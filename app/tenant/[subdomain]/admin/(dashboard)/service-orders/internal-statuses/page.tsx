"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, GitMerge, Plus } from "lucide-react";

export default function InternalStatusesPage() {
  const [name, setName] = useState("");
  const [color, setColor] = useState("gray");

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-zinc-950 -m-8 pb-8 flex flex-col">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 shadow-lg shadow-orange-500/20 shrink-0">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-8 w-64 h-64 rounded-full bg-white/5 pointer-events-none"></div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-sm mb-3" aria-label="Breadcrumb">
            <Link href="/admin" className="text-white/70 hover:text-white transition-colors truncate max-w-[45vw] sm:max-w-[220px]">
              Dashboard
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-white/50 shrink-0" />
            <Link href="/admin/service-orders" className="text-white/70 hover:text-white transition-colors truncate max-w-[45vw] sm:max-w-[220px]">
              Ordens de Serviço
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-white/50 shrink-0" />
            <span className="text-white font-medium truncate max-w-[45vw] sm:max-w-[220px]">
              Status internos
            </span>
          </nav>
          
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-2xl shadow-lg shrink-0">
              <GitMerge className="w-8 h-8 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-white truncate">Status internos</h1>
              <p className="text-orange-100 text-sm mt-0.5">
                Crie status próprios para o seu controle interno das ordens. Só você vê — o cliente não.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-8 flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

          <section className="bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-900/50">
              <p className="text-sm font-semibold text-white">Seus status internos</p>
              <p className="text-xs text-zinc-400 mt-1">
                Arraste para reordenar. Esses status não afetam o fluxo de pagamento nem aparecem para o cliente.
              </p>
            </div>

            <div className="px-6 py-10 text-center text-sm text-zinc-500 bg-zinc-950/30">
              Você ainda não criou nenhum status interno. Adicione o primeiro abaixo.
            </div>
          </section>

          <section className="bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 border-t-4 border-t-orange-500 p-6">
            <p className="text-sm font-semibold text-white mb-4">Adicionar status interno</p>
            
            <form action="#" method="POST" className="flex flex-col sm:flex-row sm:items-end gap-3">
              <div className="flex-1 min-w-0">
                <label className="block text-[11px] font-semibold text-zinc-400 uppercase mb-1">Nome</label>
                <input 
                  type="text" 
                  name="name" 
                  required 
                  maxLength={80} 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ex.: Comprando, Aguardando nota, Pronto para envio" 
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 text-white text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none px-4 py-2.5 transition-all"
                />
              </div>
              
              <div className="w-full sm:w-40 shrink-0">
                <label className="block text-[11px] font-semibold text-zinc-400 uppercase mb-1">Cor</label>
                <select 
                  name="color" 
                  value={color}
                  onChange={e => setColor(e.target.value)}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 text-white text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none px-4 py-2.5 appearance-none transition-all"
                >
                  <option value="gray">Cinza (gray)</option>
                  <option value="blue">Azul (blue)</option>
                  <option value="sky">Azul claro (sky)</option>
                  <option value="amber">Âmbar (amber)</option>
                  <option value="red">Vermelho (red)</option>
                  <option value="violet">Violeta (violet)</option>
                  <option value="purple">Roxo (purple)</option>
                  <option value="teal">Verde água (teal)</option>
                  <option value="emerald">Esmeralda (emerald)</option>
                  <option value="orange">Laranja (orange)</option>
                  <option value="green">Verde (green)</option>
                </select>
              </div>
              
              <button 
                type="submit" 
                className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition shadow-md"
              >
                <Plus className="w-4 h-4" />
                Adicionar
              </button>
            </form>
            
            <p className="text-xs text-zinc-500 mt-3">
              A coluna de status interno na lista de ordens só aparece depois que você criar ao menos um status.
            </p>
          </section>
          
        </div>
      </div>
    </div>
  );
}
