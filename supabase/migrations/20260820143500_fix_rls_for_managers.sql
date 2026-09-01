-- Allow all administrative roles to SELECT profiles in their tenant
DROP POLICY IF EXISTS "Admins can view profiles in their tenant." ON public.profiles;

CREATE POLICY "Admins can view profiles in their tenant." 
ON public.profiles FOR SELECT USING (
    public.get_auth_user_role(auth.uid()) IN ('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'SUPPORT') 
    AND tenant_id = public.get_auth_user_tenant(auth.uid())
);

-- Allow all administrative roles to SELECT and manage boxes
DROP POLICY IF EXISTS "Admins can view and manage boxes in their tenant." ON public.boxes;

CREATE POLICY "Admins can view and manage boxes in their tenant." 
ON public.boxes FOR ALL USING (
    public.get_auth_user_role(auth.uid()) IN ('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'SUPPORT') 
    AND tenant_id = public.get_auth_user_tenant(auth.uid())
);
