"use client";

import { useState } from "react";
import { useTenantSettings } from "../../components/TenantSettingsContext";
import Link from "next/link";
import { ArrowLeft, Wallet, DollarSign, Info } from "lucide-react";

export default function AddCreditsPage() {
  const { currency, weightUnit, currencySymbol } = useTenantSettings();
  const [amount, setAmount] = useState<number>(50);

  const presetValues = [25, 50, 100, 200, 500, 1000];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/app/wallet"
            className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h2 className="font-bold text-2xl text-zinc-900 flex items-center gap-3">
            <span className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
              <DollarSign className="w-6 h-6" />
            </span>
            Adicionar Créditos
          </h2>
        </div>
      </div>

      <div className="space-y-6">
        {/* Saldo Atual */}
        <div className="bg-emerald-600 rounded-2xl shadow-sm p-6 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 rounded-full blur-3xl -mr-10 -mt-10"></div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-emerald-100 text-sm font-medium uppercase tracking-wider">Seu saldo atual</p>
              <p className="text-4xl font-bold mt-1">$0.00</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Wallet className="w-8 h-8" />
            </div>
          </div>
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-zinc-200">
          <div className="px-6 py-5 border-b border-zinc-200 bg-zinc-50/50">
            <h3 className="text-lg font-bold text-zinc-900">Escolha o valor</h3>
            <p className="text-sm text-zinc-500 mt-1">
              Selecione um valor predefinido ou informe um valor personalizado.
            </p>
          </div>

          <div className="p-6 space-y-8">
            {/* Valores Predefinidos */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {presetValues.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmount(val)}
                  className={`p-4 rounded-xl border-2 transition text-center ${
                    amount === val
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-500/20"
                      : "border-zinc-200 text-zinc-700 hover:border-emerald-300 hover:bg-emerald-50/50"
                  }`}
                >
                  <span className="text-2xl font-bold">${val}</span>
                </button>
              ))}
            </div>

            {/* Valor Personalizado */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Ou informe um valor personalizado
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-semibold text-lg">
                  $
                </span>
                <input
                  type="number"
                  value={amount || ""}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  min="10"
                  max="10000"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full pl-10 pr-4 py-3 border border-zinc-300 rounded-xl text-lg font-semibold bg-white text-zinc-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                />
              </div>
              <p className="text-xs text-zinc-500 mt-2">Mínimo: $10 • Máximo: $10,000</p>
            </div>

            {/* Cotação (MOCK) */}
            {amount >= 10 && (
              <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-5">
                <h4 className="text-sm font-semibold text-indigo-900 mb-4 flex items-center gap-2">
                  <span>💱</span> Valores aproximados em Reais
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-indigo-50">
                    <p className="text-xs font-medium text-zinc-500 mb-1 uppercase tracking-wider">PIX</p>
                    <p className="text-xl font-bold text-emerald-600">
                      {currencySymbol} {(amount * 5.5).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-indigo-50">
                    <p className="text-xs font-medium text-zinc-500 mb-1 uppercase tracking-wider">Cartão (1x)</p>
                    <p className="text-xl font-bold text-indigo-600">
                      {currencySymbol} {(amount * 5.8).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Métodos de Pagamento */}
            <div>
              <h4 className="text-sm font-semibold text-zinc-900 mb-3">Método de pagamento</h4>
              <div className="mt-3 border-2 border-dashed border-zinc-200 rounded-xl p-8 text-center bg-zinc-50/50">
                <p className="text-zinc-500 font-medium">
                  <span className="text-2xl mb-2 block">🚧</span>
                  Métodos de pagamento estarão disponíveis em breve.
                </p>
              </div>
            </div>
          </div>

          {/* Botão de Confirmar */}
          <div className="px-6 py-5 bg-zinc-50 border-t border-zinc-200">
            <button
              disabled
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-zinc-200 text-zinc-500 rounded-xl cursor-not-allowed font-bold text-lg transition-all"
            >
              Nenhum método disponível
            </button>
          </div>
        </div>

        {/* Informações */}
        <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
          <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-600" />
            Como funciona?
          </h4>
          <ul className="text-sm text-blue-800 space-y-2">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0"></span>
              Escolha o valor que deseja adicionar
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0"></span>
              Escolha o método de pagamento e efetue o pagamento
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0"></span>
              Após a confirmação, o saldo é creditado automaticamente
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0"></span>
              Use seus créditos para pagar envios e serviços
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
