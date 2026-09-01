ALTER TABLE public.pre_alerts 
ADD COLUMN IF NOT EXISTS box_id uuid REFERENCES public.boxes(id) ON DELETE SET NULL;

-- Allow reading the box_id via API
GRANT SELECT, INSERT, UPDATE ON TABLE public.pre_alerts TO authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.pre_alerts TO service_role;
