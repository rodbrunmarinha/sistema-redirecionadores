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
