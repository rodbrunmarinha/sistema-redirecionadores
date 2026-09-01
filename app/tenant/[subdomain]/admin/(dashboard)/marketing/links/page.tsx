"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ChevronRight, 
  Link as LinkIcon, 
  Plus, 
  X,
  ThumbsUp,
  Search,
  Mail,
  MessageCircle,
  Music,
  Settings2,
  HelpCircle
} from "lucide-react";

export default function UTMLinksPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [links] = useState<any[]>([]); // Empty state by default

  // Form State
  const [name, setName] = useState("");
  const [destinationUrl, setDestinationUrl] = useState("");
  const [utmSource, setUtmSource] = useState("");
  const [utmMedium, setUtmMedium] = useState("");
  const [utmCampaign, setUtmCampaign] = useState("");
  const [utmTerm, setUtmTerm] = useState("");
  const [utmContent, setUtmContent] = useState("");
  const [preview, setPreview] = useState("Informe a URL de destino...");

  // Quick Templates
  const applyTemplate = (source: string, medium: string) => {
    setUtmSource(source);
    setUtmMedium(medium);
  };

  // Update Preview URL dynamically
  useEffect(() => {
    if (!destinationUrl) {
      setPreview("Informe a URL de destino...");
      return;
    }
    
    try {
      // Add https:// if it's missing just for preview parsing
      const urlStr = destinationUrl.startsWith('http') ? destinationUrl : `https://${destinationUrl}`;
      const url = new URL(urlStr);
      
      if (utmSource) url.searchParams.set("utm_source", utmSource);
      if (utmMedium) url.searchParams.set("utm_medium", utmMedium);
      if (utmCampaign) url.searchParams.set("utm_campaign", utmCampaign);
      if (utmTerm) url.searchParams.set("utm_term", utmTerm);
      if (utmContent) url.searchParams.set("utm_content", utmContent);
      
      setPreview(url.toString());
    } catch (e) {
      setPreview("Aguardando uma URL válida...");
    }
  }, [destinationUrl, utmSource, utmMedium, utmCampaign, utmTerm, utmContent]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300">
      
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 shadow-lg shadow-orange-500/20">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-8 w-64 h-64 rounded-full bg-white/5 pointer-events-none"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-sm mb-3" aria-label="Breadcrumb">
            <Link href="/admin" className="text-white/70 hover:text-white transition-colors truncate max-w-[45vw] sm:max-w-[220px]">
              Dashboard
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-white/50 shrink-0" />
            <Link href="/admin/marketing" className="text-white/70 hover:text-white transition-colors truncate max-w-[45vw] sm:max-w-[220px]">
              Marketing
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-white/50 shrink-0" />
            <span className="text-white font-medium truncate max-w-[45vw] sm:max-w-[220px]">
              Links UTM
            </span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shadow-lg shrink-0 border border-white/20">
                <LinkIcon className="w-8 h-8 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-white truncate">Gerador de Links UTM</h1>
                <p className="mt-0.5 text-sm text-orange-100">Crie links rastreáveis para suas campanhas de marketing</p>
              </div>
            </div>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-orange-600 hover:bg-orange-50 rounded-xl text-sm font-bold transition-all shadow-lg active:scale-95 shrink-0"
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              Criar Link UTM
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {/* Existing Links List / Empty State */}
        <div className="bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-orange-500/10 rounded-2xl flex items-center justify-center border border-orange-500/20">
            <LinkIcon className="w-10 h-10 text-orange-500" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Nenhum link UTM criado</h3>
          <p className="text-sm text-zinc-400 max-w-md mx-auto mb-6">
            Links UTM permitem rastrear de onde vêm seus visitantes. Crie um link para cada campanha de marketing e acompanhe quantos cliques e cadastros cada uma gera.
          </p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-500 transition shadow-md"
          >
            <Plus className="w-4 h-4" />
            Criar Primeiro Link
          </button>
        </div>
        
        {/* UTM Guide */}
        <div className="bg-orange-500/5 rounded-2xl border border-orange-500/20 p-6">
          <h4 className="font-semibold text-orange-400 mb-4 flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            O que significam os parâmetros UTM?
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            
            <div className="bg-zinc-950/50 rounded-xl p-4 border border-zinc-800/50">
              <strong className="block text-zinc-200 mb-1 font-mono text-sm">utm_source</strong>
              <span className="text-xs text-zinc-400 leading-relaxed block">De onde vem o tráfego<br/>(ex: facebook, google, instagram)</span>
            </div>
            
            <div className="bg-zinc-950/50 rounded-xl p-4 border border-zinc-800/50">
              <strong className="block text-zinc-200 mb-1 font-mono text-sm">utm_medium</strong>
              <span className="text-xs text-zinc-400 leading-relaxed block">Tipo de mídia<br/>(ex: cpc, email, social, banner)</span>
            </div>
            
            <div className="bg-zinc-950/50 rounded-xl p-4 border border-zinc-800/50">
              <strong className="block text-zinc-200 mb-1 font-mono text-sm">utm_campaign</strong>
              <span className="text-xs text-zinc-400 leading-relaxed block">Nome da campanha<br/>(ex: black-friday-2025, verao)</span>
            </div>
            
            <div className="bg-zinc-950/50 rounded-xl p-4 border border-zinc-800/50">
              <strong className="block text-zinc-200 mb-1 font-mono text-sm">utm_term</strong>
              <span className="text-xs text-zinc-400 leading-relaxed block">Palavra-chave<br/>(opcional, para Google Ads)</span>
            </div>
            
            <div className="bg-zinc-950/50 rounded-xl p-4 border border-zinc-800/50">
              <strong className="block text-zinc-200 mb-1 font-mono text-sm">utm_content</strong>
              <span className="text-xs text-zinc-400 leading-relaxed block">Variação do anúncio<br/>(opcional, para testes A/B)</span>
            </div>

          </div>
        </div>
      </div>

      {/* Modal Criar Link UTM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center px-4">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => setIsModalOpen(false)}
          ></div>
          
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Criar Link UTM</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Templates Rápidos */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-zinc-200 mb-3">Templates Rápidos</label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                <button 
                  type="button" 
                  onClick={() => applyTemplate('facebook', 'cpc')}
                  className="flex flex-col items-center justify-center p-3 rounded-xl border border-zinc-800 hover:border-orange-500 hover:bg-orange-500/5 transition-all text-center group"
                >
                  <ThumbsUp className="w-5 h-5 text-zinc-400 group-hover:text-orange-500 mb-2" />
                  <span className="text-[10px] sm:text-xs font-medium text-zinc-400 group-hover:text-orange-400 truncate w-full">Meta Ads</span>
                </button>
                
                <button 
                  type="button" 
                  onClick={() => applyTemplate('google', 'cpc')}
                  className="flex flex-col items-center justify-center p-3 rounded-xl border border-zinc-800 hover:border-orange-500 hover:bg-orange-500/5 transition-all text-center group"
                >
                  <Search className="w-5 h-5 text-zinc-400 group-hover:text-orange-500 mb-2" />
                  <span className="text-[10px] sm:text-xs font-medium text-zinc-400 group-hover:text-orange-400 truncate w-full">Google Ads</span>
                </button>

                <button 
                  type="button" 
                  onClick={() => applyTemplate('email', 'email')}
                  className="flex flex-col items-center justify-center p-3 rounded-xl border border-zinc-800 hover:border-orange-500 hover:bg-orange-500/5 transition-all text-center group"
                >
                  <Mail className="w-5 h-5 text-zinc-400 group-hover:text-orange-500 mb-2" />
                  <span className="text-[10px] sm:text-xs font-medium text-zinc-400 group-hover:text-orange-400 truncate w-full">E-mail</span>
                </button>

                <button 
                  type="button" 
                  onClick={() => applyTemplate('whatsapp', 'social')}
                  className="flex flex-col items-center justify-center p-3 rounded-xl border border-zinc-800 hover:border-orange-500 hover:bg-orange-500/5 transition-all text-center group"
                >
                  <MessageCircle className="w-5 h-5 text-zinc-400 group-hover:text-orange-500 mb-2" />
                  <span className="text-[10px] sm:text-xs font-medium text-zinc-400 group-hover:text-orange-400 truncate w-full">WhatsApp</span>
                </button>

                <button 
                  type="button" 
                  onClick={() => applyTemplate('tiktok', 'cpc')}
                  className="flex flex-col items-center justify-center p-3 rounded-xl border border-zinc-800 hover:border-orange-500 hover:bg-orange-500/5 transition-all text-center group"
                >
                  <Music className="w-5 h-5 text-zinc-400 group-hover:text-orange-500 mb-2" />
                  <span className="text-[10px] sm:text-xs font-medium text-zinc-400 group-hover:text-orange-400 truncate w-full">TikTok</span>
                </button>

                <button 
                  type="button" 
                  onClick={() => applyTemplate('', '')}
                  className="flex flex-col items-center justify-center p-3 rounded-xl border border-zinc-800 hover:border-orange-500 hover:bg-orange-500/5 transition-all text-center group"
                >
                  <Settings2 className="w-5 h-5 text-zinc-400 group-hover:text-orange-500 mb-2" />
                  <span className="text-[10px] sm:text-xs font-medium text-zinc-400 group-hover:text-orange-400 truncate w-full">Limpar</span>
                </button>
              </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">Nome do Link <span className="text-orange-500">*</span></label>
                  <input 
                    type="text" 
                    required 
                    maxLength={100} 
                    placeholder="Ex: Black Friday - Facebook Stories" 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:border-orange-500 focus:ring-orange-500/50 transition px-4 py-2.5 outline-none"
                  />
                </div>
                
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">URL de Destino <span className="text-orange-500">*</span></label>
                  <input 
                    type="url" 
                    required 
                    maxLength={500} 
                    placeholder="https://seusite.com/produto" 
                    value={destinationUrl}
                    onChange={e => setDestinationUrl(e.target.value)}
                    className="w-full rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:border-orange-500 focus:ring-orange-500/50 transition px-4 py-2.5 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-5">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">Source <span className="text-orange-500">*</span></label>
                  <input 
                    type="text" 
                    required 
                    maxLength={100} 
                    placeholder="facebook" 
                    value={utmSource}
                    onChange={e => setUtmSource(e.target.value)}
                    className="w-full rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:border-orange-500 focus:ring-orange-500/50 transition px-4 py-2.5 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">Medium <span className="text-orange-500">*</span></label>
                  <input 
                    type="text" 
                    required 
                    maxLength={100} 
                    placeholder="cpc" 
                    value={utmMedium}
                    onChange={e => setUtmMedium(e.target.value)}
                    className="w-full rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:border-orange-500 focus:ring-orange-500/50 transition px-4 py-2.5 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">Campaign <span className="text-orange-500">*</span></label>
                  <input 
                    type="text" 
                    required 
                    maxLength={100} 
                    placeholder="black-friday" 
                    value={utmCampaign}
                    onChange={e => setUtmCampaign(e.target.value)}
                    className="w-full rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:border-orange-500 focus:ring-orange-500/50 transition px-4 py-2.5 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">Term <span className="text-zinc-500 font-normal">(opcional)</span></label>
                  <input 
                    type="text" 
                    maxLength={100} 
                    placeholder="keyword" 
                    value={utmTerm}
                    onChange={e => setUtmTerm(e.target.value)}
                    className="w-full rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:border-orange-500 focus:ring-orange-500/50 transition px-4 py-2.5 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">Content <span className="text-zinc-500 font-normal">(opcional)</span></label>
                  <input 
                    type="text" 
                    maxLength={100} 
                    placeholder="banner-v2" 
                    value={utmContent}
                    onChange={e => setUtmContent(e.target.value)}
                    className="w-full rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:border-orange-500 focus:ring-orange-500/50 transition px-4 py-2.5 outline-none"
                  />
                </div>
              </div>

              {/* Preview da URL */}
              <div className="mb-8 bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                <label className="block text-xs font-bold tracking-wider text-zinc-500 mb-2">PREVIEW DA URL GERADA:</label>
                <div className="text-sm font-mono text-orange-400 break-all bg-orange-500/5 p-3 rounded-lg border border-orange-500/10 min-h-[44px] flex items-center">
                  {preview}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-zinc-800">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2.5 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-500 transition shadow-md"
                >
                  Criar Link Rastreado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
    </div>
  );
}
