'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FileText, Plus, Edit, Trash2 } from 'lucide-react';
import { deleteShippingTerm } from './_actions/shippingTerms';
import toast from 'react-hot-toast';

export function ShippingTermsClient({ subdomain, terms: initialTerms }: { subdomain: string, terms: any[] }) {
  const [terms, setTerms] = useState(initialTerms);

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este termo?')) {
      const loading = toast.loading('Excluindo...');
      const res = await deleteShippingTerm(id, subdomain);
      if (res.success) {
        setTerms(terms.filter(t => t.id !== id));
        toast.success('Termo excluído', { id: loading });
      } else {
        toast.error(res.error || 'Erro ao excluir', { id: loading });
      }
    }
  };

  if (terms.length === 0) {
    return (
      <div className="bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 text-center py-16 px-6">
        <div className="inline-flex p-5 bg-amber-500/10 border border-amber-500/20 rounded-full mb-5">
          <FileText className="h-12 w-12 text-amber-500" />
        </div>
        <h3 className="text-xl font-bold text-zinc-100">Nenhum termo cadastrado</h3>
        <p className="mt-2 text-sm text-zinc-400 max-w-md mx-auto">
          Comece criando um novo termo de envio.
        </p>
        <div className="mt-8">
          <Link 
            href={`/admin/shipping-terms/create`} 
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold rounded-xl text-white bg-amber-600 hover:bg-amber-700 shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            Novo Termo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {terms.map((term) => (
        <div 
          key={term.id} 
          className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex items-center justify-between group hover:border-zinc-700 transition"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-zinc-100">{term.title}</h3>
                {term.is_active ? (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 text-xs font-bold border border-emerald-500/20">Ativo</span>
                ) : (
                  <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-400 text-xs font-bold border border-zinc-700">Inativo</span>
                )}
              </div>
              <div className="text-sm text-zinc-400 mt-1">
                Atualizado em {new Date(term.updated_at).toLocaleDateString('pt-BR')}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Link 
              href={`/admin/shipping-terms/${term.id}/edit`}
              className="p-2 text-zinc-400 hover:text-amber-500 hover:bg-zinc-800 rounded-lg transition"
            >
              <Edit className="w-4 h-4" />
            </Link>
            <button
              onClick={() => handleDelete(term.id)}
              className="p-2 text-zinc-400 hover:text-red-500 hover:bg-zinc-800 rounded-lg transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
