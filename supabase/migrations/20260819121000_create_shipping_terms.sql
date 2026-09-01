CREATE TABLE public.shipping_terms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.shipping_terms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view terms of their tenant" 
    ON public.shipping_terms FOR SELECT 
    USING (tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Admins can insert terms" 
    ON public.shipping_terms FOR INSERT 
    WITH CHECK (
        tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()) AND
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'owner'))
    );

CREATE POLICY "Admins can update terms" 
    ON public.shipping_terms FOR UPDATE 
    USING (
        tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()) AND
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'owner'))
    );

CREATE POLICY "Admins can delete terms" 
    ON public.shipping_terms FOR DELETE 
    USING (
        tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()) AND
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'owner'))
    );

