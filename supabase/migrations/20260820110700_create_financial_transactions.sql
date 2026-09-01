CREATE TABLE public.financial_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('revenue', 'expense')),
    description TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    transaction_date DATE NOT NULL,
    category TEXT,
    reference TEXT,
    notes TEXT,
    attachment_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;

-- Add RLS Policies
CREATE POLICY "Admins and Managers can view financial_transactions" ON public.financial_transactions
    FOR SELECT USING (
        tenant_id = public.get_auth_user_tenant(auth.uid()) AND 
        public.get_auth_user_role(auth.uid()) IN ('SUPER_ADMIN', 'ADMIN', 'MANAGER')
    );

CREATE POLICY "Admins and Managers can insert financial_transactions" ON public.financial_transactions
    FOR INSERT WITH CHECK (
        tenant_id = public.get_auth_user_tenant(auth.uid()) AND 
        public.get_auth_user_role(auth.uid()) IN ('SUPER_ADMIN', 'ADMIN', 'MANAGER')
    );

CREATE POLICY "Admins and Managers can update financial_transactions" ON public.financial_transactions
    FOR UPDATE USING (
        tenant_id = public.get_auth_user_tenant(auth.uid()) AND 
        public.get_auth_user_role(auth.uid()) IN ('SUPER_ADMIN', 'ADMIN', 'MANAGER')
    );

CREATE POLICY "Admins and Managers can delete financial_transactions" ON public.financial_transactions
    FOR DELETE USING (
        tenant_id = public.get_auth_user_tenant(auth.uid()) AND 
        public.get_auth_user_role(auth.uid()) IN ('SUPER_ADMIN', 'ADMIN', 'MANAGER')
    );

-- Create Storage Bucket for Financial Attachments
INSERT INTO storage.buckets (id, name, public) 
VALUES ('financial_attachments', 'financial_attachments', false)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
CREATE POLICY "Admins can view financial attachments" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'financial_attachments' AND 
        public.get_auth_user_role(auth.uid()) IN ('SUPER_ADMIN', 'ADMIN', 'MANAGER')
    );

CREATE POLICY "Admins can insert financial attachments" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'financial_attachments' AND 
        public.get_auth_user_role(auth.uid()) IN ('SUPER_ADMIN', 'ADMIN', 'MANAGER')
    );
