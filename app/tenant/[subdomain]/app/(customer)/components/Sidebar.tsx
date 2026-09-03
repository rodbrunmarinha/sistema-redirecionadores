"use client";

import { useState, useEffect } from "react";
import { NavLink } from "./NavLink";
import { useTenantSettings } from "./TenantSettingsContext";
import { LogoutButton } from "./LogoutButton";
import { 
  Home, Package, Map, Archive, Bell, DollarSign, 
  ShoppingBag, ShoppingCart, MapPin, Calculator, 
  Scale, Headset, User, FileText, Menu, X, Store, ClipboardList, LogOut
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

interface SidebarProps {
  organizationName: string;
  firstName: string;
  fullName: string;
  suiteNumber: string;
  initials: string;
}

export function Sidebar({ organizationName, firstName, fullName, suiteNumber, initials }: SidebarProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { settings } = useTenantSettings();

  useEffect(() => {
    if (pathname?.includes('/app/store')) {
      setSidebarCollapsed(true);
    }
  }, [pathname]);

  const toggleCollapse = () => setSidebarCollapsed(!sidebarCollapsed);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/app/login");
    router.refresh();
  };

  const allMenuItems: Record<string, any> = {
    dashboard: { 
      name: "Início", 
      href: "/app", 
      icon: <Home className="w-5 h-5" />,
      iconBgClass: "bg-slate-100 dark:bg-slate-800/50",
      iconColorClass: "text-slate-600 dark:text-slate-300"
    },
    my_suite: { 
      name: "Meu Dock", 
      href: "/app/products", 
      icon: <Package className="w-5 h-5" />,
      iconBgClass: "bg-slate-100 dark:bg-slate-800/50",
      iconColorClass: "text-slate-600 dark:text-slate-300"
    },
    shipments: { 
      name: "Meus Envios", 
      href: "/app/shipments", 
      icon: <Map className="w-5 h-5" />,
      iconBgClass: "bg-slate-100 dark:bg-slate-800/50",
      iconColorClass: "text-slate-600 dark:text-slate-300"
    },
    boxes: { 
      name: "Caixas Recebidas", 
      href: "/app/boxes", 
      icon: <Archive className="w-5 h-5" />,
      iconBgClass: "bg-slate-100 dark:bg-slate-800/50",
      iconColorClass: "text-slate-600 dark:text-slate-300"
    },
    pre_alerts: { 
      name: "Pré-Alertas", 
      href: "/app/pre-alerts", 
      icon: <Bell className="w-5 h-5" />,
      iconBgClass: "bg-slate-100 dark:bg-slate-800/50",
      iconColorClass: "text-slate-600 dark:text-slate-300"
    },
    wallet: { 
      name: "Créditos", 
      href: "/app/wallet", 
      icon: <DollarSign className="w-5 h-5" />,
      iconBgClass: "bg-slate-100 dark:bg-slate-800/50",
      iconColorClass: "text-slate-600 dark:text-slate-300"
    },
    purchase_groups: { 
      name: "Grupos de Compra", 
      href: "/app/purchase-groups", 
      icon: <ShoppingBag className="w-5 h-5" />,
      iconBgClass: "bg-slate-100 dark:bg-slate-800/50",
      iconColorClass: "text-slate-600 dark:text-slate-300",
      hasDropdown: true,
      subItems: [
        { name: "Explorar Lojas", href: "/app/purchase-groups", icon: <Store className="w-4 h-4" /> },
        { name: "Meu Carrinho", href: "/app/purchase-groups/cart", icon: <ShoppingCart className="w-4 h-4" /> },
        { name: "Minhas Compras", href: "/app/purchase-groups/orders", icon: <ClipboardList className="w-4 h-4" /> }
      ]
    },
    online_purchases: { 
      name: "Compra Assistida", 
      href: "/app/online-purchases", 
      icon: <ShoppingBag className="w-5 h-5" />,
      iconBgClass: "bg-slate-100 dark:bg-slate-800/50",
      iconColorClass: "text-slate-600 dark:text-slate-300"
    },
    store: {
      name: "Loja Online",
      href: "/app/store",
      icon: <Store className="w-5 h-5" />,
      iconBgClass: "bg-slate-100 dark:bg-slate-800/50",
      iconColorClass: "text-slate-600 dark:text-slate-300",
      hasDropdown: true,
      subItems: [
        { name: "Explorar Loja", href: "/app/store", icon: <Store className="w-4 h-4" /> },
        { name: "Meu Carrinho", href: "/app/store/cart", icon: <ShoppingCart className="w-4 h-4" /> },
        { name: "Meus Pedidos", href: "/app/store/orders", icon: <ClipboardList className="w-4 h-4" /> }
      ]
    },
    addresses: { 
      name: "Meus Endereços", 
      href: "/app/addresses", 
      icon: <MapPin className="w-5 h-5" />,
      iconBgClass: "bg-slate-100 dark:bg-slate-800/50",
      iconColorClass: "text-slate-600 dark:text-slate-300"
    },
    shipping_simulator: { 
      name: "Calculadora de Frete", 
      href: "/app/shipping-calculator", 
      icon: <Calculator className="w-5 h-5" />,
      iconBgClass: "bg-slate-100 dark:bg-slate-800/50",
      iconColorClass: "text-slate-600 dark:text-slate-300"
    },
    import_calculator: { 
      name: "Calculadora de Importação", 
      href: "/app/import-calculator", 
      icon: <Scale className="w-5 h-5" />,
      iconBgClass: "bg-slate-100 dark:bg-slate-800/50",
      iconColorClass: "text-slate-600 dark:text-slate-300"
    },
    support: { 
      name: "Central de Ajuda", 
      href: "/app/support", 
      icon: <Headset className="w-5 h-5" />,
      iconBgClass: "bg-slate-100 dark:bg-slate-800/50",
      iconColorClass: "text-slate-600 dark:text-slate-300"
    },
    profile: { 
      name: "Meu Perfil", 
      href: "/app/profile", 
      icon: <User className="w-5 h-5" />,
      iconBgClass: "bg-slate-100 dark:bg-slate-800/50",
      iconColorClass: "text-slate-600 dark:text-slate-300"
    },
    terms: { 
      name: "Termos de Uso", 
      href: "/app/terms", 
      icon: <FileText className="w-5 h-5" />,
      iconBgClass: "bg-slate-100 dark:bg-slate-800/50",
      iconColorClass: "text-slate-600 dark:text-slate-300"
    }
  };

  const defaultMenuOrder = [
    'dashboard', 'my_suite', 'shipments', 'boxes', 'pre_alerts', 'wallet',
    'purchase_groups', 'online_purchases', 'store', 'addresses', 'shipping_simulator',
    'import_calculator', 'support', 'profile', 'terms'
  ];

  const adminMenus = settings?.menu?.menus;

  const menuItems = (() => {
    if (adminMenus && Array.isArray(adminMenus) && adminMenus.length > 0) {
      const activeItems = [];
      for (const item of adminMenus) {
        if (item.visible && allMenuItems[item.id]) {
          // We map over the admin definitions and grab the corresponding frontend object
          // We can also override the label if the admin changed it
          activeItems.push({
            ...allMenuItems[item.id],
            name: item.label || allMenuItems[item.id].name
          });
        }
      }
      
      // Always ensure terms is appended if not present (as it's usually static footer link)
      if (!activeItems.find(i => i.href === '/app/terms')) {
        activeItems.push(allMenuItems['terms']);
      }
      
      return activeItems;
    } else {
      // Fallback to default
      return defaultMenuOrder.map(id => allMenuItems[id]).filter(Boolean);
    }
  })();


  return (
    <>
      {/* Mobile Toggle Button (Visible only on lg and smaller when sidebar is closed) */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setSidebarOpen(true)}
          className={`p-4 bg-blue-600 text-white rounded-full shadow-xl shadow-blue-500/30 transition-all ${sidebarOpen ? 'scale-0' : 'scale-100'}`}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Backdrop for Mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:sticky inset-y-0 left-0 z-50 h-screen overflow-hidden backdrop-blur-xl transition-all duration-300 ease-in-out bg-gradient-to-b from-white/95 via-blue-50/95 to-indigo-50/95 dark:from-gray-900/95 dark:via-blue-950/95 dark:to-indigo-950/95 border-r border-blue-200/50 dark:border-blue-900/50 shadow-2xl shadow-blue-500/10 dark:shadow-blue-900/30 flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${sidebarCollapsed ? 'w-[4.5rem]' : 'w-72'}`}
      >
        {/* Sidebar Header / Logo */}
        <div className={`flex items-center border-b border-blue-200/30 dark:border-blue-800/30 bg-gradient-to-r from-white/50 to-blue-50/50 dark:from-gray-900/50 dark:to-blue-950/50 ${sidebarCollapsed ? 'justify-center px-2 py-4' : 'justify-between px-6 py-5'}`}>
          {!sidebarCollapsed && (
            <div className="flex items-center gap-4 w-full overflow-hidden">
              <div className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center shadow-lg ring-2 ring-white/50 dark:ring-gray-700/50 transition-all duration-300 hover:ring-4 hover:shadow-xl bg-gradient-to-br from-blue-600 to-blue-700">
                <span className="text-white font-bold text-xl">{organizationName.substring(0, 2).toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent truncate leading-tight">
                  {organizationName}
                </h2>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{firstName}</p>
              </div>
            </div>
          )}

          {/* Close button for mobile */}
          <button 
            onClick={() => setSidebarOpen(false)} 
            className="lg:hidden p-2.5 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all duration-200 flex-shrink-0 ml-auto"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>

          {/* Collapse Toggle for Desktop */}
          <button 
            onClick={toggleCollapse} 
            className="hidden lg:flex items-center justify-center p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors flex-shrink-0"
            title={sidebarCollapsed ? 'Expandir menu' : 'Recolher menu'}
          >
            <svg className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path>
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className={`flex-1 overflow-y-auto flex flex-col gap-1.5 sidebar-scrollbar ${sidebarCollapsed ? 'p-1.5' : 'p-4'}`}>
          {menuItems.map((item, idx) => (
            <NavLink
              key={idx}
              href={item.href}
              name={item.name}
              icon={item.icon}
              iconBgClass={item.iconBgClass}
              iconColorClass={item.iconColorClass}
              hasDropdown={item.hasDropdown}
              subItems={item.subItems}
              isCollapsed={sidebarCollapsed}
            />
          ))}
        </nav>

        {/* Footer - User Profile */}
        <div className={`border-t border-blue-200/30 dark:border-blue-800/30 ${sidebarCollapsed ? 'p-2' : 'p-4'}`}>
          <div className={`bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl ${sidebarCollapsed ? 'p-2' : 'p-4'}`}>
            <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
              
              {/* User Avatar */}
              <div className="relative flex-shrink-0">
                <div className={`rounded-full flex items-center justify-center font-bold shadow-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white ${sidebarCollapsed ? 'w-10 h-10 text-sm' : 'w-12 h-12 text-lg'}`}>
                  {initials}
                </div>
                <div className={`absolute -bottom-1 -right-1 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full ${sidebarCollapsed ? 'w-3 h-3' : 'w-4 h-4'}`}></div>
              </div>

              {!sidebarCollapsed && (
                <>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white truncate text-sm">
                      {fullName.toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                      Dock: {suiteNumber}
                    </p>
                  </div>

                  <div className="relative">
                    <button 
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)} 
                      className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition"
                    >
                      <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                      </svg>
                    </button>

                    {/* Dropdown menu */}
                    {userDropdownOpen && (
                      <div className="absolute bottom-full right-0 mb-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <button onClick={() => { router.push("/app/profile"); setUserDropdownOpen(false); }} className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition flex items-center gap-2">
                          <User className="w-4 h-4" /> Perfil
                        </button>
                        <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition flex items-center gap-2">
                          <LogOut className="w-4 h-4" /> Sair
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

      </aside>
    </>
  );
}
