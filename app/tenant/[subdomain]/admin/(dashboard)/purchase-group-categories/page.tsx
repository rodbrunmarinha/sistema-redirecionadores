'use client';

import Link from 'next/link';
import { ChevronRight, Layers, Info, PackageX } from 'lucide-react';

export default function ManageCategoriesPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300">
      
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 shadow-lg shadow-orange-500/20">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10"></div>
          <div className="absolute -bottom-16 -left-8 w-64 h-64 rounded-full bg-white/5"></div>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-4" aria-label="Breadcrumb">
            <Link href="/admin" className="text-white/70 hover:text-white transition-colors truncate max-w-[45vw] sm:max-w-[220px]">
              Dashboard
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-white/50 shrink-0" />
            <Link href="/admin/purchase-groups" className="text-white/70 hover:text-white transition-colors truncate max-w-[45vw] sm:max-w-[220px]">
              Grupos de Compras
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-white/50 shrink-0" />
            <span className="text-white font-medium truncate max-w-[45vw] sm:max-w-[220px]">
              Gerenciar Categorias
            </span>
          </nav>

          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 border border-white/20 shadow-md">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Gerenciar Categorias</h1>
              <p className="text-orange-100 text-sm mt-1">Ícones, ordem, status e limpeza das categorias</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">

        {/* Alert Info */}
        <div className="flex items-start gap-3 p-4 bg-orange-500/5 border border-orange-500/20 rounded-2xl">
          <Info className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-zinc-300 leading-relaxed">
            Novas categorias são criadas automaticamente ao cadastrar um produto. Aqui você organiza as existentes: ícone, ordem, ativação e exclusão.
          </p>
        </div>

        {/* Existing Categories Card */}
        <div className="bg-zinc-900 rounded-2xl shadow-lg border border-zinc-800 p-6">
          <h3 className="font-semibold text-lg text-white mb-4">Categorias Existentes</h3>

          {/* Empty State */}
          <div className="text-center py-12 rounded-xl border border-dashed border-zinc-700/50 bg-zinc-950/50">
            <PackageX className="w-12 h-12 mx-auto text-zinc-600 mb-3" />
            <p className="text-zinc-400 text-sm max-w-sm mx-auto">
              Nenhuma categoria ainda. Elas aparecem aqui assim que você cadastrar um produto com categoria.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
