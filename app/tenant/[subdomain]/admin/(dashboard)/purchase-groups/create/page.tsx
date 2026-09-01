"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft,
  Image as ImageIcon,
  Settings,
  DollarSign,
  CheckCircle2,
  Package,
  Calendar,
  Lock,
  Wallet,
  Smartphone
} from "lucide-react";

type Step = 1 | 2 | 3 | 4;

export default function CreatePurchaseGroupPage() {
  const [currentStep, setCurrentStep] = useState<Step>(1);

  // Form State for Summary
  const [isActive, setIsActive] = useState(false);
  const [stockControl, setStockControl] = useState(false);
  const [feeType, setFeeType] = useState("percentage");
  const [maxPerCustomer, setMaxPerCustomer] = useState("");
  const [requireTerms, setRequireTerms] = useState(false);
  const [requireWallet, setRequireWallet] = useState(false);

  // Automation State
  const [automations, setAutomations] = useState([
    { 
      delay_hours: 1, 
      message: "Olá {nome}! 👋\n\nVocê deixou itens no grupo *{nome_grupo}* sem finalizar a compra.\n\nSeus produtos ainda estão reservados. Acesse o link e conclua seu pedido:\n{link}" 
    },
    { 
      delay_hours: 24, 
      message: "Oi {nome}, último aviso! ⏰\n\nSeu carrinho no grupo *{nome_grupo}* ainda está aguardando.\n\nNão perca a chance de garantir seus produtos:\n{link}" 
    }
  ]);

  const addAutomation = () => {
    setAutomations([...automations, { delay_hours: 48, message: "" }]);
  };

  const removeAutomation = (index: number) => {
    setAutomations(automations.filter((_, i) => i !== index));
  };

  const updateAutomation = (index: number, field: string, value: any) => {
    const newAutomations = [...automations];
    newAutomations[index] = { ...newAutomations[index], [field]: value };
    setAutomations(newAutomations);
  };

  const steps = [
    { id: 1, title: "Essenciais", desc: "Nome, imagem e contexto", icon: ImageIcon },
    { id: 2, title: "Operação", desc: "Regras, agenda e liberação", icon: Settings },
    { id: 3, title: "Financeiro", desc: "Taxas, faixas e imposto", icon: DollarSign },
    { id: 4, title: "Finalização", desc: "Termos e automação WhatsApp", icon: CheckCircle2 }
  ];

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep((prev) => (prev + 1) as Step);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep((prev) => (prev - 1) as Step);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-zinc-950 -m-8 flex flex-col relative overflow-x-hidden">
      
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 shadow-lg shadow-orange-500/20 shrink-0">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-8 w-64 h-64 rounded-full bg-white/5 pointer-events-none"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-sm mb-3" aria-label="Breadcrumb">
            <Link href="/admin/purchase-groups" className="text-white/70 hover:text-white transition-colors truncate max-w-[45vw] sm:max-w-[220px]">
              Grupos de Compras
            </Link>
            <span className="text-white/50 shrink-0">/</span>
            <span className="text-white font-medium truncate max-w-[45vw] sm:max-w-[220px]">
              Novo Grupo
            </span>
          </nav>
          
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <Link 
                href="/admin/purchase-groups" 
                className="w-14 h-14 rounded-2xl bg-white/20 hover:bg-white/30 flex items-center justify-center shadow-lg shrink-0 transition"
              >
                <ArrowLeft className="w-6 h-6 text-white" />
              </Link>
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-white truncate">Novo Grupo de Compras</h1>
                <p className="mt-0.5 text-sm text-orange-100 truncate">Siga os passos abaixo para configurar o grupo</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8 flex-1 w-full pb-12">
        <div className="max-w-7xl mx-auto">

          <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
            
            {/* Main Form Area */}
            <div className="space-y-6 lg:col-span-2">
              
              {/* Introduction Banner */}
              <section className="overflow-hidden rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 via-zinc-900 to-amber-500/10 shadow-lg">
                <div className="grid gap-6 p-6 lg:grid-cols-3 lg:p-8">
                  <div className="lg:col-span-2">
                    <span className="inline-flex items-center rounded-full bg-orange-500/10 border border-orange-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-orange-400">
                      Criação Guiada
                    </span>
                    <h3 className="mt-3 text-2xl font-bold text-white">Monte o grupo, valide as regras e siga direto para os produtos.</h3>
                    <ul className="mt-4 space-y-2 text-sm text-zinc-300">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                        <span>Defina um nome forte e fácil de identificar.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                        <span>Escolha a taxa de serviço antes de publicar.</span>
                      </li>
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-5 text-white shadow-sm flex flex-col justify-center">
                    <p className="text-xs font-semibold uppercase tracking-wider text-orange-400">Próximo passo</p>
                    <p className="mt-3 text-sm leading-6 text-zinc-400">Depois de salvar, você já cai na tela de produtos para começar o cadastro em sequência.</p>
                  </div>
                </div>
              </section>

              {/* Wizard Nav */}
              <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 sm:p-5 shadow-lg">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between mb-5">
                  <div>
                    <p className="text-sm font-semibold text-white">Wizard de criação</p>
                    <p className="text-sm text-zinc-400">Dividimos o formulário em etapas para deixar as decisões mais objetivas.</p>
                  </div>
                  <p className="text-xs font-bold uppercase tracking-wider text-orange-500">Etapa {currentStep} de 4: {steps[currentStep - 1].title}</p>
                </div>

                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                  {steps.map((step) => {
                    const isCurrent = currentStep === step.id;
                    const isPast = currentStep > step.id;
                    const Icon = step.icon;
                    
                    return (
                      <button 
                        key={step.id}
                        type="button" 
                        onClick={() => setCurrentStep(step.id as Step)}
                        className={`flex shrink-0 w-64 items-center gap-3 rounded-2xl border p-3 text-left transition ${
                          isCurrent 
                            ? 'border-orange-500 bg-orange-500/10' 
                            : isPast 
                              ? 'border-zinc-700 bg-zinc-800 hover:border-orange-500/50' 
                              : 'border-zinc-800 bg-zinc-950 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold shadow-sm ${
                          isCurrent || isPast ? 'bg-orange-500 text-white' : 'bg-zinc-800 text-zinc-500'
                        }`}>
                          {step.id}
                        </span>
                        <span className="min-w-0">
                          <span className={`block text-sm font-bold ${isCurrent || isPast ? 'text-white' : 'text-zinc-500'}`}>
                            {step.title}
                          </span>
                          <span className="mt-0.5 block text-xs leading-tight text-zinc-400 truncate">
                            {step.desc}
                          </span>
                        </span>
                      </button>
                    )
                  })}
                </div>
              </section>

              {/* Form Areas */}
              <form className="space-y-6">
                
                {/* STEP 1: Identity */}
                {currentStep === 1 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 sm:p-6 shadow-lg">
                      <div className="mb-6 flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-zinc-800 border border-zinc-700 shadow-md">
                          <ImageIcon className="h-5 w-5 text-zinc-300" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-base font-semibold text-white">Informações do Grupo</h3>
                          <p className="mt-1 text-sm text-zinc-400">A capa e o título já deixam o grupo pronto para divulgação.</p>
                        </div>
                      </div>

                      <div className="grid gap-6 lg:grid-cols-5">
                        <div className="flex flex-col lg:col-span-2">
                          <label className="mb-2 block text-sm font-medium text-zinc-300">
                            Imagem de Capa
                          </label>
                          <label className="group flex h-[320px] w-full flex-1 cursor-pointer flex-col overflow-hidden rounded-2xl border-2 border-dashed border-zinc-700 bg-zinc-950 transition hover:border-orange-500 lg:h-full lg:min-h-[320px]">
                            <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-900 text-zinc-500 shadow-sm border border-zinc-800 group-hover:text-orange-500 transition">
                                <ImageIcon className="h-8 w-8" />
                              </div>
                              <p className="mt-4 text-sm font-semibold text-white">Clique para upload</p>
                              <p className="mt-2 text-xs leading-5 text-zinc-500">JPG, PNG ou GIF. Máximo 5MB.</p>
                            </div>
                          </label>
                        </div>

                        <div className="space-y-4 lg:col-span-3">
                          <div>
                            <label className="mb-2 block text-sm font-medium text-zinc-300">
                              Nome do Grupo <span className="text-red-500">*</span>
                            </label>
                            <input type="text" required className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white placeholder-zinc-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition" placeholder="Ex: Michael Kors - Orlando Outlet" />
                          </div>

                          <div className="grid gap-4 md:grid-cols-2">
                            <div>
                              <label className="mb-2 block text-sm font-medium text-zinc-300">Nome da Loja</label>
                              <input type="text" className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white placeholder-zinc-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition" placeholder="Ex: Michael Kors" />
                            </div>
                            <div>
                              <label className="mb-2 block text-sm font-medium text-zinc-300">Filial</label>
                              <input type="text" className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white placeholder-zinc-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition" placeholder="Ex: Orlando Premium Outlets" />
                            </div>
                          </div>

                          <div>
                            <label className="mb-2 block text-sm font-medium text-zinc-300">Descrição</label>
                            <textarea rows={4} className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white placeholder-zinc-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition" placeholder="Descreva o grupo de compras..."></textarea>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                )}

                {/* STEP 2: Operation */}
                {currentStep === 2 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 sm:p-6 shadow-lg">
                      <div className="mb-6 flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-zinc-800 border border-zinc-700 shadow-md">
                          <Settings className="h-5 w-5 text-zinc-300" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-base font-semibold text-white">Configurações</h3>
                          <p className="mt-1 text-sm text-zinc-400">Concentre aqui as regras que impactam carrinho, estoque e janelas de venda.</p>
                        </div>
                      </div>

                      <div className="mb-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 sm:p-5">
                        <label className="block text-sm font-bold text-white mb-1">
                          Ordenação padrão da vitrine
                        </label>
                        <p className="text-sm text-zinc-400 mb-4">
                          Como os produtos aparecem para o cliente. Produtos sem estoque vão para o fim.
                        </p>
                        <select className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition appearance-none">
                          <option value="best_sellers">Mais vendidos</option>
                          <option value="manual">Relevância</option>
                          <option value="newest">Novidades</option>
                          <option value="price_asc">Menor preço</option>
                          <option value="price_desc">Maior preço</option>
                        </select>
                      </div>

                      <div className="grid gap-4 lg:grid-cols-3 mb-6">
                        <label className={`cursor-pointer rounded-2xl border p-4 transition ${stockControl ? 'border-orange-500 bg-orange-500/5' : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'}`}>
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-bold text-white">Controle de Estoque</p>
                              <p className="mt-1 text-xs text-zinc-400 leading-relaxed">Quando ativado, os produtos terão quantidade em estoque controlada.</p>
                            </div>
                            <input type="checkbox" checked={stockControl} onChange={(e) => setStockControl(e.target.checked)} className="mt-0.5 h-5 w-5 rounded border-zinc-700 bg-zinc-900 text-orange-500 focus:ring-orange-500" />
                          </div>
                        </label>

                        <label className={`cursor-pointer rounded-2xl border p-4 transition ${isActive ? 'border-orange-500 bg-orange-500/5' : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'}`}>
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-bold text-white">Grupo Ativo</p>
                              <p className="mt-1 text-xs text-zinc-400 leading-relaxed">Marque para liberar o grupo. Se houver agenda, ele abre no horário.</p>
                            </div>
                            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="mt-0.5 h-5 w-5 rounded border-zinc-700 bg-zinc-900 text-orange-500 focus:ring-orange-500" />
                          </div>
                        </label>

                        <label className={`cursor-pointer rounded-2xl border p-4 transition ${requireWallet ? 'border-orange-500 bg-orange-500/5' : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'}`}>
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-bold text-white">Exigir carteira</p>
                              <p className="mt-1 text-xs text-zinc-400 leading-relaxed">Apenas clientes com saldo positivo na carteira poderão comprar.</p>
                            </div>
                            <input type="checkbox" checked={requireWallet} onChange={(e) => setRequireWallet(e.target.checked)} className="mt-0.5 h-5 w-5 rounded border-zinc-700 bg-zinc-900 text-orange-500 focus:ring-orange-500" />
                          </div>
                        </label>
                      </div>

                      <div className="grid gap-4 lg:grid-cols-3">
                        <div>
                          <label className="mb-2 block text-sm font-medium text-zinc-300">Máximo por Cliente</label>
                          <input type="number" value={maxPerCustomer} onChange={(e) => setMaxPerCustomer(e.target.value)} className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white placeholder-zinc-600 focus:border-orange-500 outline-none transition" placeholder="Sem limite" />
                          <p className="mt-2 text-xs text-zinc-500">Limite padrão por produto.</p>
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-medium text-zinc-300">Início das Vendas</label>
                          <input type="datetime-local" className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white placeholder-zinc-600 focus:border-orange-500 outline-none transition" />
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-medium text-zinc-300">Fim das Vendas</label>
                          <input type="datetime-local" className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white placeholder-zinc-600 focus:border-orange-500 outline-none transition" />
                        </div>
                      </div>

                    </section>
                  </div>
                )}

                {/* STEP 3: Financial */}
                {currentStep === 3 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 sm:p-6 shadow-lg">
                      <div className="mb-6 flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-zinc-800 border border-zinc-700 shadow-md">
                          <DollarSign className="h-5 w-5 text-zinc-300" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-base font-semibold text-white">Taxa de Serviço</h3>
                          <p className="mt-1 text-sm text-zinc-400">Escolha a lógica de cobrança e já deixe imposto e faixas prontos.</p>
                        </div>
                      </div>

                      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4 mb-6">
                        {['percentage', 'fixed', 'fixed_per_item', 'tiered'].map((type) => {
                          const labels: Record<string, { t: string, d: string }> = {
                            percentage: { t: "Porcentagem", d: "Ex: 10% do valor" },
                            fixed: { t: "Valor Fixo", d: "Ex: $5 por pedido" },
                            fixed_per_item: { t: "Fixo por Item", d: "Ex: $2 por item" },
                            tiered: { t: "Por Faixas", d: "Varia por faixa" }
                          };
                          const isSelected = feeType === type;

                          return (
                            <label key={type} className={`cursor-pointer rounded-2xl border p-4 transition ${isSelected ? 'border-orange-500 bg-orange-500/10' : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'}`}>
                              <input type="radio" name="fee_type" value={type} checked={isSelected} onChange={() => setFeeType(type)} className="sr-only" />
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p className="text-sm font-bold text-white">{labels[type].t}</p>
                                  <p className="mt-1 text-xs text-zinc-400">{labels[type].d}</p>
                                </div>
                                <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${isSelected ? 'border-orange-500' : 'border-zinc-600'}`}>
                                  {isSelected && <div className="h-2.5 w-2.5 rounded-full bg-orange-500"></div>}
                                </div>
                              </div>
                            </label>
                          )
                        })}
                      </div>

                      {feeType !== 'tiered' && (
                        <div className="grid gap-4 lg:grid-cols-3 mb-6">
                          <div>
                            <label className="mb-2 block text-sm font-medium text-zinc-300">
                              Valor da Taxa
                            </label>
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                                {feeType === 'percentage' ? '%' : '$'}
                              </span>
                              <input type="number" defaultValue="10" className="w-full rounded-xl border border-zinc-700 bg-zinc-950 py-3 pl-10 pr-4 text-white placeholder-zinc-600 focus:border-orange-500 outline-none transition" />
                            </div>
                          </div>
                          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-400 lg:col-span-2 flex items-center">
                            Defina a taxa principal que será aplicada nos pedidos deste grupo.
                          </div>
                        </div>
                      )}

                      <div className="grid gap-4 lg:grid-cols-3 pt-6 border-t border-zinc-800">
                        <div>
                          <label className="mb-2 block text-sm font-medium text-zinc-300">Taxa de Imposto (%)</label>
                          <div className="relative">
                            <input type="number" defaultValue="0.00" className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 pr-10 text-white placeholder-zinc-600 focus:border-orange-500 outline-none transition" />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500">%</span>
                          </div>
                        </div>
                        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-400 lg:col-span-2 flex items-center">
                          Valor padrão herdado da configuração geral da loja.
                        </div>
                      </div>

                    </section>
                  </div>
                )}

                {/* STEP 4: Finalization */}
                {currentStep === 4 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    
                    {/* Termos de Uso */}
                    <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 sm:p-6 shadow-lg">
                      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-start gap-4">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-zinc-800 border border-zinc-700 shadow-md">
                            <CheckCircle2 className="h-5 w-5 text-zinc-300" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-base font-semibold text-white">Termos de Uso do Grupo</h3>
                            <p className="mt-1 text-sm text-zinc-400">Configure termos que os usuários devem aceitar para participar.</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button type="button" className="inline-flex items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-500 transition hover:bg-orange-500/20">
                            📄 Usar Modelo Padrão
                          </button>
                          <button type="button" className="inline-flex items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-700">
                            💾 Salvar como Meu Padrão
                          </button>
                        </div>
                      </div>

                      <label className={`cursor-pointer block rounded-2xl border p-4 transition mb-4 ${requireTerms ? 'border-orange-500 bg-orange-500/5' : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'}`}>
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-sm font-bold text-white">Exigir Aceite de Termos</p>
                            <p className="mt-1 text-sm text-zinc-400 leading-relaxed">Usuários precisarão aceitar os termos antes de ver os produtos e fazer compras.</p>
                          </div>
                          <input type="checkbox" checked={requireTerms} onChange={(e) => setRequireTerms(e.target.checked)} className="mt-0.5 h-5 w-5 rounded border-zinc-700 bg-zinc-900 text-orange-500 focus:ring-orange-500" />
                        </div>
                      </label>

                      {requireTerms && (
                        <div className="space-y-4">
                          <div>
                            <label className="mb-2 block text-sm font-medium text-zinc-300">Texto dos Termos de Uso (Markdown)</label>
                            <textarea rows={14} className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 font-mono text-sm text-zinc-300 placeholder-zinc-600 focus:border-orange-500 outline-none transition" placeholder="# Termos do Grupo..."></textarea>
                          </div>
                          <div className="rounded-2xl border border-zinc-700 bg-zinc-800/50 p-4">
                            <p className="text-xs font-semibold text-zinc-300">💡 Dicas de Formatação (Markdown):</p>
                            <div className="mt-3 grid gap-2 text-xs text-zinc-400 sm:grid-cols-2">
                              <div><code className="rounded bg-zinc-900 px-1.5 py-0.5 text-orange-400"># Título</code> - Título grande</div>
                              <div><code className="rounded bg-zinc-900 px-1.5 py-0.5 text-orange-400">## Subtítulo</code> - Subtítulo</div>
                              <div><code className="rounded bg-zinc-900 px-1.5 py-0.5 text-orange-400">**texto**</code> - Negrito</div>
                              <div><code className="rounded bg-zinc-900 px-1.5 py-0.5 text-orange-400">- item</code> - Lista</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </section>

                    {/* Aviso no Checkout */}
                    <section className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 sm:p-6 shadow-lg">
                      <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500/20 border border-amber-500/30 shadow-md">
                          <CheckCircle2 className="h-5 w-5 text-amber-500" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-base font-semibold text-white">Aviso no checkout</h3>
                          <p className="mt-1 text-sm text-zinc-400">Mensagem curta e destacada que aparece no checkout deste grupo — ótima para deixar claro algo que os clientes costumam não ler nos termos (ex.: que o frete não está incluso).</p>
                          <textarea rows={2} maxLength={500} className="mt-3 w-full rounded-xl border border-amber-500/30 bg-zinc-950 px-4 py-3 text-sm text-white placeholder-zinc-600 focus:border-amber-500 outline-none transition" placeholder="Ex.: Atenção: o frete NÃO está incluso no valor dos produtos."></textarea>
                          <label className="mt-3 flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
                            <input type="checkbox" className="rounded border-zinc-700 bg-zinc-900 text-amber-500 focus:ring-amber-500" />
                            Salvar como aviso padrão (aparece em todos os grupos sem aviso próprio)
                          </label>
                        </div>
                      </div>
                    </section>

                    {/* WhatsApp */}
                    <section className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 sm:p-6 shadow-lg">
                      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-start gap-4">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/20 border border-emerald-500/30 shadow-md">
                            <Smartphone className="h-5 w-5 text-emerald-500" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-base font-semibold text-emerald-400">🟢 WhatsApp — QR Code e Divulgação</h3>
                            <p className="mt-1 text-sm text-zinc-400">Conecte uma conta via QR Code, escolha o grupo de destino e use o WhatsApp para divulgar os produtos deste grupo de compras.</p>
                          </div>
                        </div>
                        <Link href="/admin/settings/whatsapp" className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-500 transition shadow-md">
                          Abrir painel do WhatsApp
                        </Link>
                      </div>

                      <div className="grid gap-4 xl:grid-cols-2">
                        <div className="rounded-2xl border border-emerald-500/20 bg-zinc-900 p-4 sm:p-5">
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-zinc-300 mb-2">Conexão do WhatsApp</label>
                              <select className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white focus:border-emerald-500 outline-none transition appearance-none">
                                <option value="">Selecione a conexão</option>
                              </select>
                              <p className="mt-2 text-xs text-zinc-500">O mesmo grupo do WhatsApp pode ser usado em vários grupos de compras.</p>
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-zinc-300 mb-2">Grupos já vinculados</label>
                              <select className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white focus:border-emerald-500 outline-none transition appearance-none">
                                <option value="">Selecione um grupo já vinculado</option>
                              </select>
                              <p className="mt-2 text-xs leading-5 text-zinc-500">Nenhum grupo de WhatsApp foi vinculado ainda.</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-zinc-300 mb-2">Nome do grupo</label>
                              <input type="text" placeholder="Ex: Grupo Ao Vivo Nike" className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white focus:border-emerald-500 outline-none transition" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-zinc-300 mb-2">ID do grupo</label>
                              <input type="text" placeholder="Ex: 120363404694233820@g.us" className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white focus:border-emerald-500 outline-none transition" />
                            </div>
                          </div>

                          <label className="mt-5 flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                            <input type="checkbox" className="mt-1 h-5 w-5 rounded border-zinc-700 bg-zinc-900 text-emerald-500 focus:ring-emerald-500" />
                            <div>
                              <p className="text-sm font-semibold text-white">Enviar fotos dos produtos ao abrir o grupo</p>
                              <p className="mt-1 text-xs leading-5 text-zinc-400">Quando ativo, o sistema dispara automaticamente a divulgação dos produtos disponíveis quando o grupo abrir.</p>
                            </div>
                          </label>
                        </div>

                        <div className="rounded-2xl border border-emerald-500/20 bg-zinc-900 p-4 sm:p-5 space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">Mensagem de abertura</label>
                            <textarea rows={3} className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white focus:border-emerald-500 outline-none transition" defaultValue={`🚀 O grupo {{group_name}} foi aberto.\n\nAcompanhe as ofertas aqui: {{group_link}}\nProdutos disponíveis agora: {{available_products_count}} de {{products_count}}.`}></textarea>
                            <p className="mt-2 text-xs leading-5 text-zinc-500">Enviada automaticamente ao abrir o grupo, para todos os canais configurados acima.</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">Mensagem de encerramento</label>
                            <textarea rows={3} className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white focus:border-emerald-500 outline-none transition" defaultValue={`✅ O grupo {{group_name}} foi encerrado.\n\nObrigado por acompanhar a loja {{store_name}}.`}></textarea>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">Mensagem de lembrete antes do encerramento</label>
                            <textarea rows={3} className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white focus:border-emerald-500 outline-none transition" defaultValue={`⏰ Faltam {{remaining_time}} para encerrar o grupo {{group_name}}.\n\nAinda temos {{available_products_count}} produto(s) disponível(is). Confira antes do fechamento: {{group_link}}`}></textarea>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">Template da legenda dos produtos</label>
                            <textarea rows={7} className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 font-mono text-sm text-white focus:border-emerald-500 outline-none transition" defaultValue={`{{store_line}}\n{{group_line}}\n{{product_name}}\n{{category_line}}\n\n{{price_block}}\n\n{{variations_block}}\n\n{{buy_line}}`}></textarea>
                            <p className="mt-2 text-xs leading-5 text-zinc-500">Reordene os blocos como quiser. Se deixar em branco, o sistema usa o modelo padrão. Placeholders: {`{{product_name}}`}, {`{{price_block}}`}, {`{{buy_line}}`}, etc.</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">Lembretes em minutos antes do fim</label>
                            <input type="text" defaultValue="180, 60, 15" className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white focus:border-emerald-500 outline-none transition" />
                            <div className="mt-3 flex flex-wrap gap-2">
                              <button type="button" className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400 transition hover:bg-emerald-500/20">
                                Conservador: 180, 60, 15
                              </button>
                              <button type="button" className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400 transition hover:bg-emerald-500/20">
                                Equilibrado: 120, 30, 10
                              </button>
                              <button type="button" className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400 transition hover:bg-emerald-500/20">
                                Última chamada: 60, 15, 5
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>

                  </div>
                )}

              </form>
            </div>

            {/* Sidebar Summary & Controls */}
            <aside className="space-y-6 lg:sticky lg:top-6">
              
              {/* Resumo Rápido */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 sm:p-5 shadow-lg">
                <div className="flex items-start gap-3 mb-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-md">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-white">Resumo rápido</h3>
                    <p className="mt-0.5 text-xs text-zinc-400">Confira o estado do grupo antes de criar.</p>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-4 rounded-xl bg-zinc-950 px-3 py-3 border border-zinc-800/50">
                    <span className="text-zinc-400">Grupo Ativo</span>
                    <span className="font-bold text-white">{isActive ? 'Ativo' : 'Fechado'}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 rounded-xl bg-zinc-950 px-3 py-3 border border-zinc-800/50">
                    <span className="text-zinc-400">Controle de Estoque</span>
                    <span className="font-bold text-white">{stockControl ? 'Ativado' : 'Desativado'}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 rounded-xl bg-zinc-950 px-3 py-3 border border-zinc-800/50">
                    <span className="text-zinc-400">Taxa de Serviço</span>
                    <span className="font-bold text-white capitalize">{feeType.replace(/_/g, ' ')}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 rounded-xl bg-zinc-950 px-3 py-3 border border-zinc-800/50">
                    <span className="text-zinc-400">Máximo por Cliente</span>
                    <span className="font-bold text-white">{maxPerCustomer || 'Sem limite'}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 rounded-xl bg-zinc-950 px-3 py-3 border border-zinc-800/50">
                    <span className="text-zinc-400">Termos de Uso</span>
                    <span className="font-bold text-white">{requireTerms ? 'Exigido' : 'Desativado'}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 rounded-xl bg-zinc-950 px-3 py-3 border border-zinc-800/50">
                    <span className="text-zinc-400">Exigir saldo</span>
                    <span className="font-bold text-white">{requireWallet ? 'Ativado' : 'Desativado'}</span>
                  </div>
                  <div className="rounded-xl bg-zinc-950 px-3 py-3 border border-zinc-800/50">
                    <p className="text-zinc-400">Início das Vendas / Fim das Vendas</p>
                    <p className="mt-1 font-bold text-white">Começa imediatamente</p>
                  </div>
                </div>
              </div>

              {/* Checklist & Fluxo Guiado */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 sm:p-5 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white">Checklist rápido</h3>
                </div>
                <ul className="mt-4 space-y-3 text-sm text-zinc-300">
                  <li>Defina um nome forte e fácil de identificar.</li>
                  <li>Escolha a taxa de serviço antes de publicar.</li>
                  <li>Revise estoque, datas e restrições antes de seguir.</li>
                </ul>

                {/* Etapa Atual (Fluxo guiado) */}
                <div className="mt-5 rounded-2xl border border-orange-500/20 bg-orange-500/10 px-4 py-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-orange-400">Etapa atual</p>
                  <p className="mt-2 text-sm font-bold text-white">Etapa {currentStep} de 4: {steps[currentStep-1].title}</p>
                  <p className="mt-1 text-sm text-zinc-300">{steps[currentStep-1].desc}</p>
                </div>

                <div className="mt-5 space-y-3">
                  <Link 
                    href="/admin/purchase-groups" 
                    className="inline-flex w-full items-center justify-center rounded-2xl border border-zinc-700 px-4 py-3 text-sm font-bold text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
                  >
                    Cancelar
                  </Link>

                  <button 
                    type="button" 
                    onClick={handlePrev}
                    disabled={currentStep === 1}
                    className="inline-flex w-full items-center justify-center rounded-2xl border border-zinc-700 px-4 py-3 text-sm font-bold text-zinc-300 transition hover:bg-zinc-800 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Etapa anterior
                  </button>
                  
                  {currentStep < 4 ? (
                    <button 
                      type="button" 
                      onClick={handleNext}
                      className="inline-flex w-full items-center justify-center rounded-2xl bg-white px-4 py-3 text-sm font-bold text-orange-600 ring-1 ring-orange-200 transition hover:bg-orange-50"
                    >
                      Próxima etapa
                    </button>
                  ) : (
                    <button 
                      type="button" 
                      className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:from-orange-500 hover:to-amber-500"
                    >
                      Criar Grupo
                    </button>
                  )}
                </div>
              </div>

            </aside>
          </div>

        </div>
      </div>
    </div>
  );
}
