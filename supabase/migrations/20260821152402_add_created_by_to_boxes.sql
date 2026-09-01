ALTER TABLE public.boxes ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL DEFAULT auth.uid();
