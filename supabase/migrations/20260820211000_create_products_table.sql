CREATE TABLE IF NOT EXISTS public.products (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    box_id uuid NOT NULL REFERENCES public.boxes(id) ON DELETE CASCADE,
    customer_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    name text NOT NULL,
    code text,
    quantity integer DEFAULT 1,
    unit_weight numeric DEFAULT 0,
    total_weight numeric DEFAULT 0,
    photos text[],
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Superadmin can manage all products" ON public.products FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'SUPER_ADMIN')
);

CREATE POLICY "Admin can manage tenant products" ON public.products FOR ALL USING (
    tenant_id IN (SELECT tenant_id FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'MANAGER', 'SUPPORT'))
);
