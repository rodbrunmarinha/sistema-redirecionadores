'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getDocuments(tenantId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('tenant_documents')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching documents:', error);
    return [];
  }

  return data;
}

export async function uploadDocument(tenantId: string, subdomain: string, formData: FormData) {
  const supabase = await createClient();

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const file = formData.get('file') as File;

  if (!title || !file) {
    return { success: false, error: 'Título e arquivo são obrigatórios.' };
  }

  if (file.size > 20 * 1024 * 1024) {
    return { success: false, error: 'O arquivo excede o limite de 20MB.' };
  }

  const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png'];
  if (!allowedMimeTypes.includes(file.type)) {
    return { success: false, error: 'Formato inválido. Apenas PDF, JPG e PNG são permitidos.' };
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { success: false, error: 'Usuário não autenticado.' };

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (!profile || !['SUPER_ADMIN', 'ADMIN'].includes(profile.role)) {
    return { success: false, error: 'Permissão negada.' };
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  const filePath = `${tenantId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('documents')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Error uploading file:', uploadError);
    return { success: false, error: 'Falha ao fazer upload do arquivo.' };
  }

  const { data: publicUrlData } = supabase.storage
    .from('documents')
    .getPublicUrl(filePath);

  const { error: dbError } = await supabase
    .from('tenant_documents')
    .insert({
      tenant_id: tenantId,
      title,
      description,
      file_url: publicUrlData.publicUrl,
      file_size: file.size
    });

  if (dbError) {
    console.error('Error inserting document record:', dbError);
    return { success: false, error: 'Falha ao salvar registro do documento.' };
  }

  revalidatePath(`/tenant/${subdomain}/admin/documents`);
  return { success: true };
}

export async function deleteDocument(documentId: string, fileUrl: string, subdomain: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Usuário não autenticado.' };

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (!profile || !['SUPER_ADMIN', 'ADMIN'].includes(profile.role)) {
    return { success: false, error: 'Permissão negada.' };
  }

  // Extract filepath from public URL
  const urlParts = fileUrl.split('/documents/');
  if (urlParts.length > 1) {
    const filePath = urlParts[1];
    const { error: storageError } = await supabase.storage.from('documents').remove([filePath]);
    if (storageError) {
       console.error('Error removing file from storage:', storageError);
    }
  }

  const { error: dbError } = await supabase
    .from('tenant_documents')
    .delete()
    .eq('id', documentId);

  if (dbError) {
    return { success: false, error: 'Falha ao deletar registro do banco.' };
  }

  revalidatePath(`/tenant/${subdomain}/admin/documents`);
  return { success: true };
}
