"use client";
import { useTenantSettings } from "../../components/TenantSettingsContext";

import { useState, useTransition, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Info, CheckCircle2, Loader2 } from "lucide-react";
import { createPreAlertAction } from "@/app/actions/createPreAlert";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { createClient } from "@/utils/supabase/client";

export default function CreatePreAlertPage() {
  const { currency, currencySymbol } = useTenantSettings();
  const params = useParams();
  const router = useRouter();
  const subdomain = params?.subdomain as string;
  const [isPending, startTransition] = useTransition();
  const [dock, setDock] = useState("Carregando...");

  useEffect(() => {
    const fetchDock = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from("profiles").select("suite_number").eq("id", user.id).single();
        if (data && data.suite_number) setDock(data.suite_number);
        else setDock("Não encontrada");
      }
    };
    fetchDock();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    startTransition(async () => {
      const result = await createPreAlertAction(payload, subdomain);
      if (result.success) {
        toast.success("Pré-alerta criado com sucesso!");
        router.push(`/app/pre-alerts`);
      } else {
        toast.error("Erro ao criar pré-alerta: " + result.error);
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-6">
        <Link 
          href={`/app/pre-alerts`}
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-indigo-600 transition mb-4 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Pré-Alertas
        </Link>
        <h1 className="text-3xl font-bold text-zinc-900">Novo Pré-Alerta</h1>
        <p className="text-zinc-600 mt-1">Avise o armazém sobre uma nova encomenda que está a caminho.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-zinc-200/50 p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-2">
                    Loja / Fornecedor <span className="text-red-500">*</span>
                  </label>
                  <input 
                    name="store_name"
                    type="text" 
                    placeholder="ex: Amazon, eBay, Apple..." 
                    className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-colors" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-2">
                    Número do Pedido
                  </label>
                  <input 
                    name="order_number"
                    type="text" 
                    placeholder="ex: #114-1234567-890" 
                    className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-colors" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-2">
                    Código de Rastreio <span className="text-red-500">*</span>
                  </label>
                  <input 
                    name="tracking_number"
                    type="text" 
                    placeholder="ex: 1Z999AA10123456784" 
                    className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-colors" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-2">
                    Transportadora
                  </label>
                  <input 
                    name="carrier"
                    type="text" 
                    placeholder="ex: UPS, FedEx, USPS..." 
                    className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-colors" 
                  />
                </div>
              </div>

              {/* Código de Recebimento */}
              <div className="rounded-xl border border-orange-200 bg-orange-50 p-5">
                <label className="block text-sm font-bold text-orange-900 mb-1">
                  Código de Recebimento
                </label>
                <p className="text-xs text-orange-700 mb-3 leading-relaxed">
                  Código fornecido pela loja (ex: Amazon). O entregador irá solicitá-lo ao chegar no armazém para confirmar a entrega.
                </p>
                <input 
                  name="receiving_code"
                  type="text" 
                  placeholder="ex: ABC-123456" 
                  className="w-full px-4 py-2.5 bg-white border border-orange-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-mono text-sm shadow-sm transition-colors" 
                />
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-2">
                  Descrição do Conteúdo <span className="text-red-500">*</span>
                </label>
                <textarea 
                  name="description"
                  rows={3} 
                  placeholder="ex: Tênis Nike tamanho 42, camisa..." 
                  className="w-full px-4 py-3 bg-white border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-colors resize-none" 
                  required
                ></textarea>
              </div>

              {/* Qtd e Valor */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-2">
                    Qtd. de Volumes <span className="text-red-500">*</span>
                  </label>
                  <input 
                    name="volumes_qty"
                    type="number" 
                    defaultValue="1" 
                    min="1" 
                    max="50" 
                    className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-colors" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-2">
                    Valor Declarado ({currency})
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-semibold">{currencySymbol}</span>
                    <input 
                      name="declared_value"
                      type="number" 
                      min="0" 
                      step="0.01" 
                      placeholder="0.00" 
                      className="w-full pl-9 pr-4 py-2.5 bg-white border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-colors" 
                    />
                  </div>
                </div>
              </div>

              {/* Previsão e Obs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-2">
                    Previsão de Chegada
                  </label>
                  <input 
                    name="estimated_arrival"
                    type="date" 
                    className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-colors text-zinc-700" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-2">
                    Dock Destino
                  </label>
                  <input 
                    type="text" 
                    value={dock} 
                    disabled 
                    className="w-full px-4 py-2.5 bg-zinc-100 border border-zinc-200 rounded-xl text-zinc-500 font-medium cursor-not-allowed" 
                  />
                </div>
              </div>

              {/* Obs */}
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-2">
                  Observações
                </label>
                <textarea 
                  name="notes"
                  rows={2} 
                  placeholder="Informações adicionais para o armazém" 
                  className="w-full px-4 py-3 bg-white border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-colors resize-none"
                ></textarea>
              </div>

              {/* Botões */}
              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <button 
                  type="submit" 
                  disabled={isPending}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 transition-colors text-center disabled:opacity-50"
                >
                  {isPending ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Criar Pré-Alerta"}
                </button>
                <Link 
                  href={`/app/pre-alerts`} 
                  className="px-8 py-3 bg-zinc-100 text-zinc-700 rounded-xl font-semibold hover:bg-zinc-200 transition-colors text-center flex items-center justify-center"
                >
                  Cancelar
                </Link>
              </div>

            </form>
          </div>
        </div>

        {/* Sidebar tips */}
        <div className="space-y-4">
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 sticky top-28">
            <h3 className="font-bold text-indigo-900 mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-indigo-600" />
              Por que criar um pré-alerta?
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-indigo-800 leading-relaxed">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-indigo-600" />
                <span>O armazém saberá que sua encomenda está chegando e poderá identificá-la mais rápido.</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-indigo-800 leading-relaxed">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-indigo-600" />
                <span>Você receberá uma notificação assim que ela for recebida.</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-indigo-800 leading-relaxed">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-indigo-600" />
                <span>Ideal para encomendas que exigem um código de recebimento — que a empresa precisa fornecer ao entregador no momento da entrega.</span>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
