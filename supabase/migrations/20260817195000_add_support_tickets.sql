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


