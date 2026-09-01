"use client";
import React from "react";
import { Truck, Scale, Package, Wand2, Box, Info, AlertTriangle, Check } from "lucide-react";
import { useTenantSettings } from "../../../components/TenantSettingsContext";

export default function Step5Shipping({ formData, setFormData, onNext, onPrev, shippingTypes = [], availableExtras = [] }: any) {
  const { currencySymbol } = useTenantSettings();

  // Calculate weights
  const selectedProducts = formData.products || {};
  const productsWeight = Object.values(selectedProducts).reduce((acc: number, p: any) => acc + (parseFloat(p.weight || 0) * (p.quantity || 1)), 0);
  
  const selectedExtras = availableExtras.filter((e: any) => (formData.extras || []).includes(e.id));
  const extrasWeight = selectedExtras.reduce((acc: number, curr: any) => acc + (curr.extra_weight || 0), 0);
  
  // Embalagem weight is unknown at this step unless we estimate
  const totalWeight = productsWeight + extrasWeight;

  const handleSelect = (methodId: string, price: number) => {
    setFormData((prev: any) => ({ ...prev, shippingMethod: methodId, shippingPrice: price }));
  };

  // Determine which methods are available
  const availableMethods = shippingTypes.map((method: any) => {
    if (method.requires_quote) {
      return { ...method, available: true, displayPrice: "Sob cotação", price: 0 };
    }
    
    // Find applicable rate bracket
    const rate = method.shipping_rates?.find((r: any) => totalWeight >= (r.weight_start || 0) && totalWeight <= (r.weight_end || 999999));
    
    if (rate && rate.price_sell !== undefined) {
      return { ...method, available: true, displayPrice: `${currencySymbol} ${rate.price_sell.toFixed(2)}`, price: rate.price_sell };
    }
    
    return { ...method, available: false, displayPrice: null, price: 0 };
  });

  const hasAvailableMethods = availableMethods.some((m: any) => m.available);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3">
        <div className="text-3xl">🚚</div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Método de Envio</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Escolha a melhor opção de frete para você</p>
        </div>
      </div>

      {/* Detalhamento do Peso */}
      <div className="bg-blue-50/40 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/50 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Scale className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="font-bold text-blue-900 dark:text-blue-100 text-[15px]">Detalhamento do Peso</h3>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-blue-50 dark:border-blue-900/30 text-center shadow-sm shadow-blue-900/5">
            <div className="text-[11px] text-gray-500 font-bold flex items-center justify-center gap-1.5 mb-1.5 uppercase">
              <Package className="w-3.5 h-3.5 text-orange-400" /> Produtos
            </div>
            <div className="font-bold text-gray-900 dark:text-white text-lg">{productsWeight.toFixed(3)} kg</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-blue-50 dark:border-blue-900/30 text-center shadow-sm shadow-blue-900/5">
            <div className="text-[11px] text-gray-500 font-bold flex items-center justify-center gap-1.5 mb-1.5 uppercase">
              <Wand2 className="w-3.5 h-3.5 text-orange-400" /> Serviços Extras
            </div>
            <div className="font-bold text-gray-900 dark:text-white text-lg">{extrasWeight.toFixed(3)} kg</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-blue-50 dark:border-blue-900/30 text-center shadow-sm shadow-blue-900/5 opacity-70">
            <div className="text-[11px] text-gray-500 font-bold flex items-center justify-center gap-1.5 mb-1.5 uppercase">
              <Box className="w-3.5 h-3.5 text-orange-400" /> Embalagem
            </div>
            <div className="font-bold text-gray-900 dark:text-white text-lg">--- kg</div>
          </div>
          
          <div className="bg-blue-600 dark:bg-blue-500 p-4 rounded-xl border border-blue-700 dark:border-blue-600 text-center shadow-md shadow-blue-500/30">
            <div className="text-[11px] text-blue-200 dark:text-blue-100 font-bold flex items-center justify-center gap-1.5 mb-1.5 uppercase tracking-wide">
              <Scale className="w-3.5 h-3.5 text-blue-300 dark:text-blue-200" /> Peso Total
            </div>
            <div className="font-bold text-white text-xl">{totalWeight.toFixed(3)} kg</div>
          </div>
        </div>
      </div>

      {/* Methods List */}
      <div className="space-y-4">
        {!hasAvailableMethods && (
          <div className="bg-amber-50 dark:bg-amber-900/10 border-2 border-amber-200 dark:border-amber-700/50 rounded-2xl p-8 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 text-amber-500 dark:text-amber-400 rounded-2xl flex items-center justify-center mb-4">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="text-amber-800 dark:text-amber-500 font-bold text-lg mb-1">Nenhum método disponível para este destino</h3>
            <p className="text-amber-700/80 dark:text-amber-400/80 text-sm">O peso total pode exceder os limites disponíveis.</p>
          </div>
        )}

        {availableMethods.filter((m: any) => m.available).map((method: any) => {
          const isSelected = formData.shippingMethod === method.id;
          return (
            <div 
              key={method.id}
              onClick={() => handleSelect(method.id, method.price)}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                isSelected 
                ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 shadow-md ring-4 ring-blue-500/10" 
                : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm"
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    isSelected ? "border-blue-500 bg-blue-500" : "border-gray-300 dark:border-gray-600"
                  }`}>
                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">{method.name}</h3>
                </div>
                <div className="text-right">
                  <div className="font-bold text-xl text-blue-700 dark:text-blue-400">{method.displayPrice}</div>
                </div>
              </div>
              <div className="ml-8">
                {/* 
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">10-15 dias úteis</p>
                */}
                <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1">Este método de envio foi habilitado com base no peso do pacote.</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer Navigation */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-100 dark:border-gray-700 mt-8">
        <button
          onClick={onPrev}
          className="px-6 py-2.5 rounded-xl font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" /> Voltar
        </button>
        <button
          onClick={onNext}
          disabled={!formData.shippingMethod}
          className="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          Continuar
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// Temporary shim for lucide icons that aren't imported
const ChevronLeft = ({className}: any) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>;
const ChevronRight = ({className}: any) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>;
