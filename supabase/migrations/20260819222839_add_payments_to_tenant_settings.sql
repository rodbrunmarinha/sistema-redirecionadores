ALTER TABLE public.tenant_settings ADD COLUMN IF NOT EXISTS payments JSONB DEFAULT '{}'::jsonb;

