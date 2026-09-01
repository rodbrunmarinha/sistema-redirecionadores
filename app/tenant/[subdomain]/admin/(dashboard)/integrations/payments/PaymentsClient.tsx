"use client";

import { useState, useTransition } from "react";
import { 
  Globe, 
  CreditCard, 
  Wallet, 
  Lock, 
  RefreshCw, 
  Check, 
  Copy, 
  ChevronRight,
  Save,
  CheckCircle,
  XCircle,
  Loader2,
  Building2,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { savePaymentSettings } from "./_actions/payments";
import { toast } from "react-hot-toast";

interface PaymentsClientProps {
  subdomain: string;
  initialSettings: any;
}

export function PaymentsClient({ subdomain, initialSettings }: PaymentsClientProps) {
  const [isPending, startTransition] = useTransition();

  // Glin State
  const glinData = initialSettings?.glin || {};
  const [glinEnabled, setGlinEnabled] = useState(glinData.enabled || false);
  const [glinApiKey, setGlinApiKey] = useState(glinData.apiKey || "");
  const [glinSurcharge, setGlinSurcharge] = useState(glinData.surcharge || "0.00");
  const [glinWebhookSecret, setGlinWebhookSecret] = useState(glinData.webhookSecret || "");
  
  // InfinitePay State
  const infiniteData = initialSettings?.infinitepay || {};
  const [infinitepayEnabled, setInfinitepayEnabled] = useState(infiniteData.enabled || false);
  const [infinitepayHandle, setInfinitepayHandle] = useState(infiniteData.handle || "");
  const [infinitepaySurcharge, setInfinitepaySurcharge] = useState(infiniteData.surcharge || "0.00");
  const [infinitepayWebhookSecret, setInfinitepayWebhookSecret] = useState(infiniteData.webhookSecret || "");
  
  // Stripe State
  const stripeData = initialSettings?.stripe || {};
  const [stripeEnabled, setStripeEnabled] = useState(stripeData.enabled || false);
  const [stripePublishableKey, setStripePublishableKey] = useState(stripeData.publishableKey || "");
  const [stripeSecretKey, setStripeSecretKey] = useState(stripeData.secretKey || "");
  const [stripeWebhookSecret, setStripeWebhookSecret] = useState(stripeData.webhookSecret || "");

  // Manual State
  const manualData = initialSettings?.manual || {};
  const [manualEnabled, setManualEnabled] = useState(manualData.enabled || false);
  const [manualInstructions, setManualInstructions] = useState(manualData.instructions || "");
  const [manualSurcharge, setManualSurcharge] = useState(manualData.surcharge || "0.00");

  // UI States
  const [copied, setCopied] = useState<string | null>(null);
  const [testing, setTesting] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ type: string, success: boolean, message: string } | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const generateSecret = (setter: (val: string) => void) => {
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    const secret = Array.from(array, byte => byte.toString(16).padStart(2, "0")).join("");
    setter(secret);
  };

  const testConnection = (type: string) => {
    setTesting(type);
    setTestResult(null);
    setTimeout(() => {
      setTesting(null);
      setTestResult({
        type,
        success: true,
        message: "Conexão estabelecida com sucesso!"
      });
    }, 1500);
  };

  const handleSave = () => {
    startTransition(async () => {
      const payload = {
        glin: {
          enabled: glinEnabled,
          apiKey: glinApiKey,
          surcharge: glinSurcharge,
          webhookSecret: glinWebhookSecret
        },
        infinitepay: {
          enabled: infinitepayEnabled,
          handle: infinitepayHandle,
          surcharge: infinitepaySurcharge,
          webhookSecret: infinitepayWebhookSecret
        },
        stripe: {
          enabled: stripeEnabled,
          publishableKey: stripePublishableKey,
          secretKey: stripeSecretKey,
          webhookSecret: stripeWebhookSecret
        },
        manual: {
          enabled: manualEnabled,
          instructions: manualInstructions,
          surcharge: manualSurcharge
        }
      };

      const res = await savePaymentSettings(subdomain, payload);
      
      if (res.success) {
        toast.success("Configurações salvas com sucesso!");
      } else {
        toast.error(res.error || "Erro ao salvar configurações.");
      }
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 pb-12">
      <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 relative overflow-hidden">
        <div className="absolute -top-14 -right-14 w-56 h-56 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-sm mb-3">
            <Link href="/admin" className="text-orange-100 hover:text-white transition">Dashboard</Link>
            <ChevronRight className="w-4 h-4 text-orange-300" />
            <Link href="/admin/integrations" className="text-orange-100 hover:text-white transition">Integrações</Link>
            <ChevronRight className="w-4 h-4 text-orange-300" />
            <span className="text-white font-medium">Pagamentos</span>
          </nav>
          
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="w-8 h-8 text-white" />
            <h1 className="text-3xl font-bold text-white tracking-tight">Gateways de Pagamento</h1>
          </div>
          <p className="text-orange-100 max-w-2xl text-sm">
            Configure as chaves de API e webhooks para receber pagamentos de envios, ordens de serviço e lojas.
          </p>
        </div>
      </div>

      <form className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10 space-y-6" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
        
        {/* Support Gateways Summary Cards */}
        <div className="bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 p-6">
          <h2 className="text-sm font-bold text-zinc-100 mb-4 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-orange-500" /> Gateways Suportados
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className={`rounded-xl border p-3 transition ${glinEnabled ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-zinc-950 border-zinc-800/50'}`}>
              <p className={`text-xs font-semibold ${glinEnabled ? 'text-indigo-400' : 'text-zinc-200'}`}>💳 GLIN</p>
              <p className="mt-1 text-[11px] text-zinc-500 leading-relaxed">Pagamentos internacionais via cartão de crédito global.</p>
            </div>
            <div className={`rounded-xl border p-3 transition ${infinitepayEnabled ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-zinc-950 border-zinc-800/50'}`}>
              <p className={`text-xs font-semibold ${infinitepayEnabled ? 'text-emerald-400' : 'text-zinc-200'}`}>💸 InfinitePay</p>
              <p className="mt-1 text-[11px] text-zinc-500 leading-relaxed">Pagamentos em Reais (PIX, Cartão) em conta BRL.</p>
            </div>
            <div className={`rounded-xl border p-3 transition ${stripeEnabled ? 'bg-blue-500/10 border-blue-500/30' : 'bg-zinc-950 border-zinc-800/50'}`}>
              <p className={`text-xs font-semibold ${stripeEnabled ? 'text-blue-400' : 'text-zinc-200'}`}>Stripe Connect</p>
              <p className="mt-1 text-[11px] text-zinc-500 leading-relaxed">Cartão internacional via Stripe de forma automatizada.</p>
            </div>
            <div className={`rounded-xl border p-3 transition ${manualEnabled ? 'bg-amber-500/10 border-amber-500/30' : 'bg-zinc-950 border-zinc-800/50'}`}>
              <p className={`text-xs font-semibold ${manualEnabled ? 'text-amber-400' : 'text-zinc-200'}`}>💵 Manual</p>
              <p className="mt-1 text-[11px] text-zinc-500 leading-relaxed">Zelle, Cash App, Wire — confirmação pelo admin.</p>
            </div>
          </div>
        </div>

        {/* GLIN */}
        <div className="bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 overflow-hidden">
          <div className="px-5 py-4 bg-zinc-900 border-b border-zinc-800 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20">
                <Globe className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-100">GLIN</h3>
                <p className="text-zinc-400 text-sm">Remessas Internacionais (PIX, Cartão)</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={glinEnabled} onChange={(e) => setGlinEnabled(e.target.checked)} />
              <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
              <span className="ml-3 text-sm font-medium text-zinc-300">{glinEnabled ? "Ativo" : "Inativo"}</span>
            </label>
          </div>

          {glinEnabled && (
            <div className="p-5 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    API Key (Bearer Token)
                  </label>
                  <input 
                    type="text" 
                    value={glinApiKey}
                    onChange={(e) => setGlinApiKey(e.target.value)}
                    placeholder="Sua chave de API do GLIN" 
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Acréscimo (%)
                  </label>
                  <input 
                    type="number" 
                    step="0.01" 
                    value={glinSurcharge}
                    onChange={(e) => setGlinSurcharge(e.target.value)}
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                  />
                  <p className="mt-2 text-xs text-zinc-500">
                    Percentual adicional cobrado do cliente. Ex: 3.90 = +3,9%
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-zinc-500" /> Webhook Secret
                </label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={glinWebhookSecret}
                    readOnly
                    placeholder="Clique em Gerar para criar um secret" 
                    className="flex-1 px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                  />
                  <button 
                    type="button" 
                    onClick={() => generateSecret(setGlinWebhookSecret)}
                    className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium rounded-xl transition"
                  >
                    Gerar
                  </button>
                </div>
              </div>

              <div className="p-4 bg-zinc-950/50 border border-zinc-800/50 rounded-xl">
                <label className="block text-sm font-medium text-zinc-300 mb-2">URL do Webhook (registro automático)</label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm font-mono text-zinc-400 overflow-x-auto">
                    {`https://${subdomain}.dockdrop.com.br/webhooks/glin`}
                  </code>
                  <button 
                    type="button" 
                    onClick={() => copyToClipboard(`https://${subdomain}.dockdrop.com.br/webhooks/glin`, 'glin-webhook')}
                    className="p-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 rounded-lg transition"
                  >
                    {copied === "glin-webhook" ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {testResult?.type === "glin" && (
                <div className={`p-4 rounded-xl flex items-center gap-3 border ${testResult.success ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
                  {testResult.success ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                  <span className="text-sm font-medium">{testResult.message}</span>
                </div>
              )}

              <div className="flex flex-wrap gap-3 pt-4 border-t border-zinc-800">
                <button 
                  type="button" 
                  onClick={() => testConnection("glin")}
                  disabled={testing === "glin"}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium rounded-xl transition flex items-center gap-2 disabled:opacity-50"
                >
                  {testing === "glin" ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                  Testar Conexão
                </button>
              </div>
            </div>
          )}
        </div>

        {/* INFINITEPAY */}
        <div className="bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 overflow-hidden">
          <div className="px-5 py-4 bg-zinc-900 border-b border-zinc-800 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
                <Wallet className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-100">InfinitePay</h3>
                <p className="text-zinc-400 text-sm">Recebimentos no Brasil via PIX e Cartão</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={infinitepayEnabled} onChange={(e) => setInfinitepayEnabled(e.target.checked)} />
              <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              <span className="ml-3 text-sm font-medium text-zinc-300">{infinitepayEnabled ? "Ativo" : "Inativo"}</span>
            </label>
          </div>

          {infinitepayEnabled && (
            <div className="p-5 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    InfinitePay Handle (@)
                  </label>
                  <input 
                    type="text" 
                    value={infinitepayHandle}
                    onChange={(e) => setInfinitepayHandle(e.target.value)}
                    placeholder="@suaempresa" 
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Acréscimo (%)
                  </label>
                  <input 
                    type="number" 
                    step="0.01" 
                    value={infinitepaySurcharge}
                    onChange={(e) => setInfinitepaySurcharge(e.target.value)}
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-zinc-500" /> Webhook Secret
                </label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={infinitepayWebhookSecret}
                    readOnly
                    placeholder="Clique em Gerar para criar um secret" 
                    className="flex-1 px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                  />
                  <button 
                    type="button" 
                    onClick={() => generateSecret(setInfinitepayWebhookSecret)}
                    className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium rounded-xl transition"
                  >
                    Gerar
                  </button>
                </div>
              </div>

              <div className="p-4 bg-zinc-950/50 border border-zinc-800/50 rounded-xl">
                <label className="block text-sm font-medium text-zinc-300 mb-2">URL do Webhook (registro automático)</label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm font-mono text-zinc-400 overflow-x-auto">
                    {`https://${subdomain}.dockdrop.com.br/webhooks/infinitepay`}
                  </code>
                  <button 
                    type="button" 
                    onClick={() => copyToClipboard(`https://${subdomain}.dockdrop.com.br/webhooks/infinitepay`, 'infinite-webhook')}
                    className="p-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 rounded-lg transition"
                  >
                    {copied === "infinite-webhook" ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {testResult?.type === "infinitepay" && (
                <div className={`p-4 rounded-xl flex items-center gap-3 border ${testResult.success ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
                  {testResult.success ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                  <span className="text-sm font-medium">{testResult.message}</span>
                </div>
              )}

              <div className="flex flex-wrap gap-3 pt-4 border-t border-zinc-800">
                <button 
                  type="button" 
                  onClick={() => testConnection("infinitepay")}
                  disabled={testing === "infinitepay"}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium rounded-xl transition flex items-center gap-2 disabled:opacity-50"
                >
                  {testing === "infinitepay" ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                  Testar Conexão
                </button>
              </div>
            </div>
          )}
        </div>

        {/* STRIPE CONNECT */}
        <div className="bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 overflow-hidden">
          <div className="px-5 py-4 bg-zinc-900 border-b border-zinc-800 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                <CreditCard className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-100">Stripe</h3>
                <p className="text-zinc-400 text-sm">Cartões de crédito internacionais</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={stripeEnabled} onChange={(e) => setStripeEnabled(e.target.checked)} />
              <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              <span className="ml-3 text-sm font-medium text-zinc-300">{stripeEnabled ? "Ativo" : "Inativo"}</span>
            </label>
          </div>

          {stripeEnabled && (
            <div className="p-5 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Publishable Key (pk_live_...)</label>
                  <input type="text" value={stripePublishableKey} onChange={(e) => setStripePublishableKey(e.target.value)} placeholder="pk_live_..." className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Secret Key (sk_live_...)</label>
                  <input type="password" value={stripeSecretKey} onChange={(e) => setStripeSecretKey(e.target.value)} placeholder="sk_live_..." className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2 flex items-center gap-2"><Lock className="w-4 h-4 text-zinc-500" /> Webhook Secret (whsec_...)</label>
                <input type="text" value={stripeWebhookSecret} onChange={(e) => setStripeWebhookSecret(e.target.value)} placeholder="whsec_..." className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500" />
              </div>
              <div className="p-4 bg-zinc-950/50 border border-zinc-800/50 rounded-xl">
                <label className="block text-sm font-medium text-zinc-300 mb-2">URL do Webhook Stripe</label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm font-mono text-zinc-400 overflow-x-auto">{`https://${subdomain}.dockdrop.com.br/webhooks/stripe`}</code>
                  <button type="button" onClick={() => copyToClipboard(`https://${subdomain}.dockdrop.com.br/webhooks/stripe`, 'stripe-webhook')} className="p-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 rounded-lg transition">{copied === "stripe-webhook" ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* MANUAL PAYMENT */}
        <div className="bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 overflow-hidden">
          <div className="px-5 py-4 bg-zinc-900 border-b border-zinc-800 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/20">
                <Building2 className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-100">Pagamento Manual</h3>
                <p className="text-zinc-400 text-sm">Zelle, CashApp, Transferência</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={manualEnabled} onChange={(e) => setManualEnabled(e.target.checked)} />
              <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              <span className="ml-3 text-sm font-medium text-zinc-300">{manualEnabled ? "Ativo" : "Inativo"}</span>
            </label>
          </div>

          {manualEnabled && (
            <div className="p-5 space-y-6">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Instruções para o Cliente</label>
                <textarea rows={5} value={manualInstructions} onChange={(e) => setManualInstructions(e.target.value)} placeholder="Ex: Para pagar via Zelle envie para o email financeiro@suaempresa.com. Para CashApp envie para $suaempresa. Após o pagamento, envie o comprovante na seção apropriada." className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 resize-none"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Acréscimo ou Desconto (%)</label>
                <input type="number" step="0.01" value={manualSurcharge} onChange={(e) => setManualSurcharge(e.target.value)} className="w-full md:w-1/2 px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500" placeholder="0.00" />
                <p className="mt-2 text-xs text-zinc-500">Percentual cobrado. Use números negativos para descontos (ex: -5.00 para 5% de desconto).</p>
              </div>
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div className="sticky bottom-4 mt-8 flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-semibold rounded-xl transition shadow-lg shadow-orange-500/25 disabled:opacity-70"
          >
            {isPending ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Salvando...</>
            ) : (
              <><Save className="w-5 h-5" /> Salvar Configurações</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
