"use client";

import React from "react";

export default function Step2Terms({ formData, setFormData, onNext, onPrev }: any) {
  const toggleTerm = (term: string) => {
    setFormData((prev: any) => ({
      ...prev,
      termsAccepted: !prev.termsAccepted, // Simple boolean for now, could be an object if multiple terms
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Termos e Condições</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Leia e aceite as regras antes de prosseguir com o envio.</p>
      </div>

      <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 h-64 overflow-y-auto space-y-4">
        <p>
          <strong>1. Serviços de Redirecionamento</strong><br/>
          Ao utilizar nossos serviços, você concorda que atuamos apenas como intermediários para receber e despachar suas mercadorias.
        </p>
        <p>
          <strong>2. Declaração Alfandegária</strong><br/>
          Você é o único responsável pela precisão das informações fornecidas na declaração alfandegária. Valores incorretos ou descrições falsas podem resultar na apreensão da sua caixa.
        </p>
        <p>
          <strong>3. Itens Proibidos</strong><br/>
          Você declara que não está enviando nenhum item proibido pelas leis do país de origem ou destino.
        </p>
      </div>

      <label className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl cursor-pointer border border-blue-100 dark:border-blue-900/50">
        <input 
          type="checkbox" 
          className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
          checked={formData.termsAccepted}
          onChange={() => toggleTerm('all')}
        />
        <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
          Eu li e concordo com os Termos e Condições e com as Políticas de Envio.
        </span>
      </label>

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
          disabled={!formData.termsAccepted}
          className="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
