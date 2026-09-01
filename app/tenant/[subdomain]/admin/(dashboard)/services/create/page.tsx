"use client";
import { useTenantSettings } from "../../../../app/(customer)/components/TenantSettingsContext";


import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { createServiceAction } from "@/app/actions/createService";
import { ArrowLeft, Briefcase, Plus, Save } from "lucide-react";

const commonIcons = ['🛍️','📦','🧳','✈️','🏨','🚗','🛒','📬','📮','🎁','👔','👗','🔧','💼','📱','🏷️','🪄','🧹','📸','⭐','🏋️','🧺','📋','🗃️','🎨'];

export default function CreateServicePage() {
  const { currencySymbol, currency } = useTenantSettings();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("🔧");
  const [priceType, setPriceType] = useState("fixed");
  const [basePrice, setBasePrice] = useState("");
  const [estimatedDays, setEstimatedDays] = useState("");
  const [requiresApproval, setRequiresApproval] = useState(true);
  const [autoRelease, setAutoRelease] = useState(false);
  const [chargeFreightUpfront, setChargeFreightUpfront] = useState(false);
  const [requiresProductSelection, setRequiresProductSelection] = useState(false);
  const [allowQuantity, setAllowQuantity] = useState(false);
  const [serviceAction, setServiceAction] = useState("none");
  const [actionDays, setActionDays] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [paymentMode, setPaymentMode] = useState("after_completion");
  const [depositAmount, setDepositAmount] = useState("");
  const [showIconPicker, setShowIconPicker] = useState(false);

  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();


  // If priceType is 'quote', force paymentMode to 'after_completion'
  if (priceType === "quote" && paymentMode !== "after_completion") {
    setPaymentMode("after_completion");
  }

  const priceLabel = useMemo(() => {
    if (!basePrice && priceType !== "quote") return "—";
    if (priceType === "percentage") return `${basePrice}%`;
    if (priceType === "quote") return "Sob Consulta";
    return `$${parseFloat(basePrice || "0").toFixed(2).replace(".", ",")}`;
  }, [basePrice, priceType]);

  const handlePriceTypeChange = (value: string) => {
    setPriceType(value);
    if (value === "quote") {
      setPaymentMode("after_completion");
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-zinc-950 -m-8 pb-8 flex flex-col">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 shadow-lg shadow-orange-500/20 shrink-0">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-8 w-64 h-64 rounded-full bg-white/5 pointer-events-none"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-sm mb-3" aria-label="Breadcrumb">
            <Link href="/admin" className="text-white/70 hover:text-white transition-colors truncate max-w-[45vw] sm:max-w-[220px]">
              Dashboard
            </Link>
            <svg className="w-3.5 h-3.5 text-white/50 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
            <Link href="/admin/services" className="text-white/70 hover:text-white transition-colors truncate max-w-[45vw] sm:max-w-[220px]">
              Catálogo de Serviços
            </Link>
            <svg className="w-3.5 h-3.5 text-white/50 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
            <span className="text-white font-medium truncate max-w-[45vw] sm:max-w-[220px]">Novo Serviço</span>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/admin/services" className="p-2.5 bg-white/20 hover:bg-white/30 text-white rounded-xl transition shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Novo Serviço
            </h1>
          </div>
        </div>
      </div>

      <div className="py-6 sm:py-10 flex-1">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
          
          <form onSubmit={(e) => {
            e.preventDefault();
            startTransition(async () => {
              const res = await createServiceAction({
                name, description, icon, priceType, basePrice, estimatedDays,
                requiresApproval, autoRelease, chargeFreightUpfront, requiresProductSelection,
                allowQuantity, serviceAction, actionDays, isActive, paymentMode, depositAmount
              });
              if (res.success) {
                toast.success("Serviço criado com sucesso!");
                router.push("/admin/services");
              } else {
                toast.error(res.error || "Erro ao criar serviço");
              }
            });
          }}>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

              {/* Main Column */}
              <div className="xl:col-span-2 space-y-4">

                <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4 flex gap-3">
                  <span className="text-2xl flex-shrink-0">💡</span>
                  <div>
                    <p className="font-semibold text-orange-400 text-sm">O que é um Serviço?</p>
                    <p className="text-sm text-zinc-400 mt-1">Serviços são tarefas que você realiza para o cliente mediante pagamento — como Personal Shopper, Fotografia de produto, Retirada de mala, entre outros. O cliente solicita o serviço pelo painel, você executa e registra a conclusão.</p>
                  </div>
                </div>

                {/* 1. Identidade do Serviço */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-zinc-800 flex items-center gap-3">
                    <span className="w-7 h-7 bg-orange-500/20 text-orange-500 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                    <div>
                      <h3 className="font-semibold text-white">Identidade do Serviço</h3>
                      <p className="text-xs text-zinc-400">Nome e descrição que o cliente verá no catálogo</p>
                    </div>
                  </div>
                  <div className="p-6 space-y-5">
                    
                    <div className="flex gap-4 items-start">
                      <div className="relative flex-shrink-0">
                        <label className="block text-xs font-medium text-zinc-400 mb-1.5">Ícone</label>
                        <button 
                          type="button" 
                          onClick={() => setShowIconPicker(!showIconPicker)} 
                          className="w-16 h-16 flex items-center justify-center text-3xl bg-zinc-800 border-2 border-zinc-700 rounded-2xl hover:border-orange-500 transition-colors shadow-sm"
                        >
                          <span>{icon}</span>
                        </button>
                        <p className="text-xs text-zinc-500 mt-1 text-center">Clique</p>
                        
                        {showIconPicker && (
                          <div className="absolute z-30 top-full left-0 mt-2 bg-zinc-800 rounded-2xl shadow-xl border border-zinc-700 p-3 w-72">
                            <p className="text-xs font-medium text-zinc-400 mb-2">Escolha um ícone:</p>
                            <div className="grid grid-cols-6 gap-1.5">
                              {commonIcons.map(emoji => (
                                <button 
                                  key={emoji}
                                  type="button" 
                                  onClick={() => { setIcon(emoji); setShowIconPicker(false); }} 
                                  className={`w-10 h-10 flex items-center justify-center text-xl rounded-xl transition-colors ${icon === emoji ? 'ring-2 ring-orange-500 bg-orange-500/20' : 'hover:bg-zinc-700'}`}
                                >
                                  <span>{emoji}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                          Nome do Serviço *
                        </label>
                        <input 
                          type="text" 
                          required 
                          value={name}
                          onChange={e => setName(e.target.value)}
                          placeholder="Ex: Personal Shopper, Retirada de Mala..." 
                          className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                        />
                        <p className="mt-1 text-xs text-zinc-500">Este é o nome que aparece no catálogo para o cliente.</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                        Descrição <span className="font-normal text-zinc-500">(opcional, mas recomendado)</span>
                      </label>
                      <textarea 
                        rows={3} 
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="Explique o que está incluso, o que o cliente precisa enviar ou informar, e qual o resultado esperado." 
                        className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                      />
                      <p className="mt-1 text-xs text-zinc-500">Uma boa descrição reduz dúvidas e aumenta a confiança do cliente.</p>
                    </div>
                  </div>
                </div>

                {/* 2. Como vai cobrar? */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-zinc-800 flex items-center gap-3">
                    <span className="w-7 h-7 bg-orange-500/20 text-orange-500 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                    <div>
                      <h3 className="font-semibold text-white">Como vai cobrar?</h3>
                      <p className="text-xs text-zinc-400">Escolha como o valor da ordem será calculado</p>
                    </div>
                  </div>
                  <div className="p-6 space-y-5">
                    
                    <div className="space-y-2">
                      {/* Fixed */}
                      <label 
                        className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${priceType === 'fixed' ? 'border-orange-500 bg-orange-500/10' : 'border-zinc-800 hover:border-zinc-700'}`}
                      >
                        <input type="radio" value="fixed" checked={priceType === 'fixed'} onChange={() => handlePriceTypeChange('fixed')} className="sr-only" />
                        <span className="text-2xl mt-0.5 flex-shrink-0">💰</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-white text-sm">Preço Fixo</span>
                            <span className="text-xs px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded-full">Personal Shopper, Consultoria, Retirada</span>
                          </div>
                          <p className="text-xs text-zinc-400 mt-0.5">Valor único por ordem, independente da quantidade ou peso.</p>
                          <p className="text-xs text-orange-400 font-medium mt-1">Ex: Personal Shopper por $50,00</p>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${priceType === 'fixed' ? 'border-orange-500 bg-orange-500' : 'border-zinc-600'}`}>
                          <div className={`w-1.5 h-1.5 bg-white rounded-full transition-opacity ${priceType === 'fixed' ? 'opacity-100' : 'opacity-0'}`}></div>
                        </div>
                      </label>

                      {/* Per Item */}
                      <label 
                        className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${priceType === 'per_item' ? 'border-orange-500 bg-orange-500/10' : 'border-zinc-800 hover:border-zinc-700'}`}
                      >
                        <input type="radio" value="per_item" checked={priceType === 'per_item'} onChange={() => handlePriceTypeChange('per_item')} className="sr-only" />
                        <span className="text-2xl mt-0.5 flex-shrink-0">📦</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-white text-sm">Por Item</span>
                            <span className="text-xs px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded-full">Embalagem por unidade, Etiquetagem</span>
                          </div>
                          <p className="text-xs text-zinc-400 mt-0.5">O total é calculado multiplicando o preço pela quantidade de itens.</p>
                          <p className="text-xs text-orange-400 font-medium mt-1">Ex: $5,00 × 3 itens = $15,00</p>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${priceType === 'per_item' ? 'border-orange-500 bg-orange-500' : 'border-zinc-600'}`}>
                          <div className={`w-1.5 h-1.5 bg-white rounded-full transition-opacity ${priceType === 'per_item' ? 'opacity-100' : 'opacity-0'}`}></div>
                        </div>
                      </label>

                      {/* Per KG */}
                      <label 
                        className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${priceType === 'per_kg' ? 'border-orange-500 bg-orange-500/10' : 'border-zinc-800 hover:border-zinc-700'}`}
                      >
                        <input type="radio" value="per_kg" checked={priceType === 'per_kg'} onChange={() => handlePriceTypeChange('per_kg')} className="sr-only" />
                        <span className="text-2xl mt-0.5 flex-shrink-0">⚖️</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-white text-sm">Por KG</span>
                            <span className="text-xs px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded-full">Armazenagem, Transporte local</span>
                          </div>
                          <p className="text-xs text-zinc-400 mt-0.5">O total é calculado com base no peso total dos itens.</p>
                          <p className="text-xs text-orange-400 font-medium mt-1">Ex: $8,00 × 2,5 kg = $20,00</p>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${priceType === 'per_kg' ? 'border-orange-500 bg-orange-500' : 'border-zinc-600'}`}>
                          <div className={`w-1.5 h-1.5 bg-white rounded-full transition-opacity ${priceType === 'per_kg' ? 'opacity-100' : 'opacity-0'}`}></div>
                        </div>
                      </label>

                      {/* Percentage */}
                      <label 
                        className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${priceType === 'percentage' ? 'border-orange-500 bg-orange-500/10' : 'border-zinc-800 hover:border-zinc-700'}`}
                      >
                        <input type="radio" value="percentage" checked={priceType === 'percentage'} onChange={() => handlePriceTypeChange('percentage')} className="sr-only" />
                        <span className="text-2xl mt-0.5 flex-shrink-0">📊</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-white text-sm">Porcentagem</span>
                            <span className="text-xs px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded-full">Taxa de serviço, Comissão</span>
                          </div>
                          <p className="text-xs text-zinc-400 mt-0.5">Cobra uma % sobre o valor declarado dos itens da ordem.</p>
                          <p className="text-xs text-orange-400 font-medium mt-1">Ex: 15% sobre $200 = $30,00</p>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${priceType === 'percentage' ? 'border-orange-500 bg-orange-500' : 'border-zinc-600'}`}>
                          <div className={`w-1.5 h-1.5 bg-white rounded-full transition-opacity ${priceType === 'percentage' ? 'opacity-100' : 'opacity-0'}`}></div>
                        </div>
                      </label>

                      {/* Quote */}
                      <label 
                        className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${priceType === 'quote' ? 'border-orange-500 bg-orange-500/10' : 'border-zinc-800 hover:border-zinc-700'}`}
                      >
                        <input type="radio" value="quote" checked={priceType === 'quote'} onChange={() => handlePriceTypeChange('quote')} className="sr-only" />
                        <span className="text-2xl mt-0.5 flex-shrink-0">💬</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-white text-sm">Sob Consulta</span>
                            <span className="text-xs px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded-full">Serviços customizados, Fretes especiais</span>
                          </div>
                          <p className="text-xs text-zinc-400 mt-0.5">Você define o valor manualmente em cada ordem, após avaliar o pedido.</p>
                          <p className="text-xs text-orange-400 font-medium mt-1">Ex: Você informa o valor após ver o que precisa ser feito</p>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${priceType === 'quote' ? 'border-orange-500 bg-orange-500' : 'border-zinc-600'}`}>
                          <div className={`w-1.5 h-1.5 bg-white rounded-full transition-opacity ${priceType === 'quote' ? 'opacity-100' : 'opacity-0'}`}></div>
                        </div>
                      </label>
                    </div>

                    {/* Additional Options per priceType */}
                    {priceType === 'quote' && (
                      <div className="flex gap-2.5 p-3.5 bg-blue-500/10 rounded-xl border border-blue-500/20">
                        <span className="text-blue-500 flex-shrink-0 text-base">💬</span>
                        <p className="text-xs text-blue-400 leading-relaxed">
                          <strong>Sob consulta:</strong> você define o valor manualmente em cada ordem após avaliar o pedido. O pagamento fica sempre após a conclusão — cliente solicita, você executa, informa o valor e o cliente paga.
                        </p>
                      </div>
                    )}

                    {priceType !== 'quote' && (
                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                          {priceType === 'percentage' ? 'Porcentagem *' : `Preço Base (${currency || 'USD'}) *`}
                        </label>
                        <div className="relative max-w-xs">
                          {priceType !== 'percentage' && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm font-medium">{currencySymbol}</span>}
                          {priceType === 'percentage' && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm font-medium">%</span>}
                          <input 
                            type="number" 
                            step={priceType === 'percentage' ? '1' : '0.01'} 
                            min="0" 
                            max={priceType === 'percentage' ? 100 : undefined} 
                            value={basePrice}
                            onChange={e => setBasePrice(e.target.value)}
                            placeholder={priceType === 'percentage' ? '15' : '0,00'} 
                            className={`w-full rounded-xl border border-zinc-700 bg-zinc-950 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500 ${priceType === 'percentage' ? 'pl-4 pr-8' : 'pl-8 pr-4'}`}
                          />
                        </div>
                        {priceType === 'per_item' && (
                          <div className="mt-2 text-xs text-blue-400 flex items-start gap-1.5">
                            <span>ℹ️</span><span>Este valor será multiplicado pela quantidade de itens informada na ordem.</span>
                          </div>
                        )}
                        {priceType === 'per_kg' && (
                          <div className="mt-2 text-xs text-blue-400 flex items-start gap-1.5">
                            <span>ℹ️</span><span>Este valor será multiplicado pelo peso total (em kg) dos itens na ordem.</span>
                          </div>
                        )}
                        {priceType === 'percentage' && (
                          <div className="mt-2 text-xs text-blue-400 flex items-start gap-1.5">
                            <span>ℹ️</span><span>A porcentagem é aplicada sobre o valor total declarado dos itens da ordem.</span>
                          </div>
                        )}
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                        Prazo Estimado (dias)
                      </label>
                      <div className="relative max-w-xs">
                        <input 
                          type="number" 
                          min="1" 
                          value={estimatedDays}
                          onChange={e => setEstimatedDays(e.target.value)}
                          placeholder="Ex: 3" 
                          className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500 pr-16"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500">dias</span>
                      </div>
                      <p className="mt-1 text-xs text-zinc-500">Exibido como informação ao cliente. Não bloqueia nenhuma ação.</p>
                    </div>
                  </div>
                </div>

                {/* 3. Quando o cliente paga? */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-zinc-800 flex items-center gap-3">
                    <span className="w-7 h-7 bg-orange-500/20 text-orange-500 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                    <div>
                      <h3 className="font-semibold text-white">Quando o cliente paga?</h3>
                      <p className="text-xs text-zinc-400">Defina o fluxo de pagamento desta ordem</p>
                    </div>
                  </div>
                  <div className="p-6 space-y-3">

                    {priceType === 'quote' && (
                      <div className="flex gap-2.5 p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 mb-1">
                        <span className="text-blue-400 flex-shrink-0">ℹ️</span>
                        <p className="text-xs text-blue-400">Como o preço é sob consulta, o pagamento antecipado não está disponível. Apenas pagamento após conclusão se aplica.</p>
                      </div>
                    )}

                    {requiresApproval && (
                      <div className="flex gap-2.5 p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 mb-1">
                        <span className="flex-shrink-0">✋</span>
                        <p className="text-xs text-amber-400">Aprovação manual ativa: o cliente só paga (ou você só inicia) após sua aprovação. Veja o fluxo completo na lateral →</p>
                      </div>
                    )}

                    {/* Upfront */}
                    <label 
                      className={`flex gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMode === 'upfront' ? 'border-orange-500 bg-orange-500/10' : 'border-zinc-800 hover:border-zinc-700'} ${priceType === 'quote' ? 'opacity-40 pointer-events-none' : ''}`}
                    >
                      <input type="radio" value="upfront" checked={paymentMode === 'upfront'} onChange={() => setPaymentMode('upfront')} className="sr-only" />
                      <div className="flex-shrink-0 mt-0.5">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${paymentMode === 'upfront' ? 'border-orange-500 bg-orange-500' : 'border-zinc-600'}`}>
                          <div className={`w-1.5 h-1.5 bg-white rounded-full transition-opacity ${paymentMode === 'upfront' ? 'opacity-100' : 'opacity-0'}`}></div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-white">⚡ Pagamento antecipado (100% antes)</p>
                        <p className="text-xs text-zinc-400 mt-1">O cliente paga o valor total antes de você iniciar o serviço. Indicado para serviços com custo operacional imediato.</p>
                        <div className="mt-2 flex items-center gap-1 text-xs text-zinc-500">
                          <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded">Cliente paga</span>
                          <span>→</span>
                          <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded">Você executa</span>
                          <span>→</span>
                          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded">Concluído</span>
                        </div>
                      </div>
                    </label>

                    {/* After Completion */}
                    <label 
                      className={`flex gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMode === 'after_completion' ? 'border-orange-500 bg-orange-500/10' : 'border-zinc-800 hover:border-zinc-700'}`}
                    >
                      <input type="radio" value="after_completion" checked={paymentMode === 'after_completion'} onChange={() => setPaymentMode('after_completion')} className="sr-only" />
                      <div className="flex-shrink-0 mt-0.5">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${paymentMode === 'after_completion' ? 'border-orange-500 bg-orange-500' : 'border-zinc-600'}`}>
                          <div className={`w-1.5 h-1.5 bg-white rounded-full transition-opacity ${paymentMode === 'after_completion' ? 'opacity-100' : 'opacity-0'}`}></div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-white">✅ Pagamento após conclusão</p>
                        <p className="text-xs text-zinc-400 mt-1">O cliente paga somente depois que você marcar o serviço como concluído. Indicado quando o valor final só é conhecido após execução.</p>
                        <div className="mt-2 flex items-center gap-1 text-xs text-zinc-500">
                          <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded">Você executa</span>
                          <span>→</span>
                          <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded">Cliente paga</span>
                          <span>→</span>
                          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded">Concluído</span>
                        </div>
                      </div>
                    </label>

                    {/* Pre-deposit */}
                    <label 
                      className={`flex gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMode === 'pre_deposit' ? 'border-orange-500 bg-orange-500/10' : 'border-zinc-800 hover:border-zinc-700'} ${priceType === 'quote' ? 'opacity-40 pointer-events-none' : ''}`}
                    >
                      <input type="radio" value="pre_deposit" checked={paymentMode === 'pre_deposit'} onChange={() => setPaymentMode('pre_deposit')} className="sr-only" />
                      <div className="flex-shrink-0 mt-0.5">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${paymentMode === 'pre_deposit' ? 'border-orange-500 bg-orange-500' : 'border-zinc-600'}`}>
                          <div className={`w-1.5 h-1.5 bg-white rounded-full transition-opacity ${paymentMode === 'pre_deposit' ? 'opacity-100' : 'opacity-0'}`}></div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-white">💵 Pré-depósito + saldo restante</p>
                        <p className="text-xs text-zinc-400 mt-1">Ideal para Personal Shopper: o cliente paga um valor inicial (depósito) antes de você comprar, e o saldo restante após a conclusão.</p>
                        <div className="mt-2 flex items-center gap-1 text-xs text-zinc-500 flex-wrap">
                          <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded">Depósito</span>
                          <span>→</span>
                          <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded">Você compra</span>
                          <span>→</span>
                          <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded">Saldo restante</span>
                          <span>→</span>
                          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded">Concluído</span>
                        </div>

                        {paymentMode === 'pre_deposit' && (
                          <div className="mt-4 pt-4 border-t border-orange-500/20">
                            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                              {`Valor do pré-depósito (${currency || 'USD'})`} <span className="text-red-500">*</span>
                            </label>
                            <div className="relative max-w-xs">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">{currencySymbol}</span>
                              <input 
                                type="number" 
                                min="0.01" 
                                step="0.01" 
                                value={depositAmount}
                                onChange={e => setDepositAmount(e.target.value)}
                                placeholder="0,00" 
                                className="w-full pl-8 rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                              />
                            </div>
                            <p className="mt-1 text-xs text-zinc-500">O cliente paga este valor primeiro. Após a conclusão, paga apenas o que restar.</p>
                          </div>
                        )}
                      </div>
                    </label>

                  </div>
                </div>

                {/* 4. Comportamento */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-zinc-800 flex items-center gap-3">
                    <span className="w-7 h-7 bg-orange-500/20 text-orange-500 rounded-full flex items-center justify-center text-xs font-bold">4</span>
                    <div>
                      <h3 className="font-semibold text-white">Comportamento</h3>
                      <p className="text-xs text-zinc-400">Como o sistema age ao criar e concluir ordens</p>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">

                    {/* Aprovar */}
                    <div className="rounded-xl border-2 border-zinc-800 overflow-hidden">
                      <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-zinc-800/50" onClick={() => setRequiresApproval(!requiresApproval)}>
                        <div className="flex items-center gap-3">
                          <span className="text-xl">✋</span>
                          <div>
                            <p className="text-sm font-semibold text-white">Aprovar ordens antes de iniciar</p>
                            <p className="text-xs text-zinc-400 mt-0.5">O cliente solicita → você aprova ou recusa</p>
                          </div>
                        </div>
                        <button type="button" className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${requiresApproval ? 'bg-orange-500' : 'bg-zinc-700'}`}>
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${requiresApproval ? 'translate-x-6' : 'translate-x-1'}`}></span>
                        </button>
                      </div>
                      <div className="grid grid-cols-2 border-t border-zinc-800 text-xs">
                        <div className={`px-4 py-2.5 flex items-center gap-1.5 transition-colors ${requiresApproval ? 'bg-orange-500/10 text-orange-400 font-medium' : 'text-zinc-500'}`}>
                          <span>✅</span> Ligado: ordem fica como "Pendente" até você aprovar
                        </div>
                        <div className={`px-4 py-2.5 flex items-center gap-1.5 border-l border-zinc-800 transition-colors ${!requiresApproval ? 'bg-blue-500/10 text-blue-400 font-medium' : 'text-zinc-500'}`}>
                          <span>⚡</span> Desligado: aprovada automaticamente
                        </div>
                      </div>
                    </div>

                    {/* Auto Release */}
                    <div className="rounded-xl border-2 border-zinc-800 overflow-hidden">
                      <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-zinc-800/50" onClick={() => setAutoRelease(!autoRelease)}>
                        <div className="flex items-center gap-3">
                          <span className="text-xl">📬</span>
                          <div>
                            <p className="text-sm font-semibold text-white">Entregar produtos automaticamente</p>
                            <p className="text-xs text-zinc-400 mt-0.5">Ao concluir a ordem, produtos vinculados chegam no dock</p>
                          </div>
                        </div>
                        <button type="button" className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${autoRelease ? 'bg-orange-500' : 'bg-zinc-700'}`}>
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${autoRelease ? 'translate-x-6' : 'translate-x-1'}`}></span>
                        </button>
                      </div>
                      <div className="grid grid-cols-2 border-t border-zinc-800 text-xs">
                        <div className={`px-4 py-2.5 flex items-center gap-1.5 transition-colors ${autoRelease ? 'bg-orange-500/10 text-orange-400 font-medium' : 'text-zinc-500'}`}>
                          <span>✅</span> Ligado: produtos aparecem no dock ao concluir
                        </div>
                        <div className={`px-4 py-2.5 flex items-center gap-1.5 border-l border-zinc-800 transition-colors ${!autoRelease ? 'bg-blue-500/10 text-blue-400 font-medium' : 'text-zinc-500'}`}>
                          <span>🔒</span> Desligado: você libera manualmente
                        </div>
                      </div>
                    </div>

                    {/* Charge Freight */}
                    <div className="rounded-xl border-2 border-zinc-800 overflow-hidden">
                      <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-zinc-800/50" onClick={() => setChargeFreightUpfront(!chargeFreightUpfront)}>
                        <div className="flex items-center gap-3">
                          <span className="text-xl">🚚</span>
                          <div>
                            <p className="text-sm font-semibold text-white">Cobrar Frete Antecipado</p>
                            <p className="text-xs text-zinc-400 mt-0.5">Inclui frete na OS; ao pagar, o valor fica pendente na carteira do cliente e é liberado quando a ordem for concluída.</p>
                          </div>
                        </div>
                        <button type="button" className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${chargeFreightUpfront ? 'bg-orange-500' : 'bg-zinc-700'}`}>
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${chargeFreightUpfront ? 'translate-x-6' : 'translate-x-1'}`}></span>
                        </button>
                      </div>
                      <div className="grid grid-cols-2 border-t border-zinc-800 text-xs">
                        <div className={`px-4 py-2.5 flex items-center gap-1.5 transition-colors ${chargeFreightUpfront ? 'bg-orange-500/10 text-orange-400 font-medium' : 'text-zinc-500'}`}>
                          <span>✅</span> Ativo — admin informa o frete em cada OS
                        </div>
                        <div className={`px-4 py-2.5 flex items-center gap-1.5 border-l border-zinc-800 transition-colors ${!chargeFreightUpfront ? 'bg-blue-500/10 text-blue-400 font-medium' : 'text-zinc-500'}`}>
                          <span>🚫</span> Inativo — sem cobrança de frete
                        </div>
                      </div>
                    </div>

                    {/* Requires Product Selection */}
                    <div className="rounded-xl border-2 border-zinc-800 overflow-hidden">
                      <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-zinc-800/50" onClick={() => setRequiresProductSelection(!requiresProductSelection)}>
                        <div className="flex items-center gap-3">
                          <span className="text-xl">📦</span>
                          <div>
                            <p className="text-sm font-semibold text-white">Exige seleção de produto do dock</p>
                            <p className="text-xs text-zinc-400 mt-0.5">O cliente indica qual produto do dock receberá o serviço</p>
                          </div>
                        </div>
                        <button type="button" className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${requiresProductSelection ? 'bg-orange-500' : 'bg-zinc-700'}`}>
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${requiresProductSelection ? 'translate-x-6' : 'translate-x-1'}`}></span>
                        </button>
                      </div>
                      <div className="grid grid-cols-2 border-t border-zinc-800 text-xs">
                        <div className={`px-4 py-2.5 flex items-center gap-1.5 transition-colors ${requiresProductSelection ? 'bg-orange-500/10 text-orange-400 font-medium' : 'text-zinc-500'}`}>
                          <span>✅</span> Ligado: cliente seleciona o produto ao solicitar
                        </div>
                        <div className={`px-4 py-2.5 flex items-center gap-1.5 border-l border-zinc-800 transition-colors ${!requiresProductSelection ? 'bg-blue-500/10 text-blue-400 font-medium' : 'text-zinc-500'}`}>
                          <span>🚫</span> Desligado: sem produto vinculado
                        </div>
                      </div>
                    </div>

                    {/* Allow Quantity */}
                    <div className="rounded-xl border-2 border-zinc-800 overflow-hidden">
                      <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-zinc-800/50" onClick={() => setAllowQuantity(!allowQuantity)}>
                        <div className="flex items-center gap-3">
                          <span className="text-xl">🔢</span>
                          <div>
                            <p className="text-sm font-semibold text-white">Permite especificar quantidade</p>
                            <p className="text-xs text-zinc-400 mt-0.5">O cliente define quantas unidades do serviço deseja (ex: 3 fotos extras)</p>
                          </div>
                        </div>
                        <button type="button" className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${allowQuantity ? 'bg-orange-500' : 'bg-zinc-700'}`}>
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${allowQuantity ? 'translate-x-6' : 'translate-x-1'}`}></span>
                        </button>
                      </div>
                      <div className="grid grid-cols-2 border-t border-zinc-800 text-xs">
                        <div className={`px-4 py-2.5 flex items-center gap-1.5 transition-colors ${allowQuantity ? 'bg-orange-500/10 text-orange-400 font-medium' : 'text-zinc-500'}`}>
                          <span>✅</span> Ligado: cliente informa a quantidade desejada
                        </div>
                        <div className={`px-4 py-2.5 flex items-center gap-1.5 border-l border-zinc-800 transition-colors ${!allowQuantity ? 'bg-blue-500/10 text-blue-400 font-medium' : 'text-zinc-500'}`}>
                          <span>1️⃣</span> Desligado: sempre 1 unidade por pedido
                        </div>
                      </div>
                    </div>

                    {/* Active */}
                    <div className="flex items-center justify-between p-4 rounded-xl border-2 border-zinc-800 cursor-pointer hover:bg-zinc-800/50" onClick={() => setIsActive(!isActive)}>
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{isActive ? '🟢' : '🔴'}</span>
                        <div>
                          <p className="text-sm font-semibold text-white">Serviço visível no catálogo</p>
                          <p className="text-xs text-zinc-400 mt-0.5">{isActive ? 'Clientes podem ver e solicitar este serviço' : 'Serviço oculto — nenhum cliente pode solicitá-lo'}</p>
                        </div>
                      </div>
                      <button type="button" className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${isActive ? 'bg-emerald-500' : 'bg-zinc-700'}`}>
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'}`}></span>
                      </button>
                    </div>

                  </div>
                </div>

                {/* 5. Ação ao concluir */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-zinc-800 flex items-center gap-3">
                    <span className="w-7 h-7 bg-orange-500/20 text-orange-500 rounded-full flex items-center justify-center text-xs font-bold">5</span>
                    <div>
                      <h3 className="font-semibold text-white">Ação ao concluir</h3>
                      <p className="text-xs text-zinc-400">O que o sistema faz automaticamente quando a OS é marcada como concluída</p>
                    </div>
                  </div>
                  <div className="p-6 space-y-3">
                    
                    <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${serviceAction === 'none' ? 'border-orange-500 bg-orange-500/10' : 'border-zinc-800 hover:border-zinc-700'}`}>
                      <input type="radio" value="none" checked={serviceAction === 'none'} onChange={() => setServiceAction('none')} className="sr-only" />
                      <span className="text-2xl mt-0.5 flex-shrink-0">⚪</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-white text-sm">Nenhuma ação</span>
                          <span className="text-xs px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded-full">Serviços simples</span>
                        </div>
                        <p className="text-xs text-zinc-400 mt-0.5">Apenas marca a OS como concluída. Qualquer ação posterior é manual.</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${serviceAction === 'none' ? 'border-orange-500 bg-orange-500' : 'border-zinc-600'}`}>
                        <div className={`w-1.5 h-1.5 bg-white rounded-full transition-opacity ${serviceAction === 'none' ? 'opacity-100' : 'opacity-0'}`}></div>
                      </div>
                    </label>

                    <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${serviceAction === 'extend_storage' ? 'border-orange-500 bg-orange-500/10' : 'border-zinc-800 hover:border-zinc-700'}`}>
                      <input type="radio" value="extend_storage" checked={serviceAction === 'extend_storage'} onChange={() => setServiceAction('extend_storage')} className="sr-only" />
                      <span className="text-2xl mt-0.5 flex-shrink-0">📅</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-white text-sm">Estender armazenamento</span>
                          <span className="text-xs px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded-full">Ex: +30 dias de armazenagem</span>
                        </div>
                        <p className="text-xs text-zinc-400 mt-0.5">Estende automaticamente a data de vencimento do produto vinculado pelo número de dias configurado.</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${serviceAction === 'extend_storage' ? 'border-orange-500 bg-orange-500' : 'border-zinc-600'}`}>
                        <div className={`w-1.5 h-1.5 bg-white rounded-full transition-opacity ${serviceAction === 'extend_storage' ? 'opacity-100' : 'opacity-0'}`}></div>
                      </div>
                    </label>

                    <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${serviceAction === 'upload_output' ? 'border-orange-500 bg-orange-500/10' : 'border-zinc-800 hover:border-zinc-700'}`}>
                      <input type="radio" value="upload_output" checked={serviceAction === 'upload_output'} onChange={() => setServiceAction('upload_output')} className="sr-only" />
                      <span className="text-2xl mt-0.5 flex-shrink-0">📎</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-white text-sm">Entrega de arquivos</span>
                          <span className="text-xs px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded-full">Ex: fotos extras, laudos</span>
                        </div>
                        <p className="text-xs text-zinc-400 mt-0.5">O admin envia fotos ou documentos como resultado do serviço. O cliente visualiza na OS.</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${serviceAction === 'upload_output' ? 'border-orange-500 bg-orange-500' : 'border-zinc-600'}`}>
                        <div className={`w-1.5 h-1.5 bg-white rounded-full transition-opacity ${serviceAction === 'upload_output' ? 'opacity-100' : 'opacity-0'}`}></div>
                      </div>
                    </label>

                    {serviceAction === 'extend_storage' && (
                      <div className="pt-1">
                        <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                          Dias a estender <span className="text-red-500">*</span>
                        </label>
                        <div className="relative max-w-xs">
                          <input 
                            type="number" 
                            min="1" 
                            max="3650" 
                            value={actionDays}
                            onChange={e => setActionDays(e.target.value)}
                            placeholder="Ex: 30" 
                            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500 pr-16"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500">dias</span>
                        </div>
                        <p className="mt-1 text-xs text-zinc-500">Número de dias adicionado à data de vencimento atual do armazenamento do produto.</p>
                      </div>
                    )}

                    {serviceAction === 'upload_output' && (
                      <div className="flex gap-2.5 p-3.5 bg-blue-500/10 rounded-xl border border-blue-500/20">
                        <span className="text-blue-500 flex-shrink-0 text-base">📎</span>
                        <p className="text-xs text-blue-400 leading-relaxed">
                          Ao concluir a OS, o admin poderá enviar arquivos (fotos, PDFs, documentos) diretamente na tela da OS. O cliente poderá visualizá-los no portal.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4">
                  <Link 
                    href="/admin/services" 
                    className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-2.5 border border-zinc-700 text-zinc-300 rounded-xl hover:bg-zinc-800 text-sm font-medium transition-colors"
                  >
                    Cancelar
                  </Link>
                  <button 
                    type="submit" 
                    disabled={isPending}
                    className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all disabled:opacity-50"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isPending ? "Criando..." : "Criar Serviço"}
                  </button>
                </div>

              </div>

              {/* Sidebar Preview Column */}
              <div className="xl:col-span-1">
                <div className="sticky top-6 space-y-4">
                  
                  {/* Preview Card */}
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
                    <div className="px-5 py-3 bg-zinc-800/50 border-b border-zinc-800">
                      <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">👁 Prévia — como o cliente vê</p>
                    </div>
                    <div className="p-5">
                      <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700">
                        <div className="flex items-start gap-3">
                          <span className="text-3xl">{icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-white text-sm truncate">{name || 'Nome do serviço'}</p>
                            <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{description || 'Descrição do serviço...'}</p>
                          </div>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded-lg text-xs font-bold">{priceLabel}</span>
                          {estimatedDays && (
                            <span className="px-2 py-1 bg-zinc-700 text-zinc-300 rounded-lg text-xs">{estimatedDays} dias</span>
                          )}
                          {requiresApproval && (
                            <span className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded-lg text-xs">✋ Aprovação</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Summary Card */}
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-sm p-5 space-y-3">
                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">📋 Resumo da configuração</p>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between gap-2">
                        <span className="text-zinc-500">Cobrança</span>
                        <span className="font-medium text-white text-right">
                          {{fixed:'Preço fixo', per_item:'Por item', per_kg:'Por kg', percentage:'Porcentagem', quote:'Sob consulta'}[priceType]}
                        </span>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span className="text-zinc-500">Pagamento</span>
                        <span className="font-medium text-white text-right">
                          {{upfront:'Antes do serviço', after_completion:'Após conclusão', pre_deposit:'Pré-depósito + saldo'}[paymentMode]}
                        </span>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span className="text-zinc-500">Aprovação</span>
                        <span className={`font-medium ${requiresApproval ? 'text-amber-500' : 'text-emerald-500'}`}>
                          {requiresApproval ? 'Manual' : 'Automática'}
                        </span>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span className="text-zinc-500">Entrega de produto</span>
                        <span className={`font-medium ${autoRelease ? 'text-emerald-500' : 'text-blue-500'}`}>
                          {autoRelease ? 'Automática' : 'Manual'}
                        </span>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span className="text-zinc-500">Ao concluir</span>
                        <span className="font-medium text-white text-right">
                          {{none:'Nenhuma ação', extend_storage:'Estender armazenamento', upload_output:'Envio de arquivos'}[serviceAction]}
                        </span>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span className="text-zinc-500">Status</span>
                        <span className={`font-medium ${isActive ? 'text-emerald-500' : 'text-red-500'}`}>
                          {isActive ? 'Visível para os clientes' : 'Oculto dos clientes'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Flow Diagram Card */}
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-sm p-5">
                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-4">🔄 Fluxo completo desta ordem</p>
                    <div className="relative">
                      <div className="absolute left-3 top-0 bottom-0 w-px bg-zinc-800"></div>
                      <div className="space-y-0">
                        
                        {/* 1. Request */}
                        <div className="flex items-start gap-3 pb-3 relative">
                          <div className="w-6 h-6 rounded-full bg-zinc-800 border-2 border-zinc-600 flex items-center justify-center text-xs flex-shrink-0 z-10">👤</div>
                          <div className="pt-0.5">
                            <p className="text-xs font-semibold text-zinc-300">Cliente solicita</p>
                          </div>
                        </div>

                        {/* 2. Approval */}
                        {requiresApproval && (
                          <div className="flex items-start gap-3 pb-3 relative">
                            <div className="w-6 h-6 rounded-full bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center text-xs flex-shrink-0 z-10">✋</div>
                            <div className="pt-0.5">
                              <p className="text-xs font-semibold text-amber-400">Você aprova (ou recusa)</p>
                              <p className="text-[10px] text-zinc-500 mt-0.5">Ordem fica "Pendente" até sua ação</p>
                            </div>
                          </div>
                        )}

                        {/* 3. Upfront or Deposit Payment */}
                        {paymentMode === 'upfront' && (
                          <div className="flex items-start gap-3 pb-3 relative">
                            <div className="w-6 h-6 rounded-full bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center text-xs flex-shrink-0 z-10">💳</div>
                            <div className="pt-0.5">
                              <p className="text-xs font-semibold text-amber-400">Cliente paga 100%</p>
                              <p className="text-[10px] text-zinc-500 mt-0.5">Valor total antes de iniciar</p>
                            </div>
                          </div>
                        )}
                        {paymentMode === 'pre_deposit' && (
                          <div className="flex items-start gap-3 pb-3 relative">
                            <div className="w-6 h-6 rounded-full bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center text-xs flex-shrink-0 z-10">💵</div>
                            <div className="pt-0.5">
                              <p className="text-xs font-semibold text-amber-400">Cliente paga depósito inicial</p>
                              <p className="text-[10px] text-zinc-500 mt-0.5">{depositAmount ? `${currencySymbol}${parseFloat(depositAmount).toFixed(2).replace('.',',')}` : 'Valor configurado acima'}</p>
                            </div>
                          </div>
                        )}

                        {/* 4. Execution */}
                        <div className="flex items-start gap-3 pb-3 relative">
                          <div className="w-6 h-6 rounded-full bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center text-xs flex-shrink-0 z-10">⚙️</div>
                          <div className="pt-0.5">
                            <p className="text-xs font-semibold text-blue-400">Você executa o serviço</p>
                            {estimatedDays && (
                              <p className="text-[10px] text-zinc-500 mt-0.5">Prazo estimado: {estimatedDays} dias</p>
                            )}
                          </div>
                        </div>

                        {/* 5. After Completion or Balance Payment */}
                        {paymentMode === 'after_completion' && (
                          <div className="flex items-start gap-3 pb-3 relative">
                            <div className="w-6 h-6 rounded-full bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center text-xs flex-shrink-0 z-10">💳</div>
                            <div className="pt-0.5">
                              <p className="text-xs font-semibold text-amber-400">Cliente paga 100%</p>
                              <p className="text-[10px] text-zinc-500 mt-0.5">{priceType === 'quote' ? 'Você define o valor agora' : 'Valor conforme configurado'}</p>
                            </div>
                          </div>
                        )}
                        {paymentMode === 'pre_deposit' && (
                          <div className="flex items-start gap-3 pb-3 relative">
                            <div className="w-6 h-6 rounded-full bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center text-xs flex-shrink-0 z-10">💵</div>
                            <div className="pt-0.5">
                              <p className="text-xs font-semibold text-amber-400">Cliente paga saldo restante</p>
                              <p className="text-[10px] text-zinc-500 mt-0.5">Diferença entre o total e o depósito</p>
                            </div>
                          </div>
                        )}

                        {/* 6. Product release action */}
                        {autoRelease && (
                          <div className="flex items-start gap-3 pb-3 relative">
                            <div className="w-6 h-6 rounded-full bg-purple-500/20 border-2 border-purple-500 flex items-center justify-center text-xs flex-shrink-0 z-10">📦</div>
                            <div className="pt-0.5">
                              <p className="text-xs font-semibold text-purple-400">Produtos chegam no dock</p>
                              <p className="text-[10px] text-zinc-500 mt-0.5">Liberação automática ao concluir</p>
                            </div>
                          </div>
                        )}

                        {/* 7. Conclusion */}
                        <div className="flex items-start gap-3 relative">
                          <div className="w-6 h-6 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-xs flex-shrink-0 z-10">✅</div>
                          <div className="pt-0.5">
                            <p className="text-xs font-bold text-emerald-500">Ordem concluída</p>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
