-- Create shipping_types table
CREATE TABLE public.shipping_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create shipping_rates table
CREATE TABLE public.shipping_rates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type_id UUID REFERENCES public.shipping_types(id) ON DELETE CASCADE NOT NULL,
    weight_start NUMERIC(10,3) NOT NULL,
    weight_end NUMERIC(10,3) NOT NULL,
    price_cost NUMERIC(12,2) DEFAULT 0,
    price_sell NUMERIC(12,2) DEFAULT 0,
    fee_percentage NUMERIC(5,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.shipping_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_rates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Shipping types viewable by everyone in tenant" 
ON public.shipping_types FOR SELECT USING (
    tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
);
CREATE POLICY "Admins can manage shipping types" 
ON public.shipping_types FOR ALL USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('SUPER_ADMIN', 'ADMIN') 
    AND tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
);

CREATE POLICY "Shipping rates viewable by everyone in tenant" 
ON public.shipping_rates FOR SELECT USING (
    type_id IN (SELECT id FROM public.shipping_types WHERE tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()))
);
CREATE POLICY "Admins can manage shipping rates" 
ON public.shipping_rates FOR ALL USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('SUPER_ADMIN', 'ADMIN') 
    AND type_id IN (SELECT id FROM public.shipping_types WHERE tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()))
);

GRANT ALL ON TABLE public.shipping_types TO authenticated, anon, service_role;
GRANT ALL ON TABLE public.shipping_rates TO authenticated, anon, service_role;

