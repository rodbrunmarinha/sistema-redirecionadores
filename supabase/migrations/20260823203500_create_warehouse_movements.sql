
CREATE TABLE IF NOT EXISTS public.warehouse_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    box_id UUID NOT NULL REFERENCES public.boxes(id) ON DELETE CASCADE,
    old_location_id UUID REFERENCES public.warehouse_locations(id) ON DELETE SET NULL,
    new_location_id UUID REFERENCES public.warehouse_locations(id) ON DELETE SET NULL,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

GRANT ALL ON TABLE public.warehouse_movements TO anon, authenticated, service_role;
