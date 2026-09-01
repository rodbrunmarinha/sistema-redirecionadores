-- 1. Garante que a role autenticada tem permissão de leitura
GRANT SELECT ON public.store_orders TO authenticated;
GRANT SELECT ON public.store_order_items TO authenticated;

-- 2. Ativa RLS e recria a política para os Pedidos
ALTER TABLE public.store_orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Usuários podem ver seus próprios pedidos" ON public.store_orders;
CREATE POLICY "Usuários podem ver seus próprios pedidos" 
ON public.store_orders 
FOR SELECT 
TO authenticated 
USING (auth.uid() = customer_id);

-- 3. Ativa RLS e recria a política para os Itens do Pedido (filtra baseado no pedido pai)
ALTER TABLE public.store_order_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Usuários podem ver os itens dos seus pedidos" ON public.store_order_items;
CREATE POLICY "Usuários podem ver os itens dos seus pedidos" 
ON public.store_order_items 
FOR SELECT 
TO authenticated 
USING (
    order_id IN (SELECT id FROM public.store_orders WHERE customer_id = auth.uid())
);