"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ChevronRight, Star, Plus, X, LayoutTemplate, Layers, Diamond,
  Calendar, Check, AlertCircle, Play, DollarSign, Users
} from 'lucide-react';
import { useTenantSettings } from '../../../app/(customer)/components/TenantSettingsContext';
import { toast } from 'react-hot-toast';
import { createVipProgram, deleteVipProgram } from './_actions/vip';
import { useRouter } from 'next/navigation';
import VipProgramCard from './VipProgramCard';
const TEMPLATE_DESCRIPTIONS = {
  basic: 'Ideal para começar. Plano simples com benefícios diretos (desconto, cashback). Perfeito para testar rapidamente.',
  tiers: 'Pensado para crescimento. Permite criar faixas progressivas (Bronze → Prata → Ouro) com benefícios que aumentam.',
  plus: 'O mais completo. Base robusta para combinar vários benefícios avançados (desconto + cashback + frete grátis).'
};

export default function VipProgramsClient({ tenantId, subdomain, initialPrograms = [] }: { tenantId: string, subdomain: string, initialPrograms?: any[] }) {
  const router = useRouter();
  const settingsContext = useTenantSettings?.();
  const currencySymbol = settingsContext?.currencySymbol || 'R$';

  const [showForm, setShowForm] = useState(false);
  const [step, setStep] = useState(1);

  // Form State
  const [programName, setProgramName] = useState('');
  const [templateKey, setTemplateKey] = useState<'basic' | 'tiers' | 'plus'>('basic');
  const [description, setDescription] = useState('');
  
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [price, setPrice] = useState('');
  const [trialDays, setTrialDays] = useState('');
  const [graceDays, setGraceDays] = useState('3');
  const [stackingMode, setStackingMode] = useState('best_price');
  const [status, setStatus] = useState('draft');

  const handleToggleForm = () => {
    setShowForm(!showForm);
    if (!showForm) {
      setStep(1); // Reset step when opening
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [programs, setPrograms] = useState(initialPrograms);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!programName || !price) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    setIsSubmitting(true);
    const res = await createVipProgram(tenantId, {
      name: programName,
      template_key: templateKey,
      description,
      billing_cycle: billingCycle,
      price: parseFloat(price),
      trial_days: parseInt(trialDays || '0', 10),
      grace_days: parseInt(graceDays || '3', 10),
      stacking_mode: stackingMode,
      status
    });
    setIsSubmitting(false);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Programa VIP criado com sucesso!");
      setShowForm(false);
      setStep(1);
      // Reset form fields
      setProgramName('');
      setPrice('');
      setDescription('');
      // router.refresh() will refresh the server component to get new data
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 pb-20 -m-8">
      
      {/* Header */}
      <div className="bg-zinc-900 border-b border-zinc-800 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-amber-500/5 pointer-events-none blur-3xl"></div>
        <div className="absolute -bottom-16 -left-8 w-64 h-64 rounded-full bg-amber-500/5 pointer-events-none blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-sm mb-4 text-zinc-400">
            <Link href={`/admin/dashboard`} className="hover:text-zinc-100 transition-colors">Dashboard</Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            <span className="text-zinc-100 font-medium">Programas VIP</span>
          </nav>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center text-amber-500 shrink-0">
                <Star className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 truncate">Programas VIP</h1>
                <p className="text-zinc-400 text-sm mt-0.5">Crie e gerencie planos exclusivos para seus clientes</p>
              </div>
            </div>
            <button 
              onClick={handleToggleForm}
              className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 font-bold rounded-xl transition shadow-lg active:scale-95 text-sm shrink-0 border ${showForm ? 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700' : 'bg-amber-500 border-amber-500 text-zinc-950 hover:bg-amber-600'}`}
            >
              {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              <span>{showForm ? 'Fechar' : 'Novo programa'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-zinc-400">Programas criados</p>
              <Star className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-3xl font-extrabold text-zinc-100 mt-2">{initialPrograms.length}</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-zinc-400">Programas ativos</p>
              <Play className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-3xl font-extrabold text-zinc-100 mt-2">{initialPrograms.filter(p => p.status === 'active').length}</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-zinc-400">Assinantes ativos</p>
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-extrabold text-zinc-100 mt-2">0</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-zinc-400">Receita recorrente / mês</p>
              <DollarSign className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-3xl font-extrabold text-zinc-100 mt-2">{currencySymbol}0.00</p>
          </div>
        </div>

        {/* Form Wizard */}
        {showForm && (
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
            
            <div className="bg-zinc-950 border-b border-zinc-800 px-6 py-5">
              <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-500" />
                Criar Novo Programa VIP
              </h3>
              <p className="text-zinc-400 text-sm mt-1">Configure um plano exclusivo em 3 passos simples</p>

              {/* Stepper */}
              <div className="flex items-center gap-2 mt-5">
                {[1, 2, 3].map((s) => (
                  <React.Fragment key={s}>
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 border-2 ${step >= s ? 'border-amber-500 bg-amber-500/10 text-amber-500' : 'border-zinc-800 bg-zinc-900 text-zinc-500'}`}>
                        {step > s ? <Check className="w-4 h-4" /> : s}
                      </div>
                      <span className={`text-sm font-medium hidden sm:inline ${step >= s ? 'text-zinc-100' : 'text-zinc-500'}`}>
                        {s === 1 ? 'Identidade' : s === 2 ? 'Preço & Regras' : 'Publicar'}
                      </span>
                    </div>
                    {s < 3 && <div className={`w-8 sm:w-12 h-px hidden sm:block ${step > s ? 'bg-amber-500/50' : 'bg-zinc-800'}`}></div>}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              
              {/* STEP 1: IDENTITY */}
              {step === 1 && (
                <div className="animate-in fade-in slide-in-from-right-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    <div>
                      <label className="block text-sm font-bold text-zinc-300 mb-2">
                        Nome do programa <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        required 
                        value={programName}
                        onChange={(e) => setProgramName(e.target.value)}
                        className="w-full px-4 py-3 bg-zinc-950 border-2 border-zinc-800 text-zinc-100 rounded-xl focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition" 
                        placeholder="Ex.: VIP Premium, Plano Gold, Clube Select..." 
                      />
                      <p className="mt-2 text-xs text-zinc-500">Nome que aparecerá para o cliente na hora de assinar.</p>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-zinc-300 mb-2">
                        Template do plano <span className="text-red-500">*</span>
                      </label>
                      <div className="space-y-3">
                        {[
                          { key: 'basic', icon: LayoutTemplate, label: 'Básico' },
                          { key: 'tiers', icon: Layers, label: 'Níveis' },
                          { key: 'plus', icon: Diamond, label: 'Plus' }
                        ].map((t) => {
                          const Icon = t.icon;
                          const isSelected = templateKey === t.key;
                          return (
                            <label 
                              key={t.key}
                              className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${isSelected ? 'border-amber-500 bg-amber-500/5' : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'}`}
                            >
                              <input 
                                type="radio" 
                                name="template_key" 
                                value={t.key} 
                                checked={isSelected}
                                onChange={() => setTemplateKey(t.key as any)}
                                className="mt-1 w-4 h-4 text-amber-500 bg-zinc-900 border-zinc-700 focus:ring-amber-500 focus:ring-offset-zinc-950" 
                                required 
                              />
                              <div>
                                <span className={`font-bold flex items-center gap-2 ${isSelected ? 'text-amber-500' : 'text-zinc-100'}`}>
                                  <Icon className="w-4 h-4" />
                                  {t.label}
                                </span>
                                <p className="text-xs text-zinc-400 mt-1">{TEMPLATE_DESCRIPTIONS[t.key as keyof typeof TEMPLATE_DESCRIPTIONS]}</p>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <div className="lg:col-span-2">
                      <label className="block text-sm font-bold text-zinc-300 mb-2">Descrição do plano</label>
                      <textarea 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3} 
                        className="w-full px-4 py-3 bg-zinc-950 border-2 border-zinc-800 text-zinc-100 rounded-xl focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition resize-none" 
                        placeholder="Descreva os benefícios principais para convencer o cliente a assinar..."
                      ></textarea>
                      <p className="mt-2 text-xs text-zinc-500">Opcional. Exibida na página de assinatura VIP do cliente.</p>
                    </div>
                  </div>

                  <div className="flex justify-end mt-8">
                    <button 
                      type="button" 
                      onClick={() => {
                        if (!programName) { alert('Preencha o nome do programa'); return; }
                        setStep(2);
                      }} 
                      className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold rounded-xl transition shadow-lg shadow-amber-500/10"
                    >
                      Próximo: Preço & Regras
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: PRICE & RULES */}
              {step === 2 && (
                <div className="animate-in fade-in slide-in-from-right-4">
                  
                  <div className="mb-6 p-4 rounded-xl border border-amber-500/20 bg-amber-500/10 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-amber-500 text-sm">Pagamento único, renovação manual</p>
                      <p className="mt-1 text-sm text-amber-500/80">O cliente paga uma vez e renova manualmente quando vencer. Não há cobrança automática recorrente no momento.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    
                    <div>
                      <label className="block text-sm font-bold text-zinc-300 mb-2">Ciclo de validade <span className="text-red-500">*</span></label>
                      <div className="flex gap-2">
                        <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all text-sm font-bold ${billingCycle === 'monthly' ? 'border-amber-500 bg-amber-500/10 text-amber-500' : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'}`}>
                          <input type="radio" name="billing_cycle" value="monthly" checked={billingCycle === 'monthly'} onChange={() => setBillingCycle('monthly')} className="sr-only" />
                          <Calendar className="w-4 h-4" />
                          Mensal
                        </label>
                        <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all text-sm font-bold ${billingCycle === 'yearly' ? 'border-amber-500 bg-amber-500/10 text-amber-500' : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'}`}>
                          <input type="radio" name="billing_cycle" value="yearly" checked={billingCycle === 'yearly'} onChange={() => setBillingCycle('yearly')} className="sr-only" />
                          <Calendar className="w-4 h-4" />
                          Anual
                        </label>
                      </div>
                      <p className="mt-2 text-xs text-zinc-500">Quanto tempo dura o acesso VIP após pagamento.</p>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-zinc-300 mb-2">Preço <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">{currencySymbol}</span>
                        <input 
                          type="number" 
                          step="0.01" 
                          min="0" 
                          required 
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 bg-zinc-950 border-2 border-zinc-800 text-zinc-100 rounded-xl focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition" 
                          placeholder="29.90" 
                        />
                      </div>
                      <p className="mt-2 text-xs text-zinc-500">Valor cobrado por {billingCycle === 'monthly' ? 'mês' : 'ano'}.</p>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-zinc-300 mb-2">Período de teste (Trial)</label>
                      <div className="relative">
                        <input 
                          type="number" 
                          min="0" 
                          max="365" 
                          value={trialDays}
                          onChange={(e) => setTrialDays(e.target.value)}
                          className="w-full pl-4 pr-12 py-3 bg-zinc-950 border-2 border-zinc-800 text-zinc-100 rounded-xl focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition" 
                          placeholder="0" 
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 text-sm font-semibold">dias</span>
                      </div>
                      <p className="mt-2 text-xs text-zinc-500">Período grátis antes de cobrar. 0 = sem trial.</p>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-zinc-300 mb-2">Carência pós-vencimento</label>
                      <div className="relative">
                        <input 
                          type="number" 
                          min="0" 
                          max="30" 
                          value={graceDays}
                          onChange={(e) => setGraceDays(e.target.value)}
                          className="w-full pl-4 pr-12 py-3 bg-zinc-950 border-2 border-zinc-800 text-zinc-100 rounded-xl focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition" 
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 text-sm font-semibold">dias</span>
                      </div>
                      <p className="mt-2 text-xs text-zinc-500">Dias extras após vencer em que o cliente ainda mantém os benefícios.</p>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-zinc-300 mb-2">Comportamento: Cupom + VIP</label>
                      <select 
                        value={stackingMode}
                        onChange={(e) => setStackingMode(e.target.value)}
                        className="w-full px-4 py-3 bg-zinc-950 border-2 border-zinc-800 text-zinc-100 rounded-xl focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition appearance-none pr-10"
                        style={{
                          backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%24%2024%22%20fill%3D%22none%22%20stroke%3D%22%2371717a%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")`,
                          backgroundPosition: "right 12px center",
                          backgroundRepeat: "no-repeat",
                          backgroundSize: "16px"
                        }}
                      >
                        <option value="best_price">Melhor preço (maior desconto)</option>
                        <option value="none">Sem acúmulo (prioriza VIP)</option>
                        <option value="stack_allowed">Acúmulo permitido (soma VIP + cupom)</option>
                      </select>
                      <div className="mt-2 text-xs text-zinc-500">
                        {stackingMode === 'best_price' && <p>Se o cliente tem VIP 10% e cupom 15%, aplica só 15%.</p>}
                        {stackingMode === 'none' && <p>Prioriza o desconto VIP ignorando o cupom.</p>}
                        {stackingMode === 'stack_allowed' && <p>Soma: VIP 10% + cupom 15% = 25% total.</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-zinc-300 mb-2">Status inicial</label>
                      <select 
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full px-4 py-3 bg-zinc-950 border-2 border-zinc-800 text-zinc-100 rounded-xl focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition appearance-none pr-10"
                        style={{
                          backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%24%2024%22%20fill%3D%22none%22%20stroke%3D%22%2371717a%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")`,
                          backgroundPosition: "right 12px center",
                          backgroundRepeat: "no-repeat",
                          backgroundSize: "16px"
                        }}
                      >
                        <option value="draft">Rascunho (não visível)</option>
                        <option value="active">Ativo (visível e assinável)</option>
                        <option value="paused">Pausado (sem novas assinaturas)</option>
                      </select>
                      <p className="mt-2 text-xs text-zinc-500">Você pode alterar depois a qualquer momento.</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-8">
                    <button 
                      type="button" 
                      onClick={() => setStep(1)} 
                      className="inline-flex items-center gap-2 px-5 py-3 text-sm font-bold text-zinc-300 bg-zinc-800 rounded-xl hover:bg-zinc-700 transition"
                    >
                      Voltar
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        if (!price) { alert("Preencha o preço."); return; }
                        setStep(3);
                      }} 
                      className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold rounded-xl transition shadow-lg shadow-amber-500/10"
                    >
                      Próximo: Publicar
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: PUBLISH */}
              {step === 3 && (
                <div className="animate-in fade-in slide-in-from-right-4">
                  
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 mb-4">
                      <Check className="w-8 h-8" />
                    </div>
                    <h4 className="text-xl font-bold text-zinc-100">Tudo pronto!</h4>
                    <p className="text-sm text-zinc-400 mt-2 max-w-sm mx-auto">Revise as informações e crie o programa. Os benefícios poderão ser configurados em detalhes na próxima tela.</p>
                  </div>

                  <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-6 space-y-4 max-w-2xl mx-auto">
                    <div className="flex justify-between items-center border-b border-zinc-800/50 pb-4">
                      <span className="text-zinc-500 font-medium">Nome</span>
                      <span className="font-bold text-zinc-100">{programName}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-zinc-800/50 pb-4">
                      <span className="text-zinc-500 font-medium">Preço</span>
                      <span className="font-bold text-amber-500">{currencySymbol}{Number(price || 0).toFixed(2)} / {billingCycle === 'monthly' ? 'mês' : 'ano'}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-zinc-800/50 pb-4">
                      <span className="text-zinc-500 font-medium">Template</span>
                      <span className="font-bold text-zinc-100 flex items-center gap-2">
                        {templateKey === 'basic' ? <><LayoutTemplate className="w-4 h-4 text-amber-500"/> Básico</> : 
                         templateKey === 'tiers' ? <><Layers className="w-4 h-4 text-amber-500"/> Níveis</> : 
                         <><Diamond className="w-4 h-4 text-amber-500"/> Plus</>}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-2">
                      <span className="text-zinc-500 font-medium">Cupom + VIP</span>
                      <span className="font-bold text-zinc-300">
                        {stackingMode === 'best_price' ? 'Melhor preço' : stackingMode === 'none' ? 'Sem acúmulo' : 'Soma permitida'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-8 max-w-2xl mx-auto">
                    <button 
                      type="button" 
                      onClick={() => setStep(2)} 
                      className="inline-flex items-center gap-2 px-5 py-3 text-sm font-bold text-zinc-300 bg-zinc-800 rounded-xl hover:bg-zinc-700 transition"
                    >
                      Voltar
                    </button>
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-2 px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold rounded-xl transition shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                    >
                      <Check className="w-5 h-5" />
                      {isSubmitting ? 'Criando...' : 'Criar Programa VIP'}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        )}

        {/* Programs List / Empty State */}
        {!showForm && initialPrograms.length === 0 && (
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-12 text-center shadow-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-zinc-800 border border-zinc-700 text-zinc-500 mb-5">
              <Star className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-zinc-100">Nenhum programa VIP criado</h3>
            <p className="text-sm text-zinc-400 mt-2 mb-6 max-w-sm mx-auto">Você ainda não possui nenhum programa de fidelidade ativo. Comece criando o seu primeiro plano VIP.</p>
            <button 
              onClick={handleToggleForm}
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold rounded-xl transition shadow-lg shadow-amber-500/10"
            >
              <Plus className="w-5 h-5" />
              Criar meu primeiro programa
            </button>
          </div>
        )}

        {!showForm && initialPrograms.length > 0 && (
          <div className="space-y-6">
            {initialPrograms.map((program) => (
              <VipProgramCard 
                key={program.id} 
                program={program} 
                tenantId={tenantId}
                currencySymbol={currencySymbol}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
