"use client";

import Link from "next/link";
import { 
  KanbanSquare, 
  List as ListIcon, 
  Hourglass, 
  CheckCircle2, 
  Package, 
  CheckCircle, 
  XCircle,
  PackageOpen
} from "lucide-react";

export default function KanbanPage() {
  return (
    <div className="min-h-screen bg-zinc-950 -m-8 flex flex-col">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 shadow-lg shadow-orange-500/20 shrink-0">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-8 w-64 h-64 rounded-full bg-white/5 pointer-events-none"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-sm mb-3" aria-label="Breadcrumb">
            <Link href="/admin" className="text-white/70 hover:text-white transition-colors truncate max-w-[45vw] sm:max-w-[220px]">
              Dashboard
            </Link>
            <svg className="w-3.5 h-3.5 text-white/50 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
            <Link href="/admin/shipments" className="text-white/70 hover:text-white transition-colors truncate max-w-[45vw] sm:max-w-[220px]">
              Gerenciar Envios
            </Link>
            <svg className="w-3.5 h-3.5 text-white/50 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
            <span className="text-white font-medium truncate max-w-[45vw] sm:max-w-[220px]">Kanban de Envios</span>
          </nav>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4 min-w-0">
              <div className="p-3 bg-white/20 rounded-2xl shadow-lg shrink-0">
                <KanbanSquare className="w-8 h-8 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-white truncate">Kanban de Envios</h1>
                <p className="text-orange-100 text-sm mt-0.5">Arraste e solte os cards para atualizar o status</p>
              </div>
            </div>
            <Link 
              href="/admin/shipments" 
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-orange-700 hover:bg-orange-50 font-bold rounded-xl transition shadow-lg active:scale-95 text-sm shrink-0"
            >
              <ListIcon className="w-4 h-4 shrink-0" />
              Vista em Lista
            </Link>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex gap-5 min-w-max h-full">
          
          {/* Column 1: Aguardando Pagamento */}
          <div className="w-80 flex-shrink-0 flex flex-col h-full">
            <div className="mb-4">
              <div className="bg-gradient-to-r from-yellow-500 to-amber-600 rounded-2xl shadow-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Hourglass className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">Aguardando Pgto</h3>
                      <p className="text-white/80 text-xs mt-0.5">0 envios</p>
                    </div>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-white/20 backdrop-blur-sm">
                    <span className="text-white font-bold text-lg">0</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 bg-zinc-900 rounded-2xl p-4 min-h-[600px] border-2 border-zinc-800">
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-zinc-800 flex items-center justify-center">
                  <PackageOpen className="w-10 h-10 text-zinc-500" />
                </div>
                <p className="text-sm font-medium text-zinc-400">Nenhum envio</p>
                <p className="text-xs text-zinc-500 mt-1">Arraste cards para cá</p>
              </div>
            </div>
          </div>

          {/* Column 2: Pago / Processando */}
          <div className="w-80 flex-shrink-0 flex flex-col h-full">
            <div className="mb-4">
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl shadow-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">Pago / Processando</h3>
                      <p className="text-white/80 text-xs mt-0.5">0 envios</p>
                    </div>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-white/20 backdrop-blur-sm">
                    <span className="text-white font-bold text-lg">0</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 bg-zinc-900 rounded-2xl p-4 min-h-[600px] border-2 border-zinc-800">
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-zinc-800 flex items-center justify-center">
                  <PackageOpen className="w-10 h-10 text-zinc-500" />
                </div>
                <p className="text-sm font-medium text-zinc-400">Nenhum envio</p>
                <p className="text-xs text-zinc-500 mt-1">Arraste cards para cá</p>
              </div>
            </div>
          </div>

          {/* Column 3: Enviado / Em Trânsito */}
          <div className="w-80 flex-shrink-0 flex flex-col h-full">
            <div className="mb-4">
              <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl shadow-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Package className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">Em Trânsito</h3>
                      <p className="text-white/80 text-xs mt-0.5">0 envios</p>
                    </div>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-white/20 backdrop-blur-sm">
                    <span className="text-white font-bold text-lg">0</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 bg-zinc-900 rounded-2xl p-4 min-h-[600px] border-2 border-zinc-800">
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-zinc-800 flex items-center justify-center">
                  <PackageOpen className="w-10 h-10 text-zinc-500" />
                </div>
                <p className="text-sm font-medium text-zinc-400">Nenhum envio</p>
                <p className="text-xs text-zinc-500 mt-1">Arraste cards para cá</p>
              </div>
            </div>
          </div>

          {/* Column 4: Entregue */}
          <div className="w-80 flex-shrink-0 flex flex-col h-full">
            <div className="mb-4">
              <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl shadow-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">Entregue</h3>
                      <p className="text-white/80 text-xs mt-0.5">0 envios</p>
                    </div>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-white/20 backdrop-blur-sm">
                    <span className="text-white font-bold text-lg">0</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 bg-zinc-900 rounded-2xl p-4 min-h-[600px] border-2 border-zinc-800">
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-zinc-800 flex items-center justify-center">
                  <PackageOpen className="w-10 h-10 text-zinc-500" />
                </div>
                <p className="text-sm font-medium text-zinc-400">Nenhum envio</p>
                <p className="text-xs text-zinc-500 mt-1">Arraste cards para cá</p>
              </div>
            </div>
          </div>

          {/* Column 5: Cancelado */}
          <div className="w-80 flex-shrink-0 flex flex-col h-full">
            <div className="mb-4">
              <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl shadow-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <XCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">Cancelado</h3>
                      <p className="text-white/80 text-xs mt-0.5">0 envios</p>
                    </div>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-white/20 backdrop-blur-sm">
                    <span className="text-white font-bold text-lg">0</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 bg-zinc-900 rounded-2xl p-4 min-h-[600px] border-2 border-zinc-800">
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-zinc-800 flex items-center justify-center">
                  <PackageOpen className="w-10 h-10 text-zinc-500" />
                </div>
                <p className="text-sm font-medium text-zinc-400">Nenhum envio</p>
                <p className="text-xs text-zinc-500 mt-1">Arraste cards para cá</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
