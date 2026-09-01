'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, ArrowLeft, Loader2, Save, Package } from 'lucide-react';
import { updateShippingTypeAndRates } from '../../_actions/shipping';
import toast from 'react-hot-toast';
import { useTenantSettings } from '../../../../../app/(customer)/components/TenantSettingsContext';

export function ShippingEditClient({
  subdomain,
  shippingType,
  rates: initialRates
}: {
  subdomain: string;
  shippingType: any;
  rates: any[];
}) {
  const router = useRouter();
  const { settings } = useTenantSettings();
  const currencySymbol = settings?.operations?.currency || 'USD';

  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [name, setName] = useState(shippingType.name || '');
  const [rates, setRates] = useState(initialRates || []);

  
  const [allowCustomerEditValue, setAllowCustomerEditValue] = useState(!!shippingType.allow_customer_edit_value);
  const [customsMaxLines, setCustomsMaxLines] = useState(shippingType.customs_max_lines || '');
  const [customsMaxChars, setCustomsMaxChars] = useState(shippingType.customs_max_chars_per_line || '');

  const [requiresBoxAssembly, setRequiresBoxAssembly] = useState(!!shippingType.requires_box_assembly);
  const [skipCustoms, setSkipCustoms] = useState(!!shippingType.skip_customs_declaration);
  const [chargeVolumetric, setChargeVolumetric] = useState(!!shippingType.charge_volumetric);
  const [volumetricUnit, setVolumetricUnit] = useState(shippingType.volumetric_dimension_unit || 'cm');
  const [volumetricDivisor, setVolumetricDivisor] = useState(shippingType.volumetric_divisor || 5000);

  const [markupPercent, setMarkupPercent] = useState('');

  
  const handleRateChange = (index: number, field: string, value: string) => {
    const newRates = [...rates];
    const decimals = field === 'box_extra_weight' ? 3 : 2;
    
    // Auto-format masking (shifts digits from right to left)
    const digits = value.replace(/\D/g, '');
    
    if (digits === '') {
      newRates[index][field] = '';
    } else {
      const num = parseInt(digits, 10);
      newRates[index][field] = (num / Math.pow(10, decimals)).toFixed(decimals);
    }
    
    setRates(newRates);
  };

  const handleRateBlur = (index: number, field: string, value: string) => {
    const newRates = [...rates];
    let parsed = parseFloat(value);
    if (isNaN(parsed)) parsed = 0;
    // Format to 2 decimal places for money, 3 for weight
    newRates[index][field] = field === 'box_extra_weight' ? parsed.toFixed(3) : parsed.toFixed(2);
    setRates(newRates);
  };

  const applyMarkup = () => {
    const pct = parseFloat(markupPercent.replace(',', '.'));
    if (isNaN(pct)) return;
    
    const factor = 1 + (pct / 100);
    const newRates = rates.map(r => {
      const cost = parseFloat(r.price_cost) || 0;
      return {
        ...r,
        price_sell: (cost * factor).toFixed(2)
      };
    });
    setRates(newRates);
    toast.success('Preços de venda preenchidos!');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const toastId = toast.loading('Salvando alterações...');

    try {
      const payload = {
        type: {
          id: shippingType.id,
          name,
          requires_box_assembly: requiresBoxAssembly,
          skip_customs_declaration: skipCustoms,
          charge_volumetric: chargeVolumetric,
          volumetric_dimension_unit: volumetricUnit,
          
          volumetric_divisor: parseFloat(String(volumetricDivisor)) || 5000,
          allow_customer_edit_value: allowCustomerEditValue,
          customs_max_lines: customsMaxLines ? parseInt(String(customsMaxLines)) : null,
          customs_max_chars_per_line: customsMaxChars ? parseInt(String(customsMaxChars)) : null

        },
        rates: rates.map(r => ({
          id: r.id,
          price_cost: parseFloat(String(r.price_cost)) || 0,
          price_sell: parseFloat(String(r.price_sell)) || 0,
          
          fee_percentage: parseFloat(String(r.fee_percentage)) || 0,
          box_extra_weight: parseFloat(String(r.box_extra_weight)) || 0,
          is_active: !!r.is_active

        }))
      };

      const res = await updateShippingTypeAndRates(payload, subdomain);
      if (res.success) {
        toast.success('Salvo com sucesso!', { id: toastId });
        router.push(`/admin/shipping`);
      } else {
        toast.error(res.error || 'Erro ao salvar.', { id: toastId });
      }
    } catch (err) {
      toast.error('Erro de conexão.', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 -m-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-zinc-900 border-b border-zinc-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-sm mb-3 text-zinc-500">
            <Link href={`/admin`} className="hover:text-zinc-300 transition-colors">Dashboard</Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            <Link href={`/admin/shipping`} className="hover:text-zinc-300 transition-colors">Tabela de Frete</Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            <span className="text-zinc-100 font-medium">Editar preços</span>
          </nav>
          
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center flex-shrink-0 border border-zinc-700">
              <Package className="w-6 h-6 text-amber-500" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-white truncate font-bold">{name || 'Editar Frete'}</h1>
              <p className="text-zinc-400 text-sm mt-0.5">{rates.length} faixas de peso - edite todos os preços de uma vez</p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Info Card */}
          <div className="mb-5 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 shadow-sm rounded-2xl border">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-amber-500/20 p-2">
                <svg className="w-5 h-5 text-amber-600 dark:text-amber-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-500">Como revisar esta tabela</p>
                <p className="mt-1 text-sm text-amber-500/80">Custo é o valor interno, venda é o frete cobrado do cliente e taxa é um adicional de serviço. O total do cliente soma venda + taxa, e a margem compara esse total com o custo.</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-5 bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 p-6">
              <label className="block text-sm font-semibold text-zinc-300 mb-2">
                Nome do tipo de frete
              </label>
              <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full rounded-lg border-zinc-700 bg-zinc-800 dark:text-white focus:border-orange-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 px-4 py-2 outline-none"
                required 
              />
            </div>

            {/* Markup */}
            <div className="mb-5 bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 p-6 p-4">
              <p className="text-sm font-semibold text-amber-500">Margem automática</p>
              <p className="text-xs text-zinc-400 mt-0.5 mb-3">Defina uma % de margem e preencha o Preço de Venda de todas as faixas a partir do Custo. Revise e clique em salvar para confirmar.</p>
              <div className="flex flex-wrap items-end gap-2">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Margem sobre o custo</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={markupPercent}
                      onChange={e => setMarkupPercent(e.target.value)}
                      placeholder="30" 
                      className="w-32 pr-7 rounded-lg border-zinc-700 bg-zinc-800 dark:text-white focus:border-amber-500 focus:ring-amber-500 text-sm px-3 py-2 outline-none"
                    />
                    <span className="absolute inset-y-0 right-2 flex items-center text-sm text-zinc-500">%</span>
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={applyMarkup}
                  className="px-4 py-2 text-sm font-semibold rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white transition"
                >
                  Aplicar em toda a tabela
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-zinc-900/50 text-zinc-400 border-b border-zinc-800 sticky top-0">
                    <tr>
                      <th className="px-3 py-4 text-left text-xs font-bold uppercase whitespace-nowrap">Faixa</th>
                      <th className="px-3 py-4 text-left text-xs font-bold uppercase whitespace-nowrap">Custo ({currencySymbol})</th>
                      <th className="px-3 py-4 text-left text-xs font-bold uppercase whitespace-nowrap">Venda ({currencySymbol})</th>
                      <th className="px-3 py-4 text-left text-xs font-bold uppercase whitespace-nowrap">Taxa ({currencySymbol})</th>
                      <th className="px-3 py-4 text-left text-xs font-bold uppercase whitespace-nowrap">Total cliente</th>
                      <th className="px-3 py-4 text-left text-xs font-bold uppercase whitespace-nowrap">Peso extra (kg)</th>
                      <th className="px-3 py-4 text-left text-xs font-bold uppercase whitespace-nowrap">Margem</th>
                      <th className="px-3 py-4 text-center text-xs font-bold uppercase whitespace-nowrap">Ativo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50 bg-zinc-900">
                    {rates.map((r, i) => {
                      const cost = parseFloat(String(r.price_cost)) || 0;
                      const sell = parseFloat(String(r.price_sell)) || 0;
                      const fee = parseFloat(String(r.fee_percentage)) || 0;
                      const totalCliente = sell + fee;
                      const margin = cost > 0 ? ((totalCliente - cost) / cost) * 100 : 0;

                      return (
                        <tr key={i} className="hover:bg-zinc-800/30 transition" data-row-index={i}>
                          <td className="px-3 py-3 whitespace-nowrap">
                            <span className="font-bold text-zinc-100">
                              {r.weight_start.toFixed(3)} - {r.weight_end.toFixed(3)} kg
                            </span>
                          </td>
                          <td className="px-3 py-3">
                            <input 
                              type="text" inputMode="decimal"
                              value={r.price_cost}
                              onChange={e => handleRateChange(i, 'price_cost', e.target.value)}
                              onBlur={e => handleRateBlur(i, 'price_cost', e.target.value)}
                              className="w-full px-2 py-1.5 text-sm border border-zinc-700 rounded-lg bg-zinc-800/50 text-zinc-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                              required
                            />
                          </td>
                          <td className="px-3 py-3">
                            <input 
                              type="text" inputMode="decimal"
                              value={r.price_sell}
                              onChange={e => handleRateChange(i, 'price_sell', e.target.value)}
                              onBlur={e => handleRateBlur(i, 'price_sell', e.target.value)}
                              className="w-full px-2 py-1.5 text-sm border border-zinc-700 rounded-lg bg-zinc-800/50 text-zinc-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                              required
                            />
                          </td>
                          <td className="px-3 py-3">
                            <input 
                              type="text" inputMode="decimal"
                              value={r.fee_percentage}
                              onChange={e => handleRateChange(i, 'fee_percentage', e.target.value)}
                              onBlur={e => handleRateBlur(i, 'fee_percentage', e.target.value)}
                              className="w-full px-2 py-1.5 text-sm border border-zinc-700 rounded-lg bg-zinc-800/50 text-zinc-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                              required
                            />
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap">
                            <span className="text-sm font-bold text-green-500">
                              {currencySymbol} {totalCliente.toFixed(2)}
                            </span>
                          </td>
                          <td className="px-3 py-3">
                            <input 
                              type="text" inputMode="decimal"
                              value={r.box_extra_weight !== undefined ? r.box_extra_weight : 0}
                              onChange={e => handleRateChange(i, 'box_extra_weight', e.target.value)}
                              onBlur={e => handleRateBlur(i, 'box_extra_weight', e.target.value)}
                              className="w-full px-2 py-1.5 text-sm border border-zinc-700 rounded-lg bg-zinc-800/50 text-zinc-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                              required
                            />
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                              margin >= 20 ? 'bg-green-500/10 text-green-500' :
                              margin >= 10 ? 'bg-yellow-500/10 text-yellow-500' :
                              'bg-red-500/10 text-red-500'
                            }`}>
                              {margin.toFixed(1)}%
                            </span>
                          </td>
                          <td className="px-3 py-3 text-center">
                            <input 
                              type="checkbox" 
                              checked={r.is_active !== false}
                              onChange={e => {
                                const newRates = [...rates];
                                newRates[i].is_active = e.target.checked;
                                setRates(newRates);
                              }}
                              className="w-5 h-5 text-amber-500 rounded focus:ring-amber-500"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Footer Settings */}
              <div className="bg-zinc-900/50 px-6 py-6 border-t border-zinc-800">
                <div className="flex flex-col gap-4">
                  <div className="text-sm text-zinc-400 font-medium">
                    {rates.length} faixas para editar
                  </div>

                  <div className="flex flex-col gap-4">
                    
                    <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-3">
                      
                      <label className="flex h-full items-start gap-3 px-4 py-3 bg-zinc-800/50 rounded-xl border border-zinc-700/50 cursor-pointer">
                        <input type="checkbox" checked={allowCustomerEditValue} onChange={e => setAllowCustomerEditValue(e.target.checked)} className="w-5 h-5 mt-0.5 shrink-0 text-amber-500 rounded focus:ring-amber-500" />
                        <div className="min-w-0">
                          <span className="block text-sm font-medium leading-5 text-zinc-200">Permitir cliente editar valor do frete</span>
                          <p className="mt-1 text-xs leading-5 text-zinc-400">Na declaração aduaneira</p>
                        </div>
                      </label>

                      <label className="flex h-full items-start gap-3 px-4 py-3 bg-zinc-800/50 rounded-xl border border-zinc-700/50 cursor-pointer">
                        <input type="checkbox" checked={requiresBoxAssembly} onChange={e => setRequiresBoxAssembly(e.target.checked)} className="w-5 h-5 mt-0.5 shrink-0 text-orange-600 rounded focus:border-amber-500 focus:ring-1 focus:ring-amber-500" />
                        <div className="min-w-0">
                          <span className="block text-sm font-medium leading-5 text-zinc-200">⚙️ Requer Montagem de Caixa Antes do Pagamento</span>
                          <p className="mt-1 text-xs leading-5 text-zinc-400">O cliente aguardará enquanto o operador monta e pesa a caixa antes do pagamento.</p>
                        </div>
                      </label>

                      <label className="flex h-full items-start gap-3 px-4 py-3 bg-zinc-800/50 rounded-xl border border-zinc-700/50 cursor-pointer">
                        <input type="checkbox" checked={skipCustoms} onChange={e => setSkipCustoms(e.target.checked)} className="w-5 h-5 mt-0.5 shrink-0 text-amber-500 rounded focus:ring-amber-500" />
                        <div className="min-w-0">
                          <span className="block text-sm font-medium leading-5 text-zinc-200">🚫 Não Exige Declaração Aduaneira</span>
                          <p className="mt-1 text-xs leading-5 text-zinc-400">Use para fretes locais que não passam por alfândega.</p>
                        </div>
                      </label>
                    </div>

                    <div className="rounded-lg border border-zinc-700/50 bg-zinc-800/50 px-4 py-3">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input type="checkbox" checked={chargeVolumetric} onChange={e => setChargeVolumetric(e.target.checked)} className="w-5 h-5 mt-0.5 shrink-0 text-amber-500 rounded focus:ring-amber-500" />
                        <div className="min-w-0">
                          <span className="block text-sm font-medium leading-5 text-zinc-200">📦 Cobrar por peso cubado (volumétrico)</span>
                          <p className="mt-1 text-xs leading-5 text-zinc-400">O operador mede a caixa e o frete é cobrado pelo maior entre peso real e cubado.</p>
                        </div>
                      </label>
                      {chargeVolumetric && (
                        <div className="mt-3 pl-8 flex flex-wrap items-start gap-4">
                          <div>
                            <label className="block text-xs font-medium text-zinc-400 mb-1">Unidade das medidas</label>
                            <select value={volumetricUnit} onChange={e => setVolumetricUnit(e.target.value)} className="w-44 px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-100 outline-none">
                              <option value="cm">Centímetros (cm)</option>
                              <option value="in">Polegadas (pol)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-zinc-400 mb-1">Fator de cubagem</label>
                            <input type="number" min="1" step="1" value={volumetricDivisor} onChange={e => setVolumetricDivisor(e.target.value)} className="w-40 px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-100 outline-none" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="rounded-xl border border-zinc-700/50 bg-zinc-800/50 px-4 py-4">
                      <div className="flex items-start gap-2 mb-3">
                        <span className="text-zinc-400">📋</span>
                        <div>
                          <span className="block text-sm font-medium text-zinc-200">Limites da Declaração Aduaneira</span>
                          <p className="mt-1 text-xs text-zinc-400">Deixe em branco para não aplicar limite. Ignorado quando a declaração está desativada.</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-4 pl-7">
                        <div>
                          <label className="block text-xs font-medium text-zinc-400 mb-1">Nº máximo de linhas</label>
                          <input type="number" min="1" placeholder="Sem limite" value={customsMaxLines} onChange={e => setCustomsMaxLines(e.target.value)} className="w-48 px-3 py-2 border border-zinc-700 rounded-lg bg-zinc-900 text-zinc-100 outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-zinc-400 mb-1">Máx. caracteres por linha</label>
                          <input type="number" min="1" placeholder="Sem limite" value={customsMaxChars} onChange={e => setCustomsMaxChars(e.target.value)} className="w-48 px-3 py-2 border border-zinc-700 rounded-lg bg-zinc-900 text-zinc-100 outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500" />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <Link href={`/admin/shipping`} className="px-6 py-3 bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 text-zinc-300 font-semibold rounded-lg hover:bg-zinc-700 transition">
                        Cancelar
                      </Link>
                      <button type="submit" disabled={isSubmitting} className="px-8 py-3 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-600 transition flex items-center justify-center min-w-[200px]">
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Salvar todas as faixas'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
