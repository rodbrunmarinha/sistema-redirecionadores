ALTER TABLE public.profiles
ADD COLUMN custom_freight_rate NUMERIC(10, 2),
ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE;
