"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ChevronRight, Settings, RefreshCw, LogOut, MessageCircle, 
  Search, Link as LinkIcon, Loader2, Smartphone, QrCode
} from "lucide-react";
import { getWhatsAppStatus, generateWhatsAppQR, disconnectWhatsApp, getWhatsAppGroups } from "./_actions/whatsapp";

type ConnectionStatus = 'connected' | 'connecting' | 'qr_ready' | 'pairing' | 'authenticated' | 'failed' | 'disconnected';

export default function WhatsAppQRPage(props: { params: Promise<{ subdomain: string }> }) {
  const params = React.use(props.params);
  
  const [connection, setConnection] = useState<{
    status: ConnectionStatus;
    qr_code?: string;
    connected_name?: string;
    display_name?: string;
    connected_phone?: string;
    last_error?: string;
  }>({
    status: 'disconnected',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  // Load status on mount
  useEffect(() => {
    handleRefreshStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefreshStatus = async () => {
    setIsLoading(true);
    try {
      const data = await getWhatsAppStatus(params.subdomain);
      setConnection(prev => ({ ...prev, ...data, qr_code: undefined } as any));
    } catch (err: any) {
      setConnection({ status: 'failed', last_error: err.message });
    }
    setIsLoading(false);
  };

  const handleGenerateQR = async () => {
    setIsGenerating(true);
    try {
      const data = await generateWhatsAppQR(params.subdomain);
      setConnection(prev => ({ ...prev, ...data } as any));
    } catch (err: any) {
      alert("Erro ao gerar QR Code: " + err.message);
    }
    setIsGenerating(false);
  };

  const handleDisconnect = async () => {
    if (!confirm("Tem certeza que deseja desconectar o WhatsApp desta loja?")) return;
    setIsLoading(true);
    try {
      await disconnectWhatsApp(params.subdomain);
      setConnection({ status: 'disconnected' });
    } catch (err: any) {
      alert(err.message);
    }
    setIsLoading(false);
  };

  const [waGroups, setWaGroups] = useState<any[]>([]);
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [linkedOnly, setLinkedOnly] = useState(false);
  const [activeLinkGroup, setActiveLinkGroup] = useState<any>(null);

  const handleLoadGroups = async () => {
    setIsLoadingGroups(true);
    try {
      const data = await getWhatsAppGroups(params.subdomain);
      // Evolution API costuma retornar array puro ou objeto { error: false, data: [] }
      const groupsArray = Array.isArray(data) ? data : (data.groups || data.data || []);
      setWaGroups(groupsArray);
    } catch (err: any) {
      alert(err.message);
    }
    setIsLoadingGroups(false);
  };

  const filteredGroups = waGroups
    .filter(g => 
      (g.subject || g.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (g.id || '').toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      // Ordena pelos grupos mais recentes (creation ou subjectTime decrescente)
      const timeA = a.creation || a.subjectTime || 0;
      const timeB = b.creation || b.subjectTime || 0;
      return timeB - timeA;
    });

  const displayGroups = filteredGroups.slice(0, 15);

  // Simulated status text
  const humanizeStatus = (status: ConnectionStatus) => {
    switch(status) {
      case 'connected': return 'CONECTADO';
      case 'connecting':
      case 'authenticated': return 'CONECTANDO';
      case 'qr_ready': return 'QR PRONTO';
      case 'pairing': return 'PREPARANDO QR';
      case 'failed': return 'ERRO';
      default: return 'DESCONECTADO';
    }
  };

  const statusColors: Record<ConnectionStatus, string> = {
    connected: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    connecting: 'bg-sky-900/30 text-sky-400 border border-sky-500/20',
    qr_ready: 'bg-yellow-900/30 text-yellow-400 border border-yellow-500/20',
    pairing: 'bg-yellow-900/30 text-yellow-400 border border-yellow-500/20',
    authenticated: 'bg-sky-900/30 text-sky-400 border border-sky-500/20',
    failed: 'bg-red-900/30 text-red-400 border border-red-500/20',
    disconnected: 'bg-red-900/30 text-red-400 border border-red-500/20',
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300">
      {/* Header with Cndck Hub signature orange gradient */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 shadow-lg shadow-orange-500/20">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-8 w-64 h-64 rounded-full bg-white/5 pointer-events-none"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-sm mb-3" aria-label="Breadcrumb">
            <Link href="/admin" className="text-white/70 hover:text-white transition-colors truncate max-w-[45vw] sm:max-w-[220px]">
              Dashboard
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-white/50 shrink-0" />
            <Link href="/admin/purchase-groups" className="text-white/70 hover:text-white transition-colors truncate max-w-[45vw] sm:max-w-[220px]">
              Grupos de Compras
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-white/50 shrink-0" />
            <span className="text-white font-medium truncate max-w-[45vw] sm:max-w-[220px]">
              WhatsApp QR
            </span>
          </nav>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4 min-w-0">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 border border-white/20 shadow-md">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Central do WhatsApp</h1>
                <p className="text-orange-100 text-sm mt-0.5 max-w-2xl">
                  Conecte a conta da empresa via QR Code e use a conexão nos recursos do painel — vínculos, automações e envios diretos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        <div className="grid gap-6 xl:grid-cols-3">
          
          {/* Status Panel */}
          <section className="xl:col-span-1 bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 border-t-4 border-t-orange-500 overflow-hidden">
            <div className="px-6 py-5 border-b border-zinc-800 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-white">Status da conexão</p>
                <p className="text-sm text-zinc-400 mt-1">
                  Esta conexão alimenta os recursos de WhatsApp do painel.
                </p>
              </div>
              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase ${statusColors[connection.status]}`}>
                {isLoading ? 'VERIFICANDO...' : humanizeStatus(connection.status)}
              </span>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex flex-col gap-6">
                
                {/* QR Wrapper */}
                <div className="rounded-2xl border border-dashed border-orange-800/50 bg-orange-500/5 p-4 min-h-[260px] flex items-center justify-center">
                  <div className="w-full text-center space-y-4">
                    {isLoading || isGenerating ? (
                      <div className="mx-auto rounded-2xl border border-zinc-800 bg-zinc-900/70 flex flex-col items-center justify-center text-sm text-zinc-400 p-4 gap-4" style={{width: 'min(100%, 240px)', maxWidth: 240, minHeight: 240}}>
                         <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                         {isGenerating ? "Gerando QR Code..." : "Carregando status..."}
                      </div>
                    ) : connection.qr_code ? (
                      <div className="mx-auto bg-white p-2 rounded-xl" style={{width: 'max-content'}}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={connection.qr_code} alt="WhatsApp QR Code" className="w-56 h-56" />
                      </div>
                    ) : connection.status === 'connected' ? (
                       <div className="mx-auto rounded-2xl border border-emerald-800/50 bg-emerald-900/20 flex flex-col items-center justify-center text-sm text-emerald-400 p-4 gap-4" style={{width: 'min(100%, 240px)', maxWidth: 240, minHeight: 240}}>
                         <MessageCircle className="w-12 h-12 text-emerald-500" />
                         WhatsApp Conectado!
                       </div>
                    ) : (
                       <div className="mx-auto rounded-2xl border border-zinc-800 bg-zinc-900/70 flex items-center justify-center text-sm text-zinc-400 p-4 text-center" style={{width: 'min(100%, 240px)', maxWidth: 240, minHeight: 240}}>
                         Nenhum QR Code gerado.<br/>Clique no botão abaixo para gerar.
                       </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl bg-orange-500/5 p-4 border border-orange-500/20">
                      <p className="text-xs uppercase tracking-wide font-semibold text-orange-500">Loja</p>
                      <p className="mt-2 text-sm font-semibold text-white break-words">{params.subdomain}</p>
                    </div>
                    <div className="rounded-xl bg-zinc-800/50 p-4 border border-zinc-700/50">
                      <p className="text-xs uppercase tracking-wide font-semibold text-zinc-400">Telefone</p>
                      <p className="mt-2 text-sm font-semibold text-white">{connection.connected_phone || 'Aguardando conexão'}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap pt-2">
                    <button 
                      onClick={handleGenerateQR}
                      disabled={isGenerating || connection.status === 'connected'}
                      type="button" 
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-orange-600 text-white text-sm font-semibold hover:bg-orange-500 disabled:opacity-50 disabled:hover:bg-orange-600 transition shadow-md shadow-orange-500/20"
                    >
                      <QrCode className="w-4 h-4" />
                      Gerar QR Code
                    </button>

                    <button onClick={handleRefreshStatus} disabled={isLoading} type="button" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-zinc-700 text-sm font-semibold text-zinc-300 hover:bg-zinc-800 disabled:opacity-50 transition">
                      <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                      Atualizar
                    </button>

                    {(connection.status === 'connected' || connection.qr_code) && (
                      <button onClick={handleDisconnect} disabled={isLoading} type="button" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-red-900/50 text-red-400 text-sm font-semibold hover:bg-red-500/10 disabled:opacity-50 transition">
                        <LogOut className="w-4 h-4" />
                        Desconectar
                      </button>
                    )}
                  </div>
                  
                  {connection.last_error && (
                    <div className="text-sm text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                      Erro: {connection.last_error}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Groups Panel */}
          <section className="xl:col-span-2 bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 border-t-4 border-t-orange-500 overflow-hidden">
            <div className="px-6 py-5 border-b border-zinc-800 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-white">Grupos do WhatsApp e vínculos com grupos de compras</p>
                <p className="text-sm text-zinc-400 mt-1">Os grupos já usados aparecem primeiro. Você pode buscar, filtrar e gerenciar vínculos com grupos de compras sem sair desta tela.</p>
              </div>
              <button 
                type="button" 
                onClick={handleLoadGroups}
                className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 text-white text-sm font-semibold hover:bg-orange-500 transition shadow-md shadow-orange-500/20"
              >
                {isLoadingGroups ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                Carregar grupos
              </button>
            </div>

            <div className="p-6 space-y-4">
              
              {/* Quick Link Panel */}
              {activeLinkGroup && (
                <div className="rounded-2xl border border-orange-500/30 bg-orange-500/5 p-5">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-orange-400">Vínculo rápido com grupos de compras</p>
                      <p className="mt-1 text-sm text-orange-300">Escolha um grupo do WhatsApp e vincule vários grupos de compras sem sair desta tela.</p>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setActiveLinkGroup(null)}
                      className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-orange-500/40 text-sm font-semibold text-orange-400 hover:bg-orange-500/10 transition"
                    >
                      Cancelar
                    </button>
                  </div>

                  <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-amber-300">
                    Cadastre ao menos um grupo de compras para usar o vínculo rápido nesta tela.
                  </div>
                </div>
              )}

              {/* Filters */}
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <label className="block lg:flex-1">
                  <span className="text-sm font-medium text-zinc-300">Buscar grupo do WhatsApp</span>
                  <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por nome ou ID do grupo" 
                    className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 text-white focus:border-orange-500 focus:ring-orange-500/50 outline-none px-4 py-2.5 transition"
                  />
                </label>
              </div>

              <div className="text-sm text-zinc-400">
                Clique em Carregar grupos para buscar os grupos da conta conectada.
              </div>
              
              {/* Groups List */}
              <div className="space-y-3">
                {filteredGroups.length === 0 && !isLoadingGroups ? (
                  <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 text-center text-sm text-zinc-400">
                    Nenhum grupo encontrado.
                  </div>
                ) : (
                  <>
                    {displayGroups.map((group, i) => (
                      <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 transition gap-4">
                        <div>
                          <p className="text-sm font-semibold text-white">{group.subject || group.name || "Grupo sem nome"}</p>
                          <p className="text-xs text-zinc-500 mt-1">ID: {group.id}</p>
                        </div>
                        <button type="button" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-700 text-xs font-semibold text-zinc-300 hover:bg-zinc-700 transition">
                          Vincular
                        </button>
                      </div>
                    ))}
                    
                    {filteredGroups.length > 15 && (
                      <div className="text-center text-xs text-zinc-500 mt-4">
                        Mostrando 15 de {filteredGroups.length} grupos encontrados. Use a busca acima para encontrar os demais.
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
