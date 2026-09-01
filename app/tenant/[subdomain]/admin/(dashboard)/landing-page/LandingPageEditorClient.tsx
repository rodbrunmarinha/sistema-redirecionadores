"use client";

import { useState } from "react";
import { Save, Plus, Trash2, Box, Plane, Truck, ShoppingCart, Globe, Phone, MapPin, Search, Upload, Loader2, Image as ImageIcon } from "lucide-react";
import { saveLandingPageConfig } from "./_actions/saveLandingPage";
import PublicLandingPage from "../../../components/PublicLandingPage";
import { createClient } from "@/utils/supabase/client";
import * as LucideIcons from "lucide-react";

export default function LandingPageEditorClient({ initialData, subdomain }: { initialData: any, subdomain: string }) {
  const [config, setConfig] = useState({
    heroTitle: initialData?.heroTitle || "",
    heroSubtitle: initialData?.heroSubtitle || "",
    heroImage: initialData?.heroImage || "",
    heroBanner: initialData?.heroBanner || "",
    secondaryBanner: initialData?.secondaryBanner || "",
    themeColor: initialData?.themeColor || "amber",
    services: initialData?.services || [],
    howItWorks: initialData?.howItWorks || [],
    seoTitle: initialData?.seoTitle || "",
    seoDescription: initialData?.seoDescription || "",
    social: initialData?.social || { whatsapp: "", instagram: "", tiktok: "" },
  });

  const [activeTab, setActiveTab] = useState("hero");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [isUploadingSecondary, setIsUploadingSecondary] = useState(false);
  const supabase = createClient();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, key: "heroImage" | "heroBanner" | "secondaryBanner") => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // 1. Limite de tamanho dinâmico
    const maxSize = (key === "heroBanner" || key === "secondaryBanner") ? 5 * 1024 * 1024 : 2 * 1024 * 1024;
    if (file.size > maxSize) {
        alert(`Erro: O arquivo é muito grande. O tamanho máximo permitido é ${key === "heroBanner" || key === "secondaryBanner" ? "5MB" : "2MB"}.`);
        return;
    }

    // 2. Auditoria de tipo de arquivo (Apenas Imagens)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
        alert("Erro: Formato de arquivo inválido. Envie apenas imagens JPG, PNG, SVG ou WebP.");
        return;
    }

    const setUploading = key === "heroImage" ? setIsUploadingLogo : (key === "heroBanner" ? setIsUploadingBanner : setIsUploadingSecondary);
    setUploading(true);
    
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${subdomain}_${key}_${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage.from('branding').upload(fileName, file, { upsert: true });
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage.from('branding').getPublicUrl(fileName);
        updateConfig(key, publicUrl);
    } catch (error: any) {
        console.error("Erro no upload", error);
        alert("Erro ao enviar a imagem.");
    } finally {
        setUploading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const res = await saveLandingPageConfig(subdomain, config);
    setIsSaving(false);
    if (res.success) {
      alert("Configurações salvas com sucesso!");
    } else {
      alert(res.error);
    }
  };

  const updateConfig = (key: string, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const addService = () => {
    updateConfig("services", [...config.services, { title: "Novo Serviço", description: "Descrição...", icon: "Box" }]);
  };

  const removeService = (index: number) => {
    const newServices = [...config.services];
    newServices.splice(index, 1);
    updateConfig("services", newServices);
  };

  const addStep = () => {
    updateConfig("howItWorks", [...config.howItWorks, { title: "Novo Passo", description: "O que acontece aqui?" }]);
  };

  const removeStep = (index: number) => {
    const newSteps = [...config.howItWorks];
    newSteps.splice(index, 1);
    updateConfig("howItWorks", newSteps);
  };

  const iconOptions = ["Box", "Plane", "Truck", "ShoppingCart", "Globe", "Phone", "MapPin", "Search", "Star", "Heart"];

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* LEFT PANEL - FORMS */}
      <div className="w-1/2 overflow-y-auto border-r border-zinc-800 bg-zinc-950 flex flex-col">
        <div className="flex border-b border-zinc-800 p-2 gap-2 overflow-x-auto shrink-0 bg-zinc-900">
          {[
            { id: "hero", label: "Hero & Marca" },
            { id: "services", label: "Serviços" },
            { id: "steps", label: "Passo a Passo" },
            { id: "seo", label: "SEO & Contato" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id ? "bg-amber-500/10 text-amber-500" : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 p-6 space-y-6">
          {activeTab === "hero" && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm text-zinc-400 font-medium">Cor Principal</label>
                <div className="flex gap-3">
                  {["amber", "blue", "emerald", "rose", "violet"].map(color => (
                    <button
                      key={color}
                      onClick={() => updateConfig("themeColor", color)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${config.themeColor === color ? 'border-white scale-110' : 'border-transparent opacity-50'} bg-${color}-500`}
                    />
                  ))}
                </div>
                <p className="text-xs text-zinc-500">O botão e os brilhos da página vão seguir essa cor.</p>
              </div>

              <div className="space-y-4">
                <label className="text-sm text-zinc-400 font-medium">Logo da Empresa</label>
                <div className="flex items-center gap-4">
                  {config.heroImage ? (
                    <div className="relative group w-24 h-24 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center overflow-hidden">
                      <img src={config.heroImage} alt="Logo" className="max-w-full max-h-full object-contain p-2" />
                      <button onClick={() => updateConfig("heroImage", "")} className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-24 h-24 bg-zinc-900 border border-zinc-800 border-dashed rounded-xl flex flex-col items-center justify-center text-zinc-500">
                      {isUploadingLogo ? <Loader2 className="w-6 h-6 animate-spin" /> : <ImageIcon className="w-6 h-6" />}
                    </div>
                  )}
                  <div className="flex-1">
                    <label className="cursor-pointer bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm inline-flex items-center gap-2">
                      <Upload className="w-4 h-4" /> Enviar Logo
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, "heroImage")} disabled={isUploadingLogo} />
                    </label>
                    <p className="text-xs text-zinc-500 mt-2">Formatos aceitos: PNG, JPG ou SVG (Máx. 2MB)</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm text-zinc-400 font-medium">Banner Principal (Fundo)</label>
                <div className="flex items-center gap-4">
                  {config.heroBanner ? (
                    <div className="relative group w-32 h-20 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center overflow-hidden">
                      <img src={config.heroBanner} alt="Banner" className="w-full h-full object-cover opacity-80" />
                      <button onClick={() => updateConfig("heroBanner", "")} className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-32 h-20 bg-zinc-900 border border-zinc-800 border-dashed rounded-xl flex flex-col items-center justify-center text-zinc-500">
                      {isUploadingBanner ? <Loader2 className="w-6 h-6 animate-spin" /> : <ImageIcon className="w-6 h-6" />}
                    </div>
                  )}
                  <div className="flex-1">
                    <label className="cursor-pointer bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm inline-flex items-center gap-2">
                      <Upload className="w-4 h-4" /> Enviar Banner
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, "heroBanner")} disabled={isUploadingBanner} />
                    </label>
                    <p className="text-xs text-zinc-500 mt-2">Ideal: 1920x1080px (Máx. 5MB). Ficará no fundo com sua cor de tema.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm text-zinc-400 font-medium">Banner Secundário (Abaixo da introdução)</label>
                <div className="flex items-center gap-4">
                  {config.secondaryBanner ? (
                    <div className="relative group w-32 h-20 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center overflow-hidden">
                      <img src={config.secondaryBanner} alt="Secondary Banner" className="w-full h-full object-cover" />
                      <button onClick={() => updateConfig("secondaryBanner", "")} className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-32 h-20 bg-zinc-900 border border-zinc-800 border-dashed rounded-xl flex flex-col items-center justify-center text-zinc-500">
                      {isUploadingSecondary ? <Loader2 className="w-6 h-6 animate-spin" /> : <ImageIcon className="w-6 h-6" />}
                    </div>
                  )}
                  <div className="flex-1">
                    <label className="cursor-pointer bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm inline-flex items-center gap-2">
                      <Upload className="w-4 h-4" /> Enviar Imagem
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, "secondaryBanner")} disabled={isUploadingSecondary} />
                    </label>
                    <p className="text-xs text-zinc-500 mt-2">Imagem de destaque (Máx. 5MB).</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-zinc-400 font-medium">Título Principal (Fica grandão no topo)</label>
                <textarea 
                  value={config.heroTitle}
                  onChange={e => updateConfig("heroTitle", e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 min-h-[100px] resize-y"
                  placeholder="Ex: Seu endereço no mundo.&#10;Suas compras no Brasil."
                />
                <p className="text-xs text-zinc-500">Pressione ENTER para pular linha.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-zinc-400 font-medium">Subtítulo</label>
                <textarea 
                  value={config.heroSubtitle}
                  onChange={e => updateConfig("heroSubtitle", e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 h-24 resize-none"
                  placeholder="A plataforma definitiva..."
                />
              </div>
            </div>
          )}

          {activeTab === "services" && (
            <div className="space-y-6">
              {config.services.map((srv: any, i: number) => (
                <div key={i} className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl space-y-4 relative">
                  <button onClick={() => removeService(i)} className="absolute top-4 right-4 text-zinc-500 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="space-y-2">
                    <label className="text-xs text-zinc-400">Ícone</label>
                    <select 
                      value={srv.icon}
                      onChange={e => {
                        const newSrvs = [...config.services];
                        newSrvs[i].icon = e.target.value;
                        updateConfig("services", newSrvs);
                      }}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm"
                    >
                      {iconOptions.map(ico => <option key={ico} value={ico}>{ico}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-zinc-400">Título</label>
                    <input 
                      type="text" 
                      value={srv.title}
                      onChange={e => {
                        const newSrvs = [...config.services];
                        newSrvs[i].title = e.target.value;
                        updateConfig("services", newSrvs);
                      }}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-zinc-400">Descrição</label>
                    <textarea 
                      value={srv.description}
                      onChange={e => {
                        const newSrvs = [...config.services];
                        newSrvs[i].description = e.target.value;
                        updateConfig("services", newSrvs);
                      }}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm h-20"
                    />
                  </div>
                </div>
              ))}
              <button onClick={addService} className="w-full py-3 border border-dashed border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 rounded-xl flex items-center justify-center gap-2 text-sm transition-colors">
                <Plus className="w-4 h-4" /> Adicionar Serviço
              </button>
            </div>
          )}

          {activeTab === "steps" && (
            <div className="space-y-6">
              {config.howItWorks.map((step: any, i: number) => (
                <div key={i} className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl space-y-4 relative">
                  <button onClick={() => removeStep(i)} className="absolute top-4 right-4 text-zinc-500 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="font-bold text-amber-500 text-sm">Passo 0{i + 1}</div>
                  <div className="space-y-2">
                    <label className="text-xs text-zinc-400">Título</label>
                    <input 
                      type="text" 
                      value={step.title}
                      onChange={e => {
                        const newSteps = [...config.howItWorks];
                        newSteps[i].title = e.target.value;
                        updateConfig("howItWorks", newSteps);
                      }}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-zinc-400">Descrição</label>
                    <textarea 
                      value={step.description}
                      onChange={e => {
                        const newSteps = [...config.howItWorks];
                        newSteps[i].description = e.target.value;
                        updateConfig("howItWorks", newSteps);
                      }}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm h-20"
                    />
                  </div>
                </div>
              ))}
              <button onClick={addStep} className="w-full py-3 border border-dashed border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 rounded-xl flex items-center justify-center gap-2 text-sm transition-colors">
                <Plus className="w-4 h-4" /> Adicionar Passo
              </button>
            </div>
          )}

          {activeTab === "seo" && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm text-zinc-400 font-medium">Título SEO (Aba do navegador)</label>
                <input 
                  type="text" 
                  value={config.seoTitle}
                  onChange={e => updateConfig("seoTitle", e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  placeholder="Minha Empresa | Redirecionamento"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-zinc-400 font-medium">Descrição SEO</label>
                <textarea 
                  value={config.seoDescription}
                  onChange={e => updateConfig("seoDescription", e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 h-24 resize-none"
                />
              </div>
              
              <hr className="border-zinc-800" />
              <h3 className="font-bold text-white">Redes Sociais</h3>

              <div className="space-y-2">
                <label className="text-sm text-zinc-400 font-medium">WhatsApp Link</label>
                <input 
                  type="text" 
                  value={config.social.whatsapp}
                  onChange={e => updateConfig("social", { ...config.social, whatsapp: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-zinc-400 font-medium">Instagram Link</label>
                <input 
                  type="text" 
                  value={config.social.instagram}
                  onChange={e => updateConfig("social", { ...config.social, instagram: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-zinc-800 bg-zinc-950 shrink-0">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSaving ? "Salvando..." : <><Save className="w-5 h-5" /> Salvar Alterações</>}
          </button>
        </div>
      </div>

      {/* RIGHT PANEL - PREVIEW */}
      <div className="w-1/2 bg-black overflow-y-auto relative border-l border-zinc-800 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-zinc-800 [&::-webkit-scrollbar-track]:bg-black">
        <div className="sticky top-0 z-50 bg-zinc-900/80 backdrop-blur border-b border-zinc-800 p-3 flex justify-between items-center text-xs font-mono text-zinc-400">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <span>preview.cndck.com.br</span>
          <div className="w-16" />
        </div>
        
        {/* Renderize the public page here as a live preview */}
        <div className="pointer-events-none scale-[0.8] origin-top h-[125%] w-[125%] bg-zinc-50">
          <PublicLandingPage config={config} subdomain={subdomain} />
        </div>
      </div>
    </div>
  );
}
