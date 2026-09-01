"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useTenantSettings } from "../../../components/TenantSettingsContext";

export default function Step7Summary({ formData, onPrev }: any) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const { currencySymbol, settings } = useTenantSettings();

  const productIds = Object.keys(formData.products || {});
  const totalProducts = productIds.reduce((acc, id) => acc + (formData.products[id].quantity || 1), 0);
  const totalWeight = productIds.reduce((acc, id) => acc + (parseFloat(formData.products[id].weight || 0) * (formData.products[id].quantity || 1)), 0);
  const totalDeclared = formData.declaration.reduce((acc: number, row: any) => acc + (row.value * row.quantity || 0), 0);
  const totalRealValue = productIds.reduce((acc, id) => acc + (parseFloat(formData.products[id].price_paid || 0) * (formData.products[id].quantity || 1)), 0);

  let serviceFee = 0;
  const serviceFeeType = settings?.operations?.serviceFeeType || 'none';
  const serviceFeeAmount = parseFloat(settings?.operations?.serviceFeeAmount || "0");

  if (serviceFeeType === 'fixed_per_box') {
    serviceFee = serviceFeeAmount;
  } else if (serviceFeeType === 'per_weight') {
    serviceFee = serviceFeeAmount * totalWeight;
  } else if (serviceFeeType === 'percentage_product') {
    serviceFee = (totalRealValue * serviceFeeAmount) / 100;
  }

  const handleSubmit = async () => {
    setSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Envio criado com sucesso!");
      sessionStorage.removeItem("preselected_products");
      router.push("/app/shipments");
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      {submitting && (
        <div className="absolute inset-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl">
           <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
           <p className="font-bold text-gray-900 dark:text-white">Criando envio...</p>
        </div>
      )}

      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Resumo do Envio</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Revise todas as informações antes de confirmar.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Produtos */}
        <div className="bg-gray-50 dark:bg-gray-900/50 p-5 rounded-2xl border border-gray-200 dark:border-gray-700">
          <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
            Produtos
          </h3>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <p>Itens selecionados: <strong className="text-gray-900 dark:text-white">{totalProducts}</strong></p>
            <p>Peso estimado: <strong className="text-gray-900 dark:text-white">{totalWeight.toFixed(3)} kg</strong></p>
          </div>
        </div>

        {/* Endereço */}
        <div className="bg-gray-50 dark:bg-gray-900/50 p-5 rounded-2xl border border-gray-200 dark:border-gray-700">
          <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            Destino
          </h3>
          {formData.address ? (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p className="font-medium text-gray-900 dark:text-white">{formData.address.recipient}</p>
              <p>{formData.address.street} {formData.address.complement}</p>
              <p>{formData.address.city}, {formData.address.state} - {formData.address.country}</p>
            </div>
          ) : (
             <p className="text-sm text-red-500">Endereço não selecionado</p>
          )}
        </div>

        {/* Declaração */}
        <div className="bg-gray-50 dark:bg-gray-900/50 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 md:col-span-2">
          <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            Declaração Alfandegária
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-100 dark:bg-gray-800 rounded-t-lg">
                <tr>
                  <th className="px-4 py-2 rounded-tl-lg">Item</th>
                  <th className="px-4 py-2">Qtd</th>
                  <th className="px-4 py-2 text-right rounded-tr-lg">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {formData.declaration.map((item: any, i: number) => (
                  <tr key={i}>
                    <td className="px-4 py-2 font-medium text-gray-900 dark:text-white">{item.description || "-"}</td>
                    <td className="px-4 py-2 text-gray-600 dark:text-gray-400">{item.quantity}</td>
                    <td className="px-4 py-2 text-right font-medium text-gray-900 dark:text-white">{currencySymbol} {(item.value * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={2} className="px-4 py-3 text-right font-bold text-gray-900 dark:text-white">Total Declarado:</td>
                  <td className="px-4 py-3 text-right font-bold text-blue-600 dark:text-blue-400">{currencySymbol} {totalDeclared.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {/* Resumo Financeiro */}
      <div className="bg-emerald-50 dark:bg-emerald-900/20 p-5 rounded-2xl border border-emerald-200 dark:border-emerald-800/50 mt-6">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          Custos do Envio
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-600 dark:text-gray-400">
            <span>Frete Selecionado</span>
            <span>{currencySymbol} {(formData.shippingPrice || 0).toFixed(2)}</span>
          </div>
          {serviceFee > 0 && (
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>
                Taxa de Serviço do Redirecionador
                {serviceFeeType === 'percentage_product' ? ` (${serviceFeeAmount}%)` : ''}
              </span>
              <span>{currencySymbol} {serviceFee.toFixed(2)}</span>
            </div>
          )}
          <div className="pt-3 mt-3 border-t border-emerald-200/50 dark:border-emerald-800/50 flex justify-between font-bold text-lg text-emerald-700 dark:text-emerald-400">
            <span>Total a Pagar</span>
            <span>{currencySymbol} {((formData.shippingPrice || 0) + serviceFee).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-100 dark:border-gray-700 mt-8">
        <button
          onClick={onPrev}
          disabled={submitting}
          className="px-6 py-2.5 rounded-xl font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition disabled:opacity-50"
        >
          Voltar
        </button>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="px-8 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-bold transition shadow-lg flex items-center gap-2 disabled:opacity-50"
        >
          Confirmar e Solicitar Envio
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </button>
      </div>
    </div>
  );
}
