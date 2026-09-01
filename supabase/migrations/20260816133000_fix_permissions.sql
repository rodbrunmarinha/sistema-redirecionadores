-- Fix permissions for service_role and authenticated users
-- Since RLS is enabled, we should grant ALL privileges to these roles, 
-- and let the RLS policies dictate what they can actually insert/update/delete.

-- Tenants
GRANT ALL ON public.tenants TO service_role;
GRANT ALL ON public.tenants TO authenticated;

-- Profiles
GRANT ALL ON public.profiles TO service_role;
GRANT ALL ON public.profiles TO authenticated;

-- Boxes
GRANT ALL ON public.boxes TO service_role;
GRANT ALL ON public.boxes TO authenticated;

