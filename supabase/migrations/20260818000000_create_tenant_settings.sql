CREATE TABLE public.tenant_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE UNIQUE NOT NULL,
    branding JSONB DEFAULT '{}'::jsonb,
    operations JSONB DEFAULT '{}'::jsonb,
    address JSONB DEFAULT '{}'::jsonb,
    conversion JSONB DEFAULT '{}'::jsonb,
    menu JSONB DEFAULT '{}'::jsonb,
    quick_links JSONB DEFAULT '{}'::jsonb,
    notifications JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.tenant_settings ENABLE ROW LEVEL SECURITY;

-- Reading is allowed for all so the public facing tenant pages can load their colors/logos
CREATE POLICY "Settings are viewable by everyone" 
ON public.tenant_settings FOR SELECT USING (true);

-- Only Admins of that specific tenant can create their initial settings
CREATE POLICY "Admins can insert tenant settings" 
ON public.tenant_settings FOR INSERT WITH CHECK (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('SUPER_ADMIN', 'ADMIN') 
    AND tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
);

-- Only Admins of that specific tenant can update their settings
CREATE POLICY "Admins can update tenant settings" 
ON public.tenant_settings FOR UPDATE USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('SUPER_ADMIN', 'ADMIN') 
    AND tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
);
GRANT ALL ON TABLE public.tenant_settings TO authenticated;
GRANT ALL ON TABLE public.tenant_settings TO anon;
GRANT ALL ON TABLE public.tenant_settings TO service_role;

