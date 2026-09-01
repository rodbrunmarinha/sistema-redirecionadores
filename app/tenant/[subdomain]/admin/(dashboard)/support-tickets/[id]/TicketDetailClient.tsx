"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { replyToTicket, updateTicket } from "../actions";
import { Loader2, Paperclip, Send, SendHorizonal, StickyNote, Menu, X, ArrowLeft } from "lucide-react";
import Link from "next/link";
import dayjs from "dayjs";
import 'dayjs/locale/pt-br';

dayjs.locale('pt-br');

export default function TicketDetailClient({
  subdomain,
  ticket,
  messages,
  team
}: {
  subdomain: string;
  ticket: any;
  messages: any[];
  team: any[];
}) {
  const router = useRouter();
  const [mode, setMode] = useState<'reply' | 'note'>('reply');
  const [submittingReply, setSubmittingReply] = useState(false);
  const [submittingUpdate, setSubmittingUpdate] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleReply(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmittingReply(true);
    
    const formData = new FormData(e.currentTarget);
    formData.append('is_internal', mode === 'note' ? '1' : '0');

    try {
      await replyToTicket(subdomain, ticket.id, formData);
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingReply(false);
    }
  }

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmittingUpdate(true);
    const formData = new FormData(e.currentTarget);
    try {
      await updateTicket(subdomain, ticket.id, formData);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingUpdate(false);
    }
  }

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'open': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300';
      case 'in_progress': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300';
      case 'waiting_customer': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300';
      case 'waiting_admin': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300';
      case 'resolved': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300';
      case 'closed': return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-900/40 dark:text-zinc-300';
      default: return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-900/40 dark:text-zinc-300';
    }
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'low': return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-900/40 dark:text-zinc-300';
      case 'medium': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300';
      case 'high': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300';
      case 'urgent': return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300';
      default: return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-900/40 dark:text-zinc-300';
    }
  };

  const statusMap: any = {
    open: 'Aberto',
    in_progress: 'Em Andamento',
    waiting_customer: 'Aguardando Cliente',
    waiting_admin: 'Aguardando Atendimento',
    resolved: 'Resolvido',
    closed: 'Fechado'
  };

  const priorityMap: any = {
    low: 'Baixa',
    medium: 'Média',
    high: 'Alta',
    urgent: 'Urgente'
  };

  return (
    <>
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 shadow-lg shadow-orange-500/10">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 pointer-events-none blur-xl"></div>
        <div className="absolute -bottom-16 -left-8 w-64 h-64 rounded-full bg-white/5 pointer-events-none blur-2xl"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <nav className="flex items-center gap-2 text-sm mb-3" aria-label="Breadcrumb">
            <Link href="/admin" className="text-white/70 hover:text-white transition-colors truncate max-w-[45vw] sm:max-w-[220px]">Dashboard</Link>
            <span className="text-white/50 shrink-0">/</span>
            <Link href="/admin/support-tickets" className="text-white/70 hover:text-white transition-colors truncate max-w-[45vw] sm:max-w-[220px]">Tickets de Clientes</Link>
            <span className="text-white/50 shrink-0">/</span>
            <span className="text-white font-medium truncate max-w-[45vw] sm:max-w-[220px]">ID: {ticket.id.slice(0,8).toUpperCase()}</span>
          </nav>
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/admin/support-tickets" className="shrink-0 p-2.5 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white rounded-xl transition border border-white/20">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold text-white truncate">{ticket.subject}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="font-mono text-xs text-amber-100">ID: {ticket.id.slice(0,8).toUpperCase()}</span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${getStatusColor(ticket.status)}`}>
                  {statusMap[ticket.status] || ticket.status}
                </span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${getPriorityColor(ticket.priority)}`}>
                  {priorityMap[ticket.priority] || ticket.priority}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-4 sm:py-6">
        
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)}></div>
        )}

        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex gap-4 lg:gap-6 items-start">
            
            {/* Chat Column */}
            <div className="flex-1 min-w-0 flex flex-col rounded-2xl overflow-hidden shadow-lg border border-zinc-800 bg-zinc-900" style={{ height: 'calc(100vh - 190px)' }}>
              
              <div className="shrink-0 flex items-center justify-between gap-3 px-4 py-3 border-b border-zinc-800 bg-zinc-950/80">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                    {ticket.customer?.full_name?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{ticket.customer?.full_name}</p>
                    <p className="text-xs text-zinc-500 truncate">{ticket.customer?.email}</p>
                  </div>
                </div>
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden shrink-0 p-2 rounded-xl bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition">
                  <Menu className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4" id="chatMessages">
                {messages.map((msg, idx) => {
                  const isCustomer = msg.sender_id === ticket.customer_id;
                  const isInternal = msg.is_internal;
                  const sender = isCustomer ? ticket.customer : msg.sender;
                  const senderName = sender?.full_name || 'Desconhecido';
                  const initials = senderName.charAt(0).toUpperCase();
                  
                  return (
                    <div key={msg.id} className="flex gap-2.5">
                      <div className={`w-8 h-8 rounded-full shadow-sm shrink-0 mt-1 flex items-center justify-center text-xs font-bold text-white ${
                        isCustomer ? 'bg-orange-500' : 'bg-zinc-700'
                      } ${isInternal ? 'ring-2 ring-amber-500' : ''}`}>
                        {initials}
                      </div>
                      
                      <div className="max-w-[72%]">
                        <p className={`text-xs font-semibold mb-1 flex items-center gap-1 ${isInternal ? 'text-amber-500' : 'text-zinc-500'}`}>
                          {isInternal && <StickyNote className="w-3 h-3" />}
                          {senderName} {isInternal && '· Nota Interna'}
                        </p>
                        
                        <div className={`rounded-2xl rounded-tl-md px-4 py-3 shadow-sm ${
                          isInternal 
                            ? 'bg-amber-500/10 border border-amber-500/30' 
                            : 'bg-zinc-800'
                        }`}>
                          <p className={`text-sm whitespace-pre-wrap break-words ${isInternal ? 'text-amber-200' : 'text-zinc-200'}`}>
                            {msg.message}
                          </p>
                        </div>
                        <span className="text-xs text-zinc-600 mt-1 inline-block">
                          {dayjs(msg.created_at).format('HH:mm - DD/MM/YYYY')}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <div className={`shrink-0 border-t border-zinc-800 transition-colors ${mode === 'note' ? 'bg-amber-500/5' : 'bg-zinc-950'}`}>
                <div className="flex gap-1 px-4 pt-3">
                  <button onClick={() => setMode('reply')} className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    mode === 'reply' ? 'bg-orange-600 text-white shadow-sm' : 'text-zinc-500 hover:bg-zinc-800'
                  }`}>
                    Resposta
                  </button>
                  <button onClick={() => setMode('note')} className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    mode === 'note' ? 'bg-amber-600 text-white shadow-sm' : 'text-zinc-500 hover:bg-zinc-800'
                  }`}>
                    Nota Interna
                  </button>
                </div>
                <form onSubmit={handleReply} className="p-3 pt-2">
                  <div className="flex items-end gap-2">
                    <label className="shrink-0 p-2.5 rounded-xl cursor-pointer transition text-zinc-500 hover:text-orange-500 hover:bg-zinc-800">
                      <Paperclip className="w-5 h-5" />
                      <input type="file" name="attachments[]" multiple className="hidden" />
                    </label>
                    <div className="flex-1">
                      <textarea 
                        name="message" 
                        rows={1} 
                        required 
                        placeholder={mode === 'note' ? 'Escrever nota interna (invisível ao cliente)...' : 'Responder ao cliente...'}
                        className={`w-full rounded-2xl text-sm resize-none transition-colors outline-none px-4 py-3 ${
                          mode === 'note'
                            ? 'border border-amber-500/50 bg-amber-500/10 text-amber-100 placeholder-amber-500/50 focus:border-amber-500 focus:ring-1 focus:ring-amber-500'
                            : 'border border-zinc-700 bg-zinc-800 text-white placeholder-zinc-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                        }`}
                        style={{ minHeight: '44px', maxHeight: '140px' }}
                        onInput={(e) => {
                          const target = e.target as HTMLTextAreaElement;
                          target.style.height = '44px';
                          target.style.height = Math.min(target.scrollHeight, 140) + 'px';
                        }}
                      />
                    </div>
                    <button 
                      type="submit" 
                      disabled={submittingReply}
                      className={`shrink-0 p-3 text-white rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${
                        mode === 'note' ? 'bg-amber-600 hover:bg-amber-500' : 'bg-gradient-to-br from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500'
                      }`}
                    >
                      {submittingReply ? <Loader2 className="w-5 h-5 animate-spin" /> : <SendHorizonal className="w-5 h-5" />}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Right Sidebar (Desktop & Mobile) */}
            <div className={`
              w-80 shrink-0 space-y-4
              ${sidebarOpen ? 'fixed top-0 right-0 h-full z-50 overflow-y-auto bg-zinc-950 shadow-2xl p-4 block' : 'hidden lg:block'}
            `}>
              {sidebarOpen && (
                <div className="flex items-center justify-between mb-1 lg:hidden">
                  <span className="text-sm font-semibold text-white">Detalhes</span>
                  <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-lg hover:bg-zinc-800 transition">
                    <X className="w-4 h-4 text-zinc-500" />
                  </button>
                </div>
              )}

              <div className="bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 p-4">
                <div className="flex items-center gap-3 mb-3 pb-3 border-b border-zinc-800">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow">
                    {ticket.customer?.full_name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{ticket.customer?.full_name}</p>
                    <p className="text-xs text-zinc-500 truncate">{ticket.customer?.email}</p>
                    {ticket.customer?.suite_number && (
                      <span className="inline-flex items-center gap-1 mt-0.5 text-xs font-semibold text-orange-500">
                        Dock #{ticket.customer?.suite_number}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 p-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3">Detalhes do Ticket</h3>
                <form onSubmit={handleUpdate} className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-zinc-400 block mb-1">Status</label>
                    <select name="status" defaultValue={ticket.status} className="w-full rounded-xl border-zinc-700 bg-zinc-950 text-white text-sm focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none px-3 py-2">
                      <option value="open">Aberto</option>
                      <option value="in_progress">Em Andamento</option>
                      <option value="waiting_customer">Aguardando Cliente</option>
                      <option value="waiting_admin">Aguardando Atendimento</option>
                      <option value="resolved">Resolvido</option>
                      <option value="closed">Fechado</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-400 block mb-1">Prioridade</label>
                    <select name="priority" defaultValue={ticket.priority} className="w-full rounded-xl border-zinc-700 bg-zinc-950 text-white text-sm focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none px-3 py-2">
                      <option value="low">Baixa</option>
                      <option value="medium">Média</option>
                      <option value="high">Alta</option>
                      <option value="urgent">Urgente</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-400 block mb-1">Categoria</label>
                    <select name="category" defaultValue={ticket.category} className="w-full rounded-xl border-zinc-700 bg-zinc-950 text-white text-sm focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none px-3 py-2">
                      <option value="general">Geral</option>
                      <option value="financial">Financeiro</option>
                      <option value="technical">Técnico</option>
                      <option value="shipping">Envios</option>
                      <option value="store">Loja Online</option>
                      <option value="account">Minha Conta</option>
                      <option value="groups">Grupo de Compras</option>
                      <option value="other">Outro</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-400 block mb-1">Atribuir a</label>
                    <select name="assignee_id" defaultValue={ticket.assigned_to || ""} className="w-full rounded-xl border-zinc-700 bg-zinc-950 text-white text-sm focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none px-3 py-2">
                      <option value="">Não atribuído</option>
                      {team.map((member) => (
                        <option key={member.id} value={member.id}>{member.full_name}</option>
                      ))}
                    </select>
                  </div>
                  <button type="submit" disabled={submittingUpdate} className="w-full mt-2 px-3 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-sm font-semibold rounded-xl transition shadow-sm active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
                    {submittingUpdate ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Atualizar'}
                  </button>
                </form>
              </div>

              <div className="bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 p-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-4">Timeline</h3>
                <div className="relative pl-1">
                  <div className="absolute left-[6px] top-2 bottom-2 w-px bg-zinc-800"></div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-zinc-900 shrink-0 mt-0.5 z-10 relative"></div>
                      <div>
                        <p className="text-xs font-semibold text-zinc-300">Criado</p>
                        <p className="text-xs text-zinc-500 mt-0.5">{dayjs(ticket.created_at).format('DD/MM/YYYY HH:mm')}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className={`w-3.5 h-3.5 rounded-full ring-2 ring-zinc-900 shrink-0 mt-0.5 z-10 relative ${ticket.resolved_at ? 'bg-orange-500' : 'bg-zinc-700'}`}></div>
                      <div>
                        <p className="text-xs font-semibold text-zinc-300">{ticket.resolved_at ? 'Resolvido' : 'Última atualização'}</p>
                        <p className="text-xs text-zinc-500 mt-0.5">{dayjs(ticket.updated_at).format('DD/MM/YYYY HH:mm')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
