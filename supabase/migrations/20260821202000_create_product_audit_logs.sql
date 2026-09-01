CREATE TABLE IF NOT EXISTS public.product_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    field TEXT NOT NULL,
    old_value TEXT,
    new_value TEXT,
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.product_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view their tenant product audit logs" ON public.product_audit_logs
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.tenant_id = product_audit_logs.tenant_id
            AND profiles.role = 'ADMIN'
        )
    );

CREATE POLICY "Admins insert product audit logs" ON public.product_audit_logs
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.tenant_id = product_audit_logs.tenant_id
            AND profiles.role = 'ADMIN'
        )
    );
