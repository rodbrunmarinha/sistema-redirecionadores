import { Bell, Users, Info, AlertTriangle } from "lucide-react";

export function NotificationsTab({ data, onChange }: { data?: any, onChange?: (data: any) => void }) {
  // Configuração padrão
  const prefs = data?.preferences || {};

  const getPref = (key: string, type: 'push' | 'email') => {
    if (prefs[key] && prefs[key][type] !== undefined) return prefs[key][type];
    return true; // Default to true
  };

  const handleToggle = (key: string, type: 'push' | 'email') => {
    const current = getPref(key, type);
    const updated = {
      ...prefs,
      [key]: {
        ...(prefs[key] || { push: true, email: true }),
        [type]: !current
      }
    };
    onChange?.({ ...data, preferences: updated });
  };

  const adminEvents = [
    { id: 'new_service_order', icon: '🧰', title: 'Nova ordem de serviço', desc: 'Quando um cliente cria uma nova ordem de serviço.' },
    { id: 'manual_payment', icon: '💳', title: 'Pagamento manual enviado', desc: 'Quando um cliente envia comprovante de pagamento.' },
    { id: 'new_client', icon: '👤', title: 'Novo cliente', desc: 'Quando um novo cliente se cadastra.' },
    { id: 'new_online_purchase', icon: '🛒', title: 'Nova compra assistida', desc: 'Quando um cliente abre ou paga uma solicitação de compra assistida.' },
    { id: 'new_shipment_request', icon: '📦', title: 'Nova solicitação de envio', desc: 'Quando um cliente solicita ou cria um novo envio.' },
    { id: 'purchase_group_order_paid', icon: '🛍️', title: 'Pedido de grupo pago', desc: 'Quando um pedido de grupo de compras é pago pelo cliente.' },
    { id: 'customs_correction', icon: '📋', title: 'Declaração corrigida', desc: 'Quando o cliente refaz a declaração aduaneira que você mandou corrigir.' },
    { id: 'support_ticket', icon: '🎫', title: 'Novo ticket de suporte', desc: 'Quando um cliente abre ou responde um ticket de suporte.' },
    { id: 'wallet_deposit', icon: '💰', title: 'Depósito em carteira confirmado', desc: 'Quando um depósito na carteira de um cliente é confirmado.' }
  ];

  const clientEvents = [
    { id: 'client_storage_alert', icon: '📦', title: 'Prazo de armazenagem', desc: 'Avisa o cliente quando o prazo gratuito está terminando ou já venceu.', showWarning: true }
  ];

  return (
    <div className="bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 p-4 sm:p-8 space-y-10">

      {/* Admin Events */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            <Bell className="w-5 h-5 text-sky-500" />
            Preferências de Notificação (Admins)
          </h3>
          <p className="text-sm text-zinc-400 mt-1">Escolha como deseja ser notificado para cada tipo de evento. As notificações no painel (sino) são sempre enviadas.</p>
        </div>

        <div className="hidden sm:flex items-center px-4 text-xs font-semibold uppercase tracking-wide text-zinc-500">
          <span className="flex-1">Evento</span>
          <span className="w-24 text-center">Push</span>
          <span className="w-24 text-center">E-mail</span>
        </div>

        <div className="divide-y divide-zinc-800 border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/50">
          {adminEvents.map((event) => (
            <div key={event.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 hover:bg-zinc-800/50 transition-colors">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <span className="text-xl mt-0.5 flex-shrink-0">{event.icon}</span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-zinc-100">{event.title}</p>
                  <p className="text-xs text-zinc-400 mt-0.5">{event.desc}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 pl-9 sm:pl-0 sm:gap-0">
                <div className="flex flex-col sm:w-24 items-center gap-1.5">
                  <span className="sm:hidden text-xs font-medium text-zinc-500">Push</span>
                  <button 
                    type="button" 
                    onClick={() => handleToggle(event.id, 'push')}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-zinc-900 ${getPref(event.id, 'push') ? 'bg-sky-500' : 'bg-zinc-700'}`}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${getPref(event.id, 'push') ? 'translate-x-5' : 'translate-x-0'}`}></span>
                  </button>
                </div>

                <div className="flex flex-col sm:w-24 items-center gap-1.5">
                  <span className="sm:hidden text-xs font-medium text-zinc-500">E-mail</span>
                  <button 
                    type="button" 
                    onClick={() => handleToggle(event.id, 'email')}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-zinc-900 ${getPref(event.id, 'email') ? 'bg-violet-500' : 'bg-zinc-700'}`}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${getPref(event.id, 'email') ? 'translate-x-5' : 'translate-x-0'}`}></span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-start gap-3 p-4 bg-sky-900/10 rounded-xl border border-sky-900/30">
          <Info className="w-5 h-5 text-sky-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-sky-400/90">🔔 Notificações no painel (sino) são sempre enviadas independente das preferências acima.</p>
        </div>
      </div>

      <hr className="border-zinc-800" />

      {/* Client Events */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-violet-500" />
            Avisos enviados aos seus clientes
          </h3>
          <p className="text-sm text-zinc-400 mt-1">Notificações automáticas que a plataforma envia em seu nome. Desligue o que você prefere não comunicar.</p>
        </div>

        <div className="divide-y divide-zinc-800 border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/50">
          {clientEvents.map((event) => {
            const pushOn = getPref(event.id, 'push');
            const emailOn = getPref(event.id, 'email');
            
            return (
              <div key={event.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 hover:bg-zinc-800/50 transition-colors">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <span className="text-xl mt-0.5 flex-shrink-0">{event.icon}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-zinc-100">{event.title}</p>
                    <p className="text-xs text-zinc-400 mt-0.5">{event.desc}</p>
                    
                    {event.showWarning && !pushOn && !emailOn && (
                      <p className="text-xs text-amber-500 mt-2 flex items-start gap-1.5 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                        <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                        <span>Com os dois canais desligados o cliente não recebe nada, nem no sino do painel. A cobrança de armazenagem continua normalmente.</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-6 pl-9 sm:pl-0 sm:gap-0">
                  <div className="flex flex-col sm:w-24 items-center gap-1.5">
                    <span className="sm:hidden text-xs font-medium text-zinc-500">Push</span>
                    <button 
                      type="button" 
                      onClick={() => handleToggle(event.id, 'push')}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-zinc-900 ${pushOn ? 'bg-sky-500' : 'bg-zinc-700'}`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${pushOn ? 'translate-x-5' : 'translate-x-0'}`}></span>
                    </button>
                  </div>

                  <div className="flex flex-col sm:w-24 items-center gap-1.5">
                    <span className="sm:hidden text-xs font-medium text-zinc-500">E-mail</span>
                    <button 
                      type="button" 
                      onClick={() => handleToggle(event.id, 'email')}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-zinc-900 ${emailOn ? 'bg-violet-500' : 'bg-zinc-700'}`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${emailOn ? 'translate-x-5' : 'translate-x-0'}`}></span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
