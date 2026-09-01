'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Check, Loader2, FileText, Info } from 'lucide-react';
import { updateShippingTerm } from '../../_actions/shippingTerms';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import '@/app/quill-dark.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export function ShippingTermsEditClient({ subdomain, term }: { subdomain: string, term: any }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [title, setTitle] = useState(term.title);
  const [content, setContent] = useState(term.content);
  const [displayOrder, setDisplayOrder] = useState(term.display_order || 0);
  const [isActive, setIsActive] = useState(term.is_active);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Informe o título do termo.');
      return;
    }
    if (!content.trim()) {
      toast.error('Informe o conteúdo do termo.');
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Salvando termo...');

    try {
      const res = await updateShippingTerm(term.id, {
        title,
        content,
        is_active: isActive,
        display_order: displayOrder
      }, subdomain);

      if (res.success) {
        toast.success('Termo atualizado com sucesso!', { id: toastId });
        router.push(`/admin/shipping-terms`);
        router.refresh();
      } else {
        toast.error(res.error || 'Erro ao atualizar termo.', { id: toastId });
      }
    } catch (err) {
      toast.error('Erro de conexão.', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 overflow-hidden">
      <div className="p-4 sm:p-8 space-y-8">
        
        {/* Título */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-zinc-300 mb-2">
            <FileText className="w-5 h-5 text-amber-500" />
            Título do Termo <span className="text-red-500">*</span>
          </label>
          <input 
            type="text" 
            value={title}
            onChange={e => setTitle(e.target.value)}
            required 
            placeholder="Ex: Política de Produtos Proibidos" 
            className="w-full px-4 py-3 border border-zinc-700 bg-zinc-950 rounded-xl text-white focus:ring-2 focus:ring-amber-500 outline-none transition"
          />
        </div>

        {/* Conteúdo (Textarea formatado) */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-bold text-zinc-300">
            <FileText className="w-5 h-5 text-amber-500" />
            Conteúdo do Termo <span className="text-red-500">*</span>
          </label>
          <p className="text-sm text-zinc-400 flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 text-blue-500" />
            Você pode formatar o conteúdo usando texto simples, parágrafos e pontuação.
          </p>

          <div className="quill-dark">
            <ReactQuill 
              theme="snow"
              value={content}
              onChange={setContent}
              placeholder="Ao criar uma solicitação de envio, você concorda com os seguintes termos..."
              modules={{
                toolbar: [
                  [{ 'header': [1, 2, 3, false] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  [{'list': 'ordered'}, {'list': 'bullet'}],
                  ['link', 'clean']
                ]
              }}
            />
          </div>
        </div>

        {/* Ordem de Exibição */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-zinc-300 mb-2">
            <FileText className="w-5 h-5 text-amber-500" />
            Ordem de Exibição
          </label>
          <input 
            type="number" 
            min="0"
            value={displayOrder}
            onChange={e => setDisplayOrder(parseInt(e.target.value) || 0)}
            className="w-full px-4 py-3 border border-zinc-700 bg-zinc-950 rounded-xl text-white focus:ring-2 focus:ring-amber-500 outline-none transition"
          />
        </div>

        {/* Status */}
        <div className="pt-4 border-t border-zinc-800">
          <label className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition ${
            isActive ? 'bg-amber-500/5 border-amber-500/30' : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
          }`}>
            <div className="flex items-center h-5 mt-0.5">
              <input 
                type="checkbox" 
                checked={isActive}
                onChange={e => setIsActive(e.target.checked)}
                className="w-5 h-5 text-amber-600 rounded focus:ring-2 focus:ring-amber-500 bg-zinc-800 border-zinc-700" 
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-amber-500" />
                <span className="font-semibold text-zinc-100">Termo ativo</span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">Este termo será exibido durante a criação de remessas e precisa do aceite do cliente</p>
            </div>
          </label>
        </div>
        
      </div>

      {/* Footer Actions */}
      <div className="px-4 sm:px-8 py-5 bg-zinc-950 border-t border-zinc-800 flex flex-col-reverse sm:flex-row gap-4 justify-between items-center">
        <Link 
          href={`/admin/shipping-terms`}
          className="w-full sm:w-auto text-center px-6 py-3 bg-zinc-800 text-zinc-300 font-semibold rounded-xl hover:bg-zinc-700 transition"
        >
          Cancelar
        </Link>
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full sm:w-auto justify-center px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition shadow-lg flex items-center gap-2 disabled:opacity-70"
        >
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
          Salvar Alterações
        </button>
      </div>
    </form>
  );
}
