-- Add new fields to shipping_types
ALTER TABLE public.shipping_types
ADD COLUMN allow_customer_edit_value BOOLEAN DEFAULT false,
ADD COLUMN customs_max_lines INTEGER NULL,
ADD COLUMN customs_max_chars_per_line INTEGER NULL;

-- Add new fields to shipping_rates
ALTER TABLE public.shipping_rates
ADD COLUMN box_extra_weight NUMERIC(10,3) DEFAULT 0.000,
ADD COLUMN is_active BOOLEAN DEFAULT true;
