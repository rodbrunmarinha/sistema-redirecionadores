ALTER TABLE public.tenant_settings ADD COLUMN IF NOT EXISTS landing_page JSONB DEFAULT '{}'::jsonb;
