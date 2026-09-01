"use client";

import React, { useTransition } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { deleteServiceAction } from "@/app/actions/deleteService";

import { useTenantSettings } from "../../../app/(customer)/components/TenantSettingsContext";

export default function ServiceCard({ service }: { service: any }) {
    const [isPending, startTransition] = useTransition();
  const { currencySymbol } = useTenantSettings();

  const handleDelete = () => {
    if (confirm("Tem certeza que deseja excluir este serviço?")) {
      startTransition(async () => {
        const res = await deleteServiceAction(service.id);
        if (res.success) {
          toast.success("Serviço excluído!");
        } else {
          toast.error(res.error || "Erro ao excluir");
        }
      });
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition flex flex-col relative group">
      {/* Delete button (hidden by default, shown on group hover) */}
      <button 
        onClick={handleDelete}
        disabled={isPending}
        className="absolute top-4 right-4 p-2 bg-zinc-800/80 hover:bg-red-500/20 text-zinc-500 hover:text-red-500 rounded-xl transition opacity-0 group-hover:opacity-100 disabled:opacity-50 z-10"
        title="Excluir serviço"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      <div className="flex items-start justify-between mb-4 pr-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center text-2xl border border-zinc-700 shadow-sm">
            {service.icon || '🔧'}
          </div>
          <div>
            <h3 className="font-bold text-white text-lg leading-tight">{service.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium uppercase tracking-wider ${
                service.is_active ? 'bg-emerald-500/10 text-emerald-500' : 'bg-zinc-500/10 text-zinc-500'
              }`}>
                {service.is_active ? 'Ativo' : 'Oculto'}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-zinc-400 text-sm mb-4 flex-grow line-clamp-3">
        {service.description}
      </p>
      
      <div className="flex flex-wrap gap-1.5 mb-4 mt-auto">
        {service.payment_mode === 'after_completion' && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-500 border border-amber-500/20">Pago Após</span>
        )}
        {service.payment_mode === 'upfront' && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] bg-blue-500/10 text-blue-500 border border-blue-500/20">Pago Antes</span>
        )}
        {service.payment_mode === 'pre_deposit' && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] bg-purple-500/10 text-purple-500 border border-purple-500/20">Depósito</span>
        )}
        
        {service.requires_approval && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] bg-zinc-800 text-zinc-300 border border-zinc-700">Aprovação Manual</span>
        )}
        
        {service.auto_release && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] bg-zinc-800 text-zinc-300 border border-zinc-700">Liberação Automática</span>
        )}
        
        {service.charge_freight_upfront && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] bg-zinc-800 text-zinc-300 border border-zinc-700">Frete Antecipado</span>
        )}
        
        {service.estimated_days ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] bg-zinc-800 text-zinc-300 border border-zinc-700">{service.estimated_days} dias</span>
        ) : null}
      </div>

      <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs text-zinc-500 uppercase font-semibold">Valor Base</span>
          <span className="font-bold text-white">
            {service.price_type === 'quote' ? 'Sob Consulta' : 
              service.price_type === 'percentage' ? `${service.price || 0}%` : 
              `${currencySymbol}${(service.price || 0).toFixed(2).replace('.', ',')}`}
          </span>
        </div>
        
        <Link href={`/admin/services/${service.id}/edit`} className="px-3 py-1.5 text-sm bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-lg transition border border-zinc-700 hover:border-zinc-600">
          Editar
        </Link>
      </div>
    </div>
  );
}
