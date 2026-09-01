-- Remove existing text column
ALTER TABLE public.profiles DROP COLUMN suite_number;

-- Add it back as an auto-incrementing integer starting at 1001
ALTER TABLE public.profiles ADD COLUMN suite_number INTEGER GENERATED ALWAYS AS IDENTITY (START WITH 1001);

