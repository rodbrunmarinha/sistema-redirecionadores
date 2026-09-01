"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Settings, ShieldCheck, Undo2, Save, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { updateRolePermissions } from "./actions";

// Estrutura de permissões (agrupada por módulos para renderizar na UI)
const PERMISSION_MODULES = [
  {
    id: "dashboard",
    title: "Dashboard",
    description: "Visualização do painel principal",
    permissions: [{ id: "dashboard.view", label: "Visualizar" }],
  },
  {
    id: "users",
    title: "Clientes",
    description: "Gerenciamento de clientes",
    permissions: [
      { id: "users.view", label: "Visualizar" },
      { id: "users.create", label: "Criar" },
      { id: "users.edit", label: "Editar" },
      { id: "users.delete", label: "Excluir" },
    ],
  },
  {
    id: "packages",
    title: "Pacotes e Armazém",
    description: "Caixas recebidas, produtos e armazém",
    permissions: [
      { id: "packages.view", label: "Visualizar" },
      { id: "packages.create", label: "Criar" },
      { id: "packages.edit", label: "Editar" },
      { id: "packages.delete", label: "Excluir" },
    ],
  },
  {
    id: "shipments",
    title: "Envios",
    description: "Gerenciamento de envios",
    permissions: [
      { id: "shipments.view", label: "Visualizar" },
      { id: "shipments.create", label: "Criar" },
      { id: "shipments.edit", label: "Editar" },
      { id: "shipments.delete", label: "Excluir" },
    ],
  },
  {
    id: "credits",
    title: "Créditos",
    description: "Gerenciamento de carteira/créditos",
    permissions: [
      { id: "credits.view", label: "Visualizar" },
      { id: "credits.manage", label: "Gerenciar" },
    ],
  },
  {
    id: "online_purchases",
    title: "Compras Assistidas",
    description: "Compras online realizadas para clientes",
    permissions: [
      { id: "online_purchases.view", label: "Visualizar" },
      { id: "online_purchases.manage", label: "Gerenciar" },
    ],
  },
  {
    id: "purchase_groups",
    title: "Grupos de Compra",
    description: "Grupos de compra, pedidos e automações",
    permissions: [
      { id: "purchase_groups.view", label: "Visualizar" },
      { id: "purchase_groups.manage", label: "Gerenciar" },
    ],
  },
  {
    id: "store",
    title: "Loja Online",
    description: "Produtos e pedidos da loja online",
    permissions: [
      { id: "store.view", label: "Visualizar" },
      { id: "store.manage", label: "Gerenciar" },
    ],
  },
  {
    id: "coupons",
    title: "Cupons",
    description: "Cupons de desconto",
    permissions: [
      { id: "coupons.view", label: "Visualizar" },
      { id: "coupons.manage", label: "Gerenciar" },
    ],
  },
  {
    id: "marketing",
    title: "Marketing",
    description: "Pixels, links UTM, aniversariantes e afiliados",
    permissions: [{ id: "marketing.view", label: "Visualizar" }],
  },
  {
    id: "reports",
    title: "Relatórios",
    description: "Acesso a relatórios e análises",
    permissions: [
      { id: "reports.view", label: "Visualizar" },
      { id: "reports.export", label: "Exportar" },
    ],
  },
  {
    id: "support",
    title: "Suporte",
    description: "Tickets de suporte dos clientes",
    permissions: [
      { id: "support.view", label: "Visualizar" },
      { id: "support.manage", label: "Gerenciar" },
    ],
  },
  {
    id: "notifications",
    title: "Notificações Push",
    description: "Envio de notificações push",
    permissions: [
      { id: "notifications.view", label: "Visualizar" },
      { id: "notifications.manage", label: "Gerenciar" },
    ],
  },
  {
    id: "announcements",
    title: "Comunicados",
    description: "Comunicados para clientes",
    permissions: [
      { id: "announcements.view", label: "Visualizar" },
      { id: "announcements.manage", label: "Gerenciar" },
    ],
  },
  {
    id: "fiscal",
    title: "Notas Fiscais",
    description: "Faturas fiscais e séries de numeração",
    permissions: [
      { id: "fiscal.view", label: "Visualizar" },
      { id: "fiscal.manage", label: "Gerenciar" },
    ],
  },
  {
    id: "financial",
    title: "Módulo Financeiro",
    description: "Receitas, despesas e fluxo de caixa",
    permissions: [
      { id: "financial.view", label: "Visualizar" },
      { id: "financial.manage", label: "Gerenciar" },
    ],
  },
  {
    id: "vitrine",
    title: "Vitrine Shop",
    description: "Vitrine de provedores de conteúdo",
    permissions: [{ id: "vitrine.view", label: "Visualizar" }],
  },
  {
    id: "team",
    title: "Equipe",
    description: "Gerenciamento da equipe administrativa",
    permissions: [
      { id: "team.view", label: "Visualizar" },
      { id: "team.create", label: "Criar" },
      { id: "team.edit", label: "Editar" },
      { id: "team.delete", label: "Excluir" },
    ],
  },
  {
    id: "permissions",
    title: "Permissões",
    description: "Configuração de permissões por cargo",
    permissions: [{ id: "permissions.manage", label: "Gerenciar" }],
  },
  {
    id: "settings",
    title: "Configurações",
    description: "Configurações do sistema",
    permissions: [
      { id: "settings.view", label: "Visualizar" },
      { id: "settings.edit", label: "Editar" },
    ],
  },
];

const DEFAULT_PERMISSIONS = {
  ADMIN: PERMISSION_MODULES.flatMap((m) => m.permissions.map((p) => p.id)),
  MANAGER: [
    "dashboard.view", "users.view", "users.create", "users.edit", "users.delete",
    "packages.view", "packages.create", "packages.edit", "packages.delete",
    "shipments.view", "shipments.create", "shipments.edit", "shipments.delete"
  ],
  SUPPORT: ["dashboard.view", "users.view", "support.view", "support.manage"],
};

export default function PermissionsClient({
  tenant,
  rolePermissions,
}: {
  tenant: any;
  rolePermissions: Record<string, string[]>;
}) {
  const [activeTab, setActiveTab] = useState("owner");
  
  // Estado local para otimizar UI e salvar de uma vez
  const [permissions, setPermissions] = useState<Record<string, string[]>>({
    ADMIN: rolePermissions.ADMIN || DEFAULT_PERMISSIONS.ADMIN,
    MANAGER: rolePermissions.MANAGER || DEFAULT_PERMISSIONS.MANAGER,
    SUPPORT: rolePermissions.SUPPORT || DEFAULT_PERMISSIONS.SUPPORT,
  });
  
  const [loading, setLoading] = useState(false);

  const handleTogglePermission = (role: string, permissionId: string) => {
    setPermissions((prev) => {
      const rolePerms = prev[role] || [];
      if (rolePerms.includes(permissionId)) {
        return { ...prev, [role]: rolePerms.filter((p) => p !== permissionId) };
      } else {
        return { ...prev, [role]: [...rolePerms, permissionId] };
      }
    });
  };

  const handleSave = async (role: string) => {
    setLoading(true);
    try {
      const res = await updateRolePermissions(tenant.id, role, permissions[role]);
      if (res.error) throw new Error(res.error);
      toast.success(`Permissões do ${role} atualizadas com sucesso!`);
    } catch (err: any) {
      toast.error(err.message || "Ocorreu um erro ao salvar as permissões.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = (role: string) => {
    if (confirm(`Resetar para as permissões padrão de ${role}?`)) {
      setPermissions((prev) => ({
        ...prev,
        [role]: DEFAULT_PERMISSIONS[role as keyof typeof DEFAULT_PERMISSIONS] || [],
      }));
      toast.success("Permissões resetadas. Clique em Salvar para aplicar.");
    }
  };

  const isChecked = (role: string, permissionId: string) => {
    if (role === "owner") return true; // Proprietário tem tudo e não muda
    return (permissions[role] || []).includes(permissionId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100">
      {/* Cabeçalho igual à Cndck Hub Premium */}
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 shadow-lg shadow-orange-500/10">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 blur-xl"></div>
          <div className="absolute -bottom-16 -left-8 w-64 h-64 rounded-full bg-white/5 blur-2xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-sm mb-4" aria-label="Breadcrumb">
            <Link
              href="/admin"
              className="text-white/70 hover:text-white transition-colors truncate max-w-[45vw] sm:max-w-[220px]"
            >
              Dashboard
            </Link>
            <ChevronRight className="w-4 h-4 text-white/50 shrink-0" />
            <span className="text-white font-medium truncate max-w-[45vw] sm:max-w-[220px]">
              Permissões
            </span>
          </nav>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl shadow-lg shrink-0 border border-white/20">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-white truncate">
                Permissões
              </h1>
              <p className="text-amber-100/80 text-sm mt-1">
                Defina o que cada tipo de membro da equipe pode acessar no sistema
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl shadow-xl border border-zinc-800/50 overflow-hidden">
          {/* Tab Headers */}
          <div className="border-b border-zinc-800">
            <nav className="flex -mb-px overflow-x-auto flex-nowrap scrollbar-hide">
              {[
                { id: "owner", label: "Proprietário" },
                { id: "ADMIN", label: "Administrador" },
                { id: "MANAGER", label: "Gerente" },
                { id: "SUPPORT", label: "Suporte" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-amber-500 text-amber-500"
                      : "border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Contents */}
          <div className="p-4 sm:p-8">
            {activeTab === "owner" && (
              <div>
                <div className="bg-amber-950/30 border border-amber-900/50 rounded-xl p-4 sm:p-6 mb-8 flex items-start gap-4">
                  <ShieldCheck className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-amber-500">
                      Permissões do Proprietário
                    </h4>
                    <p className="text-sm text-amber-200/70 mt-1">
                      O proprietário possui acesso total ao sistema e não pode ter suas permissões alteradas. 
                      Essas são as permissões globais padrão.
                    </p>
                  </div>
                </div>
                {/* Renderização Disabled do Owner */}
                <div className="space-y-6">
                  {PERMISSION_MODULES.map((mod) => (
                    <div
                      key={mod.id}
                      className="bg-zinc-950/50 rounded-xl p-5 border border-zinc-800/50"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <h4 className="font-bold text-zinc-200 text-base">{mod.title}</h4>
                          <p className="text-sm text-zinc-500 mt-1">{mod.description}</p>
                          <div className="mt-4 space-y-3 flex flex-wrap gap-4">
                            {mod.permissions.map((perm) => (
                              <label
                                key={perm.id}
                                className="flex items-center gap-2 cursor-not-allowed opacity-60 w-full sm:w-auto min-w-[120px]"
                              >
                                <input
                                  type="checkbox"
                                  checked={true}
                                  disabled
                                  className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-amber-500 focus:ring-amber-500/20"
                                />
                                <span className="text-sm font-medium text-zinc-300">
                                  {perm.label}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {["ADMIN", "MANAGER", "SUPPORT"].includes(activeTab) && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                  <div>
                    <h3 className="text-lg font-bold text-zinc-100">
                      Permissões para {
                        activeTab === "ADMIN" ? "Administrador" :
                        activeTab === "MANAGER" ? "Gerente" : "Suporte"
                      }
                    </h3>
                    <p className="text-sm text-zinc-400 mt-1">
                      Selecione os módulos e ações que este cargo pode acessar
                    </p>
                  </div>
                  <button
                    onClick={() => handleReset(activeTab)}
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 transition text-sm font-medium border border-zinc-700"
                  >
                    <Undo2 className="w-4 h-4" />
                    Resetar Padrão
                  </button>
                </div>

                <div className="space-y-6">
                  {PERMISSION_MODULES.map((mod) => (
                    <div
                      key={mod.id}
                      className="bg-zinc-950/50 rounded-xl p-5 border border-zinc-800/50 hover:border-zinc-700 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <h4 className="font-bold text-zinc-200 text-base">{mod.title}</h4>
                          <p className="text-sm text-zinc-500 mt-1">{mod.description}</p>
                          <div className="mt-4 space-y-3 flex flex-wrap gap-4">
                            {mod.permissions.map((perm) => (
                              <label
                                key={perm.id}
                                className="flex items-center gap-2 cursor-pointer group w-full sm:w-auto min-w-[120px]"
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked(activeTab, perm.id)}
                                  onChange={() => handleTogglePermission(activeTab, perm.id)}
                                  className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-amber-500 focus:ring-amber-500/20 focus:ring-offset-zinc-900 cursor-pointer"
                                />
                                <span className="text-sm font-medium text-zinc-400 group-hover:text-zinc-200 transition-colors">
                                  {perm.label}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex items-center justify-end">
                  <button
                    onClick={() => handleSave(activeTab)}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold rounded-xl hover:from-orange-500 hover:to-amber-500 transition shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Save className="w-5 h-5" />
                    )}
                    Salvar Permissões
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
