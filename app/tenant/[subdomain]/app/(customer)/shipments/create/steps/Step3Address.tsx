"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "react-hot-toast";
import { CheckCircle2, MapPin, Plus, Loader2 } from "lucide-react";

export default function Step3Address({ formData, setFormData, onNext, onPrev }: any) {
  const [addressMode, setAddressMode] = useState<"saved" | "new">("saved");
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const [address, setAddress] = useState<any>({
    country: "BR",
    label: "",
    person_type: "fisica",
    cpf: "",
    cnpj: "",
    company_name: "",
    recipient_name: "",
    phone: "",
    zip_code: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    save_address: false
  });

  const [savingNew, setSavingNew] = useState(false);

  // Formatting helpers
  const formatCPF = (v: string) => v.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})/, '$1-$2').replace(/(-\d{2})\d+?$/, '$1');
  const formatCNPJ = (v: string) => v.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1/$2').replace(/(\d{4})(\d)/, '$1-$2').replace(/(-\d{2})\d+?$/, '$1');
  const formatCEP = (v: string) => v.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2').replace(/(-\d{3})\d+?$/, '$1');
  const formatPhone = (v: string) => {
    const c = v.replace(/\D/g, '');
    if (!c) return '';
    if (c.length <= 2) return `(${c}`;
    if (c.length <= 6) return `(${c.slice(0,2)}) ${c.slice(2)}`;
    if (c.length <= 10) return `(${c.slice(0,2)}) ${c.slice(2,6)}-${c.slice(6)}`;
    return `(${c.slice(0,2)}) ${c.slice(2,7)}-${c.slice(7,11)}`;
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('addresses')
        .select('*')
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false });
      
      if (data) {
        setSavedAddresses(data);
        if (data.length === 0) {
          setAddressMode("new");
        } else if (!formData.address) {
          // Pre-select default if none selected
          const def = data.find(d => d.is_default) || data[0];
          handleSelectSaved(def);
        }
      }
    }
    setLoading(false);
  };

  const handleSelectSaved = (addr: any) => {
    setFormData((prev: any) => ({ ...prev, address: addr }));
  };

  const handleNext = async () => {
    if (addressMode === "saved") {
      if (!formData.address) {
        toast.error("Por favor, selecione um endereço.");
        return;
      }
      onNext();
    } else {
      // Validate new address
      if (!address.recipient_name || !address.phone || !address.zip_code || !address.street || !address.city || !address.state) {
        toast.error("Preencha todos os campos obrigatórios do endereço.");
        return;
      }
      
      if (address.country === 'BR') {
        if (!address.number || !address.neighborhood) {
           toast.error("Número e Bairro são obrigatórios para o Brasil.");
           return;
        }
        if (address.person_type === 'fisica' && !address.cpf) {
           toast.error("CPF é obrigatório.");
           return;
        }
        if (address.person_type === 'juridica' && (!address.cnpj || !address.company_name)) {
           toast.error("CNPJ e Razão Social são obrigatórios.");
           return;
        }
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch tenant_id from profile
      const { data: profile } = await supabase.from('profiles').select('tenant_id').eq('id', user.id).single();
      const tenantId = profile?.tenant_id;

      if (!tenantId) {
          toast.error("Erro interno: tenant_id não encontrado.");
          return;
      }

      const newAddressData = {
         tenant_id: tenantId,
         customer_id: user.id,
         country: address.country,
         label: address.label || "Novo Endereço",
         person_type: address.country === 'BR' ? address.person_type : null,
         cpf: address.cpf,
         cnpj: address.cnpj,
         company_name: address.company_name,
         recipient_name: address.recipient_name,
         phone: address.phone,
         zip_code: address.zip_code,
         street: address.street,
         number: address.number,
         complement: address.complement,
         neighborhood: address.neighborhood,
         city: address.city,
         state: address.state,
         is_default: savedAddresses.length === 0
      };

      if (address.save_address) {
         setSavingNew(true);
         const { data, error } = await supabase.from('addresses').insert([newAddressData]).select().single();
         setSavingNew(false);
         
         if (error) {
            console.error("Error saving address", error);
            toast.error(error.message || "Erro ao salvar endereço.");
            return;
         } else if (data) {
            handleSelectSaved(data);
            setSavedAddresses([data, ...savedAddresses]);
         }
      } else {
         // Just memory
         handleSelectSaved({ id: 'temp-'+Date.now(), ...newAddressData });
      }
      
      onNext();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="text-2xl">📍</span>
              Endereço de Destino
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Para onde enviar seu pacote?</p>
      </div>

      <div>
          {/* Tabs */}
          <div className="flex gap-2 mb-6">
              <button 
                onClick={() => setAddressMode('saved')} 
                type="button" 
                className={`px-4 py-2 rounded-lg font-medium text-sm transition flex items-center gap-2 ${addressMode === 'saved' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
              >
                  <MapPin className="w-4 h-4" />
                  Endereços Salvos
                  {savedAddresses.length > 0 && (
                     <span className={`${addressMode === 'saved' ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-600'} px-1.5 py-0.5 rounded text-xs`}>{savedAddresses.length}</span>
                  )}
              </button>
              <button 
                onClick={() => setAddressMode('new')} 
                type="button" 
                className={`px-4 py-2 rounded-lg font-medium text-sm transition flex items-center gap-2 ${addressMode === 'new' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
              >
                  <Plus className="w-4 h-4" />
                  Novo Endereço
              </button>
          </div>
          
          {loading ? (
             <div className="py-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
          ) : addressMode === 'saved' ? (
              <div className="space-y-4">
                  {savedAddresses.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 dark:bg-gray-900/50 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700">
                          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-600 dark:text-gray-400 mb-3">Nenhum endereço salvo ainda</p>
                          <button onClick={() => setAddressMode('new')} type="button" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
                              Cadastrar Endereço
                          </button>
                      </div>
                  ) : (
                      savedAddresses.map((addr, idx) => {
                          const isSelected = formData.address?.id === addr.id;
                          return (
                              <label key={addr.id || idx} className={`block p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border-2 cursor-pointer transition relative ${isSelected ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}>
                                  {addr.is_default && (
                                      <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-medium shadow-sm">
                                          Padrão
                                      </div>
                                  )}
                                  
                                  <div className="flex items-start gap-3">
                                      <input type="radio" name="saved_address" checked={isSelected} onChange={() => handleSelectSaved(addr)} className="mt-1 w-5 h-5 text-green-600 border-gray-300 focus:ring-green-500" />
                                      <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-2 mb-1">
                                              <p className="font-semibold text-gray-900 dark:text-white">{addr.recipient_name}</p>
                                              {addr.label && <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded">{addr.label}</span>}
                                          </div>
                                          <p className="text-sm text-gray-600 dark:text-gray-400">{addr.street}{addr.number ? `, ${addr.number}` : ''}</p>
                                          {addr.complement && <p className="text-sm text-gray-500">{addr.complement}</p>}
                                          <p className="text-sm text-gray-500">
                                              {addr.city}{addr.state && `, ${addr.state}`} - {addr.zip_code}
                                          </p>
                                          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                              <span className="text-xs">📞</span> {addr.phone}
                                          </p>
                                      </div>
                                      {isSelected && (
                                          <div className="text-green-500 flex-shrink-0">
                                              <CheckCircle2 className="w-6 h-6" />
                                          </div>
                                      )}
                                  </div>
                              </label>
                          )
                      })
                  )}
              </div>
          ) : (
              <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">País <span className="text-red-500">*</span></label>
                          <select value={address.country} onChange={e => setAddress({...address, country: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white transition">
                              <option value="BR">🇧🇷 Brasil</option>
                              <option value="US">🇺🇸 Estados Unidos</option>
                              <option value="PT">🇵🇹 Portugal</option>
                              <option value="ES">🇪🇸 España</option>
                              <option value="UK">🇬🇧 United Kingdom</option>
                              <option value="IT">🇮🇹 Italia</option>
                              <option value="FR">🇫🇷 France</option>
                              <option value="JP">🇯🇵 Japão</option>
                          </select>
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Rótulo do Endereço</label>
                          <input type="text" value={address.label} onChange={e => setAddress({...address, label: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white transition" placeholder="Ex: Casa, Trabalho" />
                      </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700"></div>

                  {address.country === 'BR' && (
                  <>
                      <div>
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Tipo de pessoa:</label>
                          <div className="grid grid-cols-2 gap-4">
                              <label className={`relative flex items-center p-4 bg-white dark:bg-gray-800 border-2 rounded-xl cursor-pointer transition hover:shadow-md ${address.person_type === 'fisica' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
                                  <input type="radio" name="person_type" value="fisica" checked={address.person_type === 'fisica'} onChange={() => setAddress({...address, person_type: 'fisica'})} className="w-5 h-5 text-blue-600" />
                                  <div className="ml-3">
                                      <div className="text-sm font-bold text-gray-900 dark:text-white">Pessoa Física</div>
                                      <div className="text-xs text-gray-500 dark:text-gray-400">Envio para CPF</div>
                                  </div>
                              </label>

                              <label className={`relative flex items-center p-4 bg-white dark:bg-gray-800 border-2 rounded-xl cursor-pointer transition hover:shadow-md ${address.person_type === 'juridica' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
                                  <input type="radio" name="person_type" value="juridica" checked={address.person_type === 'juridica'} onChange={() => setAddress({...address, person_type: 'juridica'})} className="w-5 h-5 text-blue-600" />
                                  <div className="ml-3">
                                      <div className="text-sm font-bold text-gray-900 dark:text-white">Pessoa Jurídica</div>
                                      <div className="text-xs text-gray-500 dark:text-gray-400">Envio para CNPJ</div>
                                  </div>
                              </label>
                          </div>
                      </div>

                      <div className="border-t border-gray-200 dark:border-gray-700"></div>

                      {address.person_type === 'fisica' ? (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Nome <span className="text-red-500">*</span></label>
                                  <input type="text" value={address.recipient_name} onChange={e => setAddress({...address, recipient_name: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white transition" placeholder="Seu nome completo" />
                              </div>
                              <div>
                                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">CPF <span className="text-red-500">*</span></label>
                                  <input type="text" value={address.cpf} onChange={e => setAddress({...address, cpf: formatCPF(e.target.value)})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white transition" placeholder="000.000.000-00" />
                              </div>
                              <div>
                                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Telefone <span className="text-red-500">*</span></label>
                                  <input type="text" value={address.phone} onChange={e => setAddress({...address, phone: address.country === 'BR' ? formatPhone(e.target.value) : e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white transition" placeholder="(00) 00000-0000" />
                              </div>
                          </div>
                      ) : (
                          <>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">CNPJ <span className="text-red-500">*</span></label>
                                    <input type="text" value={address.cnpj} onChange={e => setAddress({...address, cnpj: formatCNPJ(e.target.value)})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white transition" placeholder="00.000.000/0000-00" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Nome Responsável <span className="text-red-500">*</span></label>
                                    <input type="text" value={address.recipient_name} onChange={e => setAddress({...address, recipient_name: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white transition" placeholder="Nome do responsável" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Telefone <span className="text-red-500">*</span></label>
                                    <input type="text" value={address.phone} onChange={e => setAddress({...address, phone: address.country === 'BR' ? formatPhone(e.target.value) : e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white transition" placeholder="(00) 00000-0000" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Nome da Empresa <span className="text-red-500">*</span></label>
                                <input type="text" value={address.company_name} onChange={e => setAddress({...address, company_name: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white transition" placeholder="Razão social ou nome fantasia" />
                            </div>
                          </>
                      )}
                  </>
                  )}

                  {address.country !== 'BR' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Nome <span className="text-red-500">*</span></label>
                              <input type="text" value={address.recipient_name} onChange={e => setAddress({...address, recipient_name: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white transition" placeholder="Seu nome completo" />
                          </div>
                          <div>
                              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Telefone <span className="text-red-500">*</span></label>
                              <input type="text" value={address.phone} onChange={e => setAddress({...address, phone: address.country === 'BR' ? formatPhone(e.target.value) : e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white transition" placeholder="+00 000000000" />
                          </div>
                      </div>
                  )}
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-6">
                      <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wide">Endereço</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">CEP / ZIP Code <span className="text-red-500">*</span></label>
                              <input type="text" value={address.zip_code} onChange={e => setAddress({...address, zip_code: address.country === 'BR' ? formatCEP(e.target.value) : e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white transition" placeholder={address.country === 'BR' ? "00000-000" : "Zip Code"} />
                          </div>
                          <div className="md:col-span-2">
                              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                  Endereço (Rua, Avenida, Completo) <span className="text-red-500">*</span>
                              </label>
                              <input type="text" value={address.street} onChange={e => setAddress({...address, street: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white transition" placeholder="Rua, Avenida, etc." />
                          </div>
                      </div>
                      
                      {address.country === 'BR' && (
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                              <div>
                                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Número <span className="text-red-500">*</span></label>
                                  <input type="text" value={address.number} onChange={e => setAddress({...address, number: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white transition" placeholder="123" />
                              </div>
                              <div className="md:col-span-3">
                                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Complemento</label>
                                  <input type="text" value={address.complement} onChange={e => setAddress({...address, complement: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white transition" placeholder="Apto, Bloco, etc." />
                              </div>
                          </div>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {address.country === 'BR' && (
                              <div>
                                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Bairro <span className="text-red-500">*</span></label>
                                  <input type="text" value={address.neighborhood} onChange={e => setAddress({...address, neighborhood: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white transition" placeholder="Bairro" />
                              </div>
                          )}
                          <div>
                              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Cidade <span className="text-red-500">*</span></label>
                              <input type="text" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white transition" placeholder="Cidade" />
                          </div>
                          <div>
                              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Estado / Província <span className="text-red-500">*</span></label>
                              <input type="text" value={address.state} onChange={e => setAddress({...address, state: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white transition uppercase" placeholder="UF / Estado" />
                          </div>
                      </div>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mt-6">
                      <label className="flex items-center cursor-pointer">
                          <input type="checkbox" checked={address.save_address} onChange={e => setAddress({...address, save_address: e.target.checked})} className="w-5 h-5 text-blue-600 rounded border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500" />
                          <span className="ml-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                              Salvar este endereço para futuros envios
                          </span>
                      </label>
                  </div>
              </div>
          )}
      </div>

      {/* Footer Navigation */}
      <div className="flex justify-between items-center pt-6 mt-8">
        <button
          onClick={onPrev}
          className="px-6 py-2.5 rounded-xl font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          Voltar
        </button>
        <button
          onClick={handleNext}
          disabled={savingNew}
          className="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {savingNew ? (
              <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
             <>
                Continuar
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
             </>
          )}
        </button>
      </div>
    </div>
  );
}
