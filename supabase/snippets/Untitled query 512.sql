-- ==========================================
-- COUPONS
-- ==========================================
DROP TABLE IF EXISTS public.store_coupons CASCADE;

CREATE TABLE public.store_coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    discount_type VARCHAR(20) NOT NULL, 
    discount_value DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE', 
    
    -- Elegibilidade
    customer_eligibility VARCHAR(20) NOT NULL DEFAULT 'ALL', 
    eligible_customer_ids UUID[], 
    
    -- Restrições e Limites
    min_purchase_amount DECIMAL(10, 2),
    usage_limit INTEGER, 
    usage_count INTEGER DEFAULT 0,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    
    -- Escopos 
    applies_to_shipping BOOLEAN DEFAULT true,
    applies_to_store BOOLEAN DEFAULT true,
    applies_to_extra_services BOOLEAN DEFAULT true,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE (tenant_id, code)
);

-- LIGANDO A CHAVE DO RLS (Segurança de Isolamento)
ALTER TABLE public.store_coupons ENABLE ROW LEVEL SECURITY;

-- Aplicando a Regra: O lojista só pode ver e alterar os cupons do próprio tenant (loja)
CREATE POLICY "Tenant isolation for coupons" ON public.store_coupons
    FOR ALL USING (tenant_id = public.get_auth_user_tenant(auth.uid()));