ALTER TABLE public.extra_services
ADD COLUMN charge_type TEXT DEFAULT 'fixed',
ADD COLUMN percentage_rate NUMERIC(5,2) DEFAULT 0;

