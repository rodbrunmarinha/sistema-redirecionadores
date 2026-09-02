import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  ChevronRight, 
  LifeBuoy, 
  Settings2, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Inbox, 
  CalendarDays, 
  MessageSquare,
  AlertCircle
} from "lucide-react";

export default async function SupportTicketsPage(props: {
  params: Promise<{ subdomain: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const subdomain = params.subdomain;
  
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: tenant } = await supabase
    .from('tenants')
    .select('id')
    .eq('subdomain', subdomain)
    .single();

  if (!tenant) redirect("/admin/login");

  // Parâmetros de Filtro
  const statusFilter = searchParams.status as string || 'all';
  const priorityFilter = searchParams.priority as string || '';
  const categoryFilter = searchParams.category as string || '';
  const assignedToFilter = searchParams.assigned_to as string || '';
  const searchStr = searchParams.search as string || '';

  // Query base
  let query = supabase
    .from('support_tickets')
    .select('*, customer:customer_id(full_name, email), assigned:assigned_to(full_name)')
    .eq('tenant_id', tenant.id)
    .order('created_at', { ascending: false });

  if (statusFilter !== 'all') {
    query = query.eq('status', statusFilter);
  }
  if (priorityFilter) {
    query = query.eq('priority', priorityFilter);
  }
  if (categoryFilter) {
    query = query.eq('category', categoryFilter);
  }
  if (assignedToFilter === 'me') {
    query = query.eq('assigned_to', user.id);
  } else if (assignedToFilter === 'unassigned') {
    query = query.is('assigned_to', null);
  }
  if (searchStr) {
    query = query.ilike('subject', `%${searchStr}%`);
  }

  const { data: tickets } = await query;
  
  // Vamos precisar de métricas, então fazemos uma query para todos os tickets do tenant p/ os cards
  const { data: allTickets } = await supabase
    .from('support_tickets')
    .select('status, created_at')
    .eq('tenant_id', tenant.id);

  const stats = {
    open: allTickets?.filter(t => t.status === 'open').length || 0,
    in_progress: allTickets?.filter(t => t.status === 'in_progress').length || 0,
    waiting: allTickets?.filter(t => t.status === 'waiting_customer' || t.status === 'waiting_admin').length || 0,
    resolved: allTickets?.filter(t => t.status === 'resolved' || t.status === 'closed').length || 0,
    today: allTickets?.filter(t => {
      const today = new Date();
      const ticketDate = new Date(t.created_at);
      return ticketDate.getDate() === today.getDate() &&
             ticketDate.getMonth() === today.getMonth() &&
             ticketDate.getFullYear() === today.getFullYear();
    }).length || 0,
    total: allTickets?.length || 0,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      
      {/* Header Premium Dock Drop (Laranja/Amber) */}
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 shadow-lg shadow-orange-500/10">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 pointer-events-none blur-xl"></div>
        <div className="absolute -bottom-16 -left-8 w-64 h-64 rounded-full bg-white/5 pointer-events-none blur-2xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-sm mb-4" aria-label="Breadcrumb">
            <Link href="/admin" className="text-white/70 hover:text-white transition-colors">
              Dashboard
            </Link>
            <ChevronRight className="w-4 h-4 text-white/50 shrink-0" />
            <span className="text-white font-medium">Tickets de Clientes</span>
          </nav>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl shadow-lg shrink-0 border border-white/20">
                <LifeBuoy className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Suporte ao Cliente</h1>
                <p className="text-amber-100/80 text-sm mt-1">Gerencie os chamados dos seus clientes</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/admin/support-tickets/faq/manage" className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 text-white font-semibold rounded-xl transition text-sm">
                <Settings2 className="w-4 h-4" />
                Gerenciar FAQ
              </Link>
              <Link href="/admin/support-tickets/create" className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-orange-600 hover:bg-orange-50 font-bold rounded-xl transition shadow-lg text-sm">
                <Plus className="w-4 h-4" />
                Novo chamado
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          
          <Link href="/admin/support-tickets?status=open" className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-xl hover:border-zinc-700 transition">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-bold text-white leading-none">{stats.open}</p>
                <p className="text-[11px] font-medium text-zinc-400 mt-1 uppercase tracking-wider">Abertos</p>
              </div>
            </div>
          </Link>
          
          <Link href="/admin/support-tickets?status=in_progress" className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-xl hover:border-zinc-700 transition">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-bold text-white leading-none">{stats.in_progress}</p>
                <p className="text-[11px] font-medium text-zinc-400 mt-1 uppercase tracking-wider">Em Andamento</p>
              </div>
            </div>
          </Link>

          <Link href="/admin/support-tickets?status=waiting" className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-xl hover:border-zinc-700 transition">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-bold text-white leading-none">{stats.waiting}</p>
                <p className="text-[11px] font-medium text-zinc-400 mt-1 uppercase tracking-wider">Aguardando</p>
              </div>
            </div>
          </Link>

          <Link href="/admin/support-tickets?status=resolved" className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-xl hover:border-zinc-700 transition">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-bold text-white leading-none">{stats.resolved}</p>
                <p className="text-[11px] font-medium text-zinc-400 mt-1 uppercase tracking-wider">Resolvidos</p>
              </div>
            </div>
          </Link>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500">
                <CalendarDays className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-bold text-white leading-none">{stats.today}</p>
                <p className="text-[11px] font-medium text-zinc-400 mt-1 uppercase tracking-wider">Hoje</p>
              </div>
            </div>
          </div>

          <Link href="/admin/support-tickets" className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-xl hover:border-zinc-700 transition">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-zinc-800 rounded-lg text-zinc-400">
                <Inbox className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-bold text-white leading-none">{stats.total}</p>
                <p className="text-[11px] font-medium text-zinc-400 mt-1 uppercase tracking-wider">Total</p>
              </div>
            </div>
          </Link>
          
        </div>

        {/* Filtros */}
        <form method="GET" className="bg-zinc-900 rounded-2xl p-5 shadow-xl border border-zinc-800 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <input 
              type="text" 
              name="search" 
              defaultValue={searchStr} 
              placeholder="Buscar ticket ou assunto..." 
              className="flex-1 min-w-[200px] px-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-white text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all placeholder-zinc-600"
            />
            
            <select name="status" defaultValue={statusFilter} className="px-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-white text-sm focus:border-orange-500 outline-none">
              <option value="all">Todos os status</option>
              <option value="open">Aberto</option>
              <option value="in_progress">Em Andamento</option>
              <option value="waiting_customer">Aguardando resposta</option>
              <option value="waiting_admin">Aguardando atendimento</option>
              <option value="resolved">Resolvido</option>
              <option value="closed">Fechado</option>
            </select>
            
            <select name="priority" defaultValue={priorityFilter} className="px-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-white text-sm focus:border-orange-500 outline-none">
              <option value="">Prioridade</option>
              <option value="low">Baixa</option>
              <option value="medium">Média</option>
              <option value="high">Alta</option>
              <option value="urgent">Urgente</option>
            </select>
            
            <select name="category" defaultValue={categoryFilter} className="px-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-white text-sm focus:border-orange-500 outline-none">
              <option value="">Categoria</option>
              <option value="general">Geral</option>
              <option value="financial">Financeiro</option>
              <option value="technical">Técnico</option>
              <option value="shipping">Envios</option>
              <option value="store">Loja Online</option>
              <option value="account">Minha Conta</option>
              <option value="groups">Grupo de Compras</option>
              <option value="other">Outro</option>
            </select>
            
            <select name="assigned_to" defaultValue={assignedToFilter} className="px-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-white text-sm focus:border-orange-500 outline-none">
              <option value="">Atribuição</option>
              <option value="me">Meus tickets</option>
              <option value="unassigned">Não atribuídos</option>
            </select>
            
            <button type="submit" className="px-6 py-2.5 bg-orange-600 text-white text-sm font-bold rounded-xl hover:bg-orange-500 transition shadow-lg shadow-orange-600/20">
              Filtrar
            </button>
          </div>
        </form>

        {/* Tickets List */}
        {(!tickets || tickets.length === 0) ? (
          <div className="bg-zinc-900 rounded-2xl p-12 text-center shadow-xl border border-zinc-800">
            <div className="w-16 h-16 mx-auto mb-4 bg-orange-500/10 rounded-full flex items-center justify-center">
              <Inbox className="w-8 h-8 text-orange-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Nenhum ticket encontrado</h3>
            <p className="text-zinc-400">Seus clientes ainda não abriram chamados ou nenhum bate com os filtros atuais.</p>
          </div>
        ) : (
          <div className="bg-zinc-900 rounded-2xl shadow-xl border border-zinc-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-zinc-950/50 border-b border-zinc-800">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Ticket</th>
                    <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Cliente</th>
                    <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Categoria</th>
                    <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Prioridade</th>
                    <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Criado em</th>
                    <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Atribuído a</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {tickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-zinc-800/50 transition group">
                      <td className="p-0">
                        <Link href={`/admin/support-tickets/${ticket.id}`} className="block px-6 py-4">
                          <p className="font-bold text-white group-hover:text-orange-400 transition-colors">{ticket.subject}</p>
                          <p className="text-xs text-zinc-500">ID: {ticket.id.split('-')[0]}</p>
                        </Link>
                      </td>
                      <td className="p-0">
                        <Link href={`/admin/support-tickets/${ticket.id}`} className="block px-6 py-4">
                          <p className="text-sm font-medium text-zinc-200">{(ticket.customer as any)?.full_name}</p>
                          <p className="text-xs text-zinc-500">{(ticket.customer as any)?.email}</p>
                        </Link>
                      </td>
                      <td className="p-0">
                        <Link href={`/admin/support-tickets/${ticket.id}`} className="block px-6 py-4">
                          <span className="text-xs font-medium text-zinc-400 bg-zinc-800 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                            {ticket.category}
                          </span>
                        </Link>
                      </td>
                      <td className="p-0">
                        <Link href={`/admin/support-tickets/${ticket.id}`} className="block px-6 py-4">
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
                        <Link href={`/admin/support-tickets/${ticket.id}`} className="block px-6 py-4">
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
                        <Link href={`/admin/support-tickets/${ticket.id}`} className="block px-6 py-4">
                          <span className="text-sm text-zinc-400">
                            {new Date(ticket.created_at).toLocaleDateString('pt-BR')}
                          </span>
                        </Link>
                      </td>
                      <td className="p-0">
                        <Link href={`/admin/support-tickets/${ticket.id}`} className="block px-6 py-4">
                          <span className="text-sm text-zinc-300">
                            {(ticket.assigned as any)?.full_name || '-'}
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
    </div>
  );
}
