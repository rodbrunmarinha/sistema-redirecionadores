/* ==========================================
   FIX RLS FOR PRODUCTS (CUSTOMER ACCESS)
   ========================================== */
CREATE POLICY "Customer can view own products" ON public.products FOR SELECT USING (
    customer_id = auth.uid()
);