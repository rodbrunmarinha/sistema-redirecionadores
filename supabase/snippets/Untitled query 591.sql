-- ==========================================
-- STORAGE POLICIES (products bucket)
-- ==========================================

-- 1. Criar o bucket "products" caso ele ainda não exista e garantir que é público
INSERT INTO storage.buckets (id, name, public) 
VALUES ('products', 'products', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Permitir acesso público para visualizar as imagens na loja
CREATE POLICY "Public Access for products" 
ON storage.objects FOR SELECT USING ( bucket_id = 'products' );

-- 3. Permitir que lojistas autenticados enviem (upload) arquivos
CREATE POLICY "Auth Upload to products" 
ON storage.objects FOR INSERT TO authenticated WITH CHECK ( bucket_id = 'products' );

-- 4. Permitir que lojistas autenticados apaguem arquivos (lixeira)
CREATE POLICY "Auth Delete from products" 
ON storage.objects FOR DELETE TO authenticated USING ( bucket_id = 'products' );

-- 5. Permitir que lojistas autenticados atualizem arquivos
CREATE POLICY "Auth Update in products" 
ON storage.objects FOR UPDATE TO authenticated USING ( bucket_id = 'products' );