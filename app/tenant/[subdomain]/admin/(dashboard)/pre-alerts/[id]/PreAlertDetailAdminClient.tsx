"use client";

import { useState, useTransition, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, CheckCircle2, ChevronRight, Package, Calendar, Link as LinkIcon, Search, Copy, Check, ExternalLink, ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import { deletePreAlertAction } from "@/app/actions/deletePreAlert";
import { searchBoxesAction, matchPreAlertToBoxAction, getSuggestedBoxesAction, unlinkPreAlertBoxAction } from "@/app/actions/searchBoxes";

export default function PreAlertDetailAdminClient({ preAlert: p, subdomain }: { preAlert: any, subdomain: string }) {
  const router = useRouter();
  const [showDelete, setShowDelete] = useState(false);
  const [isDeleting, startDelete] = useTransition();
  const [copied, setCopied] = useState(false);
  
  const [boxQuery, setBoxQuery] = useState("");
  const [boxResults, setBoxResults] = useState<any[]>([]);
  const [selectedBox, setSelectedBox] = useState<any | null>(() => {
    if (p.boxes) {
      return {
        id: p.boxes.id,
        label: `${p.boxes.store_name || 'S/ Loja'} · ${p.boxes.tracking_number || 'S/ Rastreio'} · Dock ${((p.boxes.profiles as any)?.suite_number) || (((p.boxes.profiles as any)?.[0]?.suite_number)) || '-'}`
      };
    }
    return null;
  });
  
  const [isLinked, setIsLinked] = useState<boolean>(!!p.box_id);
  const [isMatching, startMatching] = useTransition();
  const [suggestedBoxes, setSuggestedBoxes] = useState<any[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(true);

  
  useEffect(() => {
    async function loadSuggestions() {
      setIsLoadingSuggestions(true);
      const res = await getSuggestedBoxesAction(p.customer_id, p.tracking_number, subdomain);
      if (res.data) {
        setSuggestedBoxes(res.data);
      }
      setIsLoadingSuggestions(false);
    }
    loadSuggestions();
  }, [p.customer_id, p.tracking_number, subdomain]);

  const generateCode = (id: string, createdAt: string) => {
    const d = new Date(createdAt);
    const dateStr = `${String(d.getDate()).padStart(2, '0')}${String(d.getMonth()+1).padStart(2, '0')}${String(d.getFullYear()).slice(2)}`;
    const shortId = id.split('-')[0].slice(0, 4).toUpperCase();
    return `PA-${dateStr}-${shortId}`;
  };

  const code = generateCode(p.id, p.created_at);

  const formatDisplayDate = (dString: string | null) => {
    if (!dString) return "-";
    const d = new Date(dString);
    if (dString.length === 10) d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
    return d.toLocaleDateString('pt-BR');
  };

  const handleCopy = () => {
    if (p.receiving_code) {
      navigator.clipboard.writeText(p.receiving_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDelete = () => {
    startDelete(async () => {
      const res = await deletePreAlertAction(p.id, subdomain);
      if (res.success) {
        toast.success("Pré-alerta excluído com sucesso!");
        router.push("/admin/pre-alerts");
      } else {
        toast.error("Erro ao excluir: " + res.error);
      }
    });
  };

  const handleMatch = async () => {
    if (!selectedBox) return;
    startMatching(async () => {
      const res = await matchPreAlertToBoxAction(p.id, selectedBox.id, subdomain);
      if (res.success) {
        setIsLinked(true);
        toast.success("Caixa vinculada com sucesso!");
        router.refresh();
      } else {
        toast.error("Erro ao vincular: " + res.error);
      }
    });
  };

  const handleUnlink = async () => {
    startMatching(async () => {
      const res = await unlinkPreAlertBoxAction(p.id, subdomain);
      if (res.success) {
        setIsLinked(false);
        setSelectedBox(null);
        toast.success("Vínculo removido com sucesso!");
        router.refresh();
      } else {
        toast.error("Erro ao remover vínculo: " + res.error);
      }
    });
  };

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (boxQuery.trim().length >= 2) {
        const res = await searchBoxesAction(boxQuery, subdomain);
        setBoxResults(res.data);
      } else {
        setBoxResults([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [boxQuery, subdomain]);

  // Phone formatting helper
  const formatPhone = (phone: string | null | undefined) => {
    if (!phone) return "";
    let cleaned = phone.replace(/\D/g, "");
    if (!cleaned.startsWith("55") && cleaned.length === 11) {
      cleaned = "55" + cleaned;
    }
    return cleaned;
  };
  const waPhone = formatPhone(p.profiles?.phone);

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 shadow-lg shadow-orange-500/20">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-8 w-64 h-64 rounded-full bg-white/5 pointer-events-none"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-sm mb-3" aria-label="Breadcrumb">
            <Link href="/admin" className="text-white/70 hover:text-white transition-colors truncate max-w-[45vw] sm:max-w-[220px]">Dashboard</Link>
            <ChevronRight className="w-3.5 h-3.5 text-white/50 shrink-0" />
            <Link href="/admin/pre-alerts" className="text-white/70 hover:text-white transition-colors truncate max-w-[45vw] sm:max-w-[220px]">Pré-Alertas</Link>
            <ChevronRight className="w-3.5 h-3.5 text-white/50 shrink-0" />
            <span className="text-white font-medium truncate max-w-[45vw] sm:max-w-[220px]">{code}</span>
          </nav>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/admin/pre-alerts" className="p-2.5 bg-white/20 hover:bg-white/30 text-white rounded-xl transition shrink-0">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="min-w-0 flex-1">
                <h1 className="font-bold text-2xl sm:text-3xl text-white flex items-center flex-wrap gap-2">
                  <span className="font-mono truncate">{code}</span>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white`}>
                    <span className={`w-2 h-2 rounded-full ${p.status === 'pending' ? 'bg-amber-400 animate-pulse' : p.status === 'received' ? 'bg-emerald-400' : 'bg-zinc-400'}`}></span>
                    {p.status === 'pending' ? 'Aguardando' : p.status === 'received' ? 'Recebido' : 'Cancelado'}
                  </span>
                </h1>
              </div>
            </div>
            <button 
              type="button" 
              onClick={() => setShowDelete(true)} 
              className="shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/90 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Excluir pré-alerta</span>
            </button>
          </div>
        </div>
      </div>

      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Receiving Code Alert */}
          {p.receiving_code && (
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-5 shadow-lg shadow-orange-500/20 text-white mb-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-orange-100 text-xs font-bold uppercase tracking-widest mb-1 flex items-center gap-1.5">
                    <Package className="w-4 h-4 flex-shrink-0" />
                    Código de Recebimento
                  </p>
                  <div className="text-3xl font-extrabold font-mono tracking-widest break-all">{p.receiving_code}</div>
                  <p className="text-orange-100 text-xs mt-1">Exigir este código da transportadora no recebimento.</p>
                </div>
                <button 
                  type="button" 
                  onClick={handleCopy} 
                  className="flex-shrink-0 self-start sm:self-auto px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-bold transition flex items-center gap-2"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copiado!' : 'Copiar'}
                </button>
              </div>
            </div>
          )}
          
          <div className="grid md:grid-cols-3 gap-5">
            
            {/* Main Content (Order 2 on mobile, Order 1 on Desktop) */}
            <div className="md:col-span-2 space-y-5 order-2 md:order-1">
              
              {/* Client Info */}
              <div className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-sm overflow-hidden">
                <div className="px-4 sm:px-5 py-4 border-b border-zinc-800 bg-zinc-950">
                  <h3 className="font-bold text-white text-sm">Informações do Cliente</h3>
                </div>
                <div className="divide-y divide-zinc-800">
                  <div className="px-4 sm:px-5 py-3.5 flex justify-between gap-3">
                    <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex-shrink-0">Cliente</span>
                    <Link href={`/admin/clients/${p.customer_id}`} className="text-sm font-semibold text-indigo-400 hover:underline text-right min-w-0 truncate">
                      {p.profiles?.full_name || "-"}
                    </Link>
                  </div>
                  <div className="px-4 sm:px-5 py-3.5 flex justify-between gap-3">
                    <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex-shrink-0">Dock</span>
                    <span className="text-sm font-bold text-white">{p.profiles?.suite_number || "-"}</span>
                  </div>
                  <div className="px-4 sm:px-5 py-3.5 flex justify-between gap-3">
                    <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex-shrink-0">E-mail</span>
                    {p.profiles?.email ? (
                      <a href={`mailto:${p.profiles.email}`} className="text-sm text-indigo-400 hover:underline text-right min-w-0 break-all">
                        {p.profiles.email}
                      </a>
                    ) : (
                      <span className="text-sm text-zinc-400">-</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Package Info */}
              <div className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-sm overflow-hidden">
                <div className="px-4 sm:px-5 py-4 border-b border-zinc-800 bg-zinc-950">
                  <h3 className="font-bold text-white text-sm">Informações da Encomenda</h3>
                </div>
                <div className="divide-y divide-zinc-800">
                  <div className="px-4 sm:px-5 py-3.5 flex justify-between gap-3">
                    <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex-shrink-0">Loja</span>
                    <span className="text-sm text-white text-right min-w-0 break-words">{p.store_name || "-"}</span>
                  </div>
                  <div className="px-4 sm:px-5 py-3.5 flex justify-between gap-3">
                    <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex-shrink-0">Pedido</span>
                    <span className="text-sm text-white text-right min-w-0 break-words">{p.order_number ? `#${p.order_number}` : "-"}</span>
                  </div>
                  <div className="px-4 sm:px-5 py-3.5 flex justify-between gap-3">
                    <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex-shrink-0">Rastreio</span>
                    <code className="text-sm font-mono text-white break-all text-right">{p.tracking_number || "-"}</code>
                  </div>
                  <div className="px-4 sm:px-5 py-3.5 flex justify-between gap-3">
                    <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex-shrink-0">Transportadora</span>
                    <span className="text-sm text-white text-right min-w-0 break-words">{p.carrier || "-"}</span>
                  </div>
                  <div className="px-4 sm:px-5 py-3.5 flex justify-between gap-3">
                    <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex-shrink-0">Descrição</span>
                    <span className="text-sm text-white text-right min-w-0 break-words">{p.description || "-"}</span>
                  </div>
                  <div className="px-4 sm:px-5 py-3.5 flex justify-between gap-3">
                    <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex-shrink-0">Volumes</span>
                    <span className="text-sm text-white text-right min-w-0 break-words">{p.packages_count || 1} vol.</span>
                  </div>
                  <div className="px-4 sm:px-5 py-3.5 flex justify-between gap-3">
                    <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex-shrink-0">Valor declarado</span>
                    <span className="text-sm text-white text-right min-w-0 break-words">$ {p.declared_value || "0.00"}</span>
                  </div>
                  <div className="px-4 sm:px-5 py-3.5 flex justify-between gap-3">
                    <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex-shrink-0">Prev. chegada</span>
                    <span className="text-sm text-white text-right min-w-0 break-words">{formatDisplayDate(p.estimated_arrival)}</span>
                  </div>
                  <div className="px-4 sm:px-5 py-3.5 flex justify-between gap-3">
                    <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex-shrink-0">Observações</span>
                    <span className="text-sm text-white text-right min-w-0 break-words">{p.observations || "-"}</span>
                  </div>
                  <div className="px-4 sm:px-5 py-3.5 flex justify-between gap-3">
                    <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex-shrink-0">Criado em</span>
                    <span className="text-sm text-white text-right min-w-0 break-words">{new Date(p.created_at).toLocaleString('pt-BR')}</span>
                  </div>
                </div>
              </div>
              
              {/* Comprovantes */}
              <div className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-sm overflow-hidden">
                <div className="px-4 sm:px-5 py-4 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <LinkIcon className="w-4 h-4 text-indigo-400" />
                    Comprovantes
                  </h3>
                  <span className="text-xs text-zinc-500">{(p.attachments || []).length} arquivo(s)</span>
                </div>
                {p.attachments && p.attachments.length > 0 ? (
                  <div className="p-4 sm:p-5 grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {p.attachments.map((att: string, i: number) => (
                      <a key={i} href={att} target="_blank" rel="noopener noreferrer" className="relative aspect-square rounded-xl border border-zinc-700 bg-zinc-800 overflow-hidden flex items-center justify-center hover:border-indigo-500 transition group">
                        <img src={att} alt="Comprovante" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                          <ExternalLink className="w-6 h-6 text-white" />
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 sm:px-5 py-5 text-sm text-zinc-500 italic">
                    Nenhum comprovante anexado pelo cliente.
                  </div>
                )}
              </div>

            </div>

            {/* Sidebar (Order 1 on mobile, Order 2 on Desktop) */}
            <div className="space-y-4 order-1 md:order-2">
              
              {/* Cadastrar Caixa (fluxo principal) */}
              <div className="bg-gradient-to-br from-emerald-950 to-teal-950 border border-emerald-800/50 rounded-2xl p-4 sm:p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 bg-emerald-900/40 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Package className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-emerald-300 text-sm">Cadastrar Caixa</h3>
                    <p className="text-xs text-emerald-400 mt-0.5">Cria uma nova caixa com os dados do pré-alerta e vincula automaticamente.</p>
                  </div>
                </div>
                <Link href={`/admin/boxes/create?pre_alert_id=${p.id}&tracking=${encodeURIComponent(p.tracking_number || "")}&store=${encodeURIComponent(p.store_name || "")}&customer_id=${p.customer_id}`} className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition">
                  <Package className="w-4 h-4" />
                  Cadastrar Caixa
                </Link>
              </div>

              {/* Manual match form */}
              <div className="bg-zinc-900 rounded-2xl border border-indigo-900/50 shadow-sm p-4 sm:p-5">
                <h3 className="font-bold text-white mb-1 flex items-center gap-2">
                  <LinkIcon className="w-5 h-5 text-indigo-500" />
                  Vincular à caixa
                </h3>
                <p className="text-xs text-zinc-400 mb-4">Selecione a caixa recebida que corresponde a este pré-alerta.</p>

                
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-zinc-500 mb-2 uppercase tracking-wider">Buscar ou selecionar caixa</label>
                  
                  {!selectedBox && !isLinked && (
                    <>
                      <input 
                        type="text" 
                        value={boxQuery}
                        onChange={(e) => {
                          setBoxQuery(e.target.value);
                          if (e.target.value.length < 2) setBoxResults([]);
                        }}
                        placeholder="Pesquisar por ID, rastreio, loja..." 
                        className="w-full rounded-xl border-zinc-700 bg-zinc-950 text-white text-sm focus:border-indigo-500 focus:ring-indigo-500 mb-3 transition" 
                      />

                      {boxQuery.trim().length >= 2 ? (
                        <>
                          {boxResults.length === 0 ? (
                            <div className="text-xs text-zinc-500 px-2 py-1">Nenhuma caixa encontrada na busca.</div>
                          ) : (
                            <div className="space-y-1.5 max-h-60 overflow-y-auto mb-2 table-scrollbar">
                              <p className="text-xs font-semibold text-zinc-500 px-1 mb-1">Resultados da busca:</p>
                              {boxResults.map((b) => (
                                <button 
                                  key={b.id}
                                  type="button" 
                                  onClick={() => {
                                    setSelectedBox(b);
                                    setBoxQuery("");
                                    setBoxResults([]);
                                  }}
                                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium bg-zinc-800 text-zinc-300 hover:bg-indigo-900/40 hover:text-indigo-300 transition"
                                >
                                  {b.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          {isLoadingSuggestions ? (
                            <div className="text-xs text-zinc-500 px-2 py-1 animate-pulse">Carregando sugestões...</div>
                          ) : suggestedBoxes.length > 0 ? (
                            <div className="space-y-1.5 max-h-60 overflow-y-auto mb-2 table-scrollbar">
                              <p className="text-xs font-semibold text-zinc-500 px-1 mb-1">Sugestões de caixas do cliente:</p>
                              {suggestedBoxes.map((b) => (
                                <button 
                                  key={b.id}
                                  type="button" 
                                  onClick={() => setSelectedBox(b)}
                                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition flex items-center justify-between group ${b.is_exact_match ? 'bg-emerald-900/20 border border-emerald-900/50 text-emerald-300 hover:bg-emerald-900/40' : 'bg-zinc-800 text-zinc-300 hover:bg-indigo-900/40 hover:text-indigo-300'}`}
                                >
                                  <span className="truncate pr-2">{b.label}</span>
                                  {b.is_exact_match && <span className="shrink-0 text-[10px] font-bold uppercase tracking-widest bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded">Rastreio Exato</span>}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div className="text-xs text-zinc-500 px-2 py-2 bg-zinc-950 rounded-lg border border-zinc-800/50 text-center">Nenhuma caixa registrada para este cliente.</div>
                          )}
                        </>
                      )}
                    </>
                  )}
                  
                  {selectedBox && (
                    <div className="mt-2 flex flex-col gap-3">
                      <div className="flex items-center justify-between px-3 py-3 bg-indigo-900/20 border border-indigo-800/50 rounded-xl">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-indigo-300 truncate mr-2">{selectedBox.label}</span>
                          {isLinked && <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mt-1">Vínculo Ativo</span>}
                        </div>
                        <button type="button" onClick={isLinked ? handleUnlink : () => setSelectedBox(null)} disabled={isMatching} className="text-indigo-400 hover:text-white shrink-0 p-1 bg-indigo-900/40 hover:bg-red-900/40 hover:text-red-400 rounded-md transition disabled:opacity-50">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {!isLinked && (
                        <button 
                          type="button" 
                          onClick={handleMatch}
                          disabled={isMatching || !selectedBox}
                          className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {isMatching ? <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span> : <CheckCircle2 className="w-4 h-4" />}
                          Confirmar Vínculo
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Tracking hint */}
              {p.tracking_number && (
                <div className="bg-blue-900/20 border border-blue-900/50 rounded-2xl p-4">
                  <p className="text-xs font-semibold text-blue-400 mb-1">Rastreio do pré-alerta:</p>
                  <code className="text-sm font-mono text-blue-300 break-all">{p.tracking_number}</code>
                  <p className="text-xs text-blue-500 mt-2">Busque acima pelo mesmo tracking para encontrar a caixa correspondente.</p>
                </div>
              )}

              {/* Receiving Code hint */}
              {p.receiving_code && (
                <div className="bg-orange-900/20 border border-orange-900/50 rounded-2xl p-4">
                  <p className="text-xs font-semibold text-orange-400 mb-1 flex items-center gap-1">
                    <Package className="w-3.5 h-3.5" />
                    Código de recebimento:
                  </p>
                  <code className="text-lg font-mono font-bold text-orange-300 break-all">{p.receiving_code}</code>
                  <p className="text-xs text-orange-500 mt-2">Exija este código da transportadora antes de aceitar a entrega.</p>
                </div>
              )}

              {/* Client quick contact */}
              <div className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-sm overflow-hidden">
                <div className="px-4 sm:px-5 py-4 border-b border-zinc-800 bg-zinc-950">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-indigo-900/40 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-indigo-400 font-bold">{p.profiles?.full_name?.charAt(0) || "U"}</span>
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-white text-sm truncate">{p.profiles?.full_name || "-"}</div>
                      <div className="text-xs font-semibold text-indigo-400">
                        Dock {p.profiles?.suite_number || "-"}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="px-4 sm:px-5 py-3 space-y-2 border-b border-zinc-800">
                  {p.profiles?.email && (
                    <a href={`mailto:${p.profiles.email}`} className="flex items-center gap-2 text-xs text-zinc-400 hover:text-indigo-400 transition">
                      <span className="break-all">{p.profiles.email}</span>
                    </a>
                  )}
                  {waPhone && (
                    <a href={`https://wa.me/${waPhone}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-emerald-400 hover:text-emerald-300 transition font-medium">
                      +{waPhone}
                    </a>
                  )}
                </div>
                
                <div className="px-4 sm:px-5 py-3 space-y-2">
                  <Link href={`/admin/clients/${p.customer_id}`} className="flex items-center justify-center gap-1.5 w-full py-2 px-3 border border-indigo-900/50 text-indigo-400 hover:bg-indigo-900/20 rounded-xl text-xs font-semibold transition">
                    <ExternalLink className="w-3.5 h-3.5" />
                    Ver perfil
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDelete(false)}></div>
          <div className="relative bg-zinc-900 rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden border border-zinc-800">
            <div className="bg-red-500/10 px-6 pt-8 pb-6 text-center border-b border-red-500/20">
              <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mb-4 ring-2 ring-red-500/30">
                <Trash2 className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Excluir pré-alerta</h3>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="flex items-center gap-3 bg-zinc-950 rounded-2xl px-4 py-3 border border-zinc-800">
                <span className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Ref.</span>
                <span className="font-mono font-bold text-white text-sm truncate">{code}</span>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Tem certeza que deseja excluir este pré-alerta? Esta ação não pode ser desfeita.
              </p>
            </div>
            <div className="px-6 pb-6 flex flex-col-reverse sm:flex-row gap-3">
              <button 
                type="button" 
                onClick={() => setShowDelete(false)} 
                className="flex-1 px-5 py-2.5 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 rounded-xl font-semibold text-sm transition"
              >
                Cancelar
              </button>
              <button 
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                {isDeleting ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
