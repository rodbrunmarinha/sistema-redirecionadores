
CREATE TABLE IF NOT EXISTS public.warehouse_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  code VARCHAR(80) NOT NULL,
  name VARCHAR(255),
  zone VARCHAR(80),
  grid_row INTEGER,
  grid_col INTEGER,
  capacity INTEGER,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

GRANT ALL ON TABLE public.warehouse_locations TO anon, authenticated, service_role;
