"use client";

import Link from "next/link";
import { 
  Zap,
  ArrowLeft,
  Lock,
  MessageCircle,
  ShoppingCart,
  Link as LinkIcon
} from "lucide-react";

export default function PurchaseGroupsAutomationPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-zinc-950 -m-8 flex flex-col relative overflow-x-hidden">
      
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 shadow-lg shadow-orange-500/20 shrink-0">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-8 w-64 h-64 rounded-full bg-white/5 pointer-events-none"></div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-sm mb-3" aria-label="Breadcrumb">
            <Link href="/admin" className="text-white/70 hover:text-white transition-colors truncate max-w-[45vw] sm:max-w-[220px]">
              Dashboard
            </Link>
            <span className="text-white/50 shrink-0">/</span>
            <Link href="/admin/purchase-groups" className="text-white/70 hover:text-white transition-colors truncate max-w-[45vw] sm:max-w-[220px]">
              Grupos de Compras
            </Link>
            <span className="text-white/50 shrink-0">/</span>
            <span className="text-white font-medium truncate max-w-[45vw] sm:max-w-[220px]">
              Automação
            </span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shadow-lg flex-shrink-0">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">Automação</h1>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full whitespace-nowrap bg-white/20 text-white backdrop-blur-sm">
                    <Lock className="w-3 h-3" />
                    Enterprise
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-orange-100">
                  Encerramento automático, recuperação de carrinho e notificação de pedido
                </p>
              </div>
            </div>
            <Link 
              href="/admin/purchase-groups" 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-sm font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 sm:p-8 shadow-xl shadow-zinc-900/50">
          
          {/* Top Section: Icon, Text and Button */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-5 flex-1">
              <span className="w-12 h-12 shrink-0 flex items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                <Lock className="w-6 h-6" />
              </span>
              <div>
                <p className="text-lg sm:text-xl font-bold text-white">
                  Automação exclusiva do plano Enterprise
                </p>
                <p className="mt-1.5 text-sm text-zinc-400 leading-relaxed max-w-2xl">
                  Encerramento automático com geração de ordens, recuperação de carrinhos abandonados e envio do link de pagamento diretamente no WhatsApp dos clientes.
                </p>
              </div>
            </div>

            <div className="flex-shrink-0">
              <Link 
                href="/admin/my-subscription/upgrade" 
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-sm font-bold transition shadow-lg shadow-amber-500/20 w-full lg:w-auto"
              >
                Fazer upgrade para Enterprise
                <Zap className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Bottom Section: Feature Cards */}
          <div className="mt-8 pt-8 border-t border-zinc-800">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Feature 1 */}
              <div className="flex items-start gap-3.5 p-5 bg-zinc-950/50 rounded-2xl border border-zinc-800/80 hover:border-amber-500/30 transition-colors">
                <div className="p-2.5 bg-amber-500/10 rounded-lg shrink-0">
                  <ShoppingCart className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-200 mb-1">Geração de Ordens</h4>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    Gerar ordens automaticamente ao encerrar o grupo de compras.
                  </p>
                </div>
              </div>
              
              {/* Feature 2 */}
              <div className="flex items-start gap-3.5 p-5 bg-zinc-950/50 rounded-2xl border border-zinc-800/80 hover:border-amber-500/30 transition-colors">
                <div className="p-2.5 bg-amber-500/10 rounded-lg shrink-0">
                  <MessageCircle className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-200 mb-1">Recuperação</h4>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    Recuperar carrinhos abandonados de clientes por WhatsApp.
                  </p>
                </div>
              </div>
              
              {/* Feature 3 */}
              <div className="flex items-start gap-3.5 p-5 bg-zinc-950/50 rounded-2xl border border-zinc-800/80 hover:border-amber-500/30 transition-colors">
                <div className="p-2.5 bg-amber-500/10 rounded-lg shrink-0">
                  <LinkIcon className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-200 mb-1">Pagamento Rápido</h4>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    Enviar link de pagamento ao cliente diretamente via WhatsApp.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
      
    </div>
  );
}
