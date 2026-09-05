import { Calculator, Plus, Trash2 } from "lucide-react";

export function ServiceFeesTab({ settings, onChange }: { settings: any, onChange: (updates: any) => void }) {
  
  const strategy = settings.service_fee_strategy || 'NONE';
  const tiers = settings.service_fee_tiers || [];
  const chargeStore = settings.service_fee_charge_store_percentage || false;

  const handleAddTier = () => {
    const newTiers = [...tiers, { min: 0, max: 0, fixed_fee: 0, percentage_fee: 0 }];
    onChange({ service_fee_tiers: newTiers });
  };

  const handleUpdateTier = (index: number, field: string, value: number) => {
    const newTiers = [...tiers];
    newTiers[index][field] = value;
    onChange({ service_fee_tiers: newTiers });
  };

  const handleRemoveTier = (index: number) => {
    const newTiers = tiers.filter((_: any, i: number) => i !== index);
    onChange({ service_fee_tiers: newTiers });
  };

  return (
    <div className="space-y-6">
      
      {/* Estratégia de Cobrança */}
      <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-2">
          <Calculator className="w-5 h-5 text-amber-500" />
          <h4 className="font-medium text-zinc-100 text-sm">Modelo de Cobrança da Taxa de Serviço</h4>
        </div>
        <p className="text-xs text-zinc-400 mb-6">Escolha como e quando a taxa de serviço será cobrada dos seus clientes.</p>
        
        <div className="space-y-3">
          {[
            { id: 'NONE', label: 'Não cobrar taxa de serviço', desc: 'Nenhuma taxa será aplicada nos envios ou mensalmente.' },
            { id: 'PER_BOX', label: 'Cobrar por Envio (Caixa)', desc: 'A taxa será calculada e cobrada apenas na hora de pagar o frete do envio.' },
            { id: 'MONTHLY_INVOICE', label: 'Cobrar por Mês Fechado (Fatura Mensal)', desc: 'O sistema calcula o gasto total no mês e gera uma dívida no dia 1º, bloqueando envios se não for paga.' },
          ].map(opt => (
            <label key={opt.id} className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${strategy === opt.id ? 'border-amber-500 bg-amber-500/10' : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'}`}>
              <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${strategy === opt.id ? 'border-amber-500' : 'border-zinc-600'}`}>
                {strategy === opt.id && <div className="w-2 h-2 rounded-full bg-amber-500" />}
              </div>
              <input 
                type="radio"
                className="hidden"
                checked={strategy === opt.id}
                onChange={() => onChange({ service_fee_strategy: opt.id })}
              />
              <div>
                <p className="text-sm font-medium text-zinc-200">{opt.label}</p>
                <p className="text-xs text-zinc-500 mt-1">{opt.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {strategy !== 'NONE' && (
        <>
          {/* Regras e Faixas */}
          <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-4 sm:p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-zinc-100 text-sm">Faixas de Cobrança</h4>
              <button 
                onClick={handleAddTier}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-zinc-800 text-white hover:bg-zinc-700 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Nova Faixa
              </button>
            </div>
            <p className="text-xs text-zinc-400 mb-6">Configure o valor ou porcentagem baseada no gasto total. Para valor ilimitado no campo "Até", deixe 999999.</p>

            <div className="space-y-3 max-w-full overflow-x-auto pb-2">
              <div className="min-w-[700px]">
                <div className="grid grid-cols-[1fr_1fr_1fr_1fr_40px] gap-3 mb-2 px-1">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">De (Gasto Min)</p>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Até (Gasto Max)</p>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Taxa Fixa</p>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Taxa (%)</p>
                  <p></p>
                </div>

                {tiers.length === 0 ? (
                  <div className="text-center py-6 border border-dashed border-zinc-800 rounded-lg bg-zinc-900/30">
                    <p className="text-sm text-zinc-500">Nenhuma faixa configurada.</p>
                  </div>
                ) : (
                  tiers.map((tier: any, idx: number) => (
                    <div key={idx} className="grid grid-cols-[1fr_1fr_1fr_1fr_40px] gap-3 items-center bg-zinc-900 border border-zinc-800 p-2 rounded-lg mb-2">
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-xs text-zinc-500">¥</span>
                        <input 
                          type="number"
                          value={tier.min}
                          onChange={(e) => handleUpdateTier(idx, 'min', Number(e.target.value))}
                          className="w-full bg-zinc-950 border border-zinc-700 rounded-md py-2 pl-7 pr-3 text-sm text-white focus:ring-amber-500 focus:border-amber-500"
                        />
                      </div>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-xs text-zinc-500">¥</span>
                        <input 
                          type="number"
                          value={tier.max}
                          onChange={(e) => handleUpdateTier(idx, 'max', Number(e.target.value))}
                          className="w-full bg-zinc-950 border border-zinc-700 rounded-md py-2 pl-7 pr-3 text-sm text-white focus:ring-amber-500 focus:border-amber-500"
                        />
                      </div>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-xs text-zinc-500">¥</span>
                        <input 
                          type="number"
                          value={tier.fixed_fee}
                          onChange={(e) => handleUpdateTier(idx, 'fixed_fee', Number(e.target.value))}
                          className="w-full bg-zinc-950 border border-zinc-700 rounded-md py-2 pl-7 pr-3 text-sm text-white focus:ring-amber-500 focus:border-amber-500"
                        />
                      </div>
                      <div className="relative">
                        <input 
                          type="number"
                          value={tier.percentage_fee}
                          onChange={(e) => handleUpdateTier(idx, 'percentage_fee', Number(e.target.value))}
                          className="w-full bg-zinc-950 border border-zinc-700 rounded-md py-2 pl-3 pr-7 text-sm text-white focus:ring-amber-500 focus:border-amber-500"
                        />
                        <span className="absolute right-3 top-2.5 text-xs text-zinc-500">%</span>
                      </div>
                      <button 
                        onClick={() => handleRemoveTier(idx)}
                        className="w-10 h-10 flex items-center justify-center rounded-md bg-zinc-800 text-zinc-400 hover:text-red-400 hover:bg-zinc-700 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            <p className="text-xs text-amber-500/80 mt-2">Dica: Se a taxa for apenas fixa, deixe o (%) como 0. Se for apenas %, deixe a Taxa Fixa como 0.</p>
          </div>

          {/* Configurações Avançadas */}
          <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-4 sm:p-6">
            <h4 className="font-medium text-zinc-100 text-sm mb-4">Regras e Exceções (Loja Virtual)</h4>
            
            <label className="flex items-start gap-3 cursor-pointer">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  checked={chargeStore}
                  onChange={(e) => onChange({ service_fee_charge_store_percentage: e.target.checked })}
                  className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-amber-500 focus:ring-amber-500 focus:ring-offset-zinc-950"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-zinc-200">Cobrar taxa percentual também dos produtos comprados na Loja Virtual</p>
                <p className="text-xs text-zinc-500 mt-1">Se desmarcado (padrão), caso o cliente caia em uma faixa de % (Porcentagem), essa porcentagem NÃO será cobrada sobre o valor dos produtos adquiridos na própria loja virtual (apenas nos demais serviços). Os produtos da loja continuam somando para atingir as faixas de gasto, apenas não sofrem a taxação final.</p>
              </div>
            </label>

          </div>
        </>
      )}

    </div>
  );
}
