'use client';

import { useState } from 'react';
import { updateTenantSettings } from '../settings/_actions/settings';
import { Calculator, Save, Loader2, Info, MapPin, Receipt, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export function ImportCalculatorClient({ 
  tenantId, 
  subdomain, 
  initialSettings 
}: { 
  tenantId: string; 
  subdomain: string; 
  initialSettings: any;
}) {
  const [isSaving, setIsSaving] = useState(false);
  
  // Extract salesTaxRate from operations JSONB or default to '0.00'
  const defaultTax = initialSettings?.operations?.salesTaxRate || '0.00';
  const [salesTaxRate, setSalesTaxRate] = useState(defaultTax);

  const formatSalesTax = (val: string) => {
    let value = val.replace(/[^\d.]/g, '');
    let parts = value.split('.');
    if (parts.length > 2) {
        value = parts[0] + '.' + parts.slice(1).join('');
    }
    if (parts.length === 2 && parts[1].length > 2) {
        value = parts[0] + '.' + parts[1].substring(0, 2);
    }
    let numValue = parseFloat(value);
    if (isNaN(numValue)) {
        return '0.00';
    } else if (numValue > 100) {
        return '100.00';
    } else {
        return numValue.toFixed(2);
    }
  };

  const handleBlur = () => {
    setSalesTaxRate(formatSalesTax(salesTaxRate));
  };

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const payload = {
        ...initialSettings,
        operations: {
          ...(initialSettings.operations || {}),
          salesTaxRate: formatSalesTax(salesTaxRate)
        }
      };
      const result = await updateTenantSettings(tenantId, payload, subdomain);
      if (result.success) {
        toast.success('Taxas salvas com sucesso!');
      } else {
        toast.error(result.error || 'Erro ao salvar configurações.');
      }
    } catch (err) {
      toast.error('Erro de conexão ao salvar.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      <div className="bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 overflow-hidden">
        
        {/* Info Banner */}
        <div className="px-4 sm:px-8 py-5 bg-amber-500/10 border-b border-amber-500/20">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
            <div className="text-sm text-amber-500/90">
              <p className="font-semibold mb-1 text-amber-400">Sobre as taxas configuráveis:</p>
              <ul className="list-disc list-inside space-y-1 ml-1">
                <li><strong>Sales Tax:</strong> Imposto cobrado nos EUA sobre a compra de produtos (varia por estado)</li>
                <li><strong>ICMS:</strong> Imposto estadual brasileiro sobre circulação de mercadorias (varia por estado)</li>
                <li><strong>Imposto de Importação:</strong> Fixo em 60% (não configurável - lei brasileira)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-4 sm:p-8 space-y-8">

          {/* Sales Tax Rate */}
          <div className="bg-zinc-800/50 rounded-2xl p-5 sm:p-6 border border-zinc-700/50">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="p-3 bg-zinc-800 border border-zinc-700 rounded-xl shrink-0">
                <Receipt className="w-6 h-6 text-amber-500" />
              </div>
              <div className="flex-1 w-full">
                <label className="block text-lg font-bold text-zinc-100 mb-2">
                  Sales Tax (EUA)
                </label>
                <p className="text-sm text-zinc-400 mb-4">
                  Taxa de imposto cobrada no estado dos EUA onde os produtos são comprados. 
                  <br className="hidden sm:block" />Exemplos: Flórida ~6%, Califórnia ~7.25%, Delaware 0%
                </p>
                <div className="relative max-w-xs">
                  <input 
                    type="text" 
                    value={salesTaxRate}
                    onChange={(e) => setSalesTaxRate(e.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); handleBlur(); } }}
                    className="w-full pl-4 pr-12 py-3 text-2xl font-bold border-2 border-zinc-700 bg-zinc-800 rounded-xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 text-white transition-all" 
                    placeholder="0.00"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none">
                    <span className="text-2xl font-bold text-zinc-500">%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Info sobre ICMS */}
          <div className="bg-zinc-800/30 rounded-2xl p-5 sm:p-6 border border-zinc-800">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl shrink-0">
                <MapPin className="w-6 h-6 text-zinc-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-zinc-300 mb-2">
                  ICMS por Estado
                </h4>
                <p className="text-sm text-zinc-500">
                  O ICMS é selecionado pelo <strong>cliente</strong> na calculadora, de acordo com seu estado de destino. As taxas variam de 17% a 22% dependendo do estado brasileiro.
                </p>
              </div>
            </div>
          </div>

          {/* Fixed Tax Info */}
          <div className="bg-zinc-800/30 rounded-2xl p-5 sm:p-6 border border-zinc-800">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl shrink-0">
                <Receipt className="w-6 h-6 text-red-400" />
              </div>
              <div className="flex-1">
                <label className="block text-lg font-bold text-zinc-300 mb-2">
                  Imposto de Importação (Brasil)
                </label>
                <p className="text-sm text-zinc-500 mb-4">
                  Taxa fixa definida pela legislação brasileira. Não é configurável.
                </p>
                <div className="flex items-center gap-4">
                  <div className="px-5 py-2.5 bg-red-500/10 rounded-xl border border-red-500/20">
                    <span className="text-2xl font-bold text-red-400">60%</span>
                  </div>
                  <div className="text-sm text-zinc-500">
                    <p className="font-semibold text-zinc-400">Fixo por lei federal</p>
                    <p>Aplicado sobre produtos + frete</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6 mt-6 flex items-center justify-between border-t border-zinc-800">
            <Link 
              href={`/tenant/${subdomain}/admin/settings`} 
              className="px-6 py-3 bg-zinc-800 text-zinc-300 rounded-xl hover:bg-zinc-700 transition-colors font-medium text-sm"
            >
              Cancelar
            </Link>
            <button 
              type="submit" 
              disabled={isSaving}
              className="px-8 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-all font-bold flex items-center gap-2 text-sm disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {isSaving ? 'Salvando...' : 'Salvar Configurações'}
            </button>
          </div>
        </form>

      </div>

      {/* Preview Card */}
      <div className="bg-zinc-800/30 rounded-2xl p-5 sm:p-8 border border-zinc-800">
        <h4 className="text-lg font-bold text-zinc-300 mb-4 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-amber-500" />
          Como funciona o cálculo?
        </h4>
        <div className="space-y-3 text-sm text-zinc-400 font-mono">
          <p className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-zinc-600"/> <strong>1. Nos EUA:</strong> <span className="text-zinc-500">Produtos + Sales Tax + Frete = Total USD</span></p>
          <p className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-zinc-600"/> <strong>2. Valor Aduaneiro:</strong> <span className="text-zinc-500">(Produtos + Frete) em BRL</span></p>
          <p className="text-xs italic ml-6 text-amber-500/70">⚠️ A Sales Tax americana NÃO entra no cálculo de impostos brasileiros</p>
          <p className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-zinc-600"/> <strong>3. Imposto de Importação:</strong> <span className="text-zinc-500">60% × Valor Aduaneiro</span></p>
          <p className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-zinc-600"/> <strong>4. Base ICMS:</strong> <span className="text-zinc-500">(Valor Aduaneiro + II) / (1 - ICMS%)</span></p>
          <p className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-zinc-600"/> <strong>5. ICMS:</strong> <span className="text-zinc-500">Base ICMS × ICMS%</span></p>
          
          <div className="mt-6 pt-4 border-t border-zinc-800">
            <p className="font-bold text-lg text-amber-500 flex items-center gap-2">
              <span className="text-zinc-500">=</span> Base ICMS + Sales Tax em BRL
              <span className="text-sm font-normal text-zinc-500 ml-2">(Total Final Estimado)</span>
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
