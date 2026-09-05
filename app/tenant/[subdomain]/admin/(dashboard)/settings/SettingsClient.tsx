"use client";

import { useState } from "react";
import { 
  Palette, 
  Settings, 
  MapPin, 
  TrendingUp, 
  MenuSquare, 
  Link as LinkIcon, 
  Bell,
  ChevronRight,
  Loader2,
  Calculator
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { BrandingTab } from "./_components/BrandingTab";
import { OperationsTab } from "./_components/OperationsTab";
import { ServiceFeesTab } from "./_components/ServiceFeesTab";
import { AddressTab } from "./_components/AddressTab";
import { ConversionTab } from "./_components/ConversionTab";
import { MenuTab } from "./_components/MenuTab";
import { QuickLinksTab } from "./_components/QuickLinksTab";
import { NotificationsTab } from "./_components/NotificationsTab";
import { updateTenantSettings } from "./_actions/settings";

type TabKey = 'branding' | 'operations' | 'service_fees' | 'address' | 'conversion' | 'menu' | 'quick_links' | 'notifications';

export function SettingsClient({ tenantId, subdomain, initialSettings }: { tenantId?: string, subdomain?: string, initialSettings?: any }) {
  const [activeTab, setActiveTab] = useState<TabKey>('branding');
  const [isSaving, setIsSaving] = useState(false);
  
  // Centralized State
  const [settings, setSettings] = useState({
    branding: initialSettings?.branding || {},
    operations: initialSettings?.operations || {},
    address: initialSettings?.address || {},
    conversion: initialSettings?.conversion || {},
    menu: initialSettings?.menu || {},
    quick_links: initialSettings?.quick_links || {},
    notifications: initialSettings?.notifications || {},
    service_fee_strategy: initialSettings?.service_fee_strategy || 'NONE',
    service_fee_tiers: initialSettings?.service_fee_tiers || [],
    service_fee_charge_store_percentage: initialSettings?.service_fee_charge_store_percentage || false,
  });

  const handleUpdate = (tabKey: TabKey, newValues: any) => {
    setSettings(prev => ({
      ...prev,
      // @ts-ignore
      [tabKey]: { ...prev[tabKey], ...newValues }
    }));
  };

  const handleSave = async () => {
    if (!tenantId || !subdomain) return;
    
    setIsSaving(true);
    const toastId = toast.loading('Salvando configurações...');
    
    try {
      const result = await updateTenantSettings(tenantId, settings, subdomain);
      if (result.success) {
        toast.success('Configurações salvas com sucesso!', { id: toastId });
      } else {
        toast.error(result.error || 'Erro ao salvar configurações.', { id: toastId });
      }
    } catch (err) {
      toast.error('Erro inesperado ao salvar.', { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { key: 'branding', label: 'Aparência', icon: Palette, description: 'Logos, cores e tema' },
    { key: 'operations', label: 'Operacional', icon: Settings, description: 'Moedas, taxas e regras' },
    { key: 'service_fees', label: 'Taxas de Serviço', icon: Calculator, description: 'Regras de cobrança' },
    { key: 'address', label: 'Endereço', icon: MapPin, description: 'Endereço do dock' },
    { key: 'conversion', label: 'Conversão', icon: TrendingUp, description: 'Checkout e tracking' },
    { key: 'menu', label: 'Menu', icon: MenuSquare, description: 'Navegação do cliente' },
    { key: 'quick_links', label: 'Acesso Rápido', icon: LinkIcon, description: 'Links do painel' },
    { key: 'notifications', label: 'Notificações', icon: Bell, description: 'Alertas e avisos' },
  ] as const;

  return (
    <div className="w-full pb-10">
      <div className="relative overflow-hidden bg-gradient-to-r from-zinc-800 via-zinc-900 to-black shadow-lg shadow-zinc-900/20 pb-16">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5 pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-8 w-64 h-64 rounded-full bg-white/5 pointer-events-none"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-sm mb-3" aria-label="Breadcrumb">
            <Link href={`/admin`} className="text-white/70 hover:text-white transition-colors truncate max-w-[45vw] sm:max-w-[220px]">
              Dashboard
            </Link>
            <ChevronRight className="w-4 h-4 text-white/50 shrink-0" />
            <span className="text-white font-medium truncate">Configurações da Empresa</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Configurações da Empresa
              </h1>
              <p className="text-zinc-400 mt-1 sm:mt-2 text-sm sm:text-base max-w-2xl">
                Gerencie todos os aspectos da sua operação. As alterações feitas aqui refletirão diretamente no painel dos seus clientes.
              </p>
            </div>
            <div className="flex-shrink-0 flex gap-3">
               <button
                 type="button"
                 onClick={handleSave}
                 disabled={isSaving}
                 className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg shadow-md shadow-amber-500/20 transition-all focus:ring-2 focus:ring-amber-500/50"
               >
                 {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                 {isSaving ? 'Salvando...' : 'Salvar Alterações'}
               </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-20 relative z-10">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          
          {/* Sidebar Tabs */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 p-2 sm:sticky sm:top-24 flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible custom-scrollbar">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all whitespace-nowrap lg:whitespace-normal flex-shrink-0 lg:flex-shrink
                      ${isActive 
                        ? 'bg-amber-500/10 text-amber-500 font-medium' 
                        : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                      }
                    `}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-amber-500' : 'text-zinc-400'}`} />
                    <div className="flex flex-col items-start text-left hidden sm:flex">
                      <span className="text-sm">{tab.label}</span>
                      <span className="text-[10px] opacity-70 hidden lg:block">{tab.description}</span>
                    </div>
                    {/* For mobile just show label next to icon */}
                    <span className="text-sm sm:hidden">{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 min-w-0">
            {activeTab === 'branding' && (
              <BrandingTab 
                data={settings.branding} 
                onChange={(data: any) => handleUpdate('branding', data)} 
                tenantId={tenantId}
              />
            )}
            {activeTab === 'operations' && <OperationsTab data={settings.operations} onChange={(data: any) => handleUpdate('operations', data)} />}
            {activeTab === 'service_fees' && <ServiceFeesTab settings={settings} onChange={(updates: any) => setSettings(prev => ({ ...prev, ...updates }))} />}
            {activeTab === 'address' && <AddressTab data={settings.address} onChange={(data: any) => handleUpdate('address', data)} />}
            {activeTab === 'conversion' && <ConversionTab data={settings.conversion} onChange={(data: any) => handleUpdate('conversion', data)} />}
            {activeTab === 'menu' && <MenuTab data={settings.menu} onChange={(data: any) => handleUpdate('menu', data)} />}
            {activeTab === 'quick_links' && <QuickLinksTab data={settings.quick_links} onChange={(data: any) => handleUpdate('quick_links', data)} />}
            {activeTab === 'notifications' && <NotificationsTab data={settings.notifications} onChange={(data: any) => handleUpdate('notifications', data)} />}
          </div>
        </div>
      </div>
    </div>
  );
}
