-- 1. Add fee exemption flag to boxes
ALTER TABLE public.boxes ADD COLUMN IF NOT EXISTS service_fee_exempt BOOLEAN DEFAULT false;

-- 2. Create store orders table
CREATE TABLE public.store_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    total_amount NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'COMPLETED' CHECK (status IN ('PENDING', 'COMPLETED', 'CANCELLED')),
    payment_transaction_id UUID REFERENCES public.wallet_transactions(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.store_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view own store orders" ON public.store_orders
    FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Admins can view all store orders" ON public.store_orders
    FOR SELECT USING (public.get_auth_user_role(auth.uid()) IN ('SUPER_ADMIN', 'ADMIN', 'MANAGER'));


-- 3. Create store order items table
CREATE TABLE public.store_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    order_id UUID NOT NULL REFERENCES public.store_orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.store_products(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.store_order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view own store order items" ON public.store_order_items
    FOR SELECT USING (
        order_id IN (SELECT id FROM public.store_orders WHERE customer_id = auth.uid())
    );

CREATE POLICY "Admins can view all store order items" ON public.store_order_items
    FOR SELECT USING (public.get_auth_user_role(auth.uid()) IN ('SUPER_ADMIN', 'ADMIN', 'MANAGER'));
