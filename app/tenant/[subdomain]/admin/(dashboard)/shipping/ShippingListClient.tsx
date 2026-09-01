'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Truck, GripVertical, Settings, Trash2, Loader2, AlertTriangle, Copy, Power, PowerOff, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { deleteShippingType, reorderShippingTypes, updateShippingTypeStatus, updateShippingTypeName, duplicateShippingType } from './_actions/shipping';

interface ShippingListClientProps {
  subdomain: string;
  shippingTypes: any[];
}

export function ShippingListClient({ subdomain, shippingTypes: initialShippingTypes }: ShippingListClientProps) {
  const [shippingTypes, setShippingTypes] = useState(initialShippingTypes);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  
  // Drag and drop state
  const [draggedItem, setDraggedItem] = useState<number | null>(null);

  const activeCount = shippingTypes.filter(t => t.is_active !== false).length;
  const ratesCount = shippingTypes.reduce((acc, t) => acc + (t.shipping_rates?.length || 0), 0);

  // Reorder
  const handleDragStart = (index: number) => setDraggedItem(index);
  const handleDragEnter = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === index) return;
    const newItems = [...shippingTypes];
    const item = newItems[draggedItem];
    newItems.splice(draggedItem, 1);
    newItems.splice(index, 0, item);
    setDraggedItem(index);
    setShippingTypes(newItems);
  };
  const handleDragEnd = async () => {
    setDraggedItem(null);
    const orderedIds = shippingTypes.map(t => t.id);
    const toastId = toast.loading('Salvando ordem...');
    try {
      const res = await reorderShippingTypes(orderedIds, subdomain);
      if (res.success) toast.success('Ordem salva!', { id: toastId });
      else toast.error('Erro ao salvar.', { id: toastId });
    } catch {
      toast.error('Erro de conexão.', { id: toastId });
    }
  };

  // Actions
  const handleUpdateName = async (e: React.FormEvent, id: string) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get('name') as string;
    if (!name) return;
    
    setIsProcessing(id);
    const res = await updateShippingTypeName(id, name, subdomain);
    setIsProcessing(null);
    
    if (res.success) toast.success('Nome atualizado!');
    else toast.error('Erro ao atualizar nome.');
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    setIsProcessing(id);
    const res = await updateShippingTypeStatus(id, !currentStatus, subdomain);
    if (res.success) {
      toast.success(currentStatus ? 'Desativado!' : 'Ativado!');
      setShippingTypes(prev => prev.map(t => t.id === id ? { ...t, is_active: !currentStatus } : t));
    } else toast.error('Erro ao mudar status.');
    setIsProcessing(null);
  };

  const handleDuplicate = async (id: string) => {
    setIsProcessing(id);
    const toastId = toast.loading('Duplicando...');
    const res = await duplicateShippingType(id, subdomain);
    setIsProcessing(null);
    if (res.success) {
      toast.success('Duplicado com sucesso!', { id: toastId });
      window.location.reload(); // Quick way to get the newly inserted row
    } else {
      toast.error('Erro ao duplicar.', { id: toastId });
    }
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      const res = await deleteShippingType(deletingId, subdomain);
      if (res.success) {
        toast.success('Tipo de frete excluído!');
        setShippingTypes(prev => prev.filter(t => t.id !== deletingId));
        setDeletingId(null);
      } else toast.error(res.error || 'Erro ao excluir.');
    } catch {
      toast.error('Erro ao excluir.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (shippingTypes.length === 0) {
    return (
      <div className="bg-zinc-900 rounded-2xl shadow-xl border border-zinc-800 p-12 text-center">
        <div className="inline-flex p-6 bg-zinc-800 border border-zinc-700 rounded-full mb-6">
          <Truck className="w-16 h-16 text-amber-500" />
        </div>
        <h3 className="text-2xl font-bold text-zinc-100 mb-3">Nenhum tipo de frete cadastrado</h3>
        <p className="text-zinc-400 mb-8 max-w-md mx-auto">
          Crie seu primeiro tipo de frete e o sistema gera as faixas automaticamente para você revisar os preços depois.
        </p>

        <div className="mb-8 grid grid-cols-1 gap-4 text-left md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-800/50 p-5">
            <h4 className="text-sm font-semibold text-zinc-100">1. Crie o tipo</h4>
            <p className="mt-2 text-sm text-zinc-500">Defina um nome claro como Standard, Express ou Marítimo.</p>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-800/50 p-5">
            <h4 className="text-sm font-semibold text-zinc-100">2. Gere as faixas</h4>
            <p className="mt-2 text-sm text-zinc-500">Informe o peso inicial e final para criar todas as linhas de uma vez.</p>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-800/50 p-5">
            <h4 className="text-sm font-semibold text-zinc-100">3. Revise os preços</h4>
            <p className="mt-2 text-sm text-zinc-500">Na etapa seguinte, preencha custo, venda e taxa para cada peso.</p>
          </div>
        </div>

        <Link 
          href={`/admin/shipping/create`} 
          className="inline-flex items-center gap-2 px-8 py-4 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-700 transition shadow-lg"
        >
          <Truck className="w-5 h-5" />
          Criar primeiro tipo de frete
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* STATS HEADER */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-zinc-900 rounded-xl p-4 shadow-sm border border-zinc-800">
          <p className="text-2xl font-bold text-amber-500">{shippingTypes.length}</p>
          <p className="text-xs text-zinc-400 mt-0.5">Tipos de frete</p>
        </div>
        <div className="bg-zinc-900 rounded-xl p-4 shadow-sm border border-zinc-800">
          <p className="text-2xl font-bold text-green-500">{activeCount}</p>
          <p className="text-xs text-zinc-400 mt-0.5">Ativos</p>
        </div>
        <div className="bg-zinc-900 rounded-xl p-4 shadow-sm border border-zinc-800">
          <p className="text-2xl font-bold text-blue-500">{ratesCount}</p>
          <p className="text-xs text-zinc-400 mt-0.5">Faixas de peso</p>
        </div>
      </div>

      <p className="mb-3 text-xs text-zinc-500 flex items-center gap-1">
        <GripVertical className="w-4 h-4 opacity-60" />
        Arraste os cards para reordenar
      </p>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" onDragOver={e => e.preventDefault()}>
        {shippingTypes.map((type, index) => {
          const isActive = type.is_active !== false;
          const loading = isProcessing === type.id;
          
          return (
            <div 
              key={type.id} 
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragEnter={(e) => handleDragEnter(e, index)}
              onDragEnd={handleDragEnd}
              className={`bg-zinc-900 rounded-2xl shadow-xl border border-zinc-800 overflow-hidden transition-all ${draggedItem === index ? 'opacity-40 border-dashed border-amber-500 border-2' : ''}`}
            >
              {/* Header (drag handle) */}
              <div className="bg-zinc-800 px-6 py-4 cursor-grab active:cursor-grabbing border-b border-zinc-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-zinc-500 hover:text-zinc-300 transition flex-shrink-0" title="Arraste para reordenar">
                      <GripVertical className="w-5 h-5" />
                    </div>
                    <div className="p-2 bg-zinc-700/50 rounded-lg border border-zinc-600/50">
                      <Truck className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-zinc-100">{type.name}</h3>
                      <p className="text-sm text-zinc-400 mt-0.5">Ordem: {index}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-start gap-1 flex-1 px-6">
                    {type.requires_box_assembly && (
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 bg-zinc-700/50 text-zinc-300 rounded border border-zinc-600/50 flex items-center gap-1" title="Requer Montagem de Caixa Antes do Pagamento">
                        ⚙️ Montagem
                      </span>
                    )}
                    {type.skip_customs_declaration && (
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 bg-zinc-700/50 text-zinc-300 rounded border border-zinc-600/50 flex items-center gap-1" title="Não Exige Declaração Aduaneira">
                        🚫 Sem Aduana
                      </span>
                    )}
                    {type.charge_volumetric && (
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 bg-zinc-700/50 text-zinc-300 rounded border border-zinc-600/50 flex items-center gap-1" title="Cobrar por peso cubado (volumétrico)">
                        📦 Volumétrico
                      </span>
                    )}
                  </div>

                  {isActive ? (
                    <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full shrink-0">
                      <span className="text-xs font-bold text-green-500">ATIVO</span>
                    </div>
                  ) : (
                    <div className="px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full shrink-0">
                      <span className="text-xs font-bold text-red-500">INATIVO</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats & Actions */}
              <div className="p-6">
                <div className="flex items-center justify-center gap-8 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-500">{type.shipping_rates?.length || 0}</div>
                    <div className="text-xs text-zinc-500 mt-1">Faixas de peso</div>
                  </div>
                  <div className="w-px h-12 bg-zinc-800"></div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-zinc-300">kg</div>
                    <div className="text-xs text-zinc-500 mt-1">Unidade</div>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Name Edit Form */}
                  <form onSubmit={(e) => handleUpdateName(e, type.id)} className="space-y-2">
                    <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                      Nome do frete
                    </label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        name="name" 
                        defaultValue={type.name}
                        disabled={loading}
                        className="flex-1 px-3 py-2 text-sm border border-zinc-700 rounded-lg bg-zinc-800/50 text-zinc-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none disabled:opacity-50" 
                        required 
                      />
                      <button 
                        type="submit" 
                        disabled={loading}
                        className="px-4 py-2 bg-amber-600 text-white text-sm font-semibold rounded-lg hover:bg-amber-700 transition disabled:opacity-50 flex items-center justify-center min-w-[70px]"
                      >
                        Salvar
                      </button>
                    </div>
                  </form>

                  {/* Editar preços */}
                  <Link 
                    href={`/admin/shipping/${type.id}/rates`} 
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-zinc-800 text-amber-500 border border-zinc-700 font-bold rounded-lg hover:bg-zinc-700 hover:border-amber-500/50 transition shadow-md"
                  >
                    <Settings className="w-5 h-5" />
                    Editar preços
                  </Link>
                  
                  {/* Row actions */}
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleToggleStatus(type.id, isActive)}
                      disabled={loading}
                      className={`flex-1 px-4 py-2 text-white text-sm font-semibold rounded-lg transition flex items-center justify-center gap-1 ${
                        isActive 
                          ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300' 
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {isActive ? 'Desativar' : 'Ativar'}
                    </button>

                    <button 
                      onClick={() => handleDuplicate(type.id)}
                      disabled={loading}
                      className="flex-1 px-4 py-2 bg-zinc-800 text-blue-400 text-sm font-semibold rounded-lg hover:bg-zinc-700 hover:text-blue-300 transition flex items-center justify-center gap-1"
                    >
                      <Copy className="w-4 h-4" />
                      Duplicar
                    </button>

                    <button 
                      onClick={() => setDeletingId(type.id)}
                      disabled={loading}
                      className="flex-1 px-4 py-2 bg-red-500/10 text-red-500 text-sm font-semibold rounded-lg hover:bg-red-500/20 transition flex items-center justify-center"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isDeleting && setDeletingId(null)}></div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md relative z-10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping"></div>
                <div className="relative flex items-center justify-center w-20 h-20 bg-red-500/10 rounded-full border border-red-500/20">
                  <AlertTriangle className="w-10 h-10 text-red-500" />
                </div>
              </div>
            </div>

            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-zinc-100 mb-2">Confirmar exclusão</h3>
              <p className="text-zinc-400">Você está prestes a excluir este tipo de frete.</p>
              
              <div className="mt-4 p-4 bg-red-500/5 rounded-xl border border-red-500/10">
                <p className="text-xl font-bold text-red-400">
                  {shippingTypes.find(t => t.id === deletingId)?.name}
                </p>
              </div>
              
              <p className="text-sm text-zinc-500 mt-4 italic">
                Atenção: Todas as faixas de peso vinculadas a este tipo de frete também serão apagadas. Esta ação não pode ser desfeita.
              </p>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setDeletingId(null)}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 bg-zinc-800 text-zinc-300 font-semibold rounded-xl hover:bg-zinc-700 transition"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition flex items-center justify-center gap-2"
              >
                {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sim, Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
