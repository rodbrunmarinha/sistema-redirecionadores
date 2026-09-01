import { Link as LinkIcon, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export function QuickLinksTab({ data, onChange }: { data?: any, onChange?: (data: any) => void }) {
  const links = data?.links ?? [
    { id: 1, title: 'Tutorial Iniciante', url: 'https://youtube.com/...', icon: 'youtube' },
    { id: 2, title: 'Planilha de Medidas', url: 'https://docs.google.com/...', icon: 'file' }
  ];
  const setLinks = (val: any) => onChange?.({ ...data, links: typeof val === 'function' ? val(links) : val });

  return (
    <div className="bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 p-4 sm:p-8 space-y-10">
      
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-amber-500" />
              <span>Acesso Rápido do App</span>
            </h3>
            <p className="text-sm text-zinc-400 mt-1">
              Links que aparecerão na tela inicial (Dashboard) do painel do cliente.
            </p>
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-sm font-medium rounded-lg transition-colors">
            <Plus className="w-4 h-4" />
            Adicionar Link
          </button>
        </div>

        <div className="space-y-3">
          {links.map((link: any) => (
            <div key={link.id} className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-zinc-700 bg-zinc-800/30">
              <div className="flex-1 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Título</label>
                  <input type="text" value={link.title} readOnly className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">URL de Destino</label>
                  <input type="text" value={link.url} readOnly className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-2 text-sm" />
                </div>
              </div>
              <div className="flex sm:flex-col justify-end gap-2">
                <button className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}

          {links.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed border-zinc-800 rounded-xl">
              <p className="text-zinc-400 text-sm">Nenhum link configurado.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
