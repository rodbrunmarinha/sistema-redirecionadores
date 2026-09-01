"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Building2, 
  Package, 
  Inbox, 
  Tags, 
  Search,
  Plane,
  Settings2,
  ShoppingBag,
  Store,
  Ticket,
  Star,
  Bell,
  BarChart,
  PieChart,
  DollarSign,
  FileText,
  Users,
  Receipt,
  CreditCard,
  Building,
  Shield,
  TicketIcon,
  Headphones,
  Settings,
  FileBox,
  Mail,
  Calculator,
  Truck,
  Sparkles,
  ScrollText,
  Plug,
  Monitor,
  Download,
  ChevronDown,
  ChevronRight,
  LogOut,
  User
} from "lucide-react";

type NavItem = {
  name: string;
  href?: string;
  icon: any;
  badge?: string;
  badgeType?: "enterprise" | "pro" | "new";
  permission?: string;
  submenu?: { name: string; href: string; badge?: string; badgeType?: "enterprise" | "pro" | "new"; permission?: string }[];
};

type NavSection = {
  title: string;
  items: NavItem[];
};

const menuData: NavSection[] = [
  {
    title: "Armazém",
    items: [
      { name: "Warehouse", href: "/admin/warehouse", permission: "packages.view", icon: Building2 },
      { name: "Pré-Alertas", href: "/admin/pre-alerts", permission: "packages.view", icon: Package },
      { name: "Caixas Recebidas", href: "/admin/boxes", permission: "packages.view", icon: Inbox },
      { name: "Produtos", href: "/admin/products", permission: "packages.view", icon: Tags },
      { name: "Auditoria", href: "/admin/audit", permission: "packages.view", icon: Search },
    ]
  },
  {
    title: "Logística",
    items: [
      { name: "Envios", href: "/admin/shipments", permission: "shipments.view", icon: Plane },
      { 
        name: "Serviços", 
        icon: Settings2,
        permission: "settings.view",
        submenu: [
          { name: "Catálogo", href: "/admin/services" },
          { name: "Ordens de Serviço", href: "/admin/service-orders" }
        ]
      }
    ]
  },
  {
    title: "Vendas",
    items: [
      { name: "Compras Assistidas", href: "/admin/online-purchases", permission: "online_purchases.view", icon: ShoppingBag },
      { 
        name: "Grupos de Compras", 
        icon: Store,
        permission: "purchase_groups.view",
        submenu: [
          { name: "Lojas / Grupos", href: "/admin/purchase-groups" },
          { name: "Gerenciar Categorias", href: "/admin/purchase-group-categories" },
          { name: "Pedidos", href: "/admin/purchase-group-orders" },
          { name: "🔴 Live Shopping", href: "/admin/live-shopping" },
          { name: "Automação", href: "/admin/purchase-groups-automation" },
          { name: "Telegram Bot", href: "/admin/settings/telegram-users" },
          { name: "WhatsApp QR", href: "/admin/settings/whatsapp" }
        ]
      },
      { name: "Vitrine Shop", href: "/admin/vitrine-shop", permission: "vitrine.view", icon: Store },
      {
        name: "Loja Online",
        icon: Store,
        permission: "store.view",


        submenu: [
          { name: "Dashboard", href: "/admin/store" },
          { name: "Categorias", href: "/admin/store/categories" },
          { name: "Produtos", href: "/admin/store/products" },
          { name: "Pedidos", href: "/admin/store/orders" }
        ]
      },
      { name: "Cupons", href: "/admin/coupons", permission: "coupons.view", icon: Ticket },
      { name: "Programas VIP", href: "/admin/vip-programs", permission: "marketing.view", icon: Star },
      {
        name: "Notificações Push",
        permission: "notifications.view",
        icon: Bell,
        submenu: [
          { name: "Enviar Notificação", href: "/admin/custom-notifications/create" },
          { name: "Histórico", href: "/admin/custom-notifications/history" }
        ]
      },
      {
        name: "Marketing",
        icon: BarChart,
        permission: "marketing.view",
        submenu: [
          { name: "Dashboard", href: "/admin/marketing" },
          { name: "Pixels", href: "/admin/marketing/pixels" },
          { name: "Links UTM", href: "/admin/marketing/links" }
        ]
      }
    ]
  },
  {
    title: "Gestão",
    items: [
      {
        name: "Analytics",
        icon: PieChart,
        permission: "reports.view",
        submenu: [
          { name: "Visão Geral", href: "/admin/analytics" },
          { name: "Comportamento", href: "/admin/analytics/behavior" }
        ]
      },
      { name: "Módulo Financeiro", href: "/admin/financial-module", permission: "financial.view", icon: DollarSign },
      { name: "Faturas Fiscais", href: "/admin/fiscal-invoices", permission: "fiscal.view", icon: FileText },
      { name: "Relatórios", href: "/admin/reports", permission: "reports.view", icon: BarChart },
      { name: "Clientes", href: "/admin/clients", permission: "users.view", icon: Users },
      { name: "Comprovantes de Pagamento", href: "/admin/manual-payments", permission: "financial.view", icon: Receipt },
      { name: "Créditos", href: "/admin/wallets", permission: "credits.view", icon: CreditCard },
      { name: "Minha Empresa", href: "/admin/account", permission: "settings.view", icon: Building },
      { name: "Equipe", href: "/admin/team", permission: "team.view", icon: Users },
      { name: "Permissões", href: "/admin/permissions", permission: "permissions.manage", icon: Shield }
    ]
  },
  {
    title: "Suporte",
    items: [
      { name: "Tickets de Clientes", href: "/admin/support-tickets", permission: "support.view", icon: TicketIcon },
      { name: "Suporte Cndck", href: "/admin/master-support", permission: "support.view", icon: Headphones }
    ]
  },
  {
    title: "Configurações",
    items: [
      { name: "Configurações Gerais", href: "/admin/settings", permission: "settings.view", icon: Settings },
      { name: "Documentos p/ Clientes", href: "/admin/documents", permission: "settings.view", icon: FileBox },
      { name: "E-mail SMTP", href: "/admin/settings/email", permission: "settings.view", icon: Mail },
      { name: "Calculadora Importação", href: "/admin/import-settings", permission: "settings.view", icon: Calculator },
      { name: "Tabela de Frete", href: "/admin/shipping", permission: "settings.view", icon: Truck },
      { name: "Serviços Extras", href: "/admin/extra-services", permission: "settings.view", icon: Sparkles },
      { name: "Termos de Envio", href: "/admin/shipping-terms", permission: "settings.view", icon: ScrollText },
      { name: "Termos de Uso", href: "/admin/terms-of-service", permission: "settings.view", icon: ScrollText },
      { name: "Integrações", href: "/admin/integrations", permission: "settings.view", icon: Plug },
      { name: "Landing Page", href: "/admin/landing-page", permission: "settings.view", icon: Monitor, badge: "NOVO", badgeType: "new" }
    ]
  },
  {
    title: "Migração",
    items: [
      { name: "Importar Usuários", href: "/admin/migration", icon: Download },
      { name: "Importar Caixas", href: "/admin/migration/boxes", permission: "settings.view", icon: Download },
      { name: "Importar Produtos", href: "/admin/migration/products", permission: "settings.view", icon: Download, badge: "NOVO", badgeType: "new" }
    ]
  }
];

export default function Sidebar({
  organizationName,
  userName,
  userRole,
  userInitials,
  userPermissions
}: {
  organizationName: string;
  userName: string;
  userRole: string;
  userInitials: string;
  userPermissions: string[];
}) {
  const pathname = usePathname();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const hasPermission = (permission?: string) => {
    if (!permission) return true;
    if (userPermissions?.includes('ALL')) return true;
    return userPermissions?.includes(permission);
  };

  const toggleSection = (title: string) => {
    setOpenSections(prev => ({ 
      ...prev, 
      [title]: prev[title] === undefined ? false : !prev[title] 
    }));
  };

  const toggleMenu = (name: string, menuActive?: boolean) => {
    setOpenMenus(prev => ({ 
      ...prev, 
      [name]: prev[name] === undefined ? !menuActive : !prev[name] 
    }));
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    if (href === "/admin") return pathname === "/admin";
    return pathname === href || pathname.startsWith(`${href}/`);
  };
  const isSubmenuActive = (submenu?: { href: string }[]) => 
    submenu?.some(sub => isActive(sub.href));

  return (
    <aside className="w-[18rem] bg-zinc-950 border-r border-zinc-800 flex flex-col h-screen sticky top-0 transition-all duration-300">
      
      {/* Logo/Header */}
      <div className="h-16 flex items-center px-6 border-b border-zinc-800 shrink-0">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500 to-yellow-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <span className="text-white text-sm font-bold tracking-wider">{organizationName.substring(0, 2).toUpperCase()}</span>
          </div>
          <span className="text-white font-bold text-lg truncate">{organizationName}</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 sidebar-scrollbar">
        
        {/* Dashboard Principial */}
        <Link 
          href="/admin" 
          className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
            isActive("/admin") 
              ? "bg-zinc-800 text-white" 
              : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
          }`}
        >
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
            isActive("/admin")
              ? "bg-orange-500/20 text-orange-400"
              : "bg-zinc-900 text-zinc-500 group-hover:bg-zinc-800 group-hover:text-zinc-300"
          }`}>
            <Monitor className="w-5 h-5" />
          </div>
          <span className="font-medium whitespace-nowrap">Dashboard</span>
        </Link>

        {menuData.map((section) => {
          const visibleItems = section.items.filter(item => hasPermission(item.permission));
          if (visibleItems.length === 0) return null;
          return (
          <div key={section.title} className="pt-2">
            <button 
              onClick={() => toggleSection(section.title)}
              className="w-full flex items-center justify-between pt-4 pb-2 px-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider hover:text-zinc-300 transition-colors"
            >
              <span>{section.title}</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${openSections[section.title] === false ? '' : 'rotate-180'}`} />
            </button>
            
            <div className={`space-y-1 ${openSections[section.title] === false ? 'hidden' : 'block'}`}>
              {section.items.filter(item => hasPermission(item.permission)).map((item) => {
                const Icon = item.icon;
                const hasSubmenu = !!item.submenu;
                const menuActive = isActive(item.href) || isSubmenuActive(item.submenu);
                const isMenuOpen = openMenus[item.name] || menuActive;

                const badgeStyles = {
                  enterprise: "bg-orange-500/10 text-orange-400 border-orange-500/20",
                  pro: "bg-purple-500/10 text-purple-400 border-purple-500/20",
                  new: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                };

                return (
                  <div key={item.name}>
                    {hasSubmenu ? (
                      <button 
                        onClick={() => toggleMenu(item.name, menuActive)}
                        className={`w-full group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                          menuActive
                            ? "text-white" 
                            : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                          menuActive
                            ? "bg-orange-500/20 text-orange-400"
                            : "bg-zinc-900 text-zinc-500 group-hover:bg-zinc-800 group-hover:text-zinc-300"
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="font-medium leading-tight flex-1 text-left">{item.name}</span>
                        {item.badge && (
                          <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-md border ${badgeStyles[item.badgeType!]}`}>
                            {item.badge}
                          </span>
                        )}
                        <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${isMenuOpen ? 'rotate-90' : ''}`} />
                      </button>
                    ) : (
                      <Link 
                        href={item.href!}
                        className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                          isActive(item.href)
                            ? "bg-zinc-800 text-white" 
                            : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                          isActive(item.href)
                            ? "bg-orange-500/20 text-orange-400"
                            : "bg-zinc-900 text-zinc-500 group-hover:bg-zinc-800 group-hover:text-zinc-300"
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="font-medium leading-tight flex-1">{item.name}</span>
                        {item.badge && (
                          <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-md border ${badgeStyles[item.badgeType!]}`}>
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    )}

                    {/* Submenu Items */}
                    {hasSubmenu && isMenuOpen && (
                      <div className="mt-1 ml-4 pl-4 border-l-2 border-zinc-800 space-y-1">
                        {item.submenu!.filter(sub => hasPermission(sub.permission)).map((sub) => (
                          <Link 
                            key={sub.name}
                            href={sub.href}
                            className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                              isActive(sub.href)
                                ? "text-orange-400 bg-zinc-800/50 font-medium"
                                : "text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-300"
                            }`}
                          >
                            <span className="leading-tight flex-1">{sub.name}</span>
                            {sub.badge && (
                              <span className={`px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-md border shrink-0 ${badgeStyles[sub.badgeType!]}`}>
                                {sub.badge}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ); 
      })}</nav>

      {/* Footer - User Profile */}
      <div className="p-3 border-t border-zinc-800 shrink-0">
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-3 flex items-center gap-3 relative group">
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-yellow-600 flex items-center justify-center text-white text-sm font-bold shadow-lg">
              {userInitials}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-zinc-900 rounded-full"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-white truncate text-sm">
              {userName}
            </p>
            <p className="text-xs text-zinc-500 truncate">
              {userRole}
            </p>
          </div>
          
          {/* Dropdown simplificado para logout e perfil */}
          <div className="absolute bottom-full left-0 mb-2 w-full bg-zinc-800 rounded-xl shadow-xl border border-zinc-700 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
            <Link href="/profile" className="flex items-center gap-2 px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-700 hover:text-white transition">
              <User className="w-4 h-4" />
              Meu Perfil
            </Link>
            <form action="/auth/signout" method="post">
              <button type="submit" className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition text-left">
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </form>
          </div>
        </div>
      </div>
      
    </aside>
  );
}
