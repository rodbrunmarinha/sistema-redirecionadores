-- Tabela de Benefícios dos Programas VIP
CREATE TABLE IF NOT EXISTS public.vip_program_benefits (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    program_id UUID NOT NULL REFERENCES public.vip_programs(id) ON DELETE CASCADE,
    benefit_key TEXT NOT NULL,
    benefit_type TEXT NOT NULL DEFAULT 'percentage', -- 'percentage', 'fixed', 'boolean'
    value NUMERIC(10, 2) DEFAULT 0.00,
    min_value NUMERIC(10, 2) DEFAULT 0.00,
    max_value NUMERIC(10, 2), -- Null = Sem limite
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(program_id, benefit_key)
);

-- Habilitar RLS
ALTER TABLE public.vip_program_benefits ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
CREATE POLICY "Tenants podem gerenciar os benefícios de seus programas" ON public.vip_program_benefits
    FOR ALL
    USING (tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid() LIMIT 1))
    WITH CHECK (tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid() LIMIT 1));

CREATE POLICY "Clientes podem ler benefícios dos programas ativos" ON public.vip_program_benefits
    FOR SELECT
    USING (
        tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid() LIMIT 1)
        AND program_id IN (SELECT id FROM public.vip_programs WHERE status = 'active')
    );

-- Atualizar updated_at via trigger
CREATE OR REPLACE FUNCTION update_vip_program_benefits_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_vip_program_benefits_updated_at
    BEFORE UPDATE ON public.vip_program_benefits
    FOR EACH ROW
    EXECUTE FUNCTION update_vip_program_benefits_updated_at();


-- Tabela de Assinaturas VIP (Usuários vinculados aos programas)
CREATE TABLE IF NOT EXISTS public.vip_subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    program_id UUID NOT NULL REFERENCES public.vip_programs(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'active', -- 'active', 'canceled', 'expired', 'past_due'
    current_period_start TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(tenant_id, user_id, program_id)
);

-- Habilitar RLS
ALTER TABLE public.vip_subscriptions ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
CREATE POLICY "Tenants podem gerenciar as assinaturas VIP" ON public.vip_subscriptions
    FOR ALL
    USING (tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid() LIMIT 1))
    WITH CHECK (tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid() LIMIT 1));

CREATE POLICY "Clientes podem ler sua própria assinatura VIP" ON public.vip_subscriptions
    FOR SELECT
    USING (
        tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid() LIMIT 1)
        AND user_id = auth.uid()
    );

-- Atualizar updated_at via trigger
CREATE OR REPLACE FUNCTION update_vip_subscriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_vip_subscriptions_updated_at
    BEFORE UPDATE ON public.vip_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_vip_subscriptions_updated_at();

-- IMPORTANT: Grant privileges to anon, authenticated, and service_role
GRANT SELECT, INSERT, UPDATE, DELETE ON public.vip_program_benefits TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.vip_subscriptions TO anon, authenticated, service_role;
