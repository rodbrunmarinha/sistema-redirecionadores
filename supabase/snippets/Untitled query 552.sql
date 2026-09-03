-- ==========================================
-- ASSISTED PURCHASES (Compra Assistida)
-- ==========================================
CREATE TYPE public.assisted_purchase_status AS ENUM (
    'PENDING_PAYMENT',
    'PAID_PENDING_PURCHASE',
    'PENDING_EXTRA_PAYMENT',
    'PURCHASED',
    'OUT_OF_STOCK',
    'CANCELLED'
);

CREATE TABLE IF NOT EXISTS public.assisted_purchases (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    product_url text NOT NULL,
    product_name text NOT NULL,
    product_options text,
    quantity integer NOT NULL DEFAULT 1,
    
    unit_price numeric(10,2) NOT NULL DEFAULT 0,
    total_paid numeric(10,2) NOT NULL DEFAULT 0,
    extra_amount_requested numeric(10,2) NOT NULL DEFAULT 0,
    
    status public.assisted_purchase_status NOT NULL DEFAULT 'PENDING_PAYMENT',
    admin_notes text,
    
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX idx_assisted_purchases_tenant_id ON public.assisted_purchases(tenant_id);
CREATE INDEX idx_assisted_purchases_user_id ON public.assisted_purchases(user_id);

ALTER TABLE public.assisted_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own assisted purchases" ON public.assisted_purchases
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own assisted purchases" ON public.assisted_purchases
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assisted purchases" ON public.assisted_purchases
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admin/Manager can manage assisted purchases" ON public.assisted_purchases
    FOR ALL USING (
        tenant_id IN (SELECT tenant_id FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'MANAGER'))
    );