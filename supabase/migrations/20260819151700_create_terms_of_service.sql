CREATE TABLE public.terms_of_service (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT,
    is_active BOOLEAN DEFAULT true,
    require_on_signup BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.terms_of_service ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view terms of service of their tenant" 
    ON public.terms_of_service FOR SELECT 
    USING (tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Admins can insert terms of service" 
    ON public.terms_of_service FOR INSERT 
    WITH CHECK (
        tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()) AND
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'OWNER'))
    );

CREATE POLICY "Admins can update terms of service" 
    ON public.terms_of_service FOR UPDATE 
    USING (
        tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()) AND
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'OWNER'))
    );

CREATE POLICY "Admins can delete terms of service" 
    ON public.terms_of_service FOR DELETE 
    USING (
        tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()) AND
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'OWNER'))
    );

GRANT ALL ON TABLE public.terms_of_service TO anon, authenticated, service_role;

