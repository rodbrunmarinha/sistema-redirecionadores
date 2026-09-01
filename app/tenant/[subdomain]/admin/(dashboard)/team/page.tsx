import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Users, ShieldAlert, ShieldCheck, BarChart3, MessageSquareText, PlusCircle, Edit, Star } from "lucide-react";


export default async function TeamPage(props: { params: Promise<{ subdomain: string }> }) {
  const params = await props.params;
  const subdomain = params.subdomain;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: tenant } = await supabase
    .from('tenants')
    .select('id, owner_email, role_permissions')
    .eq('subdomain', subdomain)
    .single();

  const { data: currentUserProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
    
  const rolePermissions = tenant?.role_permissions || {};
  const currentRole = currentUserProfile?.role || 'SUPPORT';
  const userPermissions = currentRole === 'SUPER_ADMIN' ? ['ALL'] : (rolePermissions[currentRole] || []);
  const canEdit = userPermissions.includes('ALL') || userPermissions.includes('team.edit');
  const canCreate = userPermissions.includes('ALL') || userPermissions.includes('team.create');


  if (!tenant) redirect("/admin/login");

  // Fetch all team members
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .eq('tenant_id', tenant.id)
    .neq('role', 'CUSTOMER')
    .order('created_at', { ascending: true });

  const team = profiles || [];

  // Stats
  const total = team.length;
  const ownersCount = team.filter(p => p.role === 'ADMIN' && p.email === tenant.owner_email).length;
  const adminsCount = team.filter(p => p.role === 'ADMIN' && p.email !== tenant.owner_email).length;
  const othersCount = team.filter(p => p.role === 'MANAGER' || p.role === 'SUPPORT').length;

  const roleMap: Record<string, { label: string, icon: any, color: string, badge: string }> = {
    'SUPER_ADMIN': { label: 'Super Admin', icon: Star, color: 'text-purple-500', badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
    'ADMIN': { label: 'Administrador', icon: ShieldCheck, color: 'text-blue-500', badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    'MANAGER': { label: 'Gerente', icon: BarChart3, color: 'text-emerald-500', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    'SUPPORT': { label: 'Suporte', icon: MessageSquareText, color: 'text-amber-500', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  };

  return (
    <div className="min-h-screen bg-zinc-950 pb-12">
      
      {/* Header */}
      <div className="relative overflow-hidden bg-zinc-900 border-b border-zinc-800 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-amber-600/20 opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-sm mb-4 text-zinc-400">
            <Link href="/admin" className="hover:text-zinc-200 transition-colors">Dashboard</Link>
            <ChevronRight className="w-4 h-4 shrink-0" />
            <span className="text-white font-medium">Equipe</span>
          </nav>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-2xl shrink-0 text-orange-500">
                <Users className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Equipe</h1>
                <p className="text-zinc-400 text-sm mt-1">Gerencie os membros da equipe e seus níveis de acesso</p>
              </div>
            </div>
            {total >= 3 ? (
              <button disabled className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-zinc-800 text-zinc-500 font-bold rounded-xl cursor-not-allowed shrink-0">
                <PlusCircle className="w-5 h-5 shrink-0" />
                <span>Limite Atingido</span>
              </button>
            ) : (
              <Link href="/admin/team/create" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-500 transition shadow-lg shadow-orange-600/20 shrink-0">
                <PlusCircle className="w-5 h-5 shrink-0" />
                <span>Adicionar Membro</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-zinc-800 rounded-xl text-zinc-300 shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{total}</p>
                <p className="text-sm text-zinc-400">Total</p>
              </div>
            </div>
          </div>
          
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-500/10 rounded-xl text-purple-500 shrink-0">
                <Star className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{ownersCount}</p>
                <p className="text-sm text-zinc-400">Owners</p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{adminsCount}</p>
                <p className="text-sm text-zinc-400">Admins</p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500 shrink-0">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{othersCount}</p>
                <p className="text-sm text-zinc-400">Outros</p>
              </div>
            </div>
          </div>
        </div>

        {/* Plan Limit Info */}
        <div className="bg-orange-500/5 border border-orange-500/20 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="p-3 bg-orange-500/10 rounded-xl shrink-0">
            <Users className="w-6 h-6 text-orange-500" />
          </div>
          <div className="flex-1 min-w-0 w-full">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-white truncate">Limite de Administradores - Plano Iniciante</h3>
              <span className="text-sm font-semibold text-orange-500">{total}/3</span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-2.5 mb-2">
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 h-2.5 rounded-full transition-all duration-300" style={{ width: `${Math.min((total / 3) * 100, 100)}%` }}></div>
            </div>
            <p className="text-sm text-zinc-400">
              Pode adicionar mais {Math.max(3 - total, 0)} membro(s).
              <Link href="/admin/subscription" className="ml-2 font-semibold text-orange-500 hover:underline">Fazer Upgrade</Link>
            </p>
          </div>
        </div>

        {/* Mobile View */}
        <div className="lg:hidden space-y-4 mb-8">
          {team.map((member) => {
            const roleConfig = roleMap[member.role] || roleMap['SUPPORT'];
            const isOwner = member.email === tenant.owner_email;
            const Icon = isOwner ? roleMap['SUPER_ADMIN'].icon : roleConfig.icon;
            const displayBadge = isOwner ? roleMap['SUPER_ADMIN'].badge : roleConfig.badge;
            const displayLabel = isOwner ? 'Proprietário' : roleConfig.label;
            const displayIconColor = isOwner ? roleMap['SUPER_ADMIN'].color : roleConfig.color;
            const isYou = member.id === user.id;

            return (
              <div key={member.id} className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white font-bold text-lg shrink-0 uppercase">
                    {(member.full_name || "A")[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="font-bold text-white truncate">{member.full_name || "Sem Nome"}</p>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${displayBadge} shrink-0`}>
                        <Icon className="w-3.5 h-3.5" />
                        {displayLabel}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-400 truncate">{member.email}</p>
                    {isYou && <span className="text-xs text-orange-500 font-medium">(Você)</span>}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                  <span className="text-xs text-zinc-500">
                    Adicionado em {new Date(member.created_at).toLocaleDateString('pt-BR')}
                  </span>
                  {canEdit && (
                    <Link href={`/admin/team/${member.id}/edit`} className="p-2 text-zinc-400 hover:text-orange-500 hover:bg-orange-500/10 rounded-xl transition">
                      <Edit className="w-5 h-5" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop View */}
        <div className="hidden lg:block bg-zinc-900 rounded-2xl shadow-xl border border-zinc-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-zinc-950/50 border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Membro</th>
                  <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-zinc-400 uppercase tracking-wider">Nível</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-zinc-400 uppercase tracking-wider">Último Acesso</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-zinc-400 uppercase tracking-wider">Cadastrado em</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-zinc-400 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {team.map((member) => {
                  const roleConfig = roleMap[member.role] || roleMap['SUPPORT'];
                  const isOwner = member.email === tenant.owner_email;
                  const Icon = isOwner ? roleMap['SUPER_ADMIN'].icon : roleConfig.icon;
                  const displayBadge = isOwner ? roleMap['SUPER_ADMIN'].badge : roleConfig.badge;
                  const displayLabel = isOwner ? 'Proprietário' : roleConfig.label;
                  const isYou = member.id === user.id;

                  return (
                    <tr key={member.id} className="hover:bg-zinc-800/50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white font-bold uppercase">
                            {(member.full_name || "A")[0]}
                          </div>
                          <div>
                            <p className="font-bold text-white flex items-center gap-2">
                              {member.full_name || "Sem Nome"}
                              {isYou && <span className="text-xs text-orange-500 font-medium">(Você)</span>}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-zinc-300">{member.email}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${displayBadge}`}>
                          <Icon className="w-4 h-4" />
                          {displayLabel}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm text-zinc-500">há 1 dia</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm text-zinc-400">{new Date(member.created_at).toLocaleDateString('pt-BR')}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end">
                          {canEdit && (
                            <Link href={`/admin/team/${member.id}/edit`} className="p-2 text-zinc-400 hover:text-orange-500 hover:bg-orange-500/10 rounded-xl transition">
                              <Edit className="w-5 h-5" />
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Roles Info Footer */}
        <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-orange-500" />
            Níveis de Acesso
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800">
              <p className="font-bold text-purple-400 flex items-center gap-2 mb-1"><Star className="w-4 h-4" /> Proprietário</p>
              <p className="text-zinc-500">Acesso total ao sistema, faturamento e exclusão de contas.</p>
            </div>
            <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800">
              <p className="font-bold text-blue-400 flex items-center gap-2 mb-1"><ShieldCheck className="w-4 h-4" /> Administrador</p>
              <p className="text-zinc-500">Gerencia clientes, envios, configurações de caixas.</p>
            </div>
            <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800">
              <p className="font-bold text-emerald-400 flex items-center gap-2 mb-1"><BarChart3 className="w-4 h-4" /> Gerente</p>
              <p className="text-zinc-500">Visualiza relatórios e acompanha a operação diária.</p>
            </div>
            <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800">
              <p className="font-bold text-amber-400 flex items-center gap-2 mb-1"><MessageSquareText className="w-4 h-4" /> Suporte</p>
              <p className="text-zinc-500">Atende os clientes e responde tickets básicos.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
