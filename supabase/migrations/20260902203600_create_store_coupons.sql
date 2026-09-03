CREATE TABLE public.store_coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('PERCENTAGE', 'FIXED')),
    discount_value NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'EXPIRED')),
    customer_eligibility TEXT NOT NULL DEFAULT 'ALL' CHECK (customer_eligibility IN ('ALL', 'VIP_ONLY', 'SPECIFIC_CUSTOMERS')),
    eligible_customer_ids UUID[],
    min_purchase_amount NUMERIC(10, 2) DEFAULT 0,
    usage_limit INTEGER,
    usage_count INTEGER DEFAULT 0,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    applies_to_shipping BOOLEAN DEFAULT false,
    applies_to_store BOOLEAN DEFAULT true,
    applies_to_extra_services BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(tenant_id, code)
);

ALTER TABLE public.store_coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Superadmin can manage store_coupons" ON public.store_coupons FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'SUPER_ADMIN')
);

CREATE POLICY "Admin/Manager can manage store_coupons" ON public.store_coupons FOR ALL USING (
    tenant_id IN (SELECT tenant_id FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'MANAGER'))
);

CREATE POLICY "Public can read store_coupons" ON public.store_coupons FOR SELECT USING (true);

GRANT ALL ON TABLE public.store_coupons TO authenticated, service_role, anon;
