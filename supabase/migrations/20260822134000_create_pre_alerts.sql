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
