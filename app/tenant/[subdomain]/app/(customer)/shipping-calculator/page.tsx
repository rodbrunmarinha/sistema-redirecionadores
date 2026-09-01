"use client";
import { useTenantSettings } from "../components/TenantSettingsContext";

import { useState, useEffect } from "react";
import { Package, Info, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

type ShippingResult = {
  shipping_type: string;
  weight: string | number;
  weight_unit: string;
  box_extra_weight: string | number;
  total_weight: string | number;
  rate_weight_limit?: string | number;
  price_per_weight?: string | number;
  currency: string;
  sale_price: string;
  service_fee: string;
  total_cost: string;
};

export default function ShippingCalculatorPage() {
  const { currency, weightUnit, currencySymbol } = useTenantSettings();
  const [weight, setWeight] = useState<number>(1);
  const minWeight = 1;
  const maxWeight = 30;
  // const weightUnit = weightUnit;
  
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ShippingResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Compute display weight and unit
  const getDisplayWeight = () => {
    if (weightUnit === weightUnit && weight > 0 && weight < 1) {
      return Math.round(weight * 1000);
    }
    return parseFloat(weight.toFixed(3));
  };

  const getDisplayUnit = () => {
    return (weightUnit === weightUnit && weight > 0 && weight < 1) ? "g" : weightUnit;
  };

  const calculate = async (currentWeight: number) => {
    setLoading(true);
    setError(null);
    setResults([]);

    // Simulate API call delay
    setTimeout(() => {
      // Mock data based on weight
      if (currentWeight > 25) {
        // Just as an example of error state
        setError("Peso excede o limite máximo de todas as tabelas de frete (Exemplo de erro simulado acima de 25kg).");
      } else {
        // Generate mock results
        const mockResults: ShippingResult[] = [
          {
            shipping_type: "Packet Standard",
            weight: currentWeight,
            weight_unit: weightUnit,
            box_extra_weight: "0.20",
            total_weight: (currentWeight + 0.2).toFixed(2),
            rate_weight_limit: "30",
            price_per_weight: "15.00",
            currency: currency,
            sale_price: (currentWeight * 15).toFixed(2),
            service_fee: "10.00",
            total_cost: (currentWeight * 15 + 10).toFixed(2),
          },
          {
            shipping_type: "Packet Express",
            weight: currentWeight,
            weight_unit: weightUnit,
            box_extra_weight: "0.20",
            total_weight: (currentWeight + 0.2).toFixed(2),
            rate_weight_limit: "30",
            price_per_weight: "35.00",
            currency: currency,
            sale_price: (currentWeight * 35).toFixed(2),
            service_fee: "15.00",
            total_cost: (currentWeight * 35 + 15).toFixed(2),
          },
          {
            shipping_type: "FedEx Priority",
            weight: currentWeight,
            weight_unit: weightUnit,
            box_extra_weight: "0.50",
            total_weight: (currentWeight + 0.5).toFixed(2),
            rate_weight_limit: "68",
            price_per_weight: "90.00",
            currency: currency,
            sale_price: (currentWeight * 90).toFixed(2),
            service_fee: "20.00",
            total_cost: (currentWeight * 90 + 20).toFixed(2),
          }
        ];
        setResults(mockResults);
      }
      setLoading(false);
    }, 800);
  };

  // Initial calculation
  useEffect(() => {
    calculate(weight);
  }, []); // Run only once on mount

  // Debounce for slider changes
  useEffect(() => {
    const handler = setTimeout(() => {
      calculate(weight);
    }, 500);
    return () => clearTimeout(handler);
  }, [weight]);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl shadow-lg">
          <Package className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="font-semibold text-2xl text-zinc-900 leading-tight">
            Simulador de Frete
          </h2>
          <p className="text-sm text-zinc-600 mt-1">Calcule o custo de envio das suas encomendas</p>
        </div>
      </div>

      {/* Info Card */}
      <div className="mb-8 p-6 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-orange-100 rounded-xl">
            <Info className="w-6 h-6 text-orange-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-orange-800 font-semibold mb-2">💡 Como usar o simulador</p>
            <ul className="text-sm text-orange-700 space-y-1 list-disc list-inside">
              <li>Arraste o controle deslizante para ajustar o peso em <strong>kg</strong></li>
              <li>Veja instantaneamente o custo em todos os tipos de frete</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Slider Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-zinc-200 overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-orange-500 to-amber-600 px-6 py-5">
          <h3 className="text-xl font-bold text-white flex items-center gap-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
            </svg>
            Peso da Encomenda
          </h3>
        </div>

        <div className="p-8">
          {/* Weight Display */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-100 to-amber-100 rounded-2xl border-2 border-orange-300">
              <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path>
              </svg>
              <div>
                <div className="text-5xl font-bold text-orange-600">{getDisplayWeight()}</div>
                <div className="text-sm font-semibold text-orange-700 mt-1">{getDisplayUnit()}</div>
              </div>
            </div>
          </div>

          {/* Slider */}
          <div className="space-y-4 max-w-3xl mx-auto">
            <input
              type="range"
              value={weight}
              onChange={(e) => setWeight(parseFloat(e.target.value))}
              min={minWeight}
              max={maxWeight}
              step={0.1}
              className="w-full h-4 bg-gradient-to-r from-orange-200 to-amber-200 rounded-lg appearance-none cursor-pointer"
              style={{
                accentColor: '#f97316'
              }}
            />
            <div className="flex justify-between text-sm font-semibold text-zinc-600">
              <span>{weightUnit === weightUnit && minWeight < 1 ? Math.round(minWeight * 1000) + " g" : minWeight + " " + weightUnit}</span>
              <span>{maxWeight + " " + weightUnit}</span>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="mt-6 text-center animate-in fade-in">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-50 border border-blue-200 rounded-lg">
                <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                <span className="text-sm font-semibold text-blue-700">Calculando fretes...</span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && !loading && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg animate-in fade-in">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-sm font-semibold text-red-800">{error}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Grid */}
      {results.length > 0 && !loading && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-2xl font-bold text-zinc-900 mb-6 flex items-center gap-3">
            <CheckCircle2 className="w-7 h-7 text-green-600" />
            Resultados da Simulação
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((result, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-xl border border-zinc-200 overflow-hidden hover:shadow-2xl transition">
                {/* Header */}
                <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-4">
                  <h4 className="text-xl font-bold text-white">{result.shipping_type}</h4>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Weight Details */}
                  <div className="bg-gradient-to-r from-zinc-50 to-violet-50 rounded-xl p-4 space-y-3 border border-zinc-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-zinc-600">Peso do Envio:</span>
                      <span className="text-sm font-bold text-zinc-900">{result.weight} {result.weight_unit}</span>
                    </div>
                    {parseFloat(String(result.box_extra_weight)) > 0 && (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-zinc-500">+ Peso da caixa</span>
                          <span className="text-sm font-bold text-zinc-700">{result.box_extra_weight} {result.weight_unit}</span>
                        </div>
                        <div className="flex items-center justify-between border-t border-violet-200 pt-2">
                          <span className="text-xs font-semibold text-violet-700">Peso Total</span>
                          <span className="text-sm font-bold text-violet-700">{result.total_weight} {result.weight_unit}</span>
                        </div>
                      </>
                    )}
                    {result.rate_weight_limit && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-zinc-600">Faixa de Peso:</span>
                        <span className="text-sm font-bold text-violet-600">até {result.rate_weight_limit} {result.weight_unit}</span>
                      </div>
                    )}
                    {result.price_per_weight && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-zinc-600">Preço por peso:</span>
                        <span className="text-sm font-bold text-violet-600">{result.currency} {result.price_per_weight} / {result.weight_unit}</span>
                      </div>
                    )}
                  </div>

                  {/* Cost Breakdown */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 space-y-3 border border-green-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-zinc-600">Preço do Frete:</span>
                      <span className="text-sm font-bold text-zinc-900">{result.currency} {result.sale_price}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-zinc-600">Taxa de Serviço:</span>
                      <span className="text-sm font-bold text-zinc-900">{result.currency} {result.service_fee}</span>
                    </div>
                    <div className="border-t-2 border-green-300 pt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-zinc-800">TOTAL:</span>
                        <span className="text-2xl font-bold text-green-600">{result.currency} {result.total_cost}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Shipping Types / Results */}
      {!loading && !error && results.length === 0 && (
        <div className="mt-12 bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center">
          <div className="inline-flex p-6 bg-amber-100 rounded-full mb-4">
            <svg className="w-12 h-12 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-amber-800 mb-2">Nenhum Tipo de Frete Disponível</h3>
          <p className="text-sm text-amber-700">Ajuste o peso ou entre em contato com o suporte para configurar as opções de frete.</p>
        </div>
      )}
    </div>
  );
}
