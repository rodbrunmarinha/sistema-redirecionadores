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

