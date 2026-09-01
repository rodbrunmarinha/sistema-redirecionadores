"use client";

import React from "react";
import { useTenantSettings } from "../../../components/TenantSettingsContext";

export default function Step6Declaration({ formData, setFormData, onNext, onPrev }: any) {
  const { currencySymbol } = useTenantSettings();

  const handleAddRow = () => {
    setFormData((prev: any) => ({
      ...prev,
      declaration: [...prev.declaration, { description: "", quantity: 1, value: 0 }]
    }));
  };

  const handleUpdateRow = (index: number, field: string, value: any) => {
    setFormData((prev: any) => {
      const newDeclaration = [...prev.declaration];
      newDeclaration[index] = { ...newDeclaration[index], [field]: value };
      return { ...prev, declaration: newDeclaration };
    });
  };

  const handleRemoveRow = (index: number) => {
    setFormData((prev: any) => {
      const newDeclaration = [...prev.declaration];
      newDeclaration.splice(index, 1);
      return { ...prev, declaration: newDeclaration };
    });
  };

  const totalValue = formData.declaration.reduce((acc: number, row: any) => acc + (row.value * row.quantity || 0), 0);

  // Initialize with selected products or at least one row if empty
  React.useEffect(() => {
    if (formData.declaration.length === 0) {
      const selectedProducts = Object.values(formData.products || {});
      if (selectedProducts.length > 0) {
        const prefilled = selectedProducts.map((p: any) => ({
          description: p.name || "",
          quantity: p.quantity || 1,
          value: p.price_paid || 0
        }));
        setFormData((prev: any) => ({ ...prev, declaration: prefilled }));
      } else {
        handleAddRow();
      }
    }
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Declaração Alfandegária</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Preencha os itens para a alfândega. Seja preciso e descritivo em inglês.</p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex gap-3 text-amber-800 dark:text-amber-300 text-sm">
         <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
         <p>É obrigatório declarar o valor real e usar nomes descritivos (ex: "Men's Cotton T-Shirt" em vez de "Shirt").</p>
      </div>

      <div className="space-y-4">
        {formData.declaration.map((row: any, index: number) => (
          <div key={index} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex-1 w-full">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Descrição em Inglês</label>
              <input 
                type="text" 
                value={row.description}
                onChange={(e) => handleUpdateRow(index, "description", e.target.value)}
                placeholder="Ex: Men's Cotton T-Shirt"
                className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
              />
            </div>
            <div className="w-full sm:w-24">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Qtd</label>
              <input 
                type="number" 
                min="1"
                value={row.quantity}
                onChange={(e) => handleUpdateRow(index, "quantity", parseInt(e.target.value) || 1)}
                className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
              />
            </div>
            <div className="w-full sm:w-32">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Valor Unit. ({currencySymbol})</label>
              <input 
                type="number" 
                min="0"
                step="0.01"
                value={row.value || ""}
                onChange={(e) => handleUpdateRow(index, "value", parseFloat(e.target.value) || 0)}
                className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
              />
            </div>
            {formData.declaration.length > 1 && (
              <button 
                onClick={() => handleRemoveRow(index)}
                className="mt-5 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 p-4 rounded-xl">
        <button 
          onClick={handleAddRow}
          className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          Adicionar Item
        </button>
        <div className="font-bold text-gray-900 dark:text-white">
          Total Declarado: <span className="text-blue-600 dark:text-blue-400">{currencySymbol} {totalValue.toFixed(2)}</span>
        </div>
      </div>

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
