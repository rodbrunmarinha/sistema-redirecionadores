ALTER TABLE public.shipping_types
ADD COLUMN is_active BOOLEAN DEFAULT TRUE,
ADD COLUMN requires_quote BOOLEAN DEFAULT FALSE,
ADD COLUMN requires_box_assembly BOOLEAN DEFAULT FALSE,
ADD COLUMN skip_customs_declaration BOOLEAN DEFAULT FALSE,
ADD COLUMN charge_volumetric BOOLEAN DEFAULT FALSE,
ADD COLUMN volumetric_dimension_unit TEXT DEFAULT 'cm',
ADD COLUMN volumetric_divisor NUMERIC DEFAULT 5000;

