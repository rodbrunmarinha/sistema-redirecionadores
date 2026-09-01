"use client";

import { useState } from "react";
import { Plus, Trash2, Calculator, Info, Package, DollarSign, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";

type ProductRow = {
  id: number;
  price: string;
  weight: string;
  qty: number;
};

type CalculationResult = {
  shipping_method: string;
  shipping_weight_range: string;
  total_weight: number;
  valor_aduaneiro: number;
  import_tax: number;
  icms: number;
  icms_rate: number;
  products_brl: number;
  sales_tax_rate: number;
  sales_tax_brl: number;
  shipping_brl: number;
  service_fee_brl: number;
  total_final: number;
};

const ICMS_RATES: Record<string, { name: string; icms: number }> = {
  "AC": { name: "Acre", icms: 19 },
  "AL": { name: "Alagoas", icms: 19 },
  "AP": { name: "Amapá", icms: 18 },
  "AM": { name: "Amazonas", icms: 20 },
  "BA": { name: "Bahia", icms: 20.5 },
  "CE": { name: "Ceará", icms: 20 },
  "DF": { name: "Distrito Federal", icms: 20 },
  "ES": { name: "Espírito Santo", icms: 17 },
  "GO": { name: "Goiás", icms: 19 },
  "MA": { name: "Maranhão", icms: 22 },
  "MT": { name: "Mato Grosso", icms: 17 },
  "MS": { name: "Mato Grosso do Sul", icms: 17 },
  "MG": { name: "Minas Gerais", icms: 18 },
  "PA": { name: "Pará", icms: 19 },
  "PB": { name: "Paraíba", icms: 20 },
  "PR": { name: "Paraná", icms: 19.5 },
  "PE": { name: "Pernambuco", icms: 20.5 },
  "PI": { name: "Piauí", icms: 21 },
  "RJ": { name: "Rio de Janeiro", icms: 20 },
  "RN": { name: "Rio Grande do Norte", icms: 20 },
  "RS": { name: "Rio Grande do Sul", icms: 17 },
  "RO": { name: "Rondônia", icms: 19.5 },
  "RR": { name: "Roraima", icms: 20 },
  "SC": { name: "Santa Catarina", icms: 17 },
  "SP": { name: "São Paulo", icms: 18 },
  "SE": { name: "Sergipe", icms: 19 },
  "TO": { name: "Tocantins", icms: 20 }
};

export default function ImportCalculatorPage() {
  const [products, setProducts] = useState<ProductRow[]>([
    { id: 1, price: "", weight: "", qty: 1 }
  ]);
  const [selectedState, setSelectedState] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CalculationResult[] | null>(null);

  const exchangeRate = 5.22;

  const handleAddProduct = () => {
    setProducts([...products, { id: Date.now(), price: "", weight: "", qty: 1 }]);
  };

  const handleRemoveProduct = (id: number) => {
    if (products.length > 1) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handlePriceChange = (id: number, value: string) => {
    const digits = value.replace(/\D/g, '') || '0';
    const formatted = (parseInt(digits, 10) / 100).toFixed(2).replace('.', ',');
    setProducts(products.map(p => p.id === id ? { ...p, price: formatted } : p));
  };

  const handleWeightChange = (id: number, value: string) => {
    const digits = value.replace(/\D/g, '') || '0';
    const formatted = (parseInt(digits, 10) / 1000).toFixed(3).replace('.', ',');
    setProducts(products.map(p => p.id === id ? { ...p, weight: formatted } : p));
  };

  const handleChange = (id: number, field: keyof ProductRow, value: string) => {
    setProducts(products.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const formatBRL = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const calculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedState) return;

    setLoading(true);

    // Mock API Delay
    setTimeout(() => {
      let totalProductsUSD = 0;
      let totalWeight = 0;

      products.forEach(p => {
        const price = parseFloat(p.price.replace(',', '.')) || 0;
        const weight = parseFloat(p.weight.replace(',', '.')) || 0;
        const qty = parseInt(p.qty as any) || 1;

        totalProductsUSD += price * qty;
        totalWeight += weight * qty;
      });

      const productsBRL = totalProductsUSD * exchangeRate;
      
      const icmsRate = ICMS_RATES[selectedState]?.icms || 17;
      
      // Mocked Freight Costs
      const freightOptions = [
        { name: "Packet Standard", baseFreightUSD: totalWeight * 15 + 10 },
        { name: "Packet Express", baseFreightUSD: totalWeight * 25 + 15 }
      ];

      const mockResults = freightOptions.map(opt => {
        const shippingBRL = opt.baseFreightUSD * exchangeRate;
        const serviceFeeBRL = 5 * exchangeRate;
        
        const valorAduaneiro = productsBRL + shippingBRL;
        // Import tax: 60%
        const importTax = valorAduaneiro * 0.60;
        
        // ICMS "por dentro"
        const baseIcms = (valorAduaneiro + importTax) / (1 - (icmsRate / 100));
        const icms = baseIcms * (icmsRate / 100);

        const totalFinal = productsBRL + shippingBRL + serviceFeeBRL + importTax + icms;

        return {
          shipping_method: opt.name,
          shipping_weight_range: "30 kg",
          total_weight: totalWeight,
          valor_aduaneiro: valorAduaneiro,
          import_tax: importTax,
          icms: icms,
          icms_rate: icmsRate,
          products_brl: productsBRL,
          sales_tax_rate: 0,
          sales_tax_brl: 0,
          shipping_brl: shippingBRL,
          service_fee_brl: serviceFeeBRL,
          total_final: totalFinal
        };
      });

      // Sort by total final
      mockResults.sort((a, b) => a.total_final - b.total_final);

      setResults(mockResults);
      setLoading(false);
      
      setTimeout(() => {
        document.getElementById("resultsSection")?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
          <Calculator className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="font-semibold text-2xl text-zinc-900 leading-tight">
            Calculadora de Importação
          </h2>
          <p className="text-sm text-zinc-600 mt-1">Estime impostos e fretes para enviar seus produtos ao Brasil</p>
        </div>
      </div>

      {/* Exchange Rate Card */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg flex items-center justify-between flex-wrap gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <DollarSign className="w-32 h-32" />
        </div>
        <div className="relative z-10">
          <p className="font-semibold text-lg">Cotação do Dólar</p>
          <p className="text-sm opacity-80 mt-1">Atualizado automaticamente hoje</p>
        </div>
        <div className="text-right relative z-10">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-extrabold tracking-tight">R$ 5,22</span>
          </div>
          <p className="text-sm opacity-80 mt-1 font-medium">por US$</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-zinc-100 overflow-hidden">
        <div className="p-6 sm:p-8 space-y-6">
          <h3 className="text-xl font-bold text-zinc-900 flex items-center gap-3 border-b border-zinc-100 pb-4">
            <Package className="w-6 h-6 text-blue-600" />
            Adicione seus produtos
          </h3>

          <form onSubmit={calculate} className="space-y-8">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs font-semibold text-zinc-500 border-b border-zinc-200">
                    <th className="pb-3 pr-3">Preço unitário (USD)</th>
                    <th className="pb-3 pr-3">Peso unitário (kg)</th>
                    <th className="pb-3 pr-3 w-28">Quantidade</th>
                    <th className="pb-3 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="py-3 pr-3">
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 font-medium">$</span>
                          <input 
                            type="text" 
                            inputMode="numeric"
                            placeholder="0.00" 
                            required 
                            value={product.price}
                            onChange={(e) => handlePriceChange(product.id, e.target.value)}
                            className="w-full pl-8 pr-3 py-2.5 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow font-mono"
                          />
                        </div>
                      </td>
                      <td className="py-3 pr-3">
                        <input 
                          type="text" 
                          inputMode="numeric"
                          placeholder="0.000" 
                          required 
                          value={product.weight}
                          onChange={(e) => handleWeightChange(product.id, e.target.value)}
                          className="w-full px-4 py-2.5 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow font-mono"
                        />
                      </td>
                      <td className="py-3 pr-3">
                        <input 
                          type="number" 
                          min="1" 
                          required 
                          value={product.qty}
                          onChange={(e) => handleChange(product.id, "qty", e.target.value)}
                          className="w-full px-4 py-2.5 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow text-center font-medium"
                        />
                      </td>
                      <td className="py-3 text-right">
                        <button 
                          type="button" 
                          onClick={() => handleRemoveProduct(product.id)}
                          className={`p-2 rounded-lg transition-colors ${products.length > 1 ? 'text-red-400 hover:bg-red-50 hover:text-red-600' : 'text-zinc-300 cursor-not-allowed'}`}
                          disabled={products.length <= 1}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button 
              type="button" 
              onClick={handleAddProduct}
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Adicionar produto
            </button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-zinc-100">
              <div className="md:col-span-2 space-y-2">
                <label className="block text-sm font-semibold text-zinc-900">
                  Estado de destino no Brasil
                  <span className="text-xs font-normal text-zinc-500 ml-2">— para calcular ICMS</span>
                </label>
                <select 
                  required 
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow text-zinc-800 bg-white"
                >
                  <option value="">Selecione o estado...</option>
                  {Object.entries(ICMS_RATES).map(([uf, data]) => (
                    <option key={uf} value={uf}>{uf} — {data.name} ({data.icms}% ICMS)</option>
                  ))}
                </select>
                {selectedState && (
                  <p className="text-xs font-medium text-violet-600 flex items-center gap-1.5 pt-1 animate-in fade-in slide-in-from-top-1">
                    <ShieldCheck className="w-4 h-4" />
                    ICMS aplicado neste estado: <strong>{ICMS_RATES[selectedState].icms.toFixed(1)}%</strong>
                  </p>
                )}
              </div>
              
              <div className="flex items-end">
                <button 
                  type="submit" 
                  disabled={loading || !selectedState}
                  className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Calculando...
                    </>
                  ) : (
                    <>
                      <Calculator className="w-5 h-5" />
                      Calcular Importação
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Results Section */}
      {results && (
        <div id="resultsSection" className="space-y-6 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold text-zinc-900 flex items-center gap-2">
                <CheckCircle2 className="w-7 h-7 text-green-500" />
                {results.length} opções de frete
              </h3>
              <p className="text-sm text-zinc-500 mt-1">Ordenadas do menor para o maior custo total</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {results.map((result, idx) => {
              const isBest = idx === 0;
              const productsPct = Math.round((result.products_brl / result.total_final) * 100);
              const freightCost = result.shipping_brl + result.service_fee_brl;
              const freightPct = Math.round((freightCost / result.total_final) * 100);
              const taxesPct = 100 - productsPct - freightPct;
              const totalTaxes = result.import_tax + result.icms;

              return (
                <div key={idx} className={`bg-white rounded-2xl shadow-xl border-2 flex flex-col overflow-hidden transition-all hover:shadow-2xl ${isBest ? 'border-green-400' : 'border-zinc-200'}`}>
                  {isBest && (
                    <div className="bg-green-500 text-white text-center py-1.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                      ✨ Melhor Opção
                    </div>
                  )}

                  <div className="p-6 flex flex-col gap-6 flex-1">
                    {/* Header Method */}
                    <div>
                      <h4 className="font-bold text-zinc-900 text-lg leading-tight">{result.shipping_method}</h4>
                      <p className="text-xs text-zinc-500 mt-1">
                        Suporta até {result.shipping_weight_range} &nbsp;·&nbsp; Seu peso: {result.total_weight.toFixed(3)} kg
                      </p>
                    </div>

                    {/* Total Box */}
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-200 text-center">
                      <p className="text-xs text-amber-700 font-bold uppercase tracking-wider mb-1">Total Estimado</p>
                      <p className="text-3xl font-extrabold text-amber-900">{formatBRL(result.total_final)}</p>
                      <p className="text-xs text-amber-600 mt-1.5 font-medium">valor chegando no Brasil</p>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex h-2.5 rounded-full overflow-hidden gap-0.5">
                        <div style={{ width: `${productsPct}%` }} className="bg-blue-500" title={`Produtos ${productsPct}%`}></div>
                        <div style={{ width: `${freightPct}%` }} className="bg-orange-400" title={`Frete ${freightPct}%`}></div>
                        <div style={{ width: `${taxesPct}%` }} className="bg-red-500" title={`Impostos ${taxesPct}%`}></div>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2.5 text-[10px] font-semibold text-zinc-500 uppercase">
                        <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-blue-500 mr-1.5"></span>Produtos {productsPct}%</span>
                        <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-orange-400 mr-1.5"></span>Frete {freightPct}%</span>
                        <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-red-500 mr-1.5"></span>Impostos {taxesPct}%</span>
                      </div>
                    </div>

                    {/* Detailed Breakdown */}
                    <div className="space-y-4 text-sm flex-1">
                      
                      {/* Products */}
                      <div>
                        <div className="flex justify-between items-baseline font-medium">
                          <span className="text-zinc-600 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            Produto(s)
                          </span>
                          <span className="text-zinc-900">{formatBRL(result.products_brl)}</span>
                        </div>
                      </div>

                      {/* Freight */}
                      <div>
                        <div className="flex justify-between items-baseline font-medium">
                          <span className="text-zinc-600 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                            Frete
                          </span>
                          <span className="text-zinc-900">{formatBRL(result.shipping_brl)}</span>
                        </div>
                        {result.service_fee_brl > 0 && (
                          <div className="flex justify-between items-baseline pl-4 mt-1 text-xs">
                            <span className="text-zinc-400">Taxa de serviço</span>
                            <span className="text-zinc-500 font-medium">{formatBRL(result.service_fee_brl)}</span>
                          </div>
                        )}
                      </div>

                      {/* Taxes */}
                      <div className="pt-3 border-t border-zinc-100">
                        <div className="flex justify-between items-baseline font-semibold text-red-600">
                          <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500"></span>
                            Impostos no Brasil
                          </span>
                          <span>{formatBRL(totalTaxes)}</span>
                        </div>
                        <div className="mt-2 pl-4 space-y-1.5 text-xs border-l-2 border-red-100">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <p className="font-semibold text-zinc-700">Imposto de Importação (60%)</p>
                              <p className="text-zinc-400 text-[10px]">Sobre valor aduaneiro</p>
                            </div>
                            <span className="font-medium text-zinc-600">{formatBRL(result.import_tax)}</span>
                          </div>
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <p className="font-semibold text-zinc-700">ICMS ({result.icms_rate}%)</p>
                              <p className="text-zinc-400 text-[10px]">Cálculo por dentro do estado</p>
                            </div>
                            <span className="font-medium text-zinc-600">{formatBRL(result.icms)}</span>
                          </div>
                        </div>
                      </div>

                    </div>

                    <div className="pt-4 border-t border-zinc-200 flex justify-between items-center font-bold">
                      <span className="text-zinc-900 text-lg">Total</span>
                      <span className="text-amber-700 text-xl">{formatBRL(result.total_final)}</span>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {/* Warning Banner */}
          <div className="p-5 bg-amber-50 border border-amber-200 rounded-xl text-sm flex gap-4 mt-6 items-start">
            <Info className="w-6 h-6 text-amber-500 flex-shrink-0" />
            <div>
              <p className="font-bold text-amber-800 mb-1">Atenção — Valores Estimados</p>
              <p className="text-amber-700 leading-relaxed">
                Os cálculos são baseados nas alíquotas vigentes e na cotação atual do dólar turismo/comercial configurada. O valor final pode variar conforme a avaliação da Receita Federal na alfândega e a cobrança dos impostos no ato do despacho.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* Explanatory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
        <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
          <p className="font-bold text-blue-900 flex items-center gap-2 mb-2">
            📦 Imposto de Importação (II)
          </p>
          <p className="text-sm text-blue-800 leading-relaxed">
            Taxa federal de <strong>60%</strong> cobrada pela Receita Federal sobre o <em>valor aduaneiro</em> (valor dos produtos + frete) convertidos para R$.
          </p>
        </div>
        <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
          <p className="font-bold text-purple-900 flex items-center gap-2 mb-2">
            🏛️ ICMS
          </p>
          <p className="text-sm text-purple-800 leading-relaxed">
            Imposto estadual que varia de <strong>17% a 22%</strong>. A cobrança no Brasil é feita com o ICMS "embutido" no próprio valor da base, o chamado cálculo "por dentro".
          </p>
        </div>
        <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 md:col-span-2 lg:col-span-1">
          <p className="font-bold text-amber-900 flex items-center gap-2 mb-2">
            💡 Dica
          </p>
          <p className="text-sm text-amber-800 leading-relaxed">
            Compras acima de <strong>USD 50</strong> geralmente ficam sujeitas à tributação completa. Abaixo disso pode haver isenção, mas não é garantido.
          </p>
        </div>
      </div>

    </div>
  );
}
