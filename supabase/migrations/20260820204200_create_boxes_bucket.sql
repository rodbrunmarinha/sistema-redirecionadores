INSERT INTO storage.buckets (id, name, public) VALUES ('boxes', 'boxes', true) ON CONFLICT DO NOTHING;

CREATE POLICY "Give public access to boxes" ON storage.objects FOR SELECT USING (bucket_id = 'boxes');

CREATE POLICY "Allow authenticated uploads to boxes" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'boxes' AND auth.role() = 'authenticated'
);
