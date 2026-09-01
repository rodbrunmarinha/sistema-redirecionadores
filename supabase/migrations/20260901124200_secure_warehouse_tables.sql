-- Enable RLS
ALTER TABLE public.warehouse_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warehouse_movements ENABLE ROW LEVEL SECURITY;

-- Policies for warehouse_locations
CREATE POLICY "Staff can view warehouse locations" ON public.warehouse_locations
    FOR SELECT USING (
        tenant_id = public.get_auth_user_tenant(auth.uid()) AND 
        public.get_auth_user_role(auth.uid()) IN ('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'SUPPORT')
    );

CREATE POLICY "Staff can insert warehouse locations" ON public.warehouse_locations
    FOR INSERT WITH CHECK (
        tenant_id = public.get_auth_user_tenant(auth.uid()) AND 
        public.get_auth_user_role(auth.uid()) IN ('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'SUPPORT')
    );

CREATE POLICY "Staff can update warehouse locations" ON public.warehouse_locations
    FOR UPDATE USING (
        tenant_id = public.get_auth_user_tenant(auth.uid()) AND 
        public.get_auth_user_role(auth.uid()) IN ('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'SUPPORT')
    );

CREATE POLICY "Staff can delete warehouse locations" ON public.warehouse_locations
    FOR DELETE USING (
        tenant_id = public.get_auth_user_tenant(auth.uid()) AND 
        public.get_auth_user_role(auth.uid()) IN ('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'SUPPORT')
    );

-- Policies for warehouse_movements
CREATE POLICY "Staff can view warehouse movements" ON public.warehouse_movements
    FOR SELECT USING (
        tenant_id = public.get_auth_user_tenant(auth.uid()) AND 
        public.get_auth_user_role(auth.uid()) IN ('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'SUPPORT')
    );

CREATE POLICY "Staff can insert warehouse movements" ON public.warehouse_movements
    FOR INSERT WITH CHECK (
        tenant_id = public.get_auth_user_tenant(auth.uid()) AND 
        public.get_auth_user_role(auth.uid()) IN ('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'SUPPORT')
    );

CREATE POLICY "Staff can update warehouse movements" ON public.warehouse_movements
    FOR UPDATE USING (
        tenant_id = public.get_auth_user_tenant(auth.uid()) AND 
        public.get_auth_user_role(auth.uid()) IN ('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'SUPPORT')
    );

CREATE POLICY "Staff can delete warehouse movements" ON public.warehouse_movements
    FOR DELETE USING (
        tenant_id = public.get_auth_user_tenant(auth.uid()) AND 
        public.get_auth_user_role(auth.uid()) IN ('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'SUPPORT')
    );
