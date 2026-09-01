
CREATE OR REPLACE FUNCTION public.get_auth_user_role(check_uid uuid)
RETURNS text AS $$
  SELECT role FROM public.profiles WHERE id = check_uid;
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_auth_user_tenant(check_uid uuid)
RETURNS uuid AS $$
  SELECT tenant_id FROM public.profiles WHERE id = check_uid;
$$ LANGUAGE sql SECURITY DEFINER;

DROP POLICY IF EXISTS "Admins can view profiles in their tenant." ON public.profiles;

CREATE POLICY "Admins can view profiles in their tenant." 
ON public.profiles FOR SELECT USING (
    public.get_auth_user_role(auth.uid()) IN ('SUPER_ADMIN', 'ADMIN') 
    AND tenant_id = public.get_auth_user_tenant(auth.uid())
);
    