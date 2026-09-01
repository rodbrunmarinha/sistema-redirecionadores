
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    service_type TEXT NOT NULL,
    price_type TEXT NOT NULL,
    price NUMERIC(10,2),
    payment_mode TEXT NOT NULL,
    deposit_amount NUMERIC(10,2),
    estimated_days INTEGER,
    requires_approval BOOLEAN DEFAULT true,
    auto_release BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    service_action TEXT,
    requires_input BOOLEAN DEFAULT false,
    input_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Services viewable by everyone in tenant" 
ON public.services FOR SELECT USING (
    tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
);

CREATE POLICY "Admins can manage services" 
ON public.services FOR ALL USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('SUPER_ADMIN', 'ADMIN') 
    AND tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
);

GRANT ALL ON TABLE public.services TO authenticated, anon, service_role;
