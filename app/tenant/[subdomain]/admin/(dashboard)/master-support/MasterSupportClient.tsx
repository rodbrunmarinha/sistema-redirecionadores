"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { 
  HeadphonesIcon, 
  Plus, 
  HelpCircle,
  Inbox,
  Filter,
  Search,
  X,
  ChevronRight,
  BookOpen,
  CheckCircle2,
  Clock
} from "lucide-react";
import dayjs from "dayjs";

export default function MasterSupportClient({ tickets, stats, subdomain, initialStatusFilter }: any) {
  const [activeTab, setActiveTab] = useState<'faq' | 'tickets'>('faq');
  const [faqSearch, setFaqSearch] = useState('');
  const [faqCategory, setFaqCategory] = useState('all');
  const [openArticle, setOpenArticle] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleStatusFilterChange = (newStatus: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('status', newStatus);
    router.push(`${pathname}?${params.toString()}`);
  };

  const faqData: Record<string, { id: string, category: string, title: string, searchable: string }> = {
    "17": { id: "17", category: "primeiros-passos", title: "Visão geral: como a Dockdrop funciona", searchable: "visão geral: como a dockdrop funciona a dockdrop organiza a operação de redirecionamento e vendas em um fluxo simples..." },
    "18": { id: "18", category: "primeiros-passos", title: "Checklist de configuração inicial da sua empresa", searchable: "checklist de configuração inicial da sua empresa antes de receber seus primeiros clientes, revise este checklist..." },
    "19": { id: "19", category: "armazem", title: "Pré-alertas e registro de caixas recebidas", searchable: "pré-alertas e registro de caixas recebidas o pré-alerta é o aviso que o cliente cria dizendo comprei algo, vai chegar aí..." },
    "20": { id: "20", category: "armazem", title: "Localizações, mapa do armazém e rota de coleta", searchable: "localizações, mapa do armazém e rota de coleta para operações com prateleiras..." },
    "21": { id: "21", category: "logistica", title: "Criando envios e acompanhando status", searchable: "criando envios e acompanhando status quando o cliente solicita o envio dos produtos..." },
    "22": { id: "22", category: "logistica", title: "Rastreamento por produto (Módulo Transportadora)", searchable: "rastreamento por produto (módulo transportadora) no módulo de transportadora..." },
    "23": { id: "23", category: "vendas", title: "Grupos de compras: fluxo completo", searchable: "grupos de compras: fluxo completo o grupo de compras permite vender produtos em lote..." },
    "24": { id: "24", category: "vendas", title: "Carrinhos assistidos: monte o pedido pelo cliente", searchable: "carrinhos assistidos: monte o pedido pelo cliente nem todo cliente se vira sozinho no grupo de compras..." },
    "25": { id: "25", category: "vendas", title: "Automações do grupo: recuperação de carrinho e avisos", searchable: "automações do grupo: recuperação de carrinho e avisos (enterprise) em grupos de compras..." },
    "26": { id: "26", category: "vendas", title: "Loja Online: produtos, pedidos e avaliações", searchable: "loja online: produtos, pedidos e avaliações (enterprise) a loja online é sua vitrine de venda direta..." },
    "27": { id: "27", category: "vendas", title: "Live Shopping: guia da primeira transmissão", searchable: "live shopping: guia da primeira transmissão (enterprise) o live shopping transforma uma transmissão ao vivo..." },
    "28": { id: "28", category: "vendas", title: "Cupons de desconto: escopos e regras", searchable: "cupons de desconto: escopos e regras os cupons são transversais: um mesmo cupom pode valer para diferentes serviços..." },
    "29": { id: "29", category: "vendas", title: "Programas VIP: crie seu clube de assinatura", searchable: "programas vip: crie seu clube de assinatura (pro+) o programa vip cria receita recorrente..." },
    "30": { id: "30", category: "gestao", title: "Carteira Digital: créditos, débitos e cashback", searchable: "carteira digital: créditos, débitos e cashback cada cliente tem uma carteira digital dentro do seu painel..." },
    "31": { id: "31", category: "gestao", title: "Comunicados: avisos em destaque no painel", searchable: "comunicados: avisos em destaque no painel do cliente os comunicados exibem avisos em modal..." },
    "32": { id: "32", category: "gestao", title: "Suporte ao cliente: tickets, SLA e FAQ", searchable: "suporte ao cliente: tickets, sla e faq centralize o atendimento em suporte ao cliente..." },
    "33": { id: "33", category: "configuracoes", title: "Notificações: e-mail, push e whatsapp", searchable: "notificações: e-mail, push e whatsapp a dockdrop avisa seus clientes automaticamente..." },
    "34": { id: "34", category: "painel-cliente", title: "O que o seu cliente vê: painel web e aplicativo", searchable: "o que o seu cliente vê: painel web e aplicativo seu cliente tem duas portas de entrada..." },
    "35": { id: "35", category: "assinatura", title: "Planos Starter, Pro e Enterprise", searchable: "planos starter, pro e enterprise: o que cada um libera sua assinatura dockdrop define os módulos disponíveis..." },
    "36": { id: "36", category: "dicas", title: "Boas práticas para reduzir atendimento", searchable: "boas práticas para reduzir atendimento no whatsapp o objetivo do sistema é que o cliente se sirva sozinho..." }
  };

  const filteredFaq = Object.values(faqData).filter(item => {
    if (faqCategory !== 'all' && item.category !== faqCategory) return false;
    if (faqSearch.trim()) {
      const terms = faqSearch.toLowerCase().split(/\s+/).filter(Boolean);
      if (!terms.every(term => item.searchable.includes(term))) return false;
    }
    return true;
  });

  const categories = [
    { id: 'all', label: 'Tudo' },
    { id: 'primeiros-passos', label: 'Primeiros passos' },
    { id: 'armazem', label: 'Armazém' },
    { id: 'logistica', label: 'Logística e Envios' },
    { id: 'vendas', label: 'Vendas' },
    { id: 'gestao', label: 'Gestão' },
    { id: 'configuracoes', label: 'Configurações' },
    { id: 'painel-cliente', label: 'Painel do Cliente' },
    { id: 'assinatura', label: 'Assinatura' },
    { id: 'dicas', label: 'Boas práticas' }
  ];

  const categoryCounts = Object.values(faqData).reduce((acc: any, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    acc['all'] = (acc['all'] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="w-full pb-10">
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 shadow-lg shadow-orange-500/10">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 pointer-events-none blur-xl"></div>
        <div className="absolute -bottom-16 -left-8 w-64 h-64 rounded-full bg-white/5 pointer-events-none blur-2xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-sm mb-4" aria-label="Breadcrumb">
            <Link href="/admin" className="text-white/70 hover:text-white transition-colors">
              Dashboard
            </Link>
            <ChevronRight className="w-4 h-4 text-white/50 shrink-0" />
            <span className="text-white font-medium">Central de Ajuda</span>
          </nav>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4 min-w-0">
              <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl shadow-lg shrink-0 border border-white/20">
                <HelpCircle className="w-8 h-8 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-white truncate">Central de Ajuda</h1>
                <p className="text-orange-100 text-sm mt-0.5">Encontre respostas sobre cada área do sistema antes de abrir um chamado</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button 
                type="button" 
                onClick={() => setActiveTab('tickets')} 
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white/15 hover:bg-white/25 border border-white/25 text-white font-semibold rounded-xl transition text-sm backdrop-blur-sm"
              >
                <Inbox className="w-4 h-4" />
                Meus chamados
              </button>
              <Link 
                href="/admin/master-support/new" 
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-orange-700 hover:bg-orange-50 font-bold rounded-xl transition shadow-lg text-sm"
              >
                <Plus className="w-4 h-4" />
                Abrir chamado
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="rounded-2xl p-4 text-white bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-800 shadow-sm">
            <p className="text-xs font-medium text-white/70 uppercase tracking-wider">Artigos</p>
            <p className="text-2xl sm:text-3xl font-extrabold mt-1">20</p>
          </div>
          <div className="rounded-2xl p-4 text-white bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-800 shadow-sm">
            <p className="text-xs font-medium text-white/70 uppercase tracking-wider">Áreas</p>
            <p className="text-2xl sm:text-3xl font-extrabold mt-1">9</p>
          </div>
          <div className="rounded-2xl p-4 text-white bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30 shadow-sm">
            <p className="text-xs font-medium text-orange-200/70 uppercase tracking-wider">Abertos</p>
            <p className="text-2xl sm:text-3xl font-extrabold mt-1 text-orange-400">{stats.open}</p>
          </div>
          <div className="rounded-2xl p-4 text-white bg-gradient-to-br from-amber-500/20 to-amber-600/20 border border-amber-500/30 shadow-sm">
            <p className="text-xs font-medium text-amber-200/70 uppercase tracking-wider">Meus chamados</p>
            <p className="text-2xl sm:text-3xl font-extrabold mt-1 text-amber-400">{stats.total}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-zinc-900 p-1 rounded-xl w-fit border border-zinc-800">
          <button 
            onClick={() => setActiveTab('faq')} 
            className={`px-5 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'faq' ? 'bg-zinc-800 shadow-sm text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            FAQ Cndck Hub
          </button>
          <button 
            onClick={() => setActiveTab('tickets')} 
            className={`px-5 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'tickets' ? 'bg-zinc-800 shadow-sm text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Meus Chamados
          </button>
        </div>

        {/* Tab Tickets */}
        {activeTab === 'tickets' && (
          <div className="animate-in fade-in duration-300">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <select 
                value={initialStatusFilter}
                onChange={(e) => handleStatusFilterChange(e.target.value)}
                className="rounded-xl border-zinc-800 bg-zinc-900 text-white text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 px-4 py-2"
              >
                <option value="all">Todos</option>
                <option value="open">Aberto</option>
                <option value="in_progress">Em Andamento</option>
                <option value="waiting_customer">Aguardando resposta da plataforma</option>
                <option value="waiting_admin">Aguardando seu retorno</option>
                <option value="resolved">Resolvido</option>
                <option value="closed">Fechado</option>
              </select>
              
              <button 
                type="button" 
                onClick={() => setActiveTab('faq')} 
                className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 text-sm font-medium text-white rounded-xl border border-zinc-800 hover:border-orange-500/50 transition"
              >
                <BookOpen className="w-4 h-4 text-orange-500" />
                Buscar resposta na base
              </button>
            </div>

            {tickets.length === 0 ? (
              <div className="bg-zinc-900 rounded-2xl p-12 text-center shadow-sm border border-zinc-800">
                <div className="w-16 h-16 mx-auto mb-4 bg-orange-500/10 rounded-full flex items-center justify-center">
                  <Inbox className="w-8 h-8 text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">Nenhum chamado</h3>
                <p className="text-sm text-zinc-400 mb-5 max-w-lg mx-auto">
                  Consulte a base de conhecimento antes de abrir seu primeiro chamado. Em muitos casos a solução já está documentada.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button 
                    onClick={() => setActiveTab('faq')} 
                    className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 text-white text-sm font-medium rounded-xl border border-zinc-700 hover:border-zinc-600 transition"
                  >
                    <BookOpen className="w-4 h-4 text-orange-500" />
                    Ver artigos primeiro
                  </button>
                  <Link 
                    href="/admin/master-support/new" 
                    className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-xl hover:bg-orange-500 transition shadow-lg shadow-orange-600/20"
                  >
                    <Plus className="w-4 h-4" />
                    Abrir Chamado
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-zinc-900 rounded-2xl shadow-xl border border-zinc-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-zinc-950/50 border-b border-zinc-800">
                      <tr>
                        <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Ticket</th>
                        <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Categoria</th>
                        <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Prioridade</th>
                        <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Criado em</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                      {tickets.map((ticket: any) => (
                        <tr key={ticket.id} className="hover:bg-zinc-800/50 transition group">
                          <td className="p-0">
                            <Link href={`/admin/master-support/${ticket.id}`} className="block px-6 py-4">
                              <p className="font-bold text-white group-hover:text-orange-400 transition-colors">{ticket.subject}</p>
                              <p className="text-xs text-zinc-500">ID: {ticket.id.split('-')[0]}</p>
                            </Link>
                          </td>
                          <td className="p-0">
                            <Link href={`/admin/master-support/${ticket.id}`} className="block px-6 py-4">
                              <span className={`text-xs font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider ${
                                ticket.status === 'open' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                ticket.status === 'in_progress' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                ticket.status === 'resolved' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                                'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              }`}>
                                {ticket.status.replace('_', ' ')}
                              </span>
                            </Link>
                          </td>
                          <td className="p-0">
                            <Link href={`/admin/master-support/${ticket.id}`} className="block px-6 py-4">
                              <span className="text-xs font-medium text-zinc-400 bg-zinc-800 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                                {ticket.category}
                              </span>
                            </Link>
                          </td>
                          <td className="p-0">
                            <Link href={`/admin/master-support/${ticket.id}`} className="block px-6 py-4">
                              <span className={`text-xs font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider ${
                                ticket.priority === 'urgent' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                ticket.priority === 'high' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                                ticket.priority === 'medium' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                'bg-zinc-800 text-zinc-400 border border-zinc-700'
                              }`}>
                                {ticket.priority === 'urgent' ? 'Urgente' : 
                                ticket.priority === 'high' ? 'Alta' : 
                                ticket.priority === 'medium' ? 'Média' : 'Baixa'}
                              </span>
                            </Link>
                          </td>
                          <td className="p-0">
                            <Link href={`/admin/master-support/${ticket.id}`} className="block px-6 py-4">
                              <span className="text-sm text-zinc-400">
                                {dayjs(ticket.created_at).format('DD/MM/YYYY HH:mm')}
                              </span>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab FAQ */}
        {activeTab === 'faq' && (
          <div className="animate-in fade-in duration-300">
            <div className="mb-6 rounded-2xl bg-zinc-900 shadow-sm border border-zinc-800 p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">Busque a resposta antes de abrir um chamado</h3>
                  <p className="mt-1 text-sm text-zinc-400">Filtre por palavra-chave ou tema. A ideia desta área é resolver sua dúvida sem depender de atendimento individual.</p>
                </div>
                {(faqSearch || faqCategory !== 'all') && (
                  <button 
                    onClick={() => { setFaqSearch(''); setFaqCategory('all'); setOpenArticle(null); }}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-300 rounded-xl border border-zinc-700 hover:border-zinc-500 transition"
                  >
                    <X className="w-4 h-4" />
                    Limpar filtros
                  </button>
                )}
              </div>

              <div className="mt-4 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input 
                  type="text" 
                  value={faqSearch}
                  onChange={(e) => setFaqSearch(e.target.value)}
                  placeholder="Buscar na base de conhecimento..." 
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-800 bg-zinc-950 text-white text-sm focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition outline-none"
                />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {categories.map((cat) => {
                  const count = categoryCounts[cat.id] || 0;
                  if (count === 0 && cat.id !== 'all') return null;
                  
                  return (
                    <button 
                      key={cat.id}
                      onClick={() => setFaqCategory(cat.id)}
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                        faqCategory === cat.id 
                          ? 'bg-orange-600 text-white border-orange-500' 
                          : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      {cat.label}
                      <span className="rounded-full bg-black/20 px-2 py-0.5 text-[10px]">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {openArticle ? (
              <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-8 shadow-sm">
                <button 
                  onClick={() => setOpenArticle(null)}
                  className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition mb-6"
                >
                  <ChevronRight className="w-4 h-4 rotate-180" />
                  Voltar para os resultados
                </button>
                
                <h2 className="text-2xl font-bold text-white mb-2">{faqData[openArticle].title}</h2>
                <div className="inline-flex items-center rounded-full bg-zinc-800 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-400 mb-8">
                  {categories.find(c => c.id === faqData[openArticle].category)?.label}
                </div>
                
                <div className="prose prose-invert max-w-none text-zinc-300">
                  <p className="whitespace-pre-wrap">{faqData[openArticle].searchable}</p>
                </div>
              </div>
            ) : filteredFaq.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
                {filteredFaq.map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => setOpenArticle(item.id)}
                    className="text-left flex flex-col rounded-2xl bg-zinc-900 border border-zinc-800 p-5 shadow-sm hover:border-orange-500/50 transition group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center rounded-full bg-zinc-800 group-hover:bg-orange-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-zinc-400 group-hover:text-orange-400 transition-colors">
                        {categories.find(c => c.id === item.category)?.label || item.category}
                      </span>
                    </div>
                    <h4 className="mt-4 text-sm font-semibold text-white leading-6 group-hover:text-orange-400 transition-colors">
                      {item.title}
                    </h4>
                    <p className="mt-2 text-xs text-zinc-500 leading-relaxed line-clamp-3">
                      {item.searchable}
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="bg-zinc-900 rounded-2xl p-12 text-center shadow-sm border border-zinc-800">
                <div className="w-16 h-16 mx-auto mb-4 bg-zinc-800 rounded-full flex items-center justify-center">
                  <Search className="w-8 h-8 text-zinc-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">Nenhum artigo encontrado</h3>
                <p className="text-sm text-zinc-400">Tente buscar com outras palavras-chave ou remova os filtros.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
