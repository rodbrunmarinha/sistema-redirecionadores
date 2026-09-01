
ALTER TABLE public.boxes 
ADD COLUMN IF NOT EXISTS location_id UUID REFERENCES public.warehouse_locations(id) ON DELETE SET NULL;
