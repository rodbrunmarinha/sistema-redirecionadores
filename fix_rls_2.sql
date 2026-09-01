CREATE POLICY "Admins can view profiles in their tenant." 
ON public.profiles FOR SELECT USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') IN ('SUPER_ADMIN', 'ADMIN')
);
