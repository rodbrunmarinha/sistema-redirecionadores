-- 1. Create wallets table
CREATE TABLE public.wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    balance NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (balance >= 0),
    currency TEXT NOT NULL DEFAULT 'USD',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(tenant_id, customer_id)
);

-- Enable RLS
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view own wallet" ON public.wallets
    FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Admins can view all wallets" ON public.wallets
    FOR SELECT USING (public.get_auth_user_role(auth.uid()) IN ('SUPER_ADMIN', 'ADMIN', 'MANAGER'));

-- Note: No INSERT/UPDATE/DELETE policies for customers. Modifications happen via RPC only.

-- 2. Create wallet_transactions table
CREATE TABLE public.wallet_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    wallet_id UUID NOT NULL REFERENCES public.wallets(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL, -- Positive for deposits, negative for purchases
    type TEXT NOT NULL CHECK (type IN ('DEPOSIT', 'PURCHASE', 'REFUND', 'ADJUSTMENT', 'SUBSCRIPTION')),
    status TEXT NOT NULL DEFAULT 'COMPLETED' CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED')),
    reference_type TEXT, -- e.g., 'STORE_ORDER', 'SHIPMENT', 'VIP_SUBSCRIPTION', 'WALLET_TRANSACTION'
    reference_id UUID, -- ID of the related record
    description TEXT,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- Who initiated the transaction
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view own transactions" ON public.wallet_transactions
    FOR SELECT USING (
        wallet_id IN (SELECT id FROM public.wallets WHERE customer_id = auth.uid())
    );

CREATE POLICY "Admins can view all transactions" ON public.wallet_transactions
    FOR SELECT USING (public.get_auth_user_role(auth.uid()) IN ('SUPER_ADMIN', 'ADMIN', 'MANAGER'));

-- 3. Trigger to create a wallet when a customer profile is created
CREATE OR REPLACE FUNCTION public.create_wallet_for_new_customer()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.role = 'CUSTOMER' THEN
        INSERT INTO public.wallets (tenant_id, customer_id, balance, currency)
        VALUES (NEW.tenant_id, NEW.id, 0.00, 'USD')
        ON CONFLICT DO NOTHING;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_customer_created
    AFTER INSERT ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.create_wallet_for_new_customer();

-- 4. Create wallets for existing customers
INSERT INTO public.wallets (tenant_id, customer_id, balance, currency)
SELECT tenant_id, id, 0.00, 'USD'
FROM public.profiles
WHERE role = 'CUSTOMER'
ON CONFLICT DO NOTHING;

-- 5. RPC for executing secure payments (Direct Payments)
CREATE OR REPLACE FUNCTION public.process_wallet_payment(
    p_customer_id UUID,
    p_tenant_id UUID,
    p_amount NUMERIC(10, 2), -- Expected to be positive, we will deduct it
    p_type TEXT,
    p_reference_type TEXT,
    p_reference_id UUID,
    p_description TEXT
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_wallet RECORD;
    v_new_balance NUMERIC(10, 2);
    v_transaction_id UUID;
BEGIN
    -- Validations
    IF p_amount <= 0 THEN
        RAISE EXCEPTION 'Payment amount must be greater than zero';
    END IF;

    -- 1. Lock the wallet row FOR UPDATE. This forces concurrent requests to wait here.
    SELECT * INTO v_wallet 
    FROM public.wallets 
    WHERE customer_id = p_customer_id AND tenant_id = p_tenant_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Wallet not found for this customer';
    END IF;

    -- 2. Check balance
    IF v_wallet.balance < p_amount THEN
        RAISE EXCEPTION 'Insufficient balance. Have %, need %', v_wallet.balance, p_amount;
    END IF;

    -- 3. Calculate new balance
    v_new_balance := v_wallet.balance - p_amount;

    -- 4. Update wallet
    UPDATE public.wallets 
    SET balance = v_new_balance, updated_at = now()
    WHERE id = v_wallet.id;

    -- 5. Insert transaction record
    INSERT INTO public.wallet_transactions (
        tenant_id, wallet_id, amount, type, status, reference_type, reference_id, description, created_by
    ) VALUES (
        p_tenant_id, v_wallet.id, -p_amount, p_type, 'COMPLETED', p_reference_type, p_reference_id, p_description, auth.uid()
    ) RETURNING id INTO v_transaction_id;

    RETURN jsonb_build_object(
        'success', true,
        'new_balance', v_new_balance,
        'transaction_id', v_transaction_id
    );
END;
$$;

-- 6. RPC for Refunds
CREATE OR REPLACE FUNCTION public.process_wallet_refund(
    p_transaction_id UUID,
    p_tenant_id UUID
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_original_tx RECORD;
    v_wallet RECORD;
    v_new_balance NUMERIC(10, 2);
    v_refund_tx_id UUID;
    v_refund_amount NUMERIC(10, 2);
    v_is_admin BOOLEAN;
BEGIN
    -- Security: Ensure the caller is an admin
    SELECT EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND tenant_id = p_tenant_id AND role IN ('SUPER_ADMIN', 'ADMIN', 'MANAGER')
    ) INTO v_is_admin;

    IF NOT v_is_admin THEN
        RAISE EXCEPTION 'Unauthorized: Only admins can process refunds';
    END IF;

    -- Fetch original transaction
    SELECT * INTO v_original_tx
    FROM public.wallet_transactions
    WHERE id = p_transaction_id AND tenant_id = p_tenant_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Original transaction not found';
    END IF;

    -- Check if it was a purchase/deduction
    IF v_original_tx.amount >= 0 THEN
        RAISE EXCEPTION 'Can only refund deductions/purchases';
    END IF;

    -- Check if already refunded
    IF EXISTS (
        SELECT 1 FROM public.wallet_transactions 
        WHERE reference_id = p_transaction_id AND type = 'REFUND'
    ) THEN
        RAISE EXCEPTION 'This transaction has already been refunded';
    END IF;

    -- The refund amount is the absolute value of the original deduction
    v_refund_amount := ABS(v_original_tx.amount);

    -- Lock the wallet row FOR UPDATE
    SELECT * INTO v_wallet 
    FROM public.wallets 
    WHERE id = v_original_tx.wallet_id
    FOR UPDATE;

    -- Calculate new balance
    v_new_balance := v_wallet.balance + v_refund_amount;

    -- Update wallet
    UPDATE public.wallets 
    SET balance = v_new_balance, updated_at = now()
    WHERE id = v_wallet.id;

    -- Insert refund transaction
    INSERT INTO public.wallet_transactions (
        tenant_id, wallet_id, amount, type, status, reference_type, reference_id, description, created_by
    ) VALUES (
        p_tenant_id, v_wallet.id, v_refund_amount, 'REFUND', 'COMPLETED', 'WALLET_TRANSACTION', p_transaction_id, 'Refund for: ' || v_original_tx.description, auth.uid()
    ) RETURNING id INTO v_refund_tx_id;

    RETURN jsonb_build_object(
        'success', true,
        'new_balance', v_new_balance,
        'refund_transaction_id', v_refund_tx_id
    );
END;
$$;

-- 7. RPC for Adding Funds
CREATE OR REPLACE FUNCTION public.process_wallet_deposit(
    p_customer_id UUID,
    p_tenant_id UUID,
    p_amount NUMERIC(10, 2),
    p_reference_type TEXT,
    p_reference_id UUID,
    p_description TEXT
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_wallet RECORD;
    v_new_balance NUMERIC(10, 2);
    v_transaction_id UUID;
BEGIN
    IF p_amount <= 0 THEN
        RAISE EXCEPTION 'Deposit amount must be greater than zero';
    END IF;

    -- Lock the wallet row FOR UPDATE
    SELECT * INTO v_wallet 
    FROM public.wallets 
    WHERE customer_id = p_customer_id AND tenant_id = p_tenant_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Wallet not found for this customer';
    END IF;

    -- Calculate new balance
    v_new_balance := v_wallet.balance + p_amount;

    -- Update wallet
    UPDATE public.wallets 
    SET balance = v_new_balance, updated_at = now()
    WHERE id = v_wallet.id;

    -- Insert transaction record
    INSERT INTO public.wallet_transactions (
        tenant_id, wallet_id, amount, type, status, reference_type, reference_id, description, created_by
    ) VALUES (
        p_tenant_id, v_wallet.id, p_amount, 'DEPOSIT', 'COMPLETED', p_reference_type, p_reference_id, p_description, auth.uid()
    ) RETURNING id INTO v_transaction_id;

    RETURN jsonb_build_object(
        'success', true,
        'new_balance', v_new_balance,
        'transaction_id', v_transaction_id
    );
END;
$$;

