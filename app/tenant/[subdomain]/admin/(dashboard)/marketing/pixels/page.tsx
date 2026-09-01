"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ChevronRight, 
  Code2, 
  Plus, 
  X,
  ThumbsUp,
  Search,
  Tag,
  Music,
  Terminal,
  AlertTriangle,
  HelpCircle,
  Check
} from "lucide-react";

export default function PixelsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pixels] = useState<any[]>([]); // Empty state by default

  // Form State
  const [platform, setPlatform] = useState("facebook");
  const [name, setName] = useState("");
  const [pixelId, setPixelId] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [trackLanding, setTrackLanding] = useState(true);
  const [trackClientArea, setTrackClientArea] = useState(true);

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
              Pixels
            </span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shadow-lg shrink-0 border border-white/20">
                <Code2 className="w-8 h-8 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-white truncate">Pixels de Rastreamento</h1>
                <p className="mt-0.5 text-sm text-orange-100">Gerencie pixels do Meta (Facebook), Google Analytics, TikTok e mais</p>
              </div>
            </div>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-orange-600 hover:bg-orange-50 rounded-xl text-sm font-bold transition-all shadow-lg active:scale-95 shrink-0"
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              Adicionar Pixel
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {/* Existing Pixels List / Empty State */}
        <div className="bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-orange-500/10 rounded-2xl flex items-center justify-center border border-orange-500/20">
            <Code2 className="w-10 h-10 text-orange-500" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Nenhum pixel configurado</h3>
          <p className="text-sm text-zinc-400 max-w-md mx-auto mb-6">
            Adicione pixels de rastreamento para monitorar visitantes na sua landing page e portal do cliente. Suportamos Meta (Facebook), Google Analytics, Google Tag Manager, TikTok e código personalizado.
          </p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-500 transition shadow-md"
          >
            <Plus className="w-4 h-4" />
            Adicionar Primeiro Pixel
          </button>
        </div>
        
        {/* Guide Section */}
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 shadow-sm">
          <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-orange-500" />
            Como funciona?
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-zinc-400">
            <div className="flex gap-4">
              <span className="shrink-0 w-8 h-8 bg-zinc-800 border border-zinc-700 text-orange-500 rounded-full flex items-center justify-center font-bold">1</span>
              <p className="leading-relaxed mt-1">Adicione o ID do pixel da plataforma de anúncios que você usa (Meta, Google, TikTok...)</p>
            </div>
            <div className="flex gap-4">
              <span className="shrink-0 w-8 h-8 bg-zinc-800 border border-zinc-700 text-orange-500 rounded-full flex items-center justify-center font-bold">2</span>
              <p className="leading-relaxed mt-1">Escolha onde o pixel será injetado: Landing Page, Portal do Cliente ou em ambos.</p>
            </div>
            <div className="flex gap-4">
              <span className="shrink-0 w-8 h-8 bg-zinc-800 border border-zinc-700 text-orange-500 rounded-full flex items-center justify-center font-bold">3</span>
              <p className="leading-relaxed mt-1">O sistema injeta as tags e rastreia visitantes automaticamente, permitindo criar públicos de remarketing.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Adicionar Pixel */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center px-4 py-6">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => setIsModalOpen(false)}
          ></div>
          
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Adicionar Pixel</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
              
              {/* Plataforma */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-zinc-200 mb-3">Plataforma</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  
                  <label className="relative cursor-pointer group">
                    <input 
                      type="radio" 
                      name="platform" 
                      value="facebook" 
                      checked={platform === 'facebook'}
                      onChange={() => setPlatform('facebook')}
                      className="peer sr-only" 
                    />
                    <div className="flex flex-col items-center justify-center p-3 rounded-xl border border-zinc-800 peer-checked:border-orange-500 peer-checked:bg-orange-500/10 hover:bg-zinc-800 transition-all text-center h-full">
                      <ThumbsUp className={`w-6 h-6 mb-2 ${platform === 'facebook' ? 'text-orange-500' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                      <span className={`text-[11px] font-medium ${platform === 'facebook' ? 'text-orange-400' : 'text-zinc-400'}`}>Meta Pixel</span>
                    </div>
                    {platform === 'facebook' && (
                      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]"></div>
                    )}
                  </label>

                  <label className="relative cursor-pointer group">
                    <input 
                      type="radio" 
                      name="platform" 
                      value="google_analytics" 
                      checked={platform === 'google_analytics'}
                      onChange={() => setPlatform('google_analytics')}
                      className="peer sr-only" 
                    />
                    <div className="flex flex-col items-center justify-center p-3 rounded-xl border border-zinc-800 peer-checked:border-orange-500 peer-checked:bg-orange-500/10 hover:bg-zinc-800 transition-all text-center h-full">
                      <Search className={`w-6 h-6 mb-2 ${platform === 'google_analytics' ? 'text-orange-500' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                      <span className={`text-[11px] font-medium ${platform === 'google_analytics' ? 'text-orange-400' : 'text-zinc-400'}`}>Google Analytics</span>
                    </div>
                    {platform === 'google_analytics' && (
                      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]"></div>
                    )}
                  </label>

                  <label className="relative cursor-pointer group">
                    <input 
                      type="radio" 
                      name="platform" 
                      value="google_tag_manager" 
                      checked={platform === 'google_tag_manager'}
                      onChange={() => setPlatform('google_tag_manager')}
                      className="peer sr-only" 
                    />
                    <div className="flex flex-col items-center justify-center p-3 rounded-xl border border-zinc-800 peer-checked:border-orange-500 peer-checked:bg-orange-500/10 hover:bg-zinc-800 transition-all text-center h-full">
                      <Tag className={`w-6 h-6 mb-2 ${platform === 'google_tag_manager' ? 'text-orange-500' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                      <span className={`text-[11px] font-medium ${platform === 'google_tag_manager' ? 'text-orange-400' : 'text-zinc-400'}`}>Google Tag Manager</span>
                    </div>
                    {platform === 'google_tag_manager' && (
                      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]"></div>
                    )}
                  </label>

                  <label className="relative cursor-pointer group">
                    <input 
                      type="radio" 
                      name="platform" 
                      value="tiktok" 
                      checked={platform === 'tiktok'}
                      onChange={() => setPlatform('tiktok')}
                      className="peer sr-only" 
                    />
                    <div className="flex flex-col items-center justify-center p-3 rounded-xl border border-zinc-800 peer-checked:border-orange-500 peer-checked:bg-orange-500/10 hover:bg-zinc-800 transition-all text-center h-full">
                      <Music className={`w-6 h-6 mb-2 ${platform === 'tiktok' ? 'text-orange-500' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                      <span className={`text-[11px] font-medium ${platform === 'tiktok' ? 'text-orange-400' : 'text-zinc-400'}`}>TikTok Pixel</span>
                    </div>
                    {platform === 'tiktok' && (
                      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]"></div>
                    )}
                  </label>

                  <label className="relative cursor-pointer group">
                    <input 
                      type="radio" 
                      name="platform" 
                      value="custom" 
                      checked={platform === 'custom'}
                      onChange={() => setPlatform('custom')}
                      className="peer sr-only" 
                    />
                    <div className="flex flex-col items-center justify-center p-3 rounded-xl border border-zinc-800 peer-checked:border-orange-500 peer-checked:bg-orange-500/10 hover:bg-zinc-800 transition-all text-center h-full">
                      <Terminal className={`w-6 h-6 mb-2 ${platform === 'custom' ? 'text-orange-500' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                      <span className={`text-[11px] font-medium ${platform === 'custom' ? 'text-orange-400' : 'text-zinc-400'}`}>Cód. Personalizado</span>
                    </div>
                    {platform === 'custom' && (
                      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]"></div>
                    )}
                  </label>

                </div>
              </div>

              {/* Nome */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Nome de Referência <span className="text-orange-500">*</span></label>
                <input 
                  type="text" 
                  required 
                  maxLength={100} 
                  placeholder="Ex: Facebook Pixel Principal" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:border-orange-500 focus:ring-orange-500/50 transition px-4 py-2.5 outline-none"
                />
              </div>

              {/* ID do Pixel */}
              {platform !== 'custom' && (
                <div className="mb-5 animate-in fade-in slide-in-from-top-2">
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">ID do Pixel / Measurement ID <span className="text-orange-500">*</span></label>
                  <input 
                    type="text" 
                    required 
                    maxLength={100} 
                    placeholder={
                      platform === 'facebook' ? '123456789012345' : 
                      platform === 'google_analytics' ? 'G-XXXXXXXXXX' : 
                      platform === 'google_tag_manager' ? 'GTM-XXXXXXX' : 
                      platform === 'tiktok' ? 'XXXXXXXXXX' : 'ID'
                    }
                    value={pixelId}
                    onChange={e => setPixelId(e.target.value)}
                    className="w-full rounded-xl bg-zinc-950 border border-zinc-800 text-orange-400 font-mono focus:border-orange-500 focus:ring-orange-500/50 transition px-4 py-2.5 outline-none"
                  />
                  <p className="text-xs text-zinc-500 mt-2">
                    Apenas os números e letras do ID, sem as tags &lt;script&gt;.
                  </p>
                </div>
              )}

              {/* Custom Code */}
              {platform === 'custom' && (
                <div className="mb-5 animate-in fade-in slide-in-from-top-2">
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">Código HTML/JS <span className="text-orange-500">*</span></label>
                  
                  {/* Warning */}
                  <div className="mb-3 flex items-start gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-200">
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">
                      <strong>Atenção:</strong> Por segurança, são bloqueados: <code className="text-amber-400 bg-amber-500/10 px-1 rounded">document.cookie</code>, <code className="text-amber-400 bg-amber-500/10 px-1 rounded">eval()</code>, <code className="text-amber-400 bg-amber-500/10 px-1 rounded">window.location</code>, <code className="text-amber-400 bg-amber-500/10 px-1 rounded">innerHTML</code> e <code className="text-amber-400 bg-amber-500/10 px-1 rounded">document.write()</code>. Use apenas scripts de plataformas de anúncios confiáveis.
                    </span>
                  </div>

                  <textarea 
                    rows={6} 
                    required 
                    maxLength={10000} 
                    placeholder="<script>
  // Seu código de rastreamento aqui
  // Ex: pixel do Pinterest, Hotjar, etc.
</script>" 
                    value={customCode}
                    onChange={e => setCustomCode(e.target.value)}
                    className="w-full rounded-xl bg-zinc-950 border border-zinc-800 text-orange-400 font-mono text-xs focus:border-orange-500 focus:ring-orange-500/50 transition px-4 py-3 outline-none resize-none custom-scrollbar"
                  ></textarea>
                  <p className="mt-2 text-xs text-zinc-500 flex justify-between">
                    <span>O código é salvo e auditado.</span>
                    <span>{customCode.length}/10000</span>
                  </p>
                </div>
              )}

              {/* Onde rastrear */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-zinc-300 mb-3">Onde ativar o pixel?</label>
                <div className="space-y-3">
                  <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition ${trackLanding ? 'bg-orange-500/5 border-orange-500/30' : 'bg-zinc-950 border-zinc-800 hover:bg-zinc-900'}`}>
                    <div className="relative flex items-center justify-center">
                      <input 
                        type="checkbox" 
                        checked={trackLanding}
                        onChange={(e) => setTrackLanding(e.target.checked)}
                        className="peer sr-only" 
                      />
                      <div className="w-5 h-5 rounded border border-zinc-600 bg-zinc-900 peer-checked:bg-orange-500 peer-checked:border-orange-500 transition-colors flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100" strokeWidth={3} />
                      </div>
                    </div>
                    <div>
                      <span className={`text-sm font-medium ${trackLanding ? 'text-orange-400' : 'text-zinc-300'}`}>Landing Page</span>
                      <p className="text-xs text-zinc-500 mt-0.5">Site institucional / vitrine / página de vendas</p>
                    </div>
                  </label>

                  <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition ${trackClientArea ? 'bg-orange-500/5 border-orange-500/30' : 'bg-zinc-950 border-zinc-800 hover:bg-zinc-900'}`}>
                    <div className="relative flex items-center justify-center">
                      <input 
                        type="checkbox" 
                        checked={trackClientArea}
                        onChange={(e) => setTrackClientArea(e.target.checked)}
                        className="peer sr-only" 
                      />
                      <div className="w-5 h-5 rounded border border-zinc-600 bg-zinc-900 peer-checked:bg-orange-500 peer-checked:border-orange-500 transition-colors flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100" strokeWidth={3} />
                      </div>
                    </div>
                    <div>
                      <span className={`text-sm font-medium ${trackClientArea ? 'text-orange-400' : 'text-zinc-300'}`}>Portal do Cliente</span>
                      <p className="text-xs text-zinc-500 mt-0.5">Área logada / dashboard (ideal para remarketing)</p>
                    </div>
                  </label>
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
                  className="px-6 py-2.5 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-500 transition shadow-md flex items-center gap-2"
                >
                  <Code2 className="w-4 h-4" />
                  Salvar Pixel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
    </div>
  );
}
