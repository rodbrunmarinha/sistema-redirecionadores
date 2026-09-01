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


