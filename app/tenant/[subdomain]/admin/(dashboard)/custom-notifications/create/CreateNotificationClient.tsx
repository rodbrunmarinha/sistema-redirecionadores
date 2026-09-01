"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ChevronRight, 
  Send, 
  Clock, 
  CheckCircle2, 
  Search, 
  BellRing,
  SmilePlus,
  Smartphone,
  Monitor
} from "lucide-react";
import { sendCustomPushNotification } from "../_actions/send-push";

type ClientType = {
  id: string;
  full_name: string | null;
  email: string;
  hasPush?: boolean;
};

export function CreateNotificationClient({ clients, subdomain }: { clients: ClientType[], subdomain: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [recipientType, setRecipientType] = useState<"all" | "specific">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClients, setSelectedClients] = useState<Set<string>>(new Set());

  // Dados mockados de limite
  const dailyLimit = 50;
  const sentToday = 0;
  const activeClientsCount = clients.length;
  const clientsWithPush = 0; 

  const filteredClients = clients.filter(c => 
    (c.full_name || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [lastFocused, setLastFocused] = useState<"title" | "message">("message");

  const toggleClientSelection = (id: string) => {
    const newSet = new Set(selectedClients);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedClients(newSet);
  };

  const selectAllClients = () => {
    if (selectedClients.size === filteredClients.length) {
      setSelectedClients(new Set());
    } else {
      setSelectedClients(new Set(filteredClients.map(c => c.id)));
    }
  };

  const insertEmoji = (emoji: string) => {
    if (lastFocused === "title") {
      setTitle(prev => (prev + emoji).slice(0, 50));
    } else {
      setMessage(prev => (prev + emoji).slice(0, 240));
    }
  };

  const recipientCount = recipientType === "all" ? activeClientsCount : selectedClients.size;

  const handleSend = () => {
    if (!title.trim() || !message.trim() || recipientCount === 0) return;
    
    startTransition(async () => {
      try {
        const result = await sendCustomPushNotification(subdomain, {
          title,
          message,
          recipientType,
          selectedClients: Array.from(selectedClients)
        });
        
        alert(`Sucesso! ${result.sent} enviadas, ${result.failed} falhas.`);
        router.push(`/admin/custom-notifications/history`);
      } catch (err: any) {
        alert("Erro ao enviar: " + err.message);
      }
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-zinc-900 border-b border-zinc-800 -mx-4 sm:-mx-6 lg:-mx-8 -mt-4 sm:-mt-6 lg:-mt-8 px-4 sm:px-6 lg:px-8 py-6 mb-6">
        <nav className="flex items-center gap-2 text-sm mb-4" aria-label="Breadcrumb">
          <Link href={`/admin/dashboard`} className="text-zinc-400 hover:text-white transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="w-4 h-4 text-zinc-600 shrink-0" />
          <span className="text-zinc-100 font-medium">
            Notificações Push
          </span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-zinc-800 rounded-xl border border-zinc-700">
              <Send className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Enviar Notificação</h1>
              <p className="text-zinc-400 text-sm mt-1">Envie notificações diretas para os clientes</p>
            </div>
          </div>
          
          <Link 
            href={`/admin/custom-notifications/history`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Clock className="w-4 h-4" />
            Histórico
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Info Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-white flex items-center gap-2">
                <BellRing className="w-4 h-4 text-amber-500" />
                Limite Diário de Notificações
              </h3>
              <p className="text-sm text-zinc-400 mt-1">
                Enviadas hoje: <strong className="text-white">{sentToday}</strong> / {dailyLimit}
                <span className="mx-2">•</span>
                Restam <strong className="text-emerald-400">{dailyLimit - sentToday}</strong> notificações
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">{activeClientsCount}</p>
              <p className="text-xs text-zinc-500">clientes ativos</p>
              <p className="text-xs text-emerald-400 mt-1 flex items-center justify-end gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {clientsWithPush} com push ativo
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          
          {/* Form */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-sm flex flex-col">
            <div className="p-6 flex-1">
              <h3 className="text-lg font-bold text-white mb-6">📝 Compor Notificação</h3>
              
              <div className="space-y-6">
                
                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-zinc-200 mb-2">
                    Título <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    id="title" 
                    maxLength={50}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onFocus={() => setLastFocused("title")}
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-950 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 outline-none transition" 
                    placeholder="Ex: 🎉 Promoção Especial!" 
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-zinc-500">Máximo 50 caracteres</span>
                    <span className="text-xs font-semibold text-zinc-400">{title.length}/50</span>
                  </div>
                </div>

                {/* Recipients */}
                <div>
                  <label className="block text-sm font-medium text-zinc-200 mb-2">
                    Destinatários <span className="text-red-500">*</span>
                  </label>
                  
                  <div className="space-y-3">
                    <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition ${recipientType === 'all' ? 'border-amber-500 bg-amber-500/5' : 'border-zinc-800 hover:bg-zinc-800/50'}`}>
                      <input 
                        type="radio" 
                        name="recipient_type" 
                        value="all" 
                        checked={recipientType === "all"}
                        onChange={() => setRecipientType("all")}
                        className="w-4 h-4 text-amber-500 bg-zinc-950 border-zinc-700 focus:ring-amber-500/50 focus:ring-offset-zinc-900" 
                      />
                      <div className="ml-3">
                        <span className="font-medium text-white block">Todos os clientes ativos</span>
                        <span className="text-xs text-zinc-500">{activeClientsCount} clientes • {clientsWithPush} com notificações ativas</span>
                      </div>
                    </label>

                    <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition ${recipientType === 'specific' ? 'border-amber-500 bg-amber-500/5' : 'border-zinc-800 hover:bg-zinc-800/50'}`}>
                      <input 
                        type="radio" 
                        name="recipient_type" 
                        value="specific" 
                        checked={recipientType === "specific"}
                        onChange={() => setRecipientType("specific")}
                        className="w-4 h-4 text-amber-500 bg-zinc-950 border-zinc-700 focus:ring-amber-500/50 focus:ring-offset-zinc-900" 
                      />
                      <div className="ml-3">
                        <span className="font-medium text-white block">Selecionar clientes específicos</span>
                        <span className="text-xs text-zinc-500">Escolha manualmente quem receberá</span>
                      </div>
                    </label>
                  </div>

                  {/* Client Selection Box */}
                  {recipientType === "specific" && (
                    <div className="mt-4 p-4 bg-zinc-950 border border-zinc-800 rounded-xl animate-in fade-in slide-in-from-top-2">
                      <div className="relative mb-4">
                        <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input 
                          type="text" 
                          placeholder="Buscar cliente..." 
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 border border-zinc-800 rounded-lg bg-zinc-900 text-white text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 outline-none transition" 
                        />
                      </div>

                      <div className="mb-3 flex items-center justify-between px-1">
                        <span className="text-xs font-semibold text-zinc-400">
                          <span className="text-white">{selectedClients.size}</span> selecionado(s)
                        </span>
                        <button 
                          type="button" 
                          onClick={selectAllClients}
                          className="text-xs text-amber-500 hover:text-amber-400 font-medium transition"
                        >
                          Selecionar todos
                        </button>
                      </div>

                      <div className="max-h-48 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                        {filteredClients.map(client => (
                          <label key={client.id} className="flex items-center p-3 hover:bg-zinc-900 rounded-lg cursor-pointer transition">
                            <input 
                              type="checkbox" 
                              checked={selectedClients.has(client.id)}
                              onChange={() => toggleClientSelection(client.id)}
                              className="w-4 h-4 rounded text-amber-500 bg-zinc-800 border-zinc-700 focus:ring-amber-500/50 focus:ring-offset-zinc-900" 
                            />
                            <div className="ml-3 flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-white truncate">
                                  {client.full_name || "Sem Nome"}
                                </span>
                                {!client.hasPush && (
                                  <span className="flex-shrink-0 text-zinc-600" title="Sem notificações push">
                                    <BellRing className="w-3.5 h-3.5" />
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-zinc-500 truncate block mt-0.5">{client.email}</span>
                            </div>
                          </label>
                        ))}
                        {filteredClients.length === 0 && (
                          <div className="text-center py-4 text-xs text-zinc-500">Nenhum cliente encontrado.</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-zinc-200 mb-2 flex items-center justify-between">
                    <span>Mensagem <span className="text-red-500">*</span></span>
                  </label>
                  <textarea 
                    id="message" 
                    maxLength={240} 
                    rows={4} 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onFocus={() => setLastFocused("message")}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-700 bg-zinc-950 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 outline-none transition resize-none" 
                    placeholder="Digite sua mensagem aqui..." 
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-zinc-500">Máximo 240 caracteres</span>
                    <span className="text-xs font-semibold text-zinc-400">{message.length}/240</span>
                  </div>
                </div>

                {/* Emojis */}
                <div>
                  <label className="block text-sm font-medium text-zinc-200 mb-2 flex items-center gap-2">
                    <SmilePlus className="w-4 h-4 text-zinc-400" />
                    Emojis Sugeridos
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['🎉','🛒','📦','✨','⭐','🔔','💰','🎁','🚀','👋','❤️','🔥'].map(emoji => (
                      <button 
                        key={emoji}
                        type="button" 
                        onClick={() => insertEmoji(emoji)}
                        className="w-10 h-10 flex items-center justify-center bg-zinc-950 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 rounded-lg text-lg transition active:scale-95"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            <div className="p-6 bg-zinc-950 border-t border-zinc-800">
              <button 
                type="button" 
                onClick={handleSend}
                disabled={!title.trim() || !message.trim() || recipientCount === 0 || isPending}
                className="w-full px-4 py-3.5 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-500 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {isPending ? "Enviando..." : `Enviar para ${recipientCount} Cliente${recipientCount !== 1 ? 's' : ''}`}
              </button>
            </div>
          </div>

          {/* Previews */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6">
              <h3 className="text-lg font-bold text-white mb-6">👁️ Preview da Notificação</h3>
              
              <div className="space-y-8">
                {/* Preview Desktop */}
                <div>
                  <p className="text-xs text-zinc-500 mb-3 uppercase font-bold tracking-wider flex items-center gap-2">
                    <Monitor className="w-4 h-4" /> Desktop / Navegador
                  </p>
                  <div className="bg-zinc-800 border border-zinc-700/50 rounded-xl p-4 shadow-xl max-w-sm">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-600 flex items-center justify-center text-white font-bold shrink-0">
                        BD
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white text-sm leading-tight truncate">
                          {title || "Digite um título..."}
                        </p>
                        <p className="text-zinc-300 text-xs mt-1 line-clamp-3 break-words">
                          {message || "Digite uma mensagem..."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preview Mobile */}
                <div>
                  <p className="text-xs text-zinc-500 mb-3 uppercase font-bold tracking-wider flex items-center gap-2">
                    <Smartphone className="w-4 h-4" /> Celular / Tela de Bloqueio
                  </p>
                  <div className="bg-zinc-950 rounded-2xl p-4 shadow-xl max-w-sm border border-zinc-800">
                    <div className="bg-zinc-900/80 backdrop-blur-md rounded-xl p-3 shadow-lg border border-zinc-800/50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded bg-amber-600 flex items-center justify-center text-white text-[10px] font-bold">
                            BD
                          </div>
                          <span className="text-[11px] font-semibold text-zinc-300 tracking-wide uppercase">App</span>
                        </div>
                        <span className="text-[10px] text-zinc-500">agora</span>
                      </div>
                      <p className="font-bold text-white text-[13px] leading-tight break-words">
                        {title || "Digite um título..."}
                      </p>
                      <p className="text-zinc-300 text-xs mt-1 leading-snug line-clamp-2 break-words">
                        {message || "Digite uma mensagem..."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Dicas */}
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-5 mt-4">
                  <h4 className="font-semibold text-amber-500 text-sm mb-3 flex items-center gap-2">
                    💡 Dicas de Engajamento
                  </h4>
                  <ul className="text-sm text-zinc-400 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-0.5">•</span>
                      Use emojis para chamar atenção e dar personalidade.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-0.5">•</span>
                      Seja direto e objetivo. Textos longos são cortados na tela do celular.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-0.5">•</span>
                      Crie senso de urgência ("Últimas horas!", "Só hoje!").
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-0.5">•</span>
                      Evite usar CAPS LOCK no texto inteiro, pode parecer spam.
                    </li>
                  </ul>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
