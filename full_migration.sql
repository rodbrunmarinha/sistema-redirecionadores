-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tenants Table (Lojistas/Redirecionadores)
CREATE TABLE public.tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subdomain TEXT UNIQUE NOT NULL,
    organization_name TEXT NOT NULL,
    owner_name TEXT NOT NULL,
    owner_email TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn on Row Level Security (RLS) for Tenants (Although typically admin-only)
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;

-- Tenants RLS Policies
CREATE POLICY "Public profiles are viewable by everyone." 
ON public.tenants FOR SELECT USING (true);

-- Grant permissions so the RLS policy can actually be evaluated
GRANT SELECT ON public.tenants TO anon, authenticated, service_role;


-- 2. Profiles Table (Extends Supabase Auth - Clientes e Admins)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE RESTRICT NOT NULL,
    role TEXT NOT NULL DEFAULT 'CUSTOMER' CHECK (role IN ('SUPER_ADMIN', 'ADMIN', 'CUSTOMER')),
    email TEXT NOT NULL,
    full_name TEXT,
    cpf TEXT,
    suite_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn on Row Level Security (RLS) for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies
-- Users can see their own profile
CREATE POLICY "Users can view own profile." 
ON public.profiles FOR SELECT USING (auth.uid() = id);

-- Admins can view all profiles in their tenant
CREATE POLICY "Admins can view profiles in their tenant." 
ON public.profiles FOR SELECT USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('SUPER_ADMIN', 'ADMIN') 
    AND tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
);


-- 3. Boxes Table (Caixas recebidas no armazÃ©m)
CREATE TABLE public.boxes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE RESTRICT NOT NULL,
    customer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    tracking_number TEXT NOT NULL,
    weight NUMERIC(10, 2), -- Weight in lbs or kg
    dimensions TEXT, -- e.g., "10x10x10"
    declared_value NUMERIC(10, 2), -- Price declared for taxes
    status TEXT NOT NULL DEFAULT 'RECEIVED' CHECK (status IN ('RECEIVED', 'CONSOLIDATED', 'SHIPPED')),
    photos TEXT[], -- Array of URLs
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn on Row Level Security (RLS) for Boxes
ALTER TABLE public.boxes ENABLE ROW LEVEL SECURITY;

-- Boxes RLS Policies
-- Customers can view their own boxes
CREATE POLICY "Customers can view own boxes." 
ON public.boxes FOR SELECT USING (
    auth.uid() = customer_id
);

-- Admins can view and manage all boxes in their tenant
CREATE POLICY "Admins can view and manage boxes in their tenant." 
ON public.boxes FOR ALL USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('SUPER_ADMIN', 'ADMIN') 
    AND tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
);



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



-- Remove existing text column
ALTER TABLE public.profiles DROP COLUMN suite_number;

-- Add it back as an auto-incrementing integer starting at 1001
ALTER TABLE public.profiles ADD COLUMN suite_number INTEGER GENERATED ALWAYS AS IDENTITY (START WITH 1001);



ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT; ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS birth_date DATE;



-- Create the function to sync role to user_metadata
CREATE OR REPLACE FUNCTION public.sync_profile_role_to_auth()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE auth.users
  SET raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'::jsonb),
    '{role}',
    to_jsonb(NEW.role)
  )
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on the profiles table
DROP TRIGGER IF EXISTS on_profile_role_change ON public.profiles;
CREATE TRIGGER on_profile_role_change
AFTER INSERT OR UPDATE OF role ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.sync_profile_role_to_auth();





ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'SUPPORT', 'CUSTOMER'));



ALTER TABLE public.tenants ADD COLUMN IF NOT EXISTS role_permissions JSONB DEFAULT '{"ADMIN": ["dashboard.view", "users.view", "users.create", "users.edit", "users.delete", "packages.view", "packages.create", "packages.edit", "packages.delete", "shipments.view", "shipments.create", "shipments.edit", "shipments.delete", "credits.view", "credits.manage", "online_purchases.view", "online_purchases.manage", "purchase_groups.view", "purchase_groups.manage", "store.view", "store.manage", "coupons.view", "coupons.manage", "marketing.view", "reports.view", "reports.export", "support.view", "support.manage", "notifications.view", "notifications.manage", "announcements.view", "announcements.manage", "fiscal.view", "fiscal.manage", "financial.view", "financial.manage", "vitrine.view", "team.view", "team.create", "team.edit", "team.delete", "permissions.manage", "settings.view", "settings.edit"], "MANAGER": ["dashboard.view", "users.view", "users.create", "users.edit", "users.delete", "packages.view", "packages.create", "packages.edit", "packages.delete", "shipments.view", "shipments.create", "shipments.edit", "shipments.delete"], "SUPPORT": ["dashboard.view", "users.view", "support.view", "support.manage"]}'::jsonb;



CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'waiting_customer', 'waiting_admin', 'resolved', 'closed');
CREATE TYPE ticket_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE ticket_category AS ENUM ('general', 'financial', 'technical', 'shipping', 'store', 'account', 'groups', 'other');

CREATE TABLE public.support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE RESTRICT NOT NULL,
    customer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    subject TEXT NOT NULL,
    status ticket_status DEFAULT 'open' NOT NULL,
    priority ticket_priority DEFAULT 'medium' NOT NULL,
    category ticket_category DEFAULT 'general' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    resolved_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE public.support_ticket_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID REFERENCES public.support_tickets(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    message TEXT NOT NULL,
    attachments TEXT[],
    is_internal BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_ticket_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tickets." ON public.support_tickets FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "Admins can view and manage tickets in their tenant." ON public.support_tickets FOR ALL USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'SUPPORT')
    AND tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
);

CREATE POLICY "Users can view own ticket messages." ON public.support_ticket_messages FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.support_tickets WHERE id = ticket_id AND customer_id = auth.uid())
    AND is_internal = false
);
CREATE POLICY "Admins can view and manage ticket messages in their tenant." ON public.support_ticket_messages FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.support_tickets 
        WHERE id = ticket_id 
        AND tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
    )
    AND (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'SUPPORT')
);




CREATE TABLE public.tenant_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE UNIQUE NOT NULL,
    branding JSONB DEFAULT '{}'::jsonb,
    operations JSONB DEFAULT '{}'::jsonb,
    address JSONB DEFAULT '{}'::jsonb,
    conversion JSONB DEFAULT '{}'::jsonb,
    menu JSONB DEFAULT '{}'::jsonb,
    quick_links JSONB DEFAULT '{}'::jsonb,
    notifications JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.tenant_settings ENABLE ROW LEVEL SECURITY;

-- Reading is allowed for all so the public facing tenant pages can load their colors/logos
CREATE POLICY "Settings are viewable by everyone" 
ON public.tenant_settings FOR SELECT USING (true);

-- Only Admins of that specific tenant can create their initial settings
CREATE POLICY "Admins can insert tenant settings" 
ON public.tenant_settings FOR INSERT WITH CHECK (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('SUPER_ADMIN', 'ADMIN') 
    AND tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
);

-- Only Admins of that specific tenant can update their settings
CREATE POLICY "Admins can update tenant settings" 
ON public.tenant_settings FOR UPDATE USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('SUPER_ADMIN', 'ADMIN') 
    AND tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
);
GRANT ALL ON TABLE public.tenant_settings TO authenticated;
GRANT ALL ON TABLE public.tenant_settings TO anon;
GRANT ALL ON TABLE public.tenant_settings TO service_role;



-- Create documents table
CREATE TABLE public.tenant_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_size NUMERIC, -- optional, in bytes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.tenant_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Documents are viewable by everyone in tenant" 
ON public.tenant_documents FOR SELECT USING (
    tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
);

CREATE POLICY "Admins can insert documents" 
ON public.tenant_documents FOR INSERT WITH CHECK (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('SUPER_ADMIN', 'ADMIN') 
    AND tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
);

CREATE POLICY "Admins can delete documents" 
ON public.tenant_documents FOR DELETE USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('SUPER_ADMIN', 'ADMIN') 
    AND tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
);

GRANT ALL ON TABLE public.tenant_documents TO authenticated;
GRANT ALL ON TABLE public.tenant_documents TO anon;
GRANT ALL ON TABLE public.tenant_documents TO service_role;

-- Storage Bucket for Documents
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', true) ON CONFLICT (id) DO NOTHING;

-- Storage Policies for 'documents' bucket
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'documents' );
CREATE POLICY "Admin Insert" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'documents' AND (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('SUPER_ADMIN', 'ADMIN') );
CREATE POLICY "Admin Update" ON storage.objects FOR UPDATE USING ( bucket_id = 'documents' AND (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('SUPER_ADMIN', 'ADMIN') );
CREATE POLICY "Admin Delete" ON storage.objects FOR DELETE USING ( bucket_id = 'documents' AND (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('SUPER_ADMIN', 'ADMIN') );




ALTER TABLE public.tenant_settings ADD COLUMN email_smtp JSONB DEFAULT '{}'::jsonb;



-- Create shipping_types table
CREATE TABLE public.shipping_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create shipping_rates table
CREATE TABLE public.shipping_rates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type_id UUID REFERENCES public.shipping_types(id) ON DELETE CASCADE NOT NULL,
    weight_start NUMERIC(10,3) NOT NULL,
    weight_end NUMERIC(10,3) NOT NULL,
    price_cost NUMERIC(12,2) DEFAULT 0,
    price_sell NUMERIC(12,2) DEFAULT 0,
    fee_percentage NUMERIC(5,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.shipping_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_rates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Shipping types viewable by everyone in tenant" 
ON public.shipping_types FOR SELECT USING (
    tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
);
CREATE POLICY "Admins can manage shipping types" 
ON public.shipping_types FOR ALL USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('SUPER_ADMIN', 'ADMIN') 
    AND tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
);

CREATE POLICY "Shipping rates viewable by everyone in tenant" 
ON public.shipping_rates FOR SELECT USING (
    type_id IN (SELECT id FROM public.shipping_types WHERE tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()))
);
CREATE POLICY "Admins can manage shipping rates" 
ON public.shipping_rates FOR ALL USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('SUPER_ADMIN', 'ADMIN') 
    AND type_id IN (SELECT id FROM public.shipping_types WHERE tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()))
);

GRANT ALL ON TABLE public.shipping_types TO authenticated, anon, service_role;
GRANT ALL ON TABLE public.shipping_rates TO authenticated, anon, service_role;



ALTER TABLE public.shipping_types
ADD COLUMN is_active BOOLEAN DEFAULT TRUE,
ADD COLUMN requires_quote BOOLEAN DEFAULT FALSE,
ADD COLUMN requires_box_assembly BOOLEAN DEFAULT FALSE,
ADD COLUMN skip_customs_declaration BOOLEAN DEFAULT FALSE,
ADD COLUMN charge_volumetric BOOLEAN DEFAULT FALSE,
ADD COLUMN volumetric_dimension_unit TEXT DEFAULT 'cm',
ADD COLUMN volumetric_divisor NUMERIC DEFAULT 5000;



CREATE TABLE public.extra_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10,2) DEFAULT 0,
    extra_weight NUMERIC(10,3) DEFAULT 0,
    icon TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.extra_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Extra services viewable by everyone in tenant" 
ON public.extra_services FOR SELECT USING (
    tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
);
CREATE POLICY "Admins can manage extra services" 
ON public.extra_services FOR ALL USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('SUPER_ADMIN', 'ADMIN') 
    AND tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
);

GRANT ALL ON TABLE public.extra_services TO authenticated, anon, service_role;



ALTER TABLE public.extra_services
ADD COLUMN charge_type TEXT DEFAULT 'fixed',
ADD COLUMN percentage_rate NUMERIC(5,2) DEFAULT 0;



CREATE TABLE public.shipping_terms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.shipping_terms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view terms of their tenant" 
    ON public.shipping_terms FOR SELECT 
    USING (tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Admins can insert terms" 
    ON public.shipping_terms FOR INSERT 
    WITH CHECK (
        tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()) AND
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'owner'))
    );

CREATE POLICY "Admins can update terms" 
    ON public.shipping_terms FOR UPDATE 
    USING (
        tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()) AND
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'owner'))
    );

CREATE POLICY "Admins can delete terms" 
    ON public.shipping_terms FOR DELETE 
    USING (
        tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()) AND
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'owner'))
    );



ALTER TABLE public.shipping_terms ADD COLUMN display_order INTEGER DEFAULT 0;



DROP POLICY IF EXISTS "Admins can insert terms" ON public.shipping_terms;
DROP POLICY IF EXISTS "Admins can update terms" ON public.shipping_terms;
DROP POLICY IF EXISTS "Admins can delete terms" ON public.shipping_terms;

CREATE POLICY "Admins can insert terms" 
    ON public.shipping_terms FOR INSERT 
    WITH CHECK (
        tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()) AND
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'OWNER'))
    );

CREATE POLICY "Admins can update terms" 
    ON public.shipping_terms FOR UPDATE 
    USING (
        tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()) AND
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'OWNER'))
    );

CREATE POLICY "Admins can delete terms" 
    ON public.shipping_terms FOR DELETE 
    USING (
        tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()) AND
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'OWNER'))
    );



DROP POLICY IF EXISTS "Admins can insert terms" ON public.shipping_terms;
DROP POLICY IF EXISTS "Admins can update terms" ON public.shipping_terms;
DROP POLICY IF EXISTS "Admins can delete terms" ON public.shipping_terms;

CREATE POLICY "Admins can insert terms" 
    ON public.shipping_terms FOR INSERT 
    WITH CHECK (
        (tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()) AND
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'OWNER')))
        OR 
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'SUPER_ADMIN')
    );

CREATE POLICY "Admins can update terms" 
    ON public.shipping_terms FOR UPDATE 
    USING (
        (tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()) AND
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'OWNER')))
        OR 
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'SUPER_ADMIN')
    );

CREATE POLICY "Admins can delete terms" 
    ON public.shipping_terms FOR DELETE 
    USING (
        (tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()) AND
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'OWNER')))
        OR 
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'SUPER_ADMIN')
    );
DROP POLICY IF EXISTS "Users can view terms of their tenant" ON public.shipping_terms;

CREATE POLICY "Users can view terms of their tenant" 
    ON public.shipping_terms FOR SELECT 
    USING (
        tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
        OR 
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'SUPER_ADMIN')
    );



DROP POLICY IF EXISTS "Admins can insert terms" ON public.shipping_terms;
DROP POLICY IF EXISTS "Admins can update terms" ON public.shipping_terms;
DROP POLICY IF EXISTS "Admins can delete terms" ON public.shipping_terms;
DROP POLICY IF EXISTS "Users can view terms of their tenant" ON public.shipping_terms;

CREATE POLICY "Users can view terms of their tenant" 
    ON public.shipping_terms FOR SELECT 
    USING (tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Admins can insert terms" 
    ON public.shipping_terms FOR INSERT 
    WITH CHECK (
        tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()) AND
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'OWNER'))
    );

CREATE POLICY "Admins can update terms" 
    ON public.shipping_terms FOR UPDATE 
    USING (
        tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()) AND
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'OWNER'))
    );

CREATE POLICY "Admins can delete terms" 
    ON public.shipping_terms FOR DELETE 
    USING (
        tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()) AND
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'OWNER'))
    );



GRANT ALL ON TABLE public.shipping_terms TO anon, authenticated, service_role;



CREATE TABLE public.terms_of_service (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT,
    is_active BOOLEAN DEFAULT true,
    require_on_signup BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.terms_of_service ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view terms of service of their tenant" 
    ON public.terms_of_service FOR SELECT 
    USING (tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Admins can insert terms of service" 
    ON public.terms_of_service FOR INSERT 
    WITH CHECK (
        tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()) AND
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'OWNER'))
    );

CREATE POLICY "Admins can update terms of service" 
    ON public.terms_of_service FOR UPDATE 
    USING (
        tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()) AND
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'OWNER'))
    );

CREATE POLICY "Admins can delete terms of service" 
    ON public.terms_of_service FOR DELETE 
    USING (
        tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()) AND
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'OWNER'))
    );

GRANT ALL ON TABLE public.terms_of_service TO anon, authenticated, service_role;



ALTER TABLE public.terms_of_service
ADD COLUMN version TEXT DEFAULT '1.0';



ALTER TABLE public.tenant_settings ADD COLUMN IF NOT EXISTS payments JSONB DEFAULT '{}'::jsonb;



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

-- Fix the same issue on boxes if it exists:
DROP POLICY IF EXISTS "Admins can view and manage boxes in their tenant." ON public.boxes;

CREATE POLICY "Admins can view and manage boxes in their tenant." 
ON public.boxes FOR ALL USING (
    public.get_auth_user_role(auth.uid()) IN ('SUPER_ADMIN', 'ADMIN') 
    AND tenant_id = public.get_auth_user_tenant(auth.uid())
);


ALTER TABLE public.profiles
ADD COLUMN custom_freight_rate NUMERIC(10, 2),
ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE;


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


ALTER TABLE public.boxes 
ADD COLUMN IF NOT EXISTS store_name text,
ADD COLUMN IF NOT EXISTS store_location text,
ADD COLUMN IF NOT EXISTS received_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS notes text;


INSERT INTO storage.buckets (id, name, public) VALUES ('boxes', 'boxes', true) ON CONFLICT DO NOTHING;

CREATE POLICY "Give public access to boxes" ON storage.objects FOR SELECT USING (bucket_id = 'boxes');

CREATE POLICY "Allow authenticated uploads to boxes" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'boxes' AND auth.role() = 'authenticated'
);


CREATE TABLE IF NOT EXISTS public.products (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    box_id uuid NOT NULL REFERENCES public.boxes(id) ON DELETE CASCADE,
    customer_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    name text NOT NULL,
    code text,
    quantity integer DEFAULT 1,
    unit_weight numeric DEFAULT 0,
    total_weight numeric DEFAULT 0,
    photos text[],
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Superadmin can manage all products" ON public.products FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'SUPER_ADMIN')
);

CREATE POLICY "Admin can manage tenant products" ON public.products FOR ALL USING (
    tenant_id IN (SELECT tenant_id FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'MANAGER', 'SUPPORT'))
);


-- Create public bucket for product photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('products', 'products', true) 
ON CONFLICT (id) DO NOTHING;

-- Set up policies for the products bucket
CREATE POLICY "Give public access to products bucket" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'products');

CREATE POLICY "Allow authenticated uploads to products bucket" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'products' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own product photos from products bucket"
ON storage.objects FOR UPDATE
USING (bucket_id = 'products' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own product photos from products bucket"
ON storage.objects FOR DELETE
USING (bucket_id = 'products' AND auth.role() = 'authenticated');


GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO anon, authenticated, service_role;


ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS price_paid numeric,
ADD COLUMN IF NOT EXISTS notes text,
ADD COLUMN IF NOT EXISTS is_perishable boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS expiry_date date;


ALTER TABLE products ADD COLUMN IF NOT EXISTS updated_at timestamptz;


ALTER TABLE public.boxes ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL DEFAULT auth.uid();


CREATE TABLE IF NOT EXISTS public.product_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    field TEXT NOT NULL,
    old_value TEXT,
    new_value TEXT,
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.product_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view their tenant product audit logs" ON public.product_audit_logs
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.tenant_id = product_audit_logs.tenant_id
            AND profiles.role = 'ADMIN'
        )
    );

CREATE POLICY "Admins insert product audit logs" ON public.product_audit_logs
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.tenant_id = product_audit_logs.tenant_id
            AND profiles.role = 'ADMIN'
        )
    );


ALTER TABLE public.boxes ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
ALTER TABLE public.products ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;


CREATE TABLE IF NOT EXISTS public.pre_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  tracking_number VARCHAR(255) NOT NULL,
  store_name VARCHAR(255),
  order_number VARCHAR(255),
  carrier VARCHAR(100),
  receiving_code VARCHAR(100),
  description TEXT,
  volumes_qty INTEGER DEFAULT 1,
  declared_value NUMERIC(10, 2),
  estimated_arrival DATE,
  notes TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE public.pre_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view own pre_alerts" ON public.pre_alerts
FOR SELECT USING (customer_id = auth.uid());

CREATE POLICY "Customers can insert own pre_alerts" ON public.pre_alerts
FOR INSERT WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Customers can update own pre_alerts" ON public.pre_alerts
FOR UPDATE USING (customer_id = auth.uid());

CREATE POLICY "Customers can delete own pre_alerts" ON public.pre_alerts
FOR DELETE USING (customer_id = auth.uid());

CREATE POLICY "Admins can manage tenant pre_alerts" ON public.pre_alerts
FOR ALL USING (
  tenant_id = public.get_auth_user_tenant(auth.uid()) AND 
  public.get_auth_user_role(auth.uid()) IN ('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'SUPPORT')
);


ALTER TABLE public.pre_alerts 
ADD COLUMN IF NOT EXISTS box_id uuid REFERENCES public.boxes(id) ON DELETE SET NULL;

-- Allow reading the box_id via API
GRANT SELECT, INSERT, UPDATE ON TABLE public.pre_alerts TO authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.pre_alerts TO service_role;



CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    service_type TEXT NOT NULL,
    price_type TEXT NOT NULL,
    price NUMERIC(10,2),
    payment_mode TEXT NOT NULL,
    deposit_amount NUMERIC(10,2),
    estimated_days INTEGER,
    requires_approval BOOLEAN DEFAULT true,
    auto_release BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    service_action TEXT,
    requires_input BOOLEAN DEFAULT false,
    input_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Services viewable by everyone in tenant" 
ON public.services FOR SELECT USING (
    tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
);

CREATE POLICY "Admins can manage services" 
ON public.services FOR ALL USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('SUPER_ADMIN', 'ADMIN') 
    AND tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
);

GRANT ALL ON TABLE public.services TO authenticated, anon, service_role;



ALTER TABLE public.services ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;



CREATE TABLE IF NOT EXISTS public.warehouse_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  code VARCHAR(80) NOT NULL,
  name VARCHAR(255),
  zone VARCHAR(80),
  grid_row INTEGER,
  grid_col INTEGER,
  capacity INTEGER,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

GRANT ALL ON TABLE public.warehouse_locations TO anon, authenticated, service_role;



ALTER TABLE public.boxes 
ADD COLUMN IF NOT EXISTS location_id UUID REFERENCES public.warehouse_locations(id) ON DELETE SET NULL;



CREATE OR REPLACE FUNCTION search_scanner_box(p_tenant_id uuid, p_search text)
RETURNS json AS $$
DECLARE
  result json;
BEGIN
  SELECT row_to_json(t) INTO result
  FROM (
    SELECT b.id, b.tracking_number as tracking_code, b.store_name, l.code as warehouse_location_code
    FROM boxes b
    LEFT JOIN warehouse_locations l ON b.location_id = l.id
    WHERE b.tenant_id = p_tenant_id
      AND b.status = 'RECEIVED'
      AND b.deleted_at IS NULL
      AND (
        b.tracking_number = p_search
        OR b.id::text ILIKE ltrim(p_search, '#') || '%'
      )
    LIMIT 1
  ) t;
  RETURN result;
END;
$$ LANGUAGE plpgsql STABLE;

GRANT EXECUTE ON FUNCTION search_scanner_box(uuid, text) TO authenticated, service_role;



CREATE TABLE IF NOT EXISTS public.warehouse_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    box_id UUID NOT NULL REFERENCES public.boxes(id) ON DELETE CASCADE,
    old_location_id UUID REFERENCES public.warehouse_locations(id) ON DELETE SET NULL,
    new_location_id UUID REFERENCES public.warehouse_locations(id) ON DELETE SET NULL,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

GRANT ALL ON TABLE public.warehouse_movements TO anon, authenticated, service_role;


-- Add new fields to shipping_types
ALTER TABLE public.shipping_types
ADD COLUMN allow_customer_edit_value BOOLEAN DEFAULT false,
ADD COLUMN customs_max_lines INTEGER NULL,
ADD COLUMN customs_max_chars_per_line INTEGER NULL;

-- Add new fields to shipping_rates
ALTER TABLE public.shipping_rates
ADD COLUMN box_extra_weight NUMERIC(10,3) DEFAULT 0.000,
ADD COLUMN is_active BOOLEAN DEFAULT true;


-- Store Categories Table
CREATE TABLE IF NOT EXISTS public.store_categories (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.store_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Superadmin can manage store_categories" ON public.store_categories FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'SUPER_ADMIN')
);

CREATE POLICY "Admin/Manager can manage store_categories" ON public.store_categories FOR ALL USING (
    tenant_id IN (SELECT tenant_id FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'MANAGER'))
);

CREATE POLICY "Public can read store_categories" ON public.store_categories FOR SELECT USING (true);


-- Store Products Table
CREATE TABLE IF NOT EXISTS public.store_products (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    category_id uuid REFERENCES public.store_categories(id) ON DELETE SET NULL,
    name text NOT NULL,
    sku text,
    short_description text,
    full_description text,
    price numeric(10, 2) NOT NULL DEFAULT 0,
    compare_at_price numeric(10, 2),
    cost numeric(10, 2),
    stock_quantity integer NOT NULL DEFAULT 0,
    max_per_customer integer,
    weight_kg numeric(10, 3) NOT NULL DEFAULT 0,
    sort_order integer DEFAULT 0,
    main_image text,
    gallery_images text[],
    is_active boolean DEFAULT true,
    is_featured boolean DEFAULT false,
    track_stock boolean DEFAULT true,
    allow_backorders boolean DEFAULT false,
    has_variations boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.store_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Superadmin can manage store_products" ON public.store_products FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'SUPER_ADMIN')
);

CREATE POLICY "Admin/Manager can manage store_products" ON public.store_products FOR ALL USING (
    tenant_id IN (SELECT tenant_id FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'MANAGER'))
);

CREATE POLICY "Public can read store_products" ON public.store_products FOR SELECT USING (true);


-- Store Product Variations Table
CREATE TABLE IF NOT EXISTS public.store_product_variations (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    product_id uuid NOT NULL REFERENCES public.store_products(id) ON DELETE CASCADE,
    name text NOT NULL,
    sku text,
    stock_quantity integer NOT NULL DEFAULT 0,
    price numeric(10, 2),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.store_product_variations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Superadmin can manage store_product_variations" ON public.store_product_variations FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'SUPER_ADMIN')
);

CREATE POLICY "Admin/Manager can manage store_product_variations" ON public.store_product_variations FOR ALL USING (
    tenant_id IN (SELECT tenant_id FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'MANAGER'))
);

CREATE POLICY "Public can read store_product_variations" ON public.store_product_variations FOR SELECT USING (true);

GRANT ALL ON TABLE public.store_categories TO authenticated, service_role, anon;
GRANT ALL ON TABLE public.store_products TO authenticated, service_role, anon;
GRANT ALL ON TABLE public.store_product_variations TO authenticated, service_role, anon;


-- Tabela de Programas VIP
CREATE TABLE IF NOT EXISTS public.vip_programs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    template_key TEXT NOT NULL DEFAULT 'basic',
    description TEXT,
    billing_cycle TEXT NOT NULL DEFAULT 'monthly',
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    trial_days INTEGER DEFAULT 0,
    grace_days INTEGER DEFAULT 3,
    stacking_mode TEXT DEFAULT 'best_price',
    status TEXT DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS
ALTER TABLE public.vip_programs ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
CREATE POLICY "Tenants podem gerenciar seus próprios programas VIP" ON public.vip_programs
    FOR ALL
    USING (tenant_id = (SELECT tenant_id FROM auth.users WHERE id = auth.uid() LIMIT 1))
    WITH CHECK (tenant_id = (SELECT tenant_id FROM auth.users WHERE id = auth.uid() LIMIT 1));

CREATE POLICY "Clientes podem ler programas VIP ativos do tenant" ON public.vip_programs
    FOR SELECT
    USING (
        tenant_id = (SELECT tenant_id FROM auth.users WHERE id = auth.uid() LIMIT 1)
        AND status = 'active'
    );

-- Atualizar updated_at via trigger
CREATE OR REPLACE FUNCTION update_vip_programs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_vip_programs_updated_at
    BEFORE UPDATE ON public.vip_programs
    FOR EACH ROW
    EXECUTE FUNCTION update_vip_programs_updated_at();
GRANT SELECT, INSERT, UPDATE, DELETE ON public.vip_programs TO anon, authenticated, service_role;


-- Tabela de Benefícios dos Programas VIP
CREATE TABLE IF NOT EXISTS public.vip_program_benefits (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    program_id UUID NOT NULL REFERENCES public.vip_programs(id) ON DELETE CASCADE,
    benefit_key TEXT NOT NULL,
    benefit_type TEXT NOT NULL DEFAULT 'percentage', -- 'percentage', 'fixed', 'boolean'
    value NUMERIC(10, 2) DEFAULT 0.00,
    min_value NUMERIC(10, 2) DEFAULT 0.00,
    max_value NUMERIC(10, 2), -- Null = Sem limite
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(program_id, benefit_key)
);

-- Habilitar RLS
ALTER TABLE public.vip_program_benefits ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
CREATE POLICY "Tenants podem gerenciar os benefícios de seus programas" ON public.vip_program_benefits
    FOR ALL
    USING (tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid() LIMIT 1))
    WITH CHECK (tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid() LIMIT 1));

CREATE POLICY "Clientes podem ler benefícios dos programas ativos" ON public.vip_program_benefits
    FOR SELECT
    USING (
        tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid() LIMIT 1)
        AND program_id IN (SELECT id FROM public.vip_programs WHERE status = 'active')
    );

-- Atualizar updated_at via trigger
CREATE OR REPLACE FUNCTION update_vip_program_benefits_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_vip_program_benefits_updated_at
    BEFORE UPDATE ON public.vip_program_benefits
    FOR EACH ROW
    EXECUTE FUNCTION update_vip_program_benefits_updated_at();


-- Tabela de Assinaturas VIP (Usuários vinculados aos programas)
CREATE TABLE IF NOT EXISTS public.vip_subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    program_id UUID NOT NULL REFERENCES public.vip_programs(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'active', -- 'active', 'canceled', 'expired', 'past_due'
    current_period_start TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(tenant_id, user_id, program_id)
);

-- Habilitar RLS
ALTER TABLE public.vip_subscriptions ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
CREATE POLICY "Tenants podem gerenciar as assinaturas VIP" ON public.vip_subscriptions
    FOR ALL
    USING (tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid() LIMIT 1))
    WITH CHECK (tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid() LIMIT 1));

CREATE POLICY "Clientes podem ler sua própria assinatura VIP" ON public.vip_subscriptions
    FOR SELECT
    USING (
        tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid() LIMIT 1)
        AND user_id = auth.uid()
    );

-- Atualizar updated_at via trigger
CREATE OR REPLACE FUNCTION update_vip_subscriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_vip_subscriptions_updated_at
    BEFORE UPDATE ON public.vip_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_vip_subscriptions_updated_at();

-- IMPORTANT: Grant privileges to anon, authenticated, and service_role
GRANT SELECT, INSERT, UPDATE, DELETE ON public.vip_program_benefits TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.vip_subscriptions TO anon, authenticated, service_role;


-- Auditing and securing storage buckets
-- This migration enforces allowed MIME types and file size limits directly at the Supabase Storage level.
-- It ensures that even if an attacker bypasses the client-side Next.js UI and hits the Supabase Storage API directly,
-- the upload will be rejected if it contains malicious file types (like .exe, .html, .sh) or exceeds the allowed size.

-- 1. Secure 'boxes', 'products', and 'branding' buckets (Images only, max 5MB)
UPDATE storage.buckets
SET 
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/avif']::text[],
  file_size_limit = 5242880 -- 5MB in bytes
WHERE id IN ('boxes', 'products', 'branding');

-- 2. Secure 'documents' and 'financial_attachments' buckets (PDFs and Images, max 20MB)
UPDATE storage.buckets
SET 
  allowed_mime_types = ARRAY['application/pdf', 'image/jpeg', 'image/png']::text[],
  file_size_limit = 20971520 -- 20MB in bytes
WHERE id IN ('documents', 'financial_attachments');


-- Create Push Subscriptions table
CREATE TABLE public.push_subscriptions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    endpoint text NOT NULL,
    p256dh text NOT NULL,
    auth text NOT NULL,
    user_agent text,
    created_at timestamptz DEFAULT now(),
    last_used_at timestamptz,
    UNIQUE(endpoint)
);

-- Enable RLS
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can insert, read, and delete their own subscriptions
CREATE POLICY "Users can insert their own subscriptions" ON public.push_subscriptions FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Users can view their own subscriptions" ON public.push_subscriptions FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "Users can delete their own subscriptions" ON public.push_subscriptions FOR DELETE USING (auth.uid() = profile_id);

-- Admins can view all subscriptions for their tenant
CREATE POLICY "Admins can view tenant subscriptions" ON public.push_subscriptions FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND tenant_id = push_subscriptions.tenant_id AND role IN ('ADMIN', 'SUPERADMIN', 'MANAGER'))
);

-- Create Custom Notifications History table
CREATE TABLE public.custom_notifications (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    title varchar(100) NOT NULL,
    message varchar(500) NOT NULL,
    recipient_type varchar(20) NOT NULL, -- 'all' or 'specific'
    target_clients jsonb, -- Array of profile UUIDs if specific
    status varchar(20) DEFAULT 'PENDING', -- PENDING, SENT, FAILED, PARTIAL
    sent_count integer DEFAULT 0,
    failed_count integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    sent_at timestamptz
);

-- Enable RLS
ALTER TABLE public.custom_notifications ENABLE ROW LEVEL SECURITY;

-- Admins can do everything on their tenant's notifications
CREATE POLICY "Admins full access to tenant notifications" ON public.custom_notifications FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND tenant_id = custom_notifications.tenant_id AND role IN ('ADMIN', 'SUPERADMIN', 'MANAGER'))
);


GRANT ALL ON TABLE public.push_subscriptions TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.custom_notifications TO anon, authenticated, service_role;


-- 1. Create wallets table
CREATE TABLE public.wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    balance NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (balance >= 0),
    currency TEXT NOT NULL DEFAULT 'USD',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(tenant_id, customer_id)
);

-- Enable RLS
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view own wallet" ON public.wallets
    FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Admins can view all wallets" ON public.wallets
    FOR SELECT USING (public.get_auth_user_role(auth.uid()) IN ('SUPER_ADMIN', 'ADMIN', 'MANAGER'));

-- Note: No INSERT/UPDATE/DELETE policies for customers. Modifications happen via RPC only.

-- 2. Create wallet_transactions table
CREATE TABLE public.wallet_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    wallet_id UUID NOT NULL REFERENCES public.wallets(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL, -- Positive for deposits, negative for purchases
    type TEXT NOT NULL CHECK (type IN ('DEPOSIT', 'PURCHASE', 'REFUND', 'ADJUSTMENT', 'SUBSCRIPTION')),
    status TEXT NOT NULL DEFAULT 'COMPLETED' CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED')),
    reference_type TEXT, -- e.g., 'STORE_ORDER', 'SHIPMENT', 'VIP_SUBSCRIPTION', 'WALLET_TRANSACTION'
    reference_id UUID, -- ID of the related record
    description TEXT,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- Who initiated the transaction
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view own transactions" ON public.wallet_transactions
    FOR SELECT USING (
        wallet_id IN (SELECT id FROM public.wallets WHERE customer_id = auth.uid())
    );

CREATE POLICY "Admins can view all transactions" ON public.wallet_transactions
    FOR SELECT USING (public.get_auth_user_role(auth.uid()) IN ('SUPER_ADMIN', 'ADMIN', 'MANAGER'));

-- 3. Trigger to create a wallet when a customer profile is created
CREATE OR REPLACE FUNCTION public.create_wallet_for_new_customer()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.role = 'CUSTOMER' THEN
        INSERT INTO public.wallets (tenant_id, customer_id, balance, currency)
        VALUES (NEW.tenant_id, NEW.id, 0.00, 'USD')
        ON CONFLICT DO NOTHING;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_customer_created
    AFTER INSERT ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.create_wallet_for_new_customer();

-- 4. Create wallets for existing customers
INSERT INTO public.wallets (tenant_id, customer_id, balance, currency)
SELECT tenant_id, id, 0.00, 'USD'
FROM public.profiles
WHERE role = 'CUSTOMER'
ON CONFLICT DO NOTHING;

-- 5. RPC for executing secure payments (Direct Payments)
CREATE OR REPLACE FUNCTION public.process_wallet_payment(
    p_customer_id UUID,
    p_tenant_id UUID,
    p_amount NUMERIC(10, 2), -- Expected to be positive, we will deduct it
    p_type TEXT,
    p_reference_type TEXT,
    p_reference_id UUID,
    p_description TEXT
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_wallet RECORD;
    v_new_balance NUMERIC(10, 2);
    v_transaction_id UUID;
BEGIN
    -- Validations
    IF p_amount <= 0 THEN
        RAISE EXCEPTION 'Payment amount must be greater than zero';
    END IF;

    -- 1. Lock the wallet row FOR UPDATE. This forces concurrent requests to wait here.
    SELECT * INTO v_wallet 
    FROM public.wallets 
    WHERE customer_id = p_customer_id AND tenant_id = p_tenant_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Wallet not found for this customer';
    END IF;

    -- 2. Check balance
    IF v_wallet.balance < p_amount THEN
        RAISE EXCEPTION 'Insufficient balance. Have %, need %', v_wallet.balance, p_amount;
    END IF;

    -- 3. Calculate new balance
    v_new_balance := v_wallet.balance - p_amount;

    -- 4. Update wallet
    UPDATE public.wallets 
    SET balance = v_new_balance, updated_at = now()
    WHERE id = v_wallet.id;

    -- 5. Insert transaction record
    INSERT INTO public.wallet_transactions (
        tenant_id, wallet_id, amount, type, status, reference_type, reference_id, description, created_by
    ) VALUES (
        p_tenant_id, v_wallet.id, -p_amount, p_type, 'COMPLETED', p_reference_type, p_reference_id, p_description, auth.uid()
    ) RETURNING id INTO v_transaction_id;

    RETURN jsonb_build_object(
        'success', true,
        'new_balance', v_new_balance,
        'transaction_id', v_transaction_id
    );
END;
$$;

-- 6. RPC for Refunds
CREATE OR REPLACE FUNCTION public.process_wallet_refund(
    p_transaction_id UUID,
    p_tenant_id UUID
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_original_tx RECORD;
    v_wallet RECORD;
    v_new_balance NUMERIC(10, 2);
    v_refund_tx_id UUID;
    v_refund_amount NUMERIC(10, 2);
    v_is_admin BOOLEAN;
BEGIN
    -- Security: Ensure the caller is an admin
    SELECT EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND tenant_id = p_tenant_id AND role IN ('SUPER_ADMIN', 'ADMIN', 'MANAGER')
    ) INTO v_is_admin;

    IF NOT v_is_admin THEN
        RAISE EXCEPTION 'Unauthorized: Only admins can process refunds';
    END IF;

    -- Fetch original transaction
    SELECT * INTO v_original_tx
    FROM public.wallet_transactions
    WHERE id = p_transaction_id AND tenant_id = p_tenant_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Original transaction not found';
    END IF;

    -- Check if it was a purchase/deduction
    IF v_original_tx.amount >= 0 THEN
        RAISE EXCEPTION 'Can only refund deductions/purchases';
    END IF;

    -- Check if already refunded
    IF EXISTS (
        SELECT 1 FROM public.wallet_transactions 
        WHERE reference_id = p_transaction_id AND type = 'REFUND'
    ) THEN
        RAISE EXCEPTION 'This transaction has already been refunded';
    END IF;

    -- The refund amount is the absolute value of the original deduction
    v_refund_amount := ABS(v_original_tx.amount);

    -- Lock the wallet row FOR UPDATE
    SELECT * INTO v_wallet 
    FROM public.wallets 
    WHERE id = v_original_tx.wallet_id
    FOR UPDATE;

    -- Calculate new balance
    v_new_balance := v_wallet.balance + v_refund_amount;

    -- Update wallet
    UPDATE public.wallets 
    SET balance = v_new_balance, updated_at = now()
    WHERE id = v_wallet.id;

    -- Insert refund transaction
    INSERT INTO public.wallet_transactions (
        tenant_id, wallet_id, amount, type, status, reference_type, reference_id, description, created_by
    ) VALUES (
        p_tenant_id, v_wallet.id, v_refund_amount, 'REFUND', 'COMPLETED', 'WALLET_TRANSACTION', p_transaction_id, 'Refund for: ' || v_original_tx.description, auth.uid()
    ) RETURNING id INTO v_refund_tx_id;

    RETURN jsonb_build_object(
        'success', true,
        'new_balance', v_new_balance,
        'refund_transaction_id', v_refund_tx_id
    );
END;
$$;

-- 7. RPC for Adding Funds
CREATE OR REPLACE FUNCTION public.process_wallet_deposit(
    p_customer_id UUID,
    p_tenant_id UUID,
    p_amount NUMERIC(10, 2),
    p_reference_type TEXT,
    p_reference_id UUID,
    p_description TEXT
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_wallet RECORD;
    v_new_balance NUMERIC(10, 2);
    v_transaction_id UUID;
BEGIN
    IF p_amount <= 0 THEN
        RAISE EXCEPTION 'Deposit amount must be greater than zero';
    END IF;

    -- Lock the wallet row FOR UPDATE
    SELECT * INTO v_wallet 
    FROM public.wallets 
    WHERE customer_id = p_customer_id AND tenant_id = p_tenant_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Wallet not found for this customer';
    END IF;

    -- Calculate new balance
    v_new_balance := v_wallet.balance + p_amount;

    -- Update wallet
    UPDATE public.wallets 
    SET balance = v_new_balance, updated_at = now()
    WHERE id = v_wallet.id;

    -- Insert transaction record
    INSERT INTO public.wallet_transactions (
        tenant_id, wallet_id, amount, type, status, reference_type, reference_id, description, created_by
    ) VALUES (
        p_tenant_id, v_wallet.id, p_amount, 'DEPOSIT', 'COMPLETED', p_reference_type, p_reference_id, p_description, auth.uid()
    ) RETURNING id INTO v_transaction_id;

    RETURN jsonb_build_object(
        'success', true,
        'new_balance', v_new_balance,
        'transaction_id', v_transaction_id
    );
END;
$$;



-- 1. Add fee exemption flag to boxes
ALTER TABLE public.boxes ADD COLUMN IF NOT EXISTS service_fee_exempt BOOLEAN DEFAULT false;

-- 2. Create store orders table
CREATE TABLE public.store_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    total_amount NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'COMPLETED' CHECK (status IN ('PENDING', 'COMPLETED', 'CANCELLED')),
    payment_transaction_id UUID REFERENCES public.wallet_transactions(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.store_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view own store orders" ON public.store_orders
    FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Admins can view all store orders" ON public.store_orders
    FOR SELECT USING (public.get_auth_user_role(auth.uid()) IN ('SUPER_ADMIN', 'ADMIN', 'MANAGER'));


-- 3. Create store order items table
CREATE TABLE public.store_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    order_id UUID NOT NULL REFERENCES public.store_orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.store_products(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.store_order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view own store order items" ON public.store_order_items
    FOR SELECT USING (
        order_id IN (SELECT id FROM public.store_orders WHERE customer_id = auth.uid())
    );

CREATE POLICY "Admins can view all store order items" ON public.store_order_items
    FOR SELECT USING (public.get_auth_user_role(auth.uid()) IN ('SUPER_ADMIN', 'ADMIN', 'MANAGER'));


ALTER TABLE public.tenant_settings ADD COLUMN IF NOT EXISTS landing_page JSONB DEFAULT '{}'::jsonb;


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



-- ==========================================
-- STORAGE POLICIES (products bucket)
-- ==========================================

-- Create the products bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('products', 'products', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Permitir acesso publico para visualizar as imagens
CREATE POLICY "Public Access for products" 
ON storage.objects FOR SELECT USING ( bucket_id = 'products' );

-- Permitir que usuarios autenticados enviem arquivos
CREATE POLICY "Auth Upload to products" 
ON storage.objects FOR INSERT TO authenticated WITH CHECK ( bucket_id = 'products' );

-- Permitir que usuarios autenticados apaguem arquivos
CREATE POLICY "Auth Delete from products" 
ON storage.objects FOR DELETE TO authenticated USING ( bucket_id = 'products' );

-- Permitir que usuarios autenticados atualizem arquivos
CREATE POLICY "Auth Update in products" 
ON storage.objects FOR UPDATE TO authenticated USING ( bucket_id = 'products' );

-- ==========================================
-- COUPONS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.store_coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    discount_type VARCHAR(20) NOT NULL, -- 'PERCENTAGE' or 'FIXED'
    discount_value DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE', -- 'ACTIVE', 'INACTIVE', 'EXPIRED'
    
    -- Eligibility
    customer_eligibility VARCHAR(20) NOT NULL DEFAULT 'ALL', -- 'ALL', 'VIP_ONLY', 'SPECIFIC_CUSTOMERS'
    eligible_customer_ids UUID[], -- Array of client IDs if eligibility is SPECIFIC_CUSTOMERS
    
    -- Restrictions & Limits
    min_purchase_amount DECIMAL(10, 2),
    usage_limit INTEGER, -- Total times it can be used
    usage_count INTEGER DEFAULT 0,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    
    -- Scopes (where can it be applied?)
    applies_to_shipping BOOLEAN DEFAULT true,
    applies_to_store BOOLEAN DEFAULT true,
    applies_to_extra_services BOOLEAN DEFAULT true,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE (tenant_id, code)
);

ALTER TABLE public.store_coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant isolation for coupons" ON public.store_coupons
    FOR ALL USING (tenant_id = public.get_auth_user_tenant(auth.uid()));
CREATE TABLE public.store_coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('PERCENTAGE', 'FIXED')),
    discount_value NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'EXPIRED')),
    customer_eligibility TEXT NOT NULL DEFAULT 'ALL' CHECK (customer_eligibility IN ('ALL', 'VIP_ONLY', 'SPECIFIC_CUSTOMERS')),
    eligible_customer_ids UUID[],
    min_purchase_amount NUMERIC(10, 2) DEFAULT 0,
    usage_limit INTEGER,
    usage_count INTEGER DEFAULT 0,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    applies_to_shipping BOOLEAN DEFAULT false,
    applies_to_store BOOLEAN DEFAULT true,
    applies_to_extra_services BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(tenant_id, code)
);

ALTER TABLE public.store_coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Superadmin can manage store_coupons" ON public.store_coupons FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'SUPER_ADMIN')
);

CREATE POLICY "Admin/Manager can manage store_coupons" ON public.store_coupons FOR ALL USING (
    tenant_id IN (SELECT tenant_id FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'MANAGER'))
);

CREATE POLICY "Public can read store_coupons" ON public.store_coupons FOR SELECT USING (true);

GRANT ALL ON TABLE public.store_coupons TO authenticated, service_role, anon;
ALTER TABLE public.store_categories ADD COLUMN IF NOT EXISTS image_url text;
