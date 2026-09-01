"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, CreditCard, Search, X, Check, XCircle, FileText, Image as ImageIcon, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function ManualPaymentsPage() {
  const supabase = createClient();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [approveModal, setApproveModal] = useState<{ open: boolean; id: string | null; name: string; amount: number; notes: string }>({ open: false, id: null, name: "", amount: 0, notes: "" });
  const [rejectModal, setRejectModal] = useState<{ open: boolean; id: string | null; name: string; amount: number; reason: string }>({ open: false, id: null, name: "", amount: 0, reason: "" });
  const [lightbox, setLightbox] = useState<{ open: boolean; url: string; type: string; name: string }>({ open: false, url: "", type: "image", name: "" });
  const [processing, setProcessing] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("pending");
  const [search, setSearch] = useState("");

  const fetchPayments = async () => {
    setLoading(true);
    let query = supabase
      .from("manual_payments")
      .select("*, profiles(full_name)");

    if (statusFilter !== "all") {
      query = query.eq("status", statusFilter.toUpperCase());
    }

    const { data, error } = await query.order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching payments:", error);
    } else {
      let filteredData = data || [];
      if (search) {
        const s = search.toLowerCase();
        filteredData = filteredData.filter((p: any) => 
          p.profiles?.full_name?.toLowerCase().includes(s)
        );
      }
      setPayments(filteredData);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPayments();
  }, [statusFilter, search]);

  const stats = {
    all: payments.length, // this is not accurate for global if filtered, but good enough for UI
    pending: payments.filter(p => p.status === 'PENDING').length,
    approved: payments.filter(p => p.status === 'APPROVED').length,
    rejected: payments.filter(p => p.status === 'REJECTED').length,
  };

  const handleApprove = async () => {
    if (!approveModal.id || processing) return;
    setProcessing(true);
    
    const { error } = await supabase
      .from("manual_payments")
      .update({ 
        status: "APPROVED", 
        admin_notes: approveModal.notes 
      })
      .eq("id", approveModal.id);

    setProcessing(false);
    if (!error) {
      setApproveModal({ ...approveModal, open: false });
      fetchPayments();
    } else {
      alert("Erro ao aprovar: " + error.message);
    }
  };

  const handleReject = async () => {
    if (!rejectModal.id || processing || !rejectModal.reason.trim()) return;
    setProcessing(true);
    
    const { error } = await supabase
      .from("manual_payments")
      .update({ 
        status: "REJECTED", 
        admin_notes: rejectModal.reason 
      })
      .eq("id", rejectModal.id);

    setProcessing(false);
    if (!error) {
      setRejectModal({ ...rejectModal, open: false });
      fetchPayments();
    } else {
      alert("Erro ao rejeitar: " + error.message);
    }
  };

  const openProof = (url: string, name: string) => {
    if (!url) return;
    const ext = url.split('.').pop()?.toLowerCase();
    const type = ['jpg','jpeg','png','gif','webp'].includes(ext || '') ? 'image' : 'pdf';
    setLightbox({ open: true, url, type, name: name || 'Comprovante' });
  };

  return (
    <div className="min-h-screen bg-zinc-950 pb-12">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 shadow-lg shadow-orange-500/20">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10"></div>
          <div className="absolute -bottom-16 -left-8 w-64 h-64 rounded-full bg-white/5"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-sm mb-4 text-white/70">
            <Link href="/admin" className="hover:text-white transition-colors">Dashboard</Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            <span className="text-white font-medium truncate">Comprovantes de Pagamento</span>
          </nav>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shadow-lg shrink-0 border border-white/10">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Comprovantes de Pagamento</h1>
              <p className="text-orange-100 text-sm mt-1 font-medium">Revise e aprove pagamentos manuais</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button onClick={() => setStatusFilter('all')} className={`text-left relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 p-4 text-white shadow-lg transition hover:shadow-xl active:scale-95 ${statusFilter === 'all' ? 'ring-2 ring-white ring-offset-2 ring-offset-zinc-950' : ''}`}>
            <div className="absolute -right-3 -top-3 w-20 h-20 bg-white/10 rounded-full pointer-events-none"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-indigo-100">Todos</p>
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                  <CreditCard className="w-4 h-4 text-white" />
                </div>
              </div>
              <p className="text-3xl font-extrabold tracking-tight">{stats.all}</p>
            </div>
          </button>
          
          <button onClick={() => setStatusFilter('pending')} className={`text-left relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 p-4 text-white shadow-lg transition hover:shadow-xl active:scale-95 ${statusFilter === 'pending' ? 'ring-2 ring-white ring-offset-2 ring-offset-zinc-950' : ''}`}>
            <div className="absolute -right-3 -top-3 w-20 h-20 bg-white/10 rounded-full pointer-events-none"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-amber-100">Pendentes</p>
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                  <Loader2 className="w-4 h-4 text-white" />
                </div>
              </div>
              <p className="text-3xl font-extrabold tracking-tight">{stats.pending}</p>
            </div>
          </button>

          <button onClick={() => setStatusFilter('approved')} className={`text-left relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 p-4 text-white shadow-lg transition hover:shadow-xl active:scale-95 ${statusFilter === 'approved' ? 'ring-2 ring-white ring-offset-2 ring-offset-zinc-950' : ''}`}>
            <div className="absolute -right-3 -top-3 w-20 h-20 bg-white/10 rounded-full pointer-events-none"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-emerald-100">Aprovados</p>
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4 text-white" />
                </div>
              </div>
              <p className="text-3xl font-extrabold tracking-tight">{stats.approved}</p>
            </div>
          </button>

          <button onClick={() => setStatusFilter('rejected')} className={`text-left relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 p-4 text-white shadow-lg transition hover:shadow-xl active:scale-95 ${statusFilter === 'rejected' ? 'ring-2 ring-white ring-offset-2 ring-offset-zinc-950' : ''}`}>
            <div className="absolute -right-3 -top-3 w-20 h-20 bg-white/10 rounded-full pointer-events-none"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-red-100">Rejeitados</p>
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                  <XCircle className="w-4 h-4 text-white" />
                </div>
              </div>
              <p className="text-3xl font-extrabold tracking-tight">{stats.rejected}</p>
            </div>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="bg-zinc-900 rounded-2xl shadow-lg border border-zinc-800 p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2 relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-zinc-500" />
              </div>
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nome do cliente..." 
                className="w-full pl-10 pr-4 py-2.5 border border-zinc-700 rounded-xl bg-zinc-950 text-white text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              />
            </div>
            <div>
              <select className="w-full px-4 py-2.5 border border-zinc-700 rounded-xl bg-zinc-950 text-white text-sm focus:ring-2 focus:ring-orange-500 outline-none">
                <option value="">Todos os métodos</option>
                <option value="pix">Pix</option>
                <option value="zelle">Zelle</option>
                <option value="wire">Wire Transfer</option>
              </select>
            </div>
            <div>
              <select className="w-full px-4 py-2.5 border border-zinc-700 rounded-xl bg-zinc-950 text-white text-sm focus:ring-2 focus:ring-orange-500 outline-none">
                <option value="">Qualquer data</option>
                <option value="today">Hoje</option>
                <option value="week">Esta semana</option>
                <option value="month">Este mês</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          </div>
        ) : payments.length === 0 ? (
          <div className="bg-zinc-900 rounded-2xl shadow-lg border border-zinc-800 p-12 text-center">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="text-lg font-bold text-white">Nenhum comprovante encontrado</h3>
            <p className="text-zinc-400 mt-1">Quando seus clientes enviarem comprovantes, eles aparecerão aqui.</p>
          </div>
        ) : (
          <div className="bg-zinc-900 rounded-2xl shadow-lg border border-zinc-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-zinc-950/50 border-b border-zinc-800 text-zinc-400">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Cliente</th>
                    <th className="px-6 py-4 font-semibold">Valor</th>
                    <th className="px-6 py-4 font-semibold">Método</th>
                    <th className="px-6 py-4 font-semibold">Data</th>
                    <th className="px-6 py-4 font-semibold text-center">Comprovante</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">{p.profiles?.full_name || "Desconhecido"}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-emerald-400">${Number(p.amount).toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-zinc-300 capitalize">{p.method}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-zinc-400">{new Date(p.created_at).toLocaleDateString('pt-BR')}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {p.proof_url ? (
                          <button 
                            onClick={() => openProof(p.proof_url, 'Comprovante')}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                        ) : (
                          <span className="text-zinc-600">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                          p.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          p.status === 'REJECTED' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                          'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {p.status === 'PENDING' && (
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => setRejectModal({ open: true, id: p.id, name: p.profiles?.full_name, amount: p.amount, reason: "" })}
                              className="px-3 py-1.5 text-xs font-semibold text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors border border-red-500/20"
                            >
                              Rejeitar
                            </button>
                            <button 
                              onClick={() => setApproveModal({ open: true, id: p.id, name: p.profiles?.full_name, amount: p.amount, notes: "" })}
                              className="px-3 py-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg transition-colors border border-emerald-500/20"
                            >
                              Aprovar
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox.open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4">
          <div className="absolute top-0 inset-x-0 flex items-center justify-between px-6 py-4">
            <span className="text-white/60 text-sm">{lightbox.name}</span>
            <button onClick={() => setLightbox({ ...lightbox, open: false })} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition">
              <X className="w-5 h-5" />
            </button>
          </div>
          {lightbox.type === 'image' ? (
            <img src={lightbox.url} alt="Comprovante" className="max-w-full max-h-full rounded-xl object-contain" />
          ) : (
            <iframe src={lightbox.url} className="w-full max-w-4xl h-full rounded-xl bg-white"></iframe>
          )}
        </div>
      )}

      {/* Approve Modal */}
      {approveModal.open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-800 w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-green-500 px-6 py-5 text-center">
              <div className="w-14 h-14 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-2">
                <Check className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white">Aprovar Pagamento</h3>
            </div>
            <div className="p-6">
              <div className="bg-emerald-500/10 rounded-xl p-4 text-center mb-5 border border-emerald-500/20">
                <p className="text-sm text-emerald-400 font-medium">{approveModal.name}</p>
                <p className="text-3xl font-bold text-emerald-500 mt-1">${Number(approveModal.amount).toFixed(2)}</p>
                <p className="text-xs text-emerald-400/70 mt-1">Crédito será adicionado imediatamente à wallet.</p>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-zinc-400 mb-2">Observação (opcional)</label>
                <input 
                  type="text" 
                  value={approveModal.notes}
                  onChange={(e) => setApproveModal({...approveModal, notes: e.target.value})}
                  placeholder="Ex: Comprovante verificado" 
                  className="w-full px-4 py-3 border border-zinc-700 rounded-xl bg-zinc-950 text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                />
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setApproveModal({ ...approveModal, open: false })} 
                  disabled={processing}
                  className="flex-1 px-4 py-2.5 bg-zinc-800 text-zinc-300 rounded-xl font-medium hover:bg-zinc-700 transition"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleApprove} 
                  disabled={processing}
                  className="flex-1 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition flex items-center justify-center gap-2"
                >
                  {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirmar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal.open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-800 w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-rose-600 px-6 py-5 text-center">
              <div className="w-14 h-14 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-2">
                <X className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white">Rejeitar Pagamento</h3>
            </div>
            <div className="p-6">
              <div className="bg-red-500/10 rounded-xl p-4 text-center mb-5 border border-red-500/20">
                <p className="text-sm text-red-400 font-medium">{rejectModal.name}</p>
                <p className="text-3xl font-bold text-red-500 mt-1">${Number(rejectModal.amount).toFixed(2)}</p>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-zinc-400 mb-2">Motivo da rejeição <span className="text-red-500">*</span></label>
                <textarea 
                  value={rejectModal.reason}
                  onChange={(e) => setRejectModal({...rejectModal, reason: e.target.value})}
                  rows={3} 
                  placeholder="Ex: Comprovante ilegível..." 
                  className="w-full px-4 py-3 border border-zinc-700 rounded-xl bg-zinc-950 text-white text-sm focus:ring-2 focus:ring-red-500 outline-none transition-all"
                />
                <p className="text-xs text-zinc-500 mt-2">O cliente será notificado com o motivo.</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setRejectModal({ ...rejectModal, open: false })} 
                  disabled={processing}
                  className="flex-1 px-4 py-2.5 bg-zinc-800 text-zinc-300 rounded-xl font-medium hover:bg-zinc-700 transition"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleReject} 
                  disabled={processing || !rejectModal.reason.trim()}
                  className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Rejeitar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
