ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS price_paid numeric,
ADD COLUMN IF NOT EXISTS notes text,
ADD COLUMN IF NOT EXISTS is_perishable boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS expiry_date date;
