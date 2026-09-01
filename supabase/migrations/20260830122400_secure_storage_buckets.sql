-- Auditing and securing storage buckets
-- This migration enforces allowed MIME types and file size limits directly at the Supabase Storage level.
-- It ensures that even if an attacker bypasses the client-side Next.js UI and hits the Supabase Storage API directly,
-- the upload will be rejected if it contains malicious file types (like .exe, .html, .sh) or exceeds the allowed size.

-- 1. Secure 'boxes', 'products', and 'branding' buckets (Images only, max 5MB)
UPDATE storage.buckets
SET 
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/avif']::text[],
  file_size_limit = 5242880 -- 5MB in bytes
WHERE id IN ('boxes', 'products', 'branding');

-- 2. Secure 'documents' and 'financial_attachments' buckets (PDFs and Images, max 20MB)
UPDATE storage.buckets
SET 
  allowed_mime_types = ARRAY['application/pdf', 'image/jpeg', 'image/png']::text[],
  file_size_limit = 20971520 -- 20MB in bytes
WHERE id IN ('documents', 'financial_attachments');
