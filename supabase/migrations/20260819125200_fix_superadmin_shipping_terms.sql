DROP POLICY IF EXISTS "Admins can insert terms" ON public.shipping_terms;
DROP POLICY IF EXISTS "Admins can update terms" ON public.shipping_terms;
DROP POLICY IF EXISTS "Admins can delete terms" ON public.shipping_terms;

CREATE POLICY "Admins can insert terms" 
    ON public.shipping_terms FOR INSERT 
    WITH CHECK (
        (tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()) AND
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'OWNER')))
        OR 
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'SUPER_ADMIN')
    );

CREATE POLICY "Admins can update terms" 
    ON public.shipping_terms FOR UPDATE 
    USING (
        (tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()) AND
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'OWNER')))
        OR 
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'SUPER_ADMIN')
    );

CREATE POLICY "Admins can delete terms" 
    ON public.shipping_terms FOR DELETE 
    USING (
        (tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()) AND
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'OWNER')))
        OR 
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'SUPER_ADMIN')
    );
DROP POLICY IF EXISTS "Users can view terms of their tenant" ON public.shipping_terms;

CREATE POLICY "Users can view terms of their tenant" 
    ON public.shipping_terms FOR SELECT 
    USING (
        tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
        OR 
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'SUPER_ADMIN')
    );

