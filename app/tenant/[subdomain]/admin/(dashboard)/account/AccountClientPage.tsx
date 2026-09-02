"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ChevronRight, Building2, User, Key, MonitorSmartphone, 
  CreditCard, AlertTriangle, ShieldCheck, Mail, Phone, FileText, CheckCircle2, Lock, Smartphone, RefreshCw, XCircle
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AccountClientPage({ tenant, profile, subdomain }: { tenant: any, profile: any, subdomain: string }) {
  const [activeTab, setActiveTab] = useState("profile");
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Form state
  const [companyName, setCompanyName] = useState(tenant?.organization_name || "");
  const [adminName, setAdminName] = useState(profile?.full_name || "");
  const [email, setEmail] = useState(profile?.email || "");
  const [phone, setPhone] = useState(profile?.phone || "");

  const initials = (tenant?.organization_name || "XX").substring(0, 2).toUpperCase();
  const joinDate = new Date(tenant?.created_at || Date.now()).toLocaleDateString('pt-BR');

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const { error: tErr } = await supabase
        .from('tenants')
        .update({ organization_name: companyName })
        .eq('id', tenant.id);
        
      if (tErr) throw tErr;

      const { error: pErr } = await supabase
        .from('profiles')
        .update({ full_name: adminName, phone })
        .eq('id', profile.id);
        
      if (pErr) throw pErr;

      toast.success("Perfil atualizado com sucesso!");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao atualizar perfil");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 pb-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Overview Card */}
        <div className="mb-8 relative overflow-hidden rounded-2xl shadow-2xl border border-zinc-800">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50"></div>
          
          <div className="relative p-6 sm:p-8">
            <nav className="flex items-center gap-2 text-sm mb-6 text-white/70">
              <Link href="/admin" className="hover:text-white transition-colors">Dashboard</Link>
              <ChevronRight className="w-3.5 h-3.5 shrink-0" />
              <span className="text-white font-medium">Minha Empresa</span>
            </nav>

            <div className="flex flex-col md:flex-row md:items-center gap-6 sm:gap-8">
              {/* Avatar */}
              <div className="relative group shrink-0">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-4xl md:text-5xl font-bold text-white border-2 border-white/30 shadow-xl group-hover:scale-105 transition-all duration-300">
                  {initials}
                </div>
                <div className="absolute -bottom-2 -right-2 p-1.5 bg-emerald-500 rounded-xl border-4 border-orange-600 shadow-lg">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
              </div>
              
              {/* Info */}
              <div className="flex-1 text-white min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl sm:text-3xl font-bold truncate">{tenant?.organization_name || "Empresa"}</h3>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-400/20 text-emerald-100 border border-emerald-400/30 backdrop-blur-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    Ativa
                  </span>
                </div>
                
                <p className="text-white/80 text-sm mb-1">{profile?.full_name || "Admin"}</p>
                <div className="flex items-center gap-2 text-white/80 text-sm mb-6">
                  <Mail className="w-4 h-4" />
                  <span>{profile?.email}</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-3 border border-white/10">
                    <div className="text-xs uppercase tracking-wider text-white/60 mb-1">Plano Atual</div>
                    <div className="text-lg font-bold">Starter</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-3 border border-white/10">
                    <div className="text-xs uppercase tracking-wider text-white/60 mb-1">Assinatura</div>
                    <div className="text-lg font-bold">Ativa</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-3 border border-white/10">
                    <div className="text-xs uppercase tracking-wider text-white/60 mb-1">Membro desde</div>
                    <div className="text-lg font-bold">{joinDate}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content with Tabs */}
        <div className="bg-zinc-900 rounded-2xl shadow-xl border border-zinc-800 overflow-hidden">
          
          {/* Tabs Navigation */}
          <div className="bg-zinc-950/50 border-b border-zinc-800 px-4 pt-4 flex overflow-x-auto scrollbar-hide gap-2">
            {[
              { id: 'profile', label: 'Perfil', icon: User },
              { id: 'security', label: 'Segurança', icon: ShieldCheck },
              { id: 'sessions', label: 'Sessões', icon: MonitorSmartphone },
              { id: 'subscription', label: 'Assinatura', icon: CreditCard },
              { id: 'danger', label: 'Perigo', icon: AlertTriangle }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 text-sm font-medium rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
                    isActive 
                      ? tab.id === 'danger'
                        ? 'bg-zinc-900 text-red-500 border-red-500' 
                        : 'bg-zinc-900 text-orange-500 border-orange-500'
                      : 'text-zinc-400 border-transparent hover:text-zinc-200 hover:bg-zinc-900/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="p-6 sm:p-8">
            
            {/* TAB: PROFILE */}
            {activeTab === 'profile' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-3 mb-1">
                    <div className="p-2 bg-orange-500/10 rounded-xl text-orange-500">
                      <Building2 className="w-5 h-5" />
                    </div>
                    Informações da Empresa
                  </h3>
                  <p className="text-sm text-zinc-400 ml-12">Atualize os dados da sua empresa e responsável</p>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="flex items-center gap-2 text-sm font-semibold text-zinc-300 mb-2">
                        <Building2 className="w-4 h-4 text-zinc-500" /> Nome da Empresa *
                      </label>
                      <input 
                        type="text" 
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        required 
                        className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                      />
                    </div>
                    
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-zinc-300 mb-2">
                        <User className="w-4 h-4 text-zinc-500" /> Nome do Responsável *
                      </label>
                      <input 
                        type="text" 
                        value={adminName}
                        onChange={(e) => setAdminName(e.target.value)}
                        required 
                        className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-zinc-300 mb-2">
                        <Mail className="w-4 h-4 text-zinc-500" /> E-mail (Acesso) *
                      </label>
                      <input 
                        type="email" 
                        value={email}
                        disabled
                        className="w-full px-4 py-3 bg-zinc-950/50 border border-zinc-800 rounded-xl text-zinc-500 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-zinc-300 mb-2">
                        <Phone className="w-4 h-4 text-zinc-500" /> Telefone WhatsApp
                      </label>
                      <input 
                        type="text" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-zinc-300 mb-2">
                        <FileText className="w-4 h-4 text-zinc-500" /> CPF / CNPJ
                      </label>
                      <input 
                        type="text" 
                        disabled
                        placeholder="Configurado no registro"
                        className="w-full px-4 py-3 bg-zinc-950/50 border border-zinc-800 rounded-xl text-zinc-500 cursor-not-allowed"
                      />
                      <p className="mt-1 text-xs text-zinc-500">Documento base cadastrado não pode ser alterado aqui.</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-zinc-800 gap-4">
                    <p className="text-xs text-zinc-500 flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5" /> Seus dados estão protegidos
                    </p>
                    <button 
                      type="submit" 
                      disabled={saving}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-600/20"
                    >
                      {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                      {saving ? "Salvando..." : "Salvar Alterações"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB: SECURITY */}
            {activeTab === 'security' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="border border-zinc-800 bg-zinc-950/50 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <Key className="w-5 h-5 text-orange-500" /> Alterar Senha
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-zinc-300 mb-2">Senha Atual *</label>
                      <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:ring-2 focus:ring-orange-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-zinc-300 mb-2">Nova Senha *</label>
                      <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:ring-2 focus:ring-orange-500 outline-none" />
                    </div>
                    <div className="flex justify-end pt-4">
                      <button className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-xl transition-all">
                        Atualizar Senha
                      </button>
                    </div>
                  </div>
                </div>

                <div className="border border-orange-500/20 bg-orange-500/5 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                      <Smartphone className="w-5 h-5 text-orange-500" /> Autenticação de Dois Fatores (2FA)
                    </h3>
                    <p className="text-sm text-zinc-400">Adicione uma camada extra de segurança usando o Google Authenticator.</p>
                  </div>
                  <span className="px-3 py-1 bg-orange-500/10 text-orange-400 text-xs font-bold uppercase rounded-lg border border-orange-500/20 whitespace-nowrap">
                    Em breve
                  </span>
                </div>
              </div>
            )}

            {/* TAB: SESSIONS */}
            {activeTab === 'sessions' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 flex gap-4">
                  <MonitorSmartphone className="w-5 h-5 text-orange-500 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-white">Sessões Ativas</p>
                    <p className="text-xs text-zinc-400 mt-1">Sessões conectadas usando sua conta de administrador. Encerre atividades suspeitas.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-zinc-950 border border-emerald-500/30 flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                      <MonitorSmartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-white text-sm">Chrome · Windows</span>
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 rounded-md">ATUAL</span>
                      </div>
                      <p className="text-xs text-zinc-400">IP: 138.59.122.199</p>
                      <p className="text-xs text-zinc-500 mt-1">Online agora</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-zinc-800">
                  <button className="px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold rounded-xl border border-red-500/20 transition-all flex items-center gap-2">
                    <XCircle className="w-4 h-4" /> Encerrar Outras Sessões
                  </button>
                </div>
              </div>
            )}

            {/* TAB: SUBSCRIPTION */}
            {activeTab === 'subscription' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="rounded-2xl border border-zinc-800 overflow-hidden bg-zinc-950/50">
                  <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white">Starter</h3>
                      <p className="text-orange-100/80">Assinatura Mensal Dock Drop</p>
                    </div>
                    <div className="sm:text-right">
                      <div className="text-3xl font-bold text-white">R$ 368,79</div>
                      <div className="text-orange-100/80 text-sm">/mês</div>
                    </div>
                  </div>
                  
                  <div className="p-6 sm:p-8">
                    <div className="flex items-center justify-between pb-6 border-b border-zinc-800">
                      <div className="flex items-center gap-3">
                        <span className="text-zinc-400 font-medium">Status:</span>
                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Ativa
                        </span>
                      </div>
                      <span className="text-sm text-zinc-400">Próxima cobrança: 22/08/2026</span>
                    </div>

                    <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="font-bold text-white mb-4">Seus Limites</h4>
                        <ul className="space-y-3">
                          <li className="flex items-center gap-3 text-sm text-zinc-300">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Clientes Ilimitados
                          </li>
                          <li className="flex items-center gap-3 text-sm text-zinc-300">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Até 3 usuários admin
                          </li>
                          <li className="flex items-center gap-3 text-sm text-zinc-300">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Carteira Integrada e Grupo de Compras
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-bold text-white mb-4">Pagamento</h4>
                        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center gap-4">
                          <div className="w-12 h-8 bg-white rounded flex items-center justify-center shrink-0">
                            <CreditCard className="w-6 h-6 text-zinc-800" />
                          </div>
                          <div>
                            <p className="text-white font-bold text-sm">Mastercard final 3447</p>
                            <p className="text-xs text-zinc-400">Expira em 12/28</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: DANGER */}
            {activeTab === 'danger' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/20">
                  <h3 className="text-xl font-bold text-red-500 mb-2">Excluir Conta Permanentemente</h3>
                  <p className="text-sm text-red-400/80 mb-6">
                    Aviso: isso vai deletar todos os dados do seu sistema, histórico de clientes, transações e configurações. É irreversível.
                  </p>
                  <button className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-600/20">
                    Excluir Minha Empresa
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
