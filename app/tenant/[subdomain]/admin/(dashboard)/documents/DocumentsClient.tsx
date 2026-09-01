'use client';

import { useState, useRef } from 'react';
import { uploadDocument, deleteDocument } from './_actions/documents';
import { FileText, Upload, Trash2, Link as LinkIcon, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export function DocumentsClient({ 
  tenantId, 
  subdomain, 
  documents 
}: { 
  tenantId: string; 
  subdomain: string; 
  documents: any[];
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleUpload(formData: FormData) {
    setIsUploading(true);
    
    try {
      const result = await uploadDocument(tenantId, subdomain, formData);
      if (result.success) {
        toast.success('Documento enviado com sucesso!');
        formRef.current?.reset();
      } else {
        toast.error(result.error || 'Erro ao enviar documento.');
      }
    } catch (e) {
      toast.error('Erro de conexão ao enviar arquivo.');
    } finally {
      setIsUploading(false);
    }
  }

  async function handleDelete(id: string, fileUrl: string) {
    if (!confirm('Tem certeza que deseja apagar este documento? Os clientes não poderão mais acessá-lo.')) return;
    
    setDeletingId(id);
    try {
      const result = await deleteDocument(id, fileUrl, subdomain);
      if (result.success) {
        toast.success('Documento apagado com sucesso!');
      } else {
        toast.error(result.error || 'Erro ao apagar documento.');
      }
    } catch (e) {
      toast.error('Erro de conexão ao apagar arquivo.');
    } finally {
      setDeletingId(null);
    }
  }

  function formatBytes(bytes: number, decimals = 2) {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      <div className="bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 p-6">
        <h2 className="font-bold text-zinc-100 mb-1">Enviar novo documento</h2>
        <p className="text-sm text-zinc-400 mb-5">PDF de até 20 MB. Ele aparece para todos os seus clientes, no painel e no app.</p>

        <form ref={formRef} action={handleUpload} className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Título *</label>
            <input 
              type="text" 
              name="title" 
              required 
              maxLength={255} 
              placeholder="Ex.: Manual de uso do dock" 
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white focus:border-amber-500 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Arquivo PDF *</label>
            <input 
              type="file" 
              name="file" 
              accept="application/pdf" 
              required 
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-zinc-300 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-700 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-amber-500 hover:file:bg-zinc-600"
            />
            <p className="mt-1 text-xs text-zinc-500">Somente PDF, até 20 MB</p>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-zinc-300 mb-2">Descrição (opcional)</label>
            <input 
              type="text" 
              name="description" 
              maxLength={500} 
              placeholder="Uma linha explicando o que o cliente encontra no arquivo" 
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white focus:border-amber-500 focus:ring-amber-500"
            />
          </div>
          <div className="sm:col-span-2 mt-2">
            <button 
              type="submit" 
              disabled={isUploading}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition text-sm shadow-sm disabled:opacity-50"
            >
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {isUploading ? 'Enviando...' : 'Enviar documento'}
            </button>
          </div>
        </form>
      </div>

      {documents.length === 0 ? (
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-10 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-800">
            <FileText className="w-7 h-7 text-zinc-500" />
          </div>
          <p className="font-semibold text-zinc-100">Nenhum documento enviado</p>
          <p className="mt-1 text-sm text-zinc-400">Envie o primeiro PDF acima — manual de uso, guia de envio, tabela de preços.</p>
        </div>
      ) : (
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
          <ul className="divide-y divide-zinc-800">
            {documents.map((doc) => (
              <li key={doc.id} className="p-4 sm:p-6 hover:bg-zinc-800/50 transition flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center flex-shrink-0 mt-1">
                    <FileText className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-100">{doc.title}</h3>
                    {doc.description && <p className="text-sm text-zinc-400 mt-0.5">{doc.description}</p>}
                    <p className="text-xs text-zinc-500 mt-2 flex items-center gap-2">
                      <span>Adicionado em {new Date(doc.created_at).toLocaleDateString('pt-BR')}</span>
                      {doc.file_size && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                          <span>{formatBytes(doc.file_size)}</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a 
                    href={doc.file_url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition"
                    title="Acessar PDF"
                  >
                    <LinkIcon className="w-5 h-5" />
                  </a>
                  <button 
                    onClick={() => handleDelete(doc.id, doc.file_url)}
                    disabled={deletingId === doc.id}
                    className="p-2 text-red-500 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition disabled:opacity-50"
                    title="Excluir"
                  >
                    {deletingId === doc.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
