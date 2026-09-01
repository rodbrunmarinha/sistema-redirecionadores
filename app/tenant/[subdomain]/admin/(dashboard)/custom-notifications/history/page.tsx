import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { ChevronRight, Clock, Plus, Bell, Users, Calendar } from "lucide-react";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function CustomNotificationsHistoryPage(props: { params: Promise<{ subdomain: string }> }) {
  const params = await props.params;

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Get tenant
  const { data: tenant } = await supabaseAdmin
    .from("tenants")
    .select("id")
    .eq("subdomain", params.subdomain)
    .single();

  if (!tenant) {
    redirect(`/admin/dashboard`);
  }

  // Get notifications
  const { data: notifications } = await supabaseAdmin
    .from("custom_notifications")
    .select(`
      *,
      created_by (
        full_name
      )
    `)
    .eq("tenant_id", tenant.id)
    .order("created_at", { ascending: false });

  const notifs = notifications || [];

  // Stats
  const totalSent = notifs.length;
  const totalRecipients = notifs.reduce((sum, n) => sum + (n.sent_count || 0), 0);
  
  const thisMonthStart = new Date();
  thisMonthStart.setDate(1);
  thisMonthStart.setHours(0, 0, 0, 0);
  const sentThisMonth = notifs.filter(n => new Date(n.created_at) >= thisMonthStart).length;

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="space-y-6">
        
        {/* Header */}
        <div className="bg-zinc-900 border-b border-zinc-800 -mx-4 sm:-mx-6 lg:-mx-8 -mt-4 sm:-mt-6 lg:-mt-8 px-4 sm:px-6 lg:px-8 py-6 mb-6">
          <nav className="flex items-center gap-2 text-sm mb-4" aria-label="Breadcrumb">
            <Link href={`/admin/dashboard`} className="text-zinc-400 hover:text-white transition-colors">
              Dashboard
            </Link>
            <ChevronRight className="w-4 h-4 text-zinc-600 shrink-0" />
            <Link href={`/admin/custom-notifications/create`} className="text-zinc-400 hover:text-white transition-colors">
              Notificações Push
            </Link>
            <ChevronRight className="w-4 h-4 text-zinc-600 shrink-0" />
            <span className="text-zinc-100 font-medium">
              Histórico
            </span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-zinc-800 rounded-xl border border-zinc-700">
                <Clock className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Histórico de Notificações</h1>
                <p className="text-zinc-400 text-sm mt-1">Acompanhe todas as notificações push já enviadas aos seus clientes</p>
              </div>
            </div>
            
            <Link 
              href={`/admin/custom-notifications/create`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-sm font-semibold transition shadow-md"
            >
              <Plus className="w-4 h-4" />
              Nova Notificação
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto space-y-6">

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-zinc-900 rounded-2xl p-5 shadow-sm border border-zinc-800 flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-emerald-500">{totalSent}</p>
                <p className="text-xs text-zinc-400 font-semibold tracking-wide uppercase mt-1">Notificações enviadas</p>
              </div>
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                <Bell className="w-6 h-6 text-emerald-500" />
              </div>
            </div>
            
            <div className="bg-zinc-900 rounded-2xl p-5 shadow-sm border border-zinc-800 flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-amber-500">{totalRecipients}</p>
                <p className="text-xs text-zinc-400 font-semibold tracking-wide uppercase mt-1">Total de destinatários</p>
              </div>
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-amber-500" />
              </div>
            </div>
            
            <div className="bg-zinc-900 rounded-2xl p-5 shadow-sm border border-zinc-800 flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-blue-500">{sentThisMonth}</p>
                <p className="text-xs text-zinc-400 font-semibold tracking-wide uppercase mt-1">Enviadas este mês</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-zinc-900 border border-zinc-800 overflow-hidden shadow-sm rounded-2xl">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-zinc-800">
                <thead className="bg-zinc-950">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                      Data/Hora
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                      Notificação
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                      Enviado Por
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                      Destinatários
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-zinc-900 divide-y divide-zinc-800">
                  {notifs.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-sm text-zinc-500">
                        Nenhuma notificação enviada ainda.
                      </td>
                    </tr>
                  ) : (
                    notifs.map((n) => {
                      const dateObj = new Date(n.created_at);
                      const dateStr = dateObj.toLocaleDateString('pt-BR');
                      const timeStr = dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                      const creatorName = n.created_by?.full_name || "Sistema";

                      return (
                        <tr key={n.id} className="hover:bg-zinc-800/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="font-medium text-zinc-200">
                              {dateStr}
                            </div>
                            <div className="text-xs text-zinc-500 mt-0.5">
                              {timeStr}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="max-w-md">
                              <div className="font-semibold text-white mb-1">
                                {n.title}
                              </div>
                              <div className="text-zinc-400 text-xs line-clamp-2">
                                {n.message}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                            {creatorName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
                              {n.sent_count} cliente{n.sent_count !== 1 ? 's' : ''}
                            </span>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
