-- Fix extra_services
DROP POLICY IF EXISTS "Admins can manage extra services" ON public.extra_services;

CREATE POLICY "Admins can manage extra services" 
ON public.extra_services FOR ALL USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'SUPPORT') 
    AND tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
);

-- Fix shipping_types
DROP POLICY IF EXISTS "Admins can manage shipping types" ON public.shipping_types;

CREATE POLICY "Admins can manage shipping types" 
ON public.shipping_types FOR ALL USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'SUPPORT') 
    AND tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
);

-- Fix shipping_rates
DROP POLICY IF EXISTS "Admins can manage shipping rates" ON public.shipping_rates;

CREATE POLICY "Admins can manage shipping rates" 
ON public.shipping_rates FOR ALL USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'SUPPORT') 
    AND type_id IN (SELECT id FROM public.shipping_types WHERE tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()))
);

-- Fix financial_transactions
DROP POLICY IF EXISTS "Admins can view transactions" ON public.financial_transactions;
DROP POLICY IF EXISTS "Admins can insert transactions" ON public.financial_transactions;
DROP POLICY IF EXISTS "Admins can update transactions" ON public.financial_transactions;
DROP POLICY IF EXISTS "Admins can delete transactions" ON public.financial_transactions;

CREATE POLICY "Staff can view transactions" ON public.financial_transactions
    FOR SELECT USING (
        tenant_id = public.get_auth_user_tenant(auth.uid()) AND 
        public.get_auth_user_role(auth.uid()) IN ('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'SUPPORT')
    );

CREATE POLICY "Staff can insert transactions" ON public.financial_transactions
    FOR INSERT WITH CHECK (
        tenant_id = public.get_auth_user_tenant(auth.uid()) AND 
        public.get_auth_user_role(auth.uid()) IN ('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'SUPPORT')
    );

CREATE POLICY "Staff can update transactions" ON public.financial_transactions
    FOR UPDATE USING (
        tenant_id = public.get_auth_user_tenant(auth.uid()) AND 
        public.get_auth_user_role(auth.uid()) IN ('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'SUPPORT')
    );

CREATE POLICY "Staff can delete transactions" ON public.financial_transactions
    FOR DELETE USING (
        tenant_id = public.get_auth_user_tenant(auth.uid()) AND 
        public.get_auth_user_role(auth.uid()) IN ('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'SUPPORT')
    );
