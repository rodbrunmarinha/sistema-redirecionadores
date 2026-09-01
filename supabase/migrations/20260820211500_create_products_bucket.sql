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
