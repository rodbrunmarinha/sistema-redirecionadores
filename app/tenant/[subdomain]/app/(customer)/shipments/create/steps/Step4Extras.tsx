"use client";
import { useTenantSettings } from "../../../components/TenantSettingsContext";
import React from "react";
import { Plus, Check, Info, Scale } from "lucide-react";

export default function Step4Extras({ formData, setFormData, onNext, onPrev, availableExtras = [] }: any) {
  const { currencySymbol } = useTenantSettings();

  const toggleExtra = (id: string) => {
    setFormData((prev: any) => {
      const isSelected = prev.extras.includes(id);
      return {
        ...prev,
        extras: isSelected ? prev.extras.filter((e: string) => e !== id) : [...prev.extras, id]
      };
    });
  };

  const renderPrice = (extra: any) => {
    if (extra.charge_type === 'declared_percentage') {
      return `${extra.percentage_rate}% do valor`;
    }
    if (extra.charge_type === 'custom_declared_percentage') {
      return `${extra.percentage_rate}% do valor alfandegário`;
    }
    if (extra.price === 0) {
      return "Grátis";
    }
    return `${currencySymbol}${extra.price.toFixed(2)}`;
  };

  const selectedExtras = availableExtras.filter((e: any) => formData.extras.includes(e.id));
  const totalExtraCost = selectedExtras.reduce((acc: number, curr: any) => curr.charge_type === 'fixed' ? acc + (curr.price || 0) : acc, 0);
  const totalExtraWeight = selectedExtras.reduce((acc: number, curr: any) => acc + (curr.extra_weight || 0), 0);
  const hasNonFlat = selectedExtras.some((e: any) => e.charge_type !== 'fixed');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Serviços Extras</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Personalize o empacotamento do seu envio.</p>
      </div>

      {availableExtras.length === 0 ? (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800 text-center">
          <Info className="w-8 h-8 text-blue-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-1">Nenhum serviço extra disponível</h3>
          <p className="text-sm text-blue-700 dark:text-blue-300">Não há serviços adicionais configurados no momento. Você pode prosseguir para a próxima etapa.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableExtras.map((extra: any) => {
            const isSelected = formData.extras.includes(extra.id);
            const selectedExtras = availableExtras.filter((e: any) => formData.extras.includes(e.id));
  const totalExtraCost = selectedExtras.reduce((acc: number, curr: any) => curr.charge_type === 'fixed' ? acc + (curr.price || 0) : acc, 0);
  const totalExtraWeight = selectedExtras.reduce((acc: number, curr: any) => acc + (curr.extra_weight || 0), 0);
  const hasNonFlat = selectedExtras.some((e: any) => e.charge_type !== 'fixed');

  return (
              <div 
                key={extra.id}
                onClick={() => toggleExtra(extra.id)}
                className={`relative flex flex-col p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                  isSelected 
                  ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 shadow-md shadow-blue-500/10" 
                  : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm"
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${
                    isSelected 
                      ? "bg-blue-500 border-blue-500 text-white" 
                      : "border-gray-300 dark:border-gray-600 text-transparent"
                  }`}>
                    <Check className="w-4 h-4" />
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                    isSelected 
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300" 
                      : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                  }`}>
                    {renderPrice(extra)}
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className={`font-bold text-[15px] mb-1 leading-tight ${isSelected ? "text-blue-900 dark:text-blue-100" : "text-gray-900 dark:text-white"}`}>
                    {extra.name}
                  </h3>
                  <p className={`text-[13px] leading-relaxed line-clamp-3 ${isSelected ? "text-blue-700 dark:text-blue-300" : "text-gray-500 dark:text-gray-400"}`}>
                    {extra.description}
                  </p>
                </div>
                
                {extra.extra_weight > 0 && (
                  <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700/50">
                    <span className="text-[11px] font-bold uppercase text-gray-500 flex items-center gap-1">
                      <Plus className="w-3 h-3" /> Peso Estimado: {extra.extra_weight}
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}


      {selectedExtras.length > 0 && (
        <div className="mt-8 bg-purple-50/50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800/50 rounded-2xl p-5">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-gray-700 dark:text-gray-300 font-medium">Total dos Extras</h3>
            <span className="text-purple-700 dark:text-purple-400 font-bold text-lg">
              {currencySymbol} {totalExtraCost.toFixed(2)}
              {hasNonFlat && <span className="text-xs text-purple-400 ml-1 font-normal">* + Variáveis</span>}
            </span>
          </div>
          {totalExtraWeight > 0 && (
            <div className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400 font-medium text-sm">
              <Scale className="w-4 h-4" />
              <span>Peso extra adicionado: {totalExtraWeight.toFixed(3)} kg</span>
            </div>
          )}
        </div>
      )}

      {/* Footer Navigation */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-100 dark:border-gray-700 mt-8">
        <button
          onClick={onPrev}
          className="px-6 py-2.5 rounded-xl font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          Voltar
        </button>
        <button
          onClick={onNext}
          className="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold transition shadow-lg flex items-center gap-2"
        >
          Continuar
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
          </svg>
        </button>
      </div>
    </div>
  );
}
