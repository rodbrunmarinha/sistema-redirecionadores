ALTER TABLE public.boxes 
ADD COLUMN IF NOT EXISTS store_name text,
ADD COLUMN IF NOT EXISTS store_location text,
ADD COLUMN IF NOT EXISTS received_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS notes text;
