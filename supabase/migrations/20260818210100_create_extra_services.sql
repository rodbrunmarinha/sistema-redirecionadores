CREATE TABLE public.extra_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10,2) DEFAULT 0,
    extra_weight NUMERIC(10,3) DEFAULT 0,
    icon TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.extra_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Extra services viewable by everyone in tenant" 
ON public.extra_services FOR SELECT USING (
    tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
);
CREATE POLICY "Admins can manage extra services" 
ON public.extra_services FOR ALL USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('SUPER_ADMIN', 'ADMIN') 
    AND tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
);

GRANT ALL ON TABLE public.extra_services TO authenticated, anon, service_role;

