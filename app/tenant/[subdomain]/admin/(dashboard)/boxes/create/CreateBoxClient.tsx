"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  ChevronRight, ArrowLeft, Loader2, Package, Search, 
  Camera, X, Info, HelpCircle 
} from "lucide-react";
import toast from "react-hot-toast";
import { createBoxByAdmin } from "@/app/actions/createBoxByAdmin";
import { getPreAlertByTrackingAction } from "@/app/actions/getPreAlertByTracking";
import { usePermissions } from "@/app/providers/PermissionsProvider";

type ClientType = { id: string; label: string; dock: string };

export default function CreateBoxClient({ clients }: { clients: ClientType[] }) {
  const router = useRouter();
  const { hasPermission } = usePermissions();
  const [loading, setLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const searchParams = useSearchParams();
  const initialTracking = searchParams.get('tracking') || '';
  const initialStore = searchParams.get('store') || '';
  const initialCustomerId = searchParams.get('customer_id') || '';
  const initialPreAlertId = searchParams.get('pre_alert_id') || '';

  // Auto-busca Pre-Alert
  const [foundPreAlert, setFoundPreAlert] = useState<{id: string, store_name: string} | null>(null);
  const [isSearchingPreAlert, setIsSearchingPreAlert] = useState(false);
  const [storeNameValue, setStoreNameValue] = useState(initialStore);





  // Formulário Local State
  const [tracking, setTracking] = useState(initialTracking);
  const [selectedClient, setSelectedClient] = useState<ClientType | null>(() => clients.find(c => c.id === initialCustomerId) || null);
  const [clientSearch, setClientSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const photoInputRef = useRef<HTMLInputElement>(null);

  // Verifica Permissão
  useEffect(() => {
    if (!hasPermission('packages.create')) {
      toast.error("Você não tem permissão para registrar caixas.", { id: "no-perm-box" });
      router.replace("/admin/boxes");
    }
  }, [hasPermission, router]);

  // Prevenir flash
  if (!hasPermission('packages.create')) return null;

  const handleTrackingBlurOrEnter = async (val: string) => {
    if (!val || val.length < 3) return;
    setIsSearchingPreAlert(true);
    setFoundPreAlert(null);
    try {
      const res = await getPreAlertByTrackingAction(val.trim());
      if (res.success && res.preAlert) {
        setFoundPreAlert({ id: res.preAlert.id, store_name: res.preAlert.store_name || "" });
        
        // Auto-fill form
        if (res.preAlert.store_name) {
          setStoreNameValue(res.preAlert.store_name);
        }
        
        const client = clients.find(c => c.id === res.preAlert.customer_id);
        if (client) {
          setSelectedClient(client);
        }
        
        toast.success("Pré-alerta encontrado e dados preenchidos!");
      } else {
        toast.error("Nenhum pré-alerta pendente encontrado para este rastreio.");
      }
    } catch (e) {
      console.error(e);
      toast.error("Erro ao buscar pré-alerta.");
    } finally {
      setIsSearchingPreAlert(false);
    }
  };

  const filteredClients = clients.filter(c => 
    c.label.toLowerCase().includes(clientSearch.toLowerCase()) || 
    c.dock.includes(clientSearch)
  );

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        setPhotoPreview(loadEvent.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(null);
    }
  };

  const openPhotoPicker = (useCamera: boolean = false) => {
    if (photoInputRef.current) {
      if (useCamera) {
        photoInputRef.current.setAttribute('capture', 'environment');
      } else {
        photoInputRef.current.removeAttribute('capture');
      }
      photoInputRef.current.click();
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    // Verifica se selecionou o cliente
    if (!selectedClient) {
      toast.error("Por favor, selecione um cliente.");
      setLoading(false);
      return;
    }
    
    formData.set("client_id", selectedClient.id);
    
    const res = await createBoxByAdmin(formData);
    
    setLoading(false);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Caixa registrada com sucesso!");
      
      const saveAndNew = (e.nativeEvent as SubmitEvent).submitter?.getAttribute('value') === 'save_and_new';
      if (saveAndNew) {
        // Reset form
        (e.target as HTMLFormElement).reset();
        setTracking("");
        setSelectedClient(null);
        setClientSearch("");
        setPhotoPreview(null);
      } else {
        router.push("/admin/boxes");
      }
    }
  }

  return (
    <div className="min-h-screen bg-zinc-900 pb-12">
      {/* Header Dockdrop Premium */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 shadow-lg shadow-orange-500/20">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10"></div>
          <div className="absolute -bottom-16 -left-8 w-64 h-64 rounded-full bg-white/5"></div>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-sm mb-3">
            <Link href="/admin" className="text-white/70 hover:text-white transition-colors">Dashboard</Link>
            <ChevronRight className="w-3.5 h-3.5 text-white/50 shrink-0" />
            <Link href="/admin/boxes" className="text-white/70 hover:text-white transition-colors">Caixas Recebidas</Link>
            <ChevronRight className="w-3.5 h-3.5 text-white/50 shrink-0" />
            <span className="text-white font-medium">Registrar Nova Caixa</span>
          </nav>
          
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-2xl shadow-lg shrink-0">
              <Package className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Registrar Nova Caixa</h1>
              <p className="text-orange-100 text-sm mt-0.5">Encomenda recebida no warehouse</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">

        {/* Instruções de Uso */}
        <div>
          {!showHelp ? (
            <button type="button" onClick={() => setShowHelp(true)} className="text-xs font-semibold text-orange-400 hover:underline flex items-center gap-1">
              <HelpCircle className="w-4 h-4" /> Ver instruções de cadastro
            </button>
          ) : (
            <div className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700/50 relative">
              <button type="button" onClick={() => setShowHelp(false)} className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white transition">
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-3 bg-orange-600 rounded-xl">
                  <Info className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-2">Como Registrar uma Caixa</h3>
                  <ol className="space-y-2 text-sm text-zinc-300">
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-5 h-5 bg-orange-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                      <span>Selecione o <strong>cliente</strong> pelo nome ou número do dock</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-5 h-5 bg-orange-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                      <span>Preencha a <strong>loja</strong> de origem (opcional)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-5 h-5 bg-orange-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                      <span>Tire uma <strong>foto</strong> da caixa (opcional mas recomendado)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-5 h-5 bg-orange-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
                      <span>Use a <strong>pistola leitora</strong> no código de rastreio e pressione Enter para salvar</span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Formulário */}
        <div className="bg-zinc-900 border border-zinc-800 shadow-xl rounded-2xl overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {(initialPreAlertId || foundPreAlert?.id) && <input type="hidden" name="pre_alert_id" value={foundPreAlert?.id || initialPreAlertId} />}
            
            {/* Rastreio */}
            <div className="bg-zinc-800/30 rounded-xl p-6 border border-zinc-700/50">
              <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                <Search className="w-5 h-5 text-orange-500" />
                Código de Rastreio <span className="text-red-500">*</span>
              </h3>
              <p className="text-sm text-zinc-400 mb-4">Bipe com a pistola ou digite manualmente.</p>
              
              <input 
                type="text" 
                name="tracking_code" 
                value={tracking}
                onChange={(e) => setTracking(e.target.value)}
                onBlur={(e) => handleTrackingBlurOrEnter(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleTrackingBlurOrEnter(tracking);
                  }
                }}
                autoFocus 
                required
                placeholder="Escaneie com a pistola ou digite manualmente" 
                className="block w-full rounded-xl border border-zinc-700 bg-zinc-950 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 px-4 py-4 text-lg font-mono outline-none transition" 
              />
              {isSearchingPreAlert && <p className="text-xs text-orange-400 mt-2 animate-pulse">Buscando pré-alerta associado...</p>}
              {foundPreAlert && (
                <div className="mt-4 p-3 bg-emerald-900/20 border border-emerald-800/50 rounded-xl flex flex-col gap-1">
                  <span className="text-sm font-semibold text-emerald-400">Pré-alerta encontrado!</span>
                  <span className="text-xs text-zinc-400">Os dados da loja e do cliente foram preenchidos automaticamente.</span>
                </div>
              )}
            </div>

            {/* Cliente */}
            <div className="bg-zinc-800/30 rounded-xl p-6 border border-zinc-700/50">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                1. Cliente
              </h3>
              <label className="block text-sm font-semibold text-zinc-300 mb-2">
                Selecione o Cliente <span className="text-red-500">*</span>
              </label>
              
              <div className="relative">
                <input 
                  type="text" 
                  value={selectedClient ? selectedClient.label : clientSearch}
                  onChange={(e) => {
                    setClientSearch(e.target.value);
                    setSelectedClient(null);
                    setIsDropdownOpen(true);
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                  placeholder="-- Busque pelo nome ou dock --" 
                  className="block w-full rounded-xl border border-zinc-700 bg-zinc-950 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 pr-10 px-4 py-3 text-base outline-none transition" 
                />
                
                {selectedClient ? (
                  <button type="button" onClick={() => { setSelectedClient(null); setClientSearch(""); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-red-500 transition">
                    <X className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">
                    <Search className="w-4 h-4" />
                  </div>
                )}

                {isDropdownOpen && (
                  <div className="absolute z-50 mt-2 w-full bg-zinc-800 border border-zinc-700 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                    {filteredClients.map(c => (
                      <button 
                        key={c.id} 
                        type="button" 
                        onClick={() => {
                          setSelectedClient(c);
                          setIsDropdownOpen(false);
                          setClientSearch("");
                        }} 
                        className="w-full text-left px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-700 hover:text-white transition"
                      >
                        {c.label}
                      </button>
                    ))}
                    {filteredClients.length === 0 && (
                      <div className="px-4 py-3 text-sm text-zinc-500 text-center">
                        Nenhum cliente encontrado
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Detalhes da Caixa */}
            <div className="bg-zinc-800/30 rounded-xl p-6 border border-zinc-700/50">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                2. Detalhes da Caixa
              </h3>
              
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-zinc-300 mb-2">Loja de Origem</label>
                    <input type="text" name="store_name" value={storeNameValue} onChange={(e) => setStoreNameValue(e.target.value)} placeholder="Ex: Amazon, AliExpress" className="block w-full rounded-xl border border-zinc-700 bg-zinc-950 text-white focus:border-orange-500 px-4 py-3 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-zinc-300 mb-2">Filial <span className="text-zinc-500 font-normal">(opcional)</span></label>
                    <input type="text" name="store_location" placeholder="Ex: Orlando, FL" className="block w-full rounded-xl border border-zinc-700 bg-zinc-950 text-white focus:border-orange-500 px-4 py-3 outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-zinc-300 mb-2">Data e Hora do Recebimento</label>
                  <input type="datetime-local" name="received_at" defaultValue={new Date().toISOString().slice(0, 16)} className="block w-full rounded-xl border border-zinc-700 bg-zinc-950 text-white focus:border-orange-500 px-4 py-3 outline-none [color-scheme:dark]" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-zinc-300 mb-2">Foto da Caixa</label>
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      {photoPreview ? (
                        <img src={photoPreview} alt="Preview" className="h-32 w-32 rounded-xl object-cover border border-zinc-700" />
                      ) : (
                        <div className="h-32 w-32 rounded-xl bg-zinc-950 flex items-center justify-center border border-dashed border-zinc-700">
                          <Camera className="h-10 w-10 text-zinc-700" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <input type="file" name="photo" accept="image/*" className="hidden" ref={photoInputRef} onChange={handlePhotoChange} />
                      <div className="flex flex-wrap gap-3">
                        <button type="button" onClick={() => openPhotoPicker(false)} className="inline-flex items-center gap-2 rounded-lg bg-zinc-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-zinc-700 transition">
                          Escolher imagem
                        </button>
                        <button type="button" onClick={() => openPhotoPicker(true)} className="inline-flex items-center gap-2 rounded-lg bg-orange-500/10 px-4 py-2.5 text-sm font-semibold text-orange-500 hover:bg-orange-500/20 transition">
                          Tirar foto agora
                        </button>
                      </div>
                      <p className="mt-2 text-xs text-zinc-500">📸 PNG, JPG até 5MB (recomendado)</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-zinc-300 mb-2">Observações</label>
                  <textarea name="notes" rows={3} placeholder="Ex: Caixa amassada, pacote molhado..." className="block w-full rounded-xl border border-zinc-700 bg-zinc-950 text-white focus:border-orange-500 px-4 py-3 outline-none"></textarea>
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-8 border-t border-zinc-800">
              <Link href="/admin/boxes" className="px-6 py-3 bg-zinc-800 text-zinc-300 font-semibold rounded-xl hover:bg-zinc-700 transition flex items-center justify-center gap-2">
                <ArrowLeft className="w-5 h-5" /> Cancelar
              </Link>
              
              <button type="submit" name="save_and_new" value="save_and_new" disabled={loading} className="px-6 py-3 bg-zinc-800 border border-zinc-700 text-white font-semibold rounded-xl hover:bg-zinc-700 transition sm:ml-auto">
                Salvar e Próxima
              </button>

              <button type="submit" disabled={loading} className="px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold rounded-xl hover:from-orange-600 hover:to-amber-700 transition shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2">
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                Registrar Caixa
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
