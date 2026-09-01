"use client";

import React, { useState } from 'react';
import { Star, Users, Check, ChevronDown, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { updateVipProgram, updateVipProgramBenefits } from './_actions/vip';

export default function VipProgramCard({ program, tenantId, currencySymbol }: { program: any, tenantId: string, currencySymbol: string }) {
  const [openSection, setOpenSection] = useState<'config' | 'benefits' | 'subscribers'>('config');
  const [isSaving, setIsSaving] = useState(false);
  
  // Local state for config form
  const [name, setName] = useState(program.name || '');
  const [status, setStatus] = useState(program.status || 'draft');
  const [billingCycle, setBillingCycle] = useState(program.billing_cycle || 'monthly');
  const [price, setPrice] = useState(program.price || 0);
  const [stackingMode, setStackingMode] = useState(program.stacking_mode || 'best_price');

  const [openBenefit, setOpenBenefit] = useState<string | null>(null);

  // We'll just define the benefits array to render them
  const ALL_BENEFITS = [
    { key: 'store_discount', label: '🏷️ Desconto em Loja', desc: 'Desconto automático no checkout da loja online' },
    { key: 'cashback', label: '💰 Cashback', desc: 'Devolve um valor para a carteira digital do cliente após a compra' },
    { key: 'priority', label: '⚡ Prioridade de Atendimento', desc: 'Clientes VIP são priorizados no processamento.' },
    { key: 'purchase_group_early_access', label: '🚀 Acesso Antecipado', desc: 'VIPs acessam grupos de compra antes da abertura oficial' },
    { key: 'shipping_fee_discount', label: '✈️ Desconto no Envio', desc: 'Desconto na taxa de envio' },
    { key: 'purchase_group_fee_discount', label: '🛍️ Desconto Taxa de Grupos', desc: 'Desconto na taxa de grupos de compras' },
    { key: 'assisted_purchase_fee_discount', label: '🤝 Desconto Compra Assistida', desc: 'Desconto na taxa de compra assistida' },
    { key: 'services_fee_discount', label: '🔧 Desconto Serviços Extras', desc: 'Desconto em serviços avulsos (fotos, etc)' },
    { key: 'free_shipping', label: '📦 Frete Grátis VIP', desc: 'Frete gratuito ou com teto' },
  ];

  const [benefitsState, setBenefitsState] = useState<any>(() => {
    const existing = program.vip_program_benefits || [];
    const map: any = {};
    existing.forEach((e: any) => {
      map[e.benefit_key] = {
        is_active: e.is_active,
        benefit_type: e.benefit_type,
        value: Number(e.value || 0),
        min_value: Number(e.min_value || 0),
        max_value: e.max_value !== null ? Number(e.max_value) : ''
      };
    });
    
    const completeMap: any = {};
    ALL_BENEFITS.forEach(b => {
       if (map[b.key]) {
         completeMap[b.key] = map[b.key];
       } else {
         completeMap[b.key] = { is_active: false, benefit_type: 'percentage', value: 0, min_value: 0, max_value: '' };
       }
    });
    return completeMap;
  });

  const handleBenefitChange = (key: string, field: string, val: any) => {
    setBenefitsState((prev: any) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: val
      }
    }));
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const res = await updateVipProgram(tenantId, program.id, {
      name, status, billing_cycle: billingCycle, price, stacking_mode: stackingMode
    });
    setIsSaving(false);
    if (res.error) toast.error(res.error);
    else toast.success("Configuração salva com sucesso!");
  };

  const handleSaveBenefits = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const payload = Object.keys(benefitsState).map(key => ({
      benefit_key: key,
      benefit_type: benefitsState[key].benefit_type,
      value: benefitsState[key].value,
      min_value: benefitsState[key].min_value,
      max_value: benefitsState[key].max_value === '' ? null : benefitsState[key].max_value,
      is_active: benefitsState[key].is_active
    }));

    const res = await updateVipProgramBenefits(tenantId, program.id, payload);
    setIsSaving(false);
    if (res.error) toast.error(res.error);
    else toast.success("Benefícios salvos com sucesso!");
  };

  return (
    <div className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-sm overflow-hidden mb-6">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-zinc-900 to-zinc-950 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-zinc-800/50">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Star className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-100">{program.name}</h3>
            <p className="text-sm text-zinc-400 mt-0.5 flex items-center gap-1.5">
              <span>{program.billing_cycle === 'monthly' ? 'Mensal' : 'Anual'}</span>
              <span>&middot;</span>
              <span>{currencySymbol}{Number(program.price).toFixed(2)}</span>
              <span>&middot;</span>
              <span>Template {program.template_key}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
            <Users className="w-3.5 h-3.5 text-amber-500" />
            0 assinantes ativos
          </span>
          <span className={`px-3 py-1.5 text-xs font-semibold rounded-full border ${program.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>
            {program.status === 'active' ? 'Ativo' : program.status === 'draft' ? 'Rascunho' : 'Pausado'}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-zinc-800 px-6 bg-zinc-900/50">
        <div className="flex gap-4 -mb-px overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setOpenSection('config')} 
            className={`px-2 py-4 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${openSection === 'config' ? 'border-amber-500 text-amber-500' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
          >
            ⚙️ Configuração
          </button>
          <button 
            onClick={() => setOpenSection('benefits')} 
            className={`px-2 py-4 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${openSection === 'benefits' ? 'border-amber-500 text-amber-500' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
          >
            🎁 Benefícios
          </button>
          <button 
            onClick={() => setOpenSection('subscribers')} 
            className={`flex items-center gap-2 px-2 py-4 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${openSection === 'subscribers' ? 'border-amber-500 text-amber-500' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
          >
            👥 Assinantes
            <span className={`inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 text-[11px] font-bold rounded-full ${openSection === 'subscribers' ? 'bg-amber-500/20 text-amber-500' : 'bg-zinc-800 text-zinc-400'}`}>
              0
            </span>
          </button>
        </div>
      </div>

      {/* Content: Subscribers */}
      {openSection === 'subscribers' && (
        <div className="p-8 text-center bg-zinc-900">
          <p className="text-sm text-zinc-500">Nenhum assinante ativo ainda.</p>
        </div>
      )}

      {/* Content: Config */}
      {openSection === 'config' && (
        <div className="p-6 bg-zinc-900">
          <form onSubmit={handleSaveConfig} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-zinc-300 mb-2">Nome</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-xl focus:border-amber-500 outline-none transition text-sm" />
            </div>

            <div>
              <label className="block text-sm font-bold text-zinc-300 mb-2">Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)} className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-xl focus:border-amber-500 outline-none transition text-sm appearance-none">
                <option value="draft">📝 Rascunho</option>
                <option value="active">✅ Ativo</option>
                <option value="paused">⏸️ Pausado</option>
                <option value="archived">🗄️ Arquivado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-zinc-300 mb-2">Ciclo</label>
              <select value={billingCycle} onChange={e => setBillingCycle(e.target.value)} className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-xl focus:border-amber-500 outline-none transition text-sm appearance-none">
                <option value="monthly">Mensal</option>
                <option value="yearly">Anual</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-zinc-300 mb-2">Preço</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-zinc-500 text-sm font-bold">{currencySymbol}</span>
                <input type="number" step="0.01" min="0" value={price} onChange={e => setPrice(Number(e.target.value))} className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-xl focus:border-amber-500 outline-none transition text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-zinc-300 mb-2">Cupom + VIP</label>
              <select value={stackingMode} onChange={e => setStackingMode(e.target.value)} className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-xl focus:border-amber-500 outline-none transition text-sm appearance-none">
                <option value="best_price">Melhor preço</option>
                <option value="none">Sem acúmulo</option>
                <option value="stack_allowed">Acúmulo permitido</option>
              </select>
            </div>

            <div className="sm:col-span-2 lg:col-span-3 flex justify-end mt-2">
              <button type="submit" disabled={isSaving} className="inline-flex items-center gap-2 px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-sm font-bold rounded-xl transition border border-zinc-700">
                <Check className="w-4 h-4" />
                {isSaving ? 'Salvando...' : 'Salvar Configuração'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Content: Benefits */}
      {openSection === 'benefits' && (
        <div className="p-6 bg-zinc-900">
          <form onSubmit={handleSaveBenefits} className="space-y-6">
            <div>
              <h4 className="text-base font-bold text-zinc-100">Benefícios do plano</h4>
              <p className="text-sm text-zinc-400 mt-1">Ative os benefícios desejados e configure cada um. Clique para expandir.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {ALL_BENEFITS.map((b) => {
                const isOpen = openBenefit === b.key;
                const state = benefitsState[b.key];
                return (
                  <div key={b.key} className={`border rounded-xl transition-all ${isOpen ? 'border-amber-500/50 bg-amber-500/5' : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'}`}>
                    <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => setOpenBenefit(isOpen ? null : b.key)}>
                      <label className="inline-flex items-center gap-3 cursor-pointer flex-1" onClick={(e) => e.stopPropagation()}>
                        <input 
                          type="checkbox" 
                          checked={state.is_active}
                          onChange={(e) => handleBenefitChange(b.key, 'is_active', e.target.checked)}
                          className="w-5 h-5 rounded border-zinc-700 bg-zinc-900 text-amber-500 focus:ring-amber-500 focus:ring-offset-zinc-950" 
                        />
                        <div>
                          <span className="font-bold text-zinc-100 text-sm">{b.label}</span>
                          <p className="text-xs text-zinc-500 mt-0.5">{b.desc}</p>
                        </div>
                      </label>
                      <ChevronDown className={`w-5 h-5 text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                    
                    {isOpen && (
                      <div className="px-4 pb-5 pt-2 space-y-4 border-t border-zinc-800/50 mt-2">
                        {b.key !== 'priority' ? (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-zinc-400 mb-1.5">Tipo</label>
                              <select 
                                value={state.benefit_type}
                                onChange={(e) => handleBenefitChange(b.key, 'benefit_type', e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg text-sm p-2 outline-none"
                              >
                                <option value="percentage">% Percentual</option>
                                <option value="fixed">$ Fixo</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-zinc-400 mb-1.5">Valor</label>
                              <input 
                                type="number" 
                                step="0.01"
                                value={state.value}
                                onChange={(e) => handleBenefitChange(b.key, 'value', Number(e.target.value))}
                                placeholder="Ex: 10" 
                                className="w-full bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg text-sm p-2 outline-none focus:border-amber-500" 
                              />
                            </div>
                            {b.key !== 'purchase_group_early_access' && (
                              <>
                                <div>
                                  <label className="block text-xs font-bold text-zinc-400 mb-1.5">Mínimo</label>
                                  <input 
                                    type="number" 
                                    step="0.01"
                                    value={state.min_value}
                                    onChange={(e) => handleBenefitChange(b.key, 'min_value', Number(e.target.value))}
                                    placeholder="0.00" 
                                    className="w-full bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg text-sm p-2 outline-none focus:border-amber-500" 
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-bold text-zinc-400 mb-1.5">Teto (Max)</label>
                                  <input 
                                    type="number" 
                                    step="0.01"
                                    value={state.max_value}
                                    onChange={(e) => handleBenefitChange(b.key, 'max_value', e.target.value)}
                                    placeholder="Sem limite" 
                                    className="w-full bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg text-sm p-2 outline-none focus:border-amber-500" 
                                  />
                                </div>
                              </>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-zinc-400">Atendimento prioritário habilitado. Não necessita configurações adicionais.</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-4 border-t border-zinc-800">
              <button type="submit" disabled={isSaving} className="inline-flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold rounded-xl transition shadow-lg shadow-amber-500/10">
                <Check className="w-4 h-4" />
                {isSaving ? 'Salvando...' : 'Salvar Benefícios'}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
