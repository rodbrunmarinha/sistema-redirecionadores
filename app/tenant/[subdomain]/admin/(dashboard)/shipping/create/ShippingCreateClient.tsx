'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Truck, Calculator, Settings, Tag, Loader2, Info, Check, Package, MapPin } from 'lucide-react';
import { createShippingType } from '../_actions/shipping';
import toast from 'react-hot-toast';

export function ShippingCreateClient({ subdomain }: { subdomain: string }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successModal, setSuccessModal] = useState<{ show: boolean, id: string, name: string, count: number, min: string, max: string, step: string }>({ show: false, id: "", name: "", count: 0, min: "", max: "", step: "" });

  // States
  const [pricingMode, setPricingMode] = useState<'table' | 'quote'>('table');
  const [name, setName] = useState('');
  const [sortOrder, setSortOrder] = useState('0');
  
  // Table Mode Options
  const [generationMode, setGenerationMode] = useState<'limit' | 'continuous_ranges'>('limit');
  const [minWeight, setMinWeight] = useState('1');
  const [maxWeight, setMaxWeight] = useState('30');
  const [weightStep, setWeightStep] = useState('1.000');

  // Checkboxes
  const [isActive, setIsActive] = useState(true);
  const [boxAssembly, setBoxAssembly] = useState(false);
  const [skipCustoms, setSkipCustoms] = useState(false);
  const [volumetric, setVolumetric] = useState(false);
  
  // Volumetric Data
  const [volumetricUnit, setVolumetricUnit] = useState('cm');
  const [volumetricDivisor, setVolumetricDivisor] = useState('5000');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Informe o nome do tipo de frete.');
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Criando tipo de frete...');

    const payload = {
      name,
      sort_order: parseInt(sortOrder) || 0,
      requires_quote: pricingMode === 'quote',
      is_active: isActive,
      requires_box_assembly: boxAssembly,
      skip_customs_declaration: skipCustoms,
      charge_volumetric: volumetric,
      volumetric_dimension_unit: volumetricUnit,
      volumetric_divisor: parseFloat(volumetricDivisor) || 5000,
      
      // Table generation
      generation_mode: generationMode,
      min_weight: minWeight,
      max_weight: maxWeight,
      weight_step: weightStep
    };

    try {
      const res = await createShippingType(payload, subdomain);
      if (res.success) {
        toast.dismiss(toastId);
        if (pricingMode === 'table') {
          setSuccessModal({ show: true, id: res.id, name: name, count: res.ratesCount || 0, min: minWeight, max: maxWeight, step: weightStep });
        } else {
          toast.success('Tipo de frete criado com sucesso!');
          router.push(`/admin/shipping`);
        }
      } else {
        toast.error(res.error || 'Erro ao criar.', { id: toastId });
      }
    } catch (err) {
      toast.error('Erro de conexão.', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* 1. Como este frete é cobrado? */}
      <div className="bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-bold text-zinc-100">Como este frete é cobrado?</h2>
        </div>
        <p className="text-sm text-zinc-400 mb-6">Escolha o modelo de cobrança deste tipo de frete.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button 
            type="button" 
            onClick={() => setPricingMode('table')}
            className={`relative text-left rounded-xl border-2 p-5 transition ${
              pricingMode === 'table' 
              ? 'border-amber-500 bg-amber-500/10' 
              : 'border-zinc-800 bg-zinc-800/50 hover:border-zinc-700'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-2xl">⚖️</span>
              {pricingMode === 'table' && (
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-500 text-white">
                  <Check className="w-3 h-3" />
                </span>
              )}
            </div>
            <p className="mt-3 text-sm font-bold text-zinc-100">Tabela por peso</p>
            <p className="mt-1 text-xs text-zinc-500 leading-relaxed">Você define faixas de peso e preços. O sistema calcula o frete automaticamente.</p>
          </button>

          <button 
            type="button" 
            onClick={() => setPricingMode('quote')}
            className={`relative text-left rounded-xl border-2 p-5 transition ${
              pricingMode === 'quote' 
              ? 'border-amber-500 bg-amber-500/10' 
              : 'border-zinc-800 bg-zinc-800/50 hover:border-zinc-700'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-2xl">🧮</span>
              {pricingMode === 'quote' && (
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-500 text-white">
                  <Check className="w-3 h-3" />
                </span>
              )}
            </div>
            <p className="mt-3 text-sm font-bold text-zinc-100">Requer orçamento</p>
            <p className="mt-1 text-xs text-zinc-500 leading-relaxed">Sem tabela de faixas. O operador informa o frete e a taxa em cada envio.</p>
          </button>
        </div>

        {pricingMode === 'quote' && (
          <div className="mt-4 flex items-start gap-3 rounded-xl bg-amber-500/10 border border-amber-500/20 p-4">
            <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-500/90 leading-relaxed">Ao ativar, a tabela de faixas de peso é ocultada. O cliente solicita o envio e você informa o valor do frete e da taxa de serviço para liberar o pagamento.</p>
          </div>
        )}
      </div>

      {/* 2. Identificação */}
      <div className="bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Tag className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-bold text-zinc-100">Identificação</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="sm:col-span-2">
            <label className="block text-sm font-bold text-zinc-300 mb-2">
              Nome do tipo de frete <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-3 border border-zinc-700 bg-zinc-800 rounded-xl text-white focus:ring-2 focus:ring-amber-500 outline-none" 
              placeholder="Ex: Packet Standard, Marítimo..." 
              required 
            />
            <p className="mt-2 text-xs text-zinc-500">Nome que identifica este frete no painel e no simulador.</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-zinc-300 mb-2">
              Ordem de exibição
            </label>
            <input 
              type="number" 
              min="0"
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value)}
              className="w-full px-4 py-3 border border-zinc-700 bg-zinc-800 rounded-xl text-white focus:ring-2 focus:ring-amber-500 outline-none" 
            />
            <p className="mt-2 text-xs text-zinc-500">Menor número aparece primeiro</p>
          </div>
        </div>
      </div>

      {/* 3. Faixas de peso (Only if table mode) */}
      {pricingMode === 'table' && (
        <div className="bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 p-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-2 mb-2">
            <Truck className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-zinc-100">Faixas de peso</h2>
          </div>
          <p className="text-sm text-zinc-400 mb-6">
            O sistema criará automaticamente as linhas da tabela. Use limites diretos para gerar "1kg, 2kg..." ou contínuas para "0.001 a 0.100".
          </p>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-zinc-300 mb-2">
                Modo de geração <span className="text-red-500">*</span>
              </label>
              <select 
                value={generationMode}
                onChange={e => setGenerationMode(e.target.value as any)}
                className="w-full px-4 py-3 border border-zinc-700 bg-zinc-800 rounded-xl text-white focus:ring-2 focus:ring-amber-500 outline-none"
              >
                <option value="limit">Limites diretos</option>
                <option value="continuous_ranges">Faixas contínuas</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-zinc-300 mb-2">
                  Peso inicial (kg) <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  min="0.001" 
                  step="0.001" 
                  value={minWeight}
                  onChange={e => setMinWeight(e.target.value)}
                  className="w-full px-4 py-3 border border-zinc-700 bg-zinc-800 rounded-xl text-white focus:ring-2 focus:ring-amber-500 outline-none" 
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-zinc-300 mb-2">
                  Peso final (kg) <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  min="0.001" 
                  step="0.001" 
                  value={maxWeight}
                  onChange={e => setMaxWeight(e.target.value)}
                  className="w-full px-4 py-3 border border-zinc-700 bg-zinc-800 rounded-xl text-white focus:ring-2 focus:ring-amber-500 outline-none" 
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-zinc-300 mb-2">
                  Passo (kg) <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  min="0.001" 
                  step="0.001" 
                  value={weightStep}
                  onChange={e => setWeightStep(e.target.value)}
                  className="w-full px-4 py-3 border border-zinc-700 bg-zinc-800 rounded-xl text-white focus:ring-2 focus:ring-amber-500 outline-none" 
                  required 
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Opções do Frete */}
      <div className="bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Settings className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-bold text-zinc-100">Opções do frete</h2>
        </div>

        <div className="space-y-4">
          
          <label className={`flex items-start gap-4 cursor-pointer p-4 border-2 rounded-xl transition ${
            isActive ? 'border-amber-500 bg-amber-500/5' : 'border-zinc-800 bg-zinc-800/30'
          }`}>
            <input 
              type="checkbox" 
              checked={isActive}
              onChange={e => setIsActive(e.target.checked)}
              className="mt-0.5 w-5 h-5 text-amber-600 rounded bg-zinc-700 border-zinc-600 focus:ring-amber-500 focus:ring-offset-zinc-900" 
            />
            <div>
              <span className="text-sm font-bold text-zinc-100 flex items-center gap-2">Ativo</span>
              <p className="text-xs text-zinc-500 mt-1">Deixe ativo para que o frete apareça como opção para os clientes.</p>
            </div>
          </label>

          {pricingMode === 'table' && (
            <label className={`flex items-start gap-4 cursor-pointer p-4 border-2 rounded-xl transition ${
              boxAssembly ? 'border-amber-500 bg-amber-500/5' : 'border-zinc-800 bg-zinc-800/30'
            }`}>
              <input 
                type="checkbox" 
                checked={boxAssembly}
                onChange={e => setBoxAssembly(e.target.checked)}
                className="mt-0.5 w-5 h-5 text-amber-600 rounded bg-zinc-700 border-zinc-600 focus:ring-amber-500 focus:ring-offset-zinc-900" 
              />
              <div>
                <span className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                  <Package className="w-4 h-4 text-zinc-400" /> Requer Montagem de Caixa
                </span>
                <p className="text-xs text-zinc-500 mt-1">O cliente aguardará o operador montar e pesar a caixa antes de liberar o pagamento.</p>
              </div>
            </label>
          )}

          <label className={`flex items-start gap-4 cursor-pointer p-4 border-2 rounded-xl transition ${
            skipCustoms ? 'border-amber-500 bg-amber-500/5' : 'border-zinc-800 bg-zinc-800/30'
          }`}>
            <input 
              type="checkbox" 
              checked={skipCustoms}
              onChange={e => setSkipCustoms(e.target.checked)}
              className="mt-0.5 w-5 h-5 text-amber-600 rounded bg-zinc-700 border-zinc-600 focus:ring-amber-500 focus:ring-offset-zinc-900" 
            />
            <div>
              <span className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-zinc-400" /> Não Exige Declaração Aduaneira
              </span>
              <p className="text-xs text-zinc-500 mt-1">A etapa de preenchimento aduaneiro será pulada (útil para envios locais/retirada).</p>
            </div>
          </label>

          {pricingMode === 'table' && (
            <div className={`p-4 border-2 rounded-xl transition ${
              volumetric ? 'border-amber-500 bg-amber-500/5' : 'border-zinc-800 bg-zinc-800/30'
            }`}>
              <label className="flex items-start gap-4 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={volumetric}
                  onChange={e => setVolumetric(e.target.checked)}
                  className="mt-0.5 w-5 h-5 text-amber-600 rounded bg-zinc-700 border-zinc-600 focus:ring-amber-500 focus:ring-offset-zinc-900" 
                />
                <div>
                  <span className="text-sm font-bold text-zinc-100">Cobrar por peso cubado (volumétrico)</span>
                  <p className="text-xs text-zinc-500 mt-1">Cobra-se pelo maior valor entre o peso real e o peso cubado.</p>
                </div>
              </label>

              {volumetric && (
                <div className="mt-4 ml-9 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-zinc-800/50">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-2">Unidade das medidas</label>
                    <select 
                      value={volumetricUnit}
                      onChange={e => setVolumetricUnit(e.target.value)}
                      className="w-full px-3 py-2 border border-zinc-700 bg-zinc-800 rounded-lg text-white focus:ring-2 focus:ring-amber-500 outline-none text-sm"
                    >
                      <option value="cm">Centímetros (cm)</option>
                      <option value="in">Polegadas (pol)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-2">Fator de cubagem</label>
                    <input 
                      type="number" 
                      value={volumetricDivisor}
                      onChange={e => setVolumetricDivisor(e.target.value)}
                      className="w-full px-3 py-2 border border-zinc-700 bg-zinc-800 rounded-lg text-white focus:ring-2 focus:ring-amber-500 outline-none text-sm"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Submit Action */}
      <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-4">
        <Link 
          href={`/admin/shipping`}
          className="w-full sm:w-auto px-6 py-3 bg-zinc-800 text-zinc-300 font-semibold rounded-xl hover:bg-zinc-700 transition text-center"
        >
          Cancelar
        </Link>
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full sm:w-auto px-8 py-3 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-700 transition shadow-lg inline-flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Truck className="w-5 h-5" />
          )}
          <span>{pricingMode === 'table' ? 'Criar e gerar faixas' : 'Novo tipo de frete'}</span>
        </button>
      </div>

    </form>

    {/* Success Modal */}
    {successModal.show && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
          <div className="bg-amber-600 pt-12 pb-8 px-6 relative overflow-hidden flex justify-center">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-black/10 rounded-full translate-x-16 translate-y-16"></div>
            <div className="relative w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
              <div className="text-amber-600 flex flex-col items-center justify-center">
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="absolute -top-1 -left-1 text-white">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                </div>
                <div className="absolute -top-1 right-2 text-white/80">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                </div>
              </div>
            </div>
          </div>
          <div className="p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Sucesso!</h3>
            <p className="text-gray-500 dark:text-zinc-400 text-sm leading-relaxed mb-8">
              Tipo {successModal.name} criado com {successModal.count} faixas ({successModal.min} a {successModal.max}, passo {successModal.step}). Você já pode editar os preços dessa tabela na listagem de fretes.
            </p>
            <button
              onClick={() => router.push(`/admin/shipping/${successModal.id}/rates`)}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3.5 px-4 rounded-xl transition shadow-lg shadow-amber-500/20"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
