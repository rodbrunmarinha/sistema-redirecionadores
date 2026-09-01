"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { updatePreAlertAction } from "@/app/actions/updatePreAlert";
import { cancelPreAlertAction } from "@/app/actions/cancelPreAlert";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { ArrowLeft, CheckCircle2, ChevronDown, Copy, Edit2, Package, Box, XCircle, Info, Paperclip, UploadCloud } from "lucide-react";

export default function PreAlertDetailClient({ preAlert, subdomain }: { preAlert: any, subdomain: string }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isCancelPending, startCancelTransition] = useTransition();

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    startTransition(async () => {
      const result = await updatePreAlertAction(payload, preAlert.id, subdomain);
      if (result.success) {
        toast.success("Pré-alerta atualizado com sucesso!");
        setIsEditing(false);
        router.refresh();
      } else {
        toast.error("Erro ao atualizar: " + result.error);
      }
    });
  };

  const handleCancel = () => {
    if (confirm("Tem certeza que deseja cancelar este pré-alerta?")) {
      startCancelTransition(async () => {
        const result = await cancelPreAlertAction(preAlert.id, subdomain);
        if (result.success) {
          toast.success("Pré-alerta cancelado!");
          router.refresh();
        } else {
          toast.error("Erro ao cancelar: " + result.error);
        }
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Código copiado!");
  };

  const formatDisplayDate = (dString: string | null) => {
    if (!dString) return "-";
    const d = new Date(dString);
    if (dString.length === 10) {
      d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
    }
    return d.toLocaleDateString('pt-BR');
  };

  const formatDateTime = (dString: string) => {
    const d = new Date(dString);
    return `${d.toLocaleDateString('pt-BR')} ${d.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}`;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back */}
      <Link href={`/app/pre-alerts`} className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-indigo-600 transition mb-2 font-medium">
        <ArrowLeft className="w-4 h-4" />
        Pré-Alertas
      </Link>

      {/* Receipt Code Hero */}
      {preAlert.receiving_code && (
        <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl p-5 shadow-xl shadow-orange-500/30 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-5 h-5 text-orange-200" />
            <p className="text-orange-100 text-sm font-bold uppercase tracking-widest">Cód. Recebimento</p>
          </div>
          <div className="text-3xl font-extrabold font-mono tracking-widest mb-3">{preAlert.receiving_code}</div>
          <p className="text-orange-100 text-xs mb-3">Quando o entregador chegar ao armazém, ele irá solicitar este código para confirmar a entrega. Informando aqui, o armazém já estará preparado.</p>
          <button 
            type="button" 
            onClick={() => copyToClipboard(preAlert.receiving_code)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur rounded-xl font-semibold text-sm transition"
          >
            <Copy className="w-4 h-4" />
            Copiar código
          </button>
        </div>
      )}

      {/* Status + Details */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-zinc-200/50 divide-y divide-zinc-200/50">
        <div className="px-6 py-4 flex items-center justify-between">
          <span className="font-bold text-zinc-900">Status</span>
          <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold ${
            preAlert.status === 'pending' ? 'bg-amber-100 text-amber-700' :
            preAlert.status === 'received' ? 'bg-emerald-100 text-emerald-700' :
            'bg-zinc-100 text-zinc-700'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              preAlert.status === 'pending' ? 'bg-amber-500 animate-pulse' :
              preAlert.status === 'received' ? 'bg-emerald-500' :
              'bg-zinc-400'
            }`}></span>
            {preAlert.status === 'pending' ? 'Aguardando' : preAlert.status === 'received' ? 'Recebido' : 'Cancelado'}
          </span>
        </div>

        <div className="px-6 py-3.5 flex justify-between gap-4">
          <span className="text-sm font-semibold text-zinc-500 flex-shrink-0">Loja</span>
          <span className="text-sm text-zinc-900 font-medium text-right">{preAlert.store_name || "-"}</span>
        </div>
        {preAlert.order_number && (
          <div className="px-6 py-3.5 flex justify-between gap-4">
            <span className="text-sm font-semibold text-zinc-500 flex-shrink-0">Pedido</span>
            <span className="text-sm text-zinc-900 font-medium text-right">{preAlert.order_number}</span>
          </div>
        )}
        <div className="px-6 py-3.5 flex justify-between gap-4">
          <span className="text-sm font-semibold text-zinc-500 flex-shrink-0">Rastreio</span>
          <code className="text-sm font-mono text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded">{preAlert.tracking_number}</code>
        </div>
        {preAlert.receiving_code && (
          <div className="px-6 py-3.5 flex justify-between gap-4">
            <span className="text-sm font-semibold text-zinc-500 flex-shrink-0">Cód. Recebimento</span>
            <code className="text-sm font-mono text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded">{preAlert.receiving_code}</code>
          </div>
        )}
        <div className="px-6 py-3.5 flex justify-between gap-4">
          <span className="text-sm font-semibold text-zinc-500 flex-shrink-0">Transportadora</span>
          <span className="text-sm text-zinc-900 font-medium text-right">{preAlert.carrier || "-"}</span>
        </div>
        <div className="px-6 py-3.5 flex justify-between gap-4">
          <span className="text-sm font-semibold text-zinc-500 flex-shrink-0">Conteúdo</span>
          <span className="text-sm text-zinc-900 font-medium text-right">{preAlert.description}</span>
        </div>
        <div className="px-6 py-3.5 flex justify-between gap-4">
          <span className="text-sm font-semibold text-zinc-500 flex-shrink-0">Volumes</span>
          <span className="text-sm text-zinc-900 font-medium text-right">{preAlert.volumes_qty} vol.</span>
        </div>
        <div className="px-6 py-3.5 flex justify-between gap-4">
          <span className="text-sm font-semibold text-zinc-500 flex-shrink-0">Valor declarado</span>
          <span className="text-sm text-zinc-900 font-medium text-right">${Number(preAlert.declared_value).toFixed(2)}</span>
        </div>
        <div className="px-6 py-3.5 flex justify-between gap-4">
          <span className="text-sm font-semibold text-zinc-500 flex-shrink-0">Prev. de chegada</span>
          <span className="text-sm text-zinc-900 font-medium text-right">{formatDisplayDate(preAlert.estimated_arrival)}</span>
        </div>
        {preAlert.notes && (
          <div className="px-6 py-3.5 flex justify-between gap-4">
            <span className="text-sm font-semibold text-zinc-500 flex-shrink-0">Obs.</span>
            <span className="text-sm text-zinc-900 font-medium text-right">{preAlert.notes}</span>
          </div>
        )}
        <div className="px-6 py-3.5 flex justify-between gap-4">
          <span className="text-sm font-semibold text-zinc-500 flex-shrink-0">Criado em</span>
          <span className="text-sm text-zinc-900 font-medium text-right">{formatDateTime(preAlert.created_at)}</span>
        </div>
        {preAlert.status === 'received' && preAlert.boxes && (
          <>
            <div className="px-6 py-3.5 border-t border-zinc-200/50 flex justify-between gap-4 ">
              <span className="text-sm font-semibold text-emerald-500 flex-shrink-0">Caixa recebida</span>
              <Link href={`/app/boxes/${preAlert.boxes.id}`} className="text-sm text-emerald-500 font-bold text-right flex items-center gap-1 hover:underline">
                <Box className="w-4 h-4" />
                Ver caixa recebida #{preAlert.boxes.id.slice(0, 4).toUpperCase()}
              </Link>
            </div>
            <div className="px-6 py-3.5 border-t border-zinc-200/50 flex justify-between gap-4 ">
              <span className="text-sm font-semibold text-emerald-500 flex-shrink-0">Chegou em</span>
              <span className="text-sm text-emerald-500 font-bold text-right">{formatDateTime(preAlert.boxes.received_at)}</span>
            </div>
          </>
        )}
      </div>

      {/* Comprovantes Placeholder */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-zinc-200/50">
        <div className="px-6 py-4 border-b border-zinc-200/50 flex items-center justify-between">
          <span className="flex items-center gap-2 font-semibold text-zinc-900">
            <Paperclip className="w-4 h-4 text-indigo-500" />
            Comprovantes
          </span>
          <button type="button" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition" onClick={() => toast("Upload de anexos será implementado na próxima atualização!")}>
            <UploadCloud className="w-3.5 h-3.5" />
            Adicionar
          </button>
        </div>
        <div className="px-6 py-5 text-sm text-zinc-400 italic">
          Nenhum comprovante anexado.
        </div>
      </div>

      {/* Edit section */}
      {preAlert.status === 'pending' && (
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-zinc-200/50">
          <button 
            type="button" 
            onClick={() => setIsEditing(!isEditing)} 
            className="w-full flex items-center justify-between gap-3 px-6 py-4 text-left"
          >
            <span className="flex items-center gap-2 font-semibold text-zinc-900">
              <Edit2 className="w-4 h-4 text-indigo-500" />
              Editar informações
            </span>
            <ChevronDown className={`w-5 h-5 text-zinc-400 transition-transform ${isEditing ? 'rotate-180' : ''}`} />
          </button>

          {isEditing && (
            <div className="border-t border-zinc-200/50 px-6 py-5">
              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-600 mb-1">Loja / Fornecedor <span className="text-red-500">*</span></label>
                    <input type="text" name="store_name" defaultValue={preAlert.store_name} required className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-xl text-sm focus:border-indigo-500 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-600 mb-1">Número do Pedido</label>
                    <input type="text" name="order_number" defaultValue={preAlert.order_number} className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-xl text-sm focus:border-indigo-500 focus:ring-indigo-500" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-600 mb-1">Código de Rastreio <span className="text-red-500">*</span></label>
                    <input type="text" name="tracking_number" defaultValue={preAlert.tracking_number} required className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-xl text-sm font-mono focus:border-indigo-500 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-600 mb-1">Código de Recebimento</label>
                    <input type="text" name="receiving_code" defaultValue={preAlert.receiving_code} className="w-full px-4 py-2.5 bg-white border border-orange-300 rounded-xl text-sm font-mono focus:border-orange-500 focus:ring-orange-500" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-600 mb-1">Transportadora</label>
                    <input type="text" name="carrier" defaultValue={preAlert.carrier} className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-xl text-sm focus:border-indigo-500 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-600 mb-1">Previsão de Chegada</label>
                    <input type="date" name="estimated_arrival" defaultValue={preAlert.estimated_arrival} className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-xl text-sm focus:border-indigo-500 focus:ring-indigo-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-600 mb-1">Descrição do Conteúdo <span className="text-red-500">*</span></label>
                  <textarea name="description" rows={2} required defaultValue={preAlert.description} className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-xl text-sm focus:border-indigo-500 focus:ring-indigo-500" />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-600 mb-1">Qtd. de Volumes <span className="text-red-500">*</span></label>
                    <input type="number" name="volumes_qty" min="1" max="50" required defaultValue={preAlert.volumes_qty} className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-xl text-sm focus:border-indigo-500 focus:ring-indigo-500" />
                  </div>
                  <div className="col-span-2 sm:col-span-2">
                    <label className="block text-xs font-semibold text-zinc-600 mb-1">Valor Declarado (USD)</label>
                    <input type="number" name="declared_value" min="0" step="0.01" defaultValue={preAlert.declared_value} className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-xl text-sm focus:border-indigo-500 focus:ring-indigo-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-600 mb-1">Observações</label>
                  <textarea name="notes" rows={2} defaultValue={preAlert.notes} className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-xl text-sm focus:border-indigo-500 focus:ring-indigo-500" />
                </div>

                <div className="flex gap-3 pt-1">
                  <button type="submit" disabled={isPending} className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition shadow-lg shadow-indigo-500/30 disabled:opacity-50">
                    {isPending ? "Salvando..." : "Salvar alterações"}
                  </button>
                  <button type="button" onClick={() => setIsEditing(false)} className="px-5 py-2.5 bg-zinc-100 text-zinc-700 hover:bg-zinc-200 font-semibold rounded-xl text-sm transition">
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Cancel button */}
      {preAlert.status === 'pending' && (
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-zinc-200/50 p-6">
          <h3 className="font-semibold text-zinc-900 mb-3">Cancelar pré-alerta</h3>
          <p className="text-sm text-zinc-500 mb-4">Se sua encomenda foi cancelada ou não vai mais chegar, você pode cancelar este pré-alerta.</p>
          <button 
            type="button" 
            onClick={handleCancel}
            disabled={isCancelPending}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-100 text-red-700 hover:bg-red-200 font-semibold rounded-xl transition text-sm disabled:opacity-50"
          >
            <XCircle className="w-4 h-4" />
            {isCancelPending ? "Cancelando..." : "Cancelar pré-alerta"}
          </button>
        </div>
      )}
    </div>
  );
}
