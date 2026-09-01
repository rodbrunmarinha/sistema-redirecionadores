'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FileText, Plus, Edit, Trash2, Info } from 'lucide-react';
import { deleteTermOfService } from './_actions/termsOfService';
import toast from 'react-hot-toast';

export function TermsOfServiceClient({ subdomain, terms: initialTerms }: { subdomain: string, terms: any[] }) {
  const [terms, setTerms] = useState(initialTerms);

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este termo?')) {
      const loading = toast.loading('Excluindo...');
      const res = await deleteTermOfService(id, subdomain);
      if (res.success) {
        setTerms(terms.filter(t => t.id !== id));
        toast.success('Termo excluído', { id: loading });
      } else {
        toast.error(res.error || 'Erro ao excluir', { id: loading });
      }
    }
  };

  const emptyState = (
    <div className="bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 text-center py-16 px-6">
      <div className="inline-flex p-5 bg-amber-500/10 border border-amber-500/20 rounded-full mb-5">
        <FileText className="h-12 w-12 text-amber-500" />
      </div>
      <h3 className="text-xl font-bold text-zinc-100">Nenhum termo cadastrado</h3>
      <p className="mt-2 text-sm text-zinc-400 max-w-md mx-auto">
        Comece criando seus Termos de Uso para serem aceitos pelos clientes no cadastro.
      </p>
      <div className="mt-8">
        <Link 
          href={`/admin/terms-of-service/create`} 
          className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold rounded-xl text-white bg-amber-600 hover:bg-amber-700 shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          Novo Termo
        </Link>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 rounded-xl border border-blue-500/20 bg-blue-500/10 p-4">
        <div className="rounded-lg bg-blue-500/20 p-2 shrink-0">
          <Info className="w-5 h-5 text-blue-400" />
        </div>
        <p className="text-sm text-blue-200 self-center">
          <strong>Informação:</strong> Os Termos de Uso com "Exigir no Cadastro" ativado serão exibidos quando um novo cliente criar uma conta. Apenas termos ativos e marcados para exigir no registro aparecerão.
        </p>
      </div>

      {terms.length === 0 ? emptyState : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
          <ul className="divide-y divide-zinc-800">
            {terms.map((term: any) => (
              <li key={term.id} className="p-4 sm:p-6 hover:bg-zinc-800/50 transition-colors group">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-medium text-zinc-100 truncate">{term.title}</h4>
                      <span className="text-sm text-zinc-500 font-mono">v{term.version || '1.0'}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${term.is_active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'}`}>
                        {term.is_active ? 'Ativo' : 'Inativo'}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${term.require_on_signup ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'}`}>
                        {term.require_on_signup ? 'Exigido no Cadastro' : 'Opcional'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link 
                      href={`/admin/terms-of-service/${term.id}/edit`}
                      className="p-2 text-zinc-400 hover:text-amber-500 hover:bg-amber-500/10 rounded-lg transition"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button 
                      onClick={() => handleDelete(term.id)}
                      className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
