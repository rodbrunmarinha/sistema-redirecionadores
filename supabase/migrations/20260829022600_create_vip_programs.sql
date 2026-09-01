-- Tabela de Programas VIP
CREATE TABLE IF NOT EXISTS public.vip_programs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    template_key TEXT NOT NULL DEFAULT 'basic',
    description TEXT,
    billing_cycle TEXT NOT NULL DEFAULT 'monthly',
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    trial_days INTEGER DEFAULT 0,
    grace_days INTEGER DEFAULT 3,
    stacking_mode TEXT DEFAULT 'best_price',
    status TEXT DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS
ALTER TABLE public.vip_programs ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
CREATE POLICY "Tenants podem gerenciar seus próprios programas VIP" ON public.vip_programs
    FOR ALL
    USING (tenant_id = (SELECT tenant_id FROM auth.users WHERE id = auth.uid() LIMIT 1))
    WITH CHECK (tenant_id = (SELECT tenant_id FROM auth.users WHERE id = auth.uid() LIMIT 1));

CREATE POLICY "Clientes podem ler programas VIP ativos do tenant" ON public.vip_programs
    FOR SELECT
    USING (
        tenant_id = (SELECT tenant_id FROM auth.users WHERE id = auth.uid() LIMIT 1)
        AND status = 'active'
    );

-- Atualizar updated_at via trigger
CREATE OR REPLACE FUNCTION update_vip_programs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_vip_programs_updated_at
    BEFORE UPDATE ON public.vip_programs
    FOR EACH ROW
    EXECUTE FUNCTION update_vip_programs_updated_at();
GRANT SELECT, INSERT, UPDATE, DELETE ON public.vip_programs TO anon, authenticated, service_role;
