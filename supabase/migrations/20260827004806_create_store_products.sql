-- Store Categories Table
CREATE TABLE IF NOT EXISTS public.store_categories (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.store_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Superadmin can manage store_categories" ON public.store_categories FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'SUPER_ADMIN')
);

CREATE POLICY "Admin/Manager can manage store_categories" ON public.store_categories FOR ALL USING (
    tenant_id IN (SELECT tenant_id FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'MANAGER'))
);

CREATE POLICY "Public can read store_categories" ON public.store_categories FOR SELECT USING (true);


-- Store Products Table
CREATE TABLE IF NOT EXISTS public.store_products (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    category_id uuid REFERENCES public.store_categories(id) ON DELETE SET NULL,
    name text NOT NULL,
    sku text,
    short_description text,
    full_description text,
    price numeric(10, 2) NOT NULL DEFAULT 0,
    compare_at_price numeric(10, 2),
    cost numeric(10, 2),
    stock_quantity integer NOT NULL DEFAULT 0,
    max_per_customer integer,
    weight_kg numeric(10, 3) NOT NULL DEFAULT 0,
    sort_order integer DEFAULT 0,
    main_image text,
    gallery_images text[],
    is_active boolean DEFAULT true,
    is_featured boolean DEFAULT false,
    track_stock boolean DEFAULT true,
    allow_backorders boolean DEFAULT false,
    has_variations boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.store_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Superadmin can manage store_products" ON public.store_products FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'SUPER_ADMIN')
);

CREATE POLICY "Admin/Manager can manage store_products" ON public.store_products FOR ALL USING (
    tenant_id IN (SELECT tenant_id FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'MANAGER'))
);

CREATE POLICY "Public can read store_products" ON public.store_products FOR SELECT USING (true);


-- Store Product Variations Table
CREATE TABLE IF NOT EXISTS public.store_product_variations (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    product_id uuid NOT NULL REFERENCES public.store_products(id) ON DELETE CASCADE,
    name text NOT NULL,
    sku text,
    stock_quantity integer NOT NULL DEFAULT 0,
    price numeric(10, 2),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.store_product_variations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Superadmin can manage store_product_variations" ON public.store_product_variations FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'SUPER_ADMIN')
);

CREATE POLICY "Admin/Manager can manage store_product_variations" ON public.store_product_variations FOR ALL USING (
    tenant_id IN (SELECT tenant_id FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'MANAGER'))
);

CREATE POLICY "Public can read store_product_variations" ON public.store_product_variations FOR SELECT USING (true);

GRANT ALL ON TABLE public.store_categories TO authenticated, service_role, anon;
GRANT ALL ON TABLE public.store_products TO authenticated, service_role, anon;
GRANT ALL ON TABLE public.store_product_variations TO authenticated, service_role, anon;
