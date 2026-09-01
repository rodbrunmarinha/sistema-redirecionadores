"use client";

import { useState } from "react";
import { Users, Info, ChevronDown, Archive, ShieldCheck, Zap } from "lucide-react";

export default function PurchaseGroupsPage() {
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(true);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 flex items-center gap-3">
          <span className="text-3xl">👥</span>
          Grupos de Compras
        </h1>
        <p className="text-zinc-600 mt-1">Aproveite promoções exclusivas comprando em grupo</p>
      </div>

      <div className="space-y-6">
        {/* Banner Informativo */}
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
          <button 
            type="button" 
            onClick={() => setIsHowItWorksOpen(!isHowItWorksOpen)} 
            className="w-full flex items-center gap-4 p-6 text-left transition-colors hover:bg-zinc-50"
          >
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Info className="w-6 h-6 text-white" />
            </div>
            <h3 className="flex-1 text-lg font-bold text-zinc-900">Como funciona?</h3>
            <ChevronDown className={`w-5 h-5 text-zinc-400 transition-transform duration-200 ${isHowItWorksOpen ? 'rotate-180' : ''}`} />
          </button>
          
          <div className={`px-6 pb-6 pt-0 transition-all duration-300 ${isHowItWorksOpen ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden pb-0'}`}>
            <p className="text-zinc-600 leading-relaxed">
              Vamos até lojas e outlets, buscando as melhores promoções que você só teria acesso se estivesse aqui! Escolha seus produtos favoritos, adicione ao carrinho e efetue o pagamento.
            </p>
            <p className="text-amber-700 text-sm mt-4 flex items-start gap-3 bg-amber-50 p-4 rounded-xl border border-amber-100">
              <span className="text-amber-500 shrink-0 mt-0.5 text-lg">⚠️</span>
              <span className="leading-relaxed"><strong>Atenção:</strong> Os produtos são comprados após o fechamento do grupo. Caso algum produto esteja fora de estoque, o valor será reembolsado em créditos para o seu saldo na plataforma.</span>
            </p>
          </div>
        </div>

        {/* Empty State */}
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
          <div className="text-center py-16 px-6">
            <div className="relative w-32 h-32 mx-auto mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-full animate-pulse"></div>
              <div className="absolute inset-4 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center">
                <Users className="w-16 h-16 text-purple-500" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-zinc-900 mb-2">Nenhum grupo disponível no momento</h3>
            <p className="text-zinc-500 max-w-md mx-auto mb-10">
              Novos grupos de compras são criados regularmente com promoções exclusivas. Volte em breve para conferir!
            </p>
            
            {/* Benefícios Card */}
            <div className="max-w-3xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="bg-purple-50 rounded-xl p-5 border border-purple-100 transition-transform hover:-translate-y-1">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-4 shadow-sm">
                    <Archive className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold text-purple-900 mb-1">Preços Exclusivos</h4>
                  <p className="text-sm text-purple-700/80">Promoções direto das lojas</p>
                </div>
                
                <div className="bg-indigo-50 rounded-xl p-5 border border-indigo-100 transition-transform hover:-translate-y-1">
                  <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center mb-4 shadow-sm">
                    <ShieldCheck className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold text-indigo-900 mb-1">Compra Garantida</h4>
                  <p className="text-sm text-indigo-700/80">Reembolso se indisponível</p>
                </div>
                
                <div className="bg-blue-50 rounded-xl p-5 border border-blue-100 transition-transform hover:-translate-y-1">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-4 shadow-sm">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold text-blue-900 mb-1">Poder do Grupo</h4>
                  <p className="text-sm text-blue-700/80">Melhores condições em conjunto</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
