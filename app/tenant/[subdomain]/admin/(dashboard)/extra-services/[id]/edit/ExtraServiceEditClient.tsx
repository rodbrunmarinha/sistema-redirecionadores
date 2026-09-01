'use client';

import { useState } from 'react';
import { usePermissions } from '@/app/providers/PermissionsProvider';
import { useTenantSettings } from '../../../../../app/(customer)/components/TenantSettingsContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lightbulb, Check, Loader2, Package, Scissors, Lock, Zap, DollarSign, Settings2 } from 'lucide-react';
import { updateExtraService } from '../../_actions/extraServices';
import toast from 'react-hot-toast';

export function ExtraServiceEditClient({ subdomain, extraService }: { subdomain: string, extraService: any }) {
  const router = useRouter();
  const { hasPermission } = usePermissions();
  const { currencySymbol } = useTenantSettings();

  if (!hasPermission('settings.edit')) return <div className="p-8 text-center text-zinc-500">Acesso restrito.</div>;
  const [isSubmitting, setIsSubmitting] = useState(false);

  // States initialized with existing values
  const [name, setName] = useState(extraService.name || '');
  const [description, setDescription] = useState(extraService.description || '');
  const [chargeType, setChargeType] = useState<'fixed' | 'declared_percentage' | 'custom_declared_percentage'>(extraService.charge_type || 'fixed');
  
  // Formatters
  const [priceDisplay, setPriceDisplay] = useState(Number(extraService.price || 0).toFixed(2));
  const [percentageDisplay, setPercentageDisplay] = useState(Number(extraService.percentage_rate || 0).toFixed(2));
  const [weightDisplay, setWeightDisplay] = useState(Number(extraService.extra_weight || 0).toFixed(3));
  
  const [isActive, setIsActive] = useState(!!extraService.is_active);

  // Formatting helpers
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (!value) value = '0';
    const num = parseInt(value, 10);
    setPriceDisplay((num / 100).toFixed(2));
  };

  const handlePercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (!value) value = '0';
    let num = parseInt(value, 10);
    // Limit to 100%
    if (num > 10000) num = 10000;
    setPercentageDisplay((num / 100).toFixed(2));
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (!value) value = '0';
    const num = parseInt(value, 10);
    setWeightDisplay((num / 1000).toFixed(3));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Informe o nome do serviço.');
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Atualizando serviço...');

    const payload = {
      name,
      description,
      charge_type: chargeType,
      price: parseFloat(priceDisplay) || 0,
      percentage_rate: parseFloat(percentageDisplay) || 0,
      extra_weight: parseFloat(weightDisplay) || 0,
      is_active: isActive
    };

    try {
      const res = await updateExtraService(extraService.id, payload, subdomain);
      if (res.success) {
        toast.success('Serviço atualizado com sucesso!', { id: toastId });
        router.push(`/admin/extra-services`);
      } else {
        toast.error(res.error || 'Erro ao atualizar.', { id: toastId });
      }
    } catch (err) {
      toast.error('Erro de conexão.', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Info Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-500/10 rounded-xl shadow-lg border border-amber-500/20">
            <Lightbulb className="w-6 h-6 text-amber-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-zinc-100 mb-4">Exemplos de Serviços Extras</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-zinc-950 px-4 py-3 rounded-lg border border-zinc-800">
                <span className="font-semibold text-zinc-100 flex items-center gap-2 mb-1">
                  <Package className="w-4 h-4 text-zinc-500" /> Embalagem:
                </span>
                <span className="text-zinc-500">Caixa dupla, Bubble wrap</span>
              </div>
              <div className="bg-zinc-950 px-4 py-3 rounded-lg border border-zinc-800">
                <span className="font-semibold text-zinc-100 flex items-center gap-2 mb-1">
                  <Scissors className="w-4 h-4 text-zinc-500" /> Manuais:
                </span>
                <span className="text-zinc-500">Remover etiquetas, Reembalar</span>
              </div>
              <div className="bg-zinc-950 px-4 py-3 rounded-lg border border-zinc-800">
                <span className="font-semibold text-zinc-100 flex items-center gap-2 mb-1">
                  <Lock className="w-4 h-4 text-zinc-500" /> Segurança:
                </span>
                <span className="text-zinc-500">Seguro (ex: 2.50% do declarado)</span>
              </div>
              <div className="bg-zinc-950 px-4 py-3 rounded-lg border border-zinc-800">
                <span className="font-semibold text-zinc-100 flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-zinc-500" /> Premium:
                </span>
                <span className="text-zinc-500">Processamento expresso</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 overflow-hidden">
        <div className="p-4 sm:p-8 space-y-8">
          
          {/* Nome */}
          <div>
            <label className="block text-sm font-bold text-zinc-300 mb-2">
              Nome do Serviço <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              value={name}
              onChange={e => setName(e.target.value)}
              required 
              placeholder="Ex: Adicionar fita adesiva para reforçar a caixa" 
              className="w-full px-4 py-3 border border-zinc-700 bg-zinc-950 rounded-xl text-white focus:ring-2 focus:ring-amber-500 outline-none transition"
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-bold text-zinc-300 mb-2">
              Descrição (Opcional)
            </label>
            <textarea 
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Descreva os detalhes do serviço..." 
              className="w-full px-4 py-3 border border-zinc-700 bg-zinc-950 rounded-xl text-white focus:ring-2 focus:ring-amber-500 outline-none transition"
            />
          </div>

          {/* Tipo de Cobrança */}
          <div>
            <label className="block text-sm font-bold text-zinc-300 mb-4">
              Tipo de Cobrança <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <label 
                className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${
                  chargeType === 'fixed' ? 'border-amber-500 bg-amber-500/10' : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'
                }`}
              >
                <input 
                  type="radio" 
                  name="charge_type" 
                  value="fixed" 
                  checked={chargeType === 'fixed'}
                  onChange={() => setChargeType('fixed')}
                  className="mt-1 text-amber-600 focus:ring-amber-500 bg-zinc-800 border-zinc-700" 
                />
                <div>
                  <p className="text-sm font-semibold text-zinc-100">Valor Fixo</p>
                  <p className="text-xs text-zinc-500 mt-1">Cobra um valor único por envio</p>
                </div>
              </label>

              <label 
                className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${
                  chargeType === 'declared_percentage' ? 'border-amber-500 bg-amber-500/10' : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'
                }`}
              >
                <input 
                  type="radio" 
                  name="charge_type" 
                  value="declared_percentage" 
                  checked={chargeType === 'declared_percentage'}
                  onChange={() => setChargeType('declared_percentage')}
                  className="mt-1 text-amber-600 focus:ring-amber-500 bg-zinc-800 border-zinc-700" 
                />
                <div>
                  <p className="text-sm font-semibold text-zinc-100">% do Valor Declarado</p>
                  <p className="text-xs text-zinc-500 mt-1">Seguro = % sobre declaração aduaneira</p>
                </div>
              </label>

              <label 
                className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${
                  chargeType === 'custom_declared_percentage' ? 'border-amber-500 bg-amber-500/10' : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'
                }`}
              >
                <input 
                  type="radio" 
                  name="charge_type" 
                  value="custom_declared_percentage" 
                  checked={chargeType === 'custom_declared_percentage'}
                  onChange={() => setChargeType('custom_declared_percentage')}
                  className="mt-1 text-amber-600 focus:ring-amber-500 bg-zinc-800 border-zinc-700" 
                />
                <div>
                  <p className="text-sm font-semibold text-zinc-100">% sobre Valor Informado</p>
                  <p className="text-xs text-zinc-500 mt-1">Cliente informa uma base para este seguro</p>
                </div>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-zinc-800">
            {/* Preço (Only for Fixed) */}
            {chargeType === 'fixed' ? (
              <div className="animate-in fade-in duration-300">
                <label className="block text-sm font-bold text-zinc-300 mb-2">
                  Preço <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <span className="text-zinc-500 font-medium px-2">{currencySymbol}</span>
                  </div>
                  <input 
                    type="text" 
                    value={priceDisplay}
                    onChange={handlePriceChange}
                    className="w-full pl-12 pr-4 py-4 bg-zinc-950 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-white font-semibold text-lg"
                  />
                </div>
                <div className="mt-3">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${
                    parseFloat(priceDisplay) === 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'
                  }`}>
                    {parseFloat(priceDisplay) === 0 ? '✓ Serviço Gratuito' : '💰 Serviço Pago'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="animate-in fade-in duration-300">
                <label className="block text-sm font-bold text-zinc-300 mb-2">
                  Percentual do Seguro <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={percentageDisplay}
                    onChange={handlePercentageChange}
                    className="w-full pl-4 pr-12 py-4 bg-zinc-950 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-white font-semibold text-lg"
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none z-10">
                    <span className="text-zinc-500 font-bold text-lg">%</span>
                  </div>
                </div>
                <p className="mt-3 text-xs text-amber-500/80 bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
                  {chargeType === 'declared_percentage' 
                    ? 'O sistema calculará automaticamente este serviço com base no total declarado na etapa de declaração aduaneira.' 
                    : 'O sistema aplicará este percentual no valor informado pelo cliente para este seguro específico.'}
                </p>
              </div>
            )}

            {/* Peso Extra */}
            <div>
              <label className="block text-sm font-bold text-zinc-300 mb-2">
                Peso Extra <span className="text-zinc-500 font-normal">(Opcional)</span>
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  value={weightDisplay}
                  onChange={handleWeightChange}
                  className="w-full pl-4 pr-16 py-4 bg-zinc-950 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-white font-semibold text-lg"
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none z-10">
                  <span className="text-zinc-500 font-bold">kg</span>
                </div>
              </div>
              <div className="mt-3">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${
                  parseFloat(weightDisplay) === 0 ? 'bg-zinc-800 text-zinc-400' : 'bg-orange-500/10 text-orange-500'
                }`}>
                  {parseFloat(weightDisplay) === 0 ? '➖ Sem peso adicional' : '⚠️ Afeta cálculo do frete'}
                </span>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="pt-4 border-t border-zinc-800">
            <label className="block text-sm font-bold text-zinc-300 mb-3">Status</label>
            <label className={`flex items-center gap-3 cursor-pointer p-4 rounded-xl border-2 transition ${
              isActive ? 'bg-amber-500/5 border-amber-500/30' : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
            }`}>
              <input 
                type="checkbox" 
                checked={isActive}
                onChange={e => setIsActive(e.target.checked)}
                className="w-5 h-5 text-amber-600 rounded focus:ring-2 focus:ring-amber-500 bg-zinc-800 border-zinc-700" 
              />
              <span className="text-sm font-semibold text-zinc-100">Serviço ativo e disponível para clientes</span>
            </label>
          </div>
          
        </div>

        {/* Footer Actions */}
        <div className="px-4 sm:px-8 py-5 bg-zinc-950 border-t border-zinc-800 flex flex-col-reverse sm:flex-row gap-4 justify-between items-center">
          <Link 
            href={`/admin/extra-services`}
            className="w-full sm:w-auto text-center px-6 py-3 bg-zinc-800 text-zinc-300 font-semibold rounded-xl hover:bg-zinc-700 transition"
          >
            Cancelar
          </Link>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full sm:w-auto justify-center px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition shadow-lg flex items-center gap-2 disabled:opacity-70"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
            Salvar Alterações
          </button>
        </div>
      </form>

    </div>
  );
}
