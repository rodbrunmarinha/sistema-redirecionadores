"use client";

import Link from "next/link";
import { Plus, MapPin, Package } from "lucide-react";

export default function AddressesPage() {
  return (
    <div className="max-w-7xl mx-auto py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-3xl text-zinc-900 flex items-center gap-3">
            <span className="text-3xl">📍</span>
            Meus Endereços de Entrega
          </h2>
          <p className="text-sm text-zinc-600 mt-1">Gerencie seus endereços para recebimento de encomendas</p>
        </div>
        <Link 
          href="/app/addresses/create" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold rounded-xl hover:from-violet-700 hover:to-indigo-700 transition shadow-lg shadow-violet-500/30 hover:-translate-y-0.5 w-fit"
        >
          <Plus className="w-5 h-5" />
          Novo Endereço
        </Link>
      </div>

      {/* Main Content - Empty State */}
      <div className="bg-gradient-to-br from-zinc-50 to-zinc-100 rounded-[2rem] shadow-sm border-2 border-dashed border-zinc-200 p-16 text-center mt-6">
        <div className="max-w-md mx-auto">
          <div className="mb-6 relative flex justify-center">
            <MapPin className="h-24 w-24 text-zinc-300" />
            <div className="absolute top-0 right-1/4 animate-bounce">
              <span className="text-4xl">📦</span>
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-zinc-900 mb-3">Nenhum endereço cadastrado</h3>
          
          <p className="text-zinc-500 mb-8 leading-relaxed">
            Adicione um endereço para receber suas encomendas e facilitar o processo de envio.
          </p>
          
          <Link 
            href="/app/addresses/create" 
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-base font-bold rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 hover:-translate-y-0.5"
          >
            <Plus className="w-6 h-6" />
            Adicionar Primeiro Endereço
          </Link>
        </div>
      </div>
    </div>
  );
}
