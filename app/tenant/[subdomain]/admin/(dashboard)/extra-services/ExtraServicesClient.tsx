'use client';

import { useState, useRef } from 'react';
import { usePermissions } from '@/app/providers/PermissionsProvider';
import { useTenantSettings } from '../../../app/(customer)/components/TenantSettingsContext';
import Link from 'next/link';
import { Settings2, Plus, Info, ChevronDown, Package, Scissors, Zap, AlertTriangle, GripVertical, Trash2, Edit } from 'lucide-react';
import { reorderExtraServices, deleteExtraService } from './_actions/extraServices';
import toast from 'react-hot-toast';

export function ExtraServicesClient({ subdomain, extraServices: initialServices }: { subdomain: string, extraServices: any[] }) {
  const { hasPermission } = usePermissions();
  const { currencySymbol } = useTenantSettings();
  if (!hasPermission('settings.view')) return <div className="p-8 text-center text-zinc-500">Acesso restrito.</div>;
  const [expanded, setExpanded] = useState(false);
  const [services, setServices] = useState(initialServices);

  // Drag and Drop state
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const dragItemRef = useRef<number | null>(null);
  const dragOverItemRef = useRef<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedItem(index);
    dragItemRef.current = index;
  };

  const handleDragEnter = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragItemRef.current !== null && dragItemRef.current !== index) {
      dragOverItemRef.current = index;
      const newItems = [...services];
      const draggedItemContent = newItems[dragItemRef.current];
      newItems.splice(dragItemRef.current, 1);
      newItems.splice(index, 0, draggedItemContent);
      dragItemRef.current = index;
      setServices(newItems);
    }
  };

  const handleDragEnd = async () => {
    setDraggedItem(null);
    dragItemRef.current = null;
    dragOverItemRef.current = null;
    
    // Save order
    const orderedIds = services.map(s => s.id);
    await reorderExtraServices(orderedIds, subdomain);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este serviço?')) {
      const loading = toast.loading('Excluindo...');
      const res = await deleteExtraService(id, subdomain);
      if (res.success) {
        setServices(services.filter(s => s.id !== id));
        toast.success('Serviço excluído', { id: loading });
      } else {
        toast.error(res.error || 'Erro ao excluir', { id: loading });
      }
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Help Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
        <button 
          onClick={() => setExpanded(!expanded)} 
          className="w-full p-4 sm:p-6 flex flex-col items-start gap-4 text-left sm:flex-row sm:items-center hover:bg-zinc-800/50 transition-colors"
        >
          <div className="flex-shrink-0">
            <div className="p-3 bg-amber-500/10 rounded-xl shadow-lg border border-amber-500/20">
              <Settings2 className="w-6 h-6 text-amber-500" />
            </div>
          </div>
          <div className="flex-1 min-w-0 text-left">
            <h3 className="text-lg font-bold text-zinc-100">O que são Serviços Extras?</h3>
            <p className="text-sm text-zinc-400 mt-1">Clique para ver detalhes e exemplos</p>
          </div>
          <div className={`flex-shrink-0 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>
            <ChevronDown className="w-5 h-5 text-zinc-500" />
          </div>
        </button>
        
        {expanded && (
          <div className="px-4 sm:px-6 pb-4 sm:pb-6 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="pt-4 border-t border-zinc-800">
              <p className="text-sm text-zinc-300 mb-6 leading-relaxed">
                Serviços extras são opções adicionais que seus clientes podem contratar durante a solicitação de envio. Eles permitem personalizar o atendimento, aumentar a segurança dos produtos e gerar receita adicional para seu negócio.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Como Funcionam */}
                <div className="bg-zinc-950 rounded-xl p-5 border border-zinc-800">
                  <h4 className="font-bold text-zinc-100 mb-3 flex items-center gap-2">
                    <Info className="w-5 h-5 text-amber-500" />
                    Como Funcionam
                  </h4>
                  <ul className="text-sm text-zinc-400 space-y-3">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 font-bold">•</span>
                      <span><strong>Gratuitos ou Pagos:</strong> Você define se o serviço terá custo adicional</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 font-bold">•</span>
                      <span><strong>Peso Extra:</strong> Pode adicionar peso que afeta o cálculo do frete</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 font-bold">•</span>
                      <span><strong>Ativação:</strong> Ative/desative serviços sem removê-los</span>
                    </li>
                  </ul>
                </div>

                {/* Exemplos Práticos */}
                <div className="bg-zinc-950 rounded-xl p-5 border border-zinc-800">
                  <h4 className="font-bold text-zinc-100 mb-3 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-500" />
                    Exemplos de Serviços
                  </h4>
                  <div className="space-y-3">
                    <div className="text-sm bg-zinc-900 px-3 py-2.5 rounded-lg border border-zinc-800">
                      <div className="font-semibold text-zinc-100 flex items-center gap-2">
                        <Package className="w-4 h-4 text-zinc-500" /> Caixa com Parede Dupla
                      </div>
                      <div className="text-xs text-zinc-500 mt-1">Proteção extra • $ 5.00 • +0.300 kg</div>
                    </div>
                    <div className="text-sm bg-zinc-900 px-3 py-2.5 rounded-lg border border-zinc-800">
                      <div className="font-semibold text-zinc-100 flex items-center gap-2">
                        <Scissors className="w-4 h-4 text-zinc-500" /> Remoção de Etiquetas
                      </div>
                      <div className="text-xs text-zinc-500 mt-1">Serviço gratuito • $ 0.00 • Sem peso extra</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Impacto no Frete */}
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-amber-500 mb-1">Impacto no Cálculo do Frete</p>
                    <p className="text-sm text-amber-500/80 leading-relaxed">
                      Quando um cliente seleciona serviços com peso extra, esse peso é somado ao peso dos produtos. Se a soma ultrapassar a faixa de peso atual, o sistema automaticamente calculará o frete na próxima faixa disponível.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* List or Empty State */}
      {services.length === 0 ? (
        <div className="bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 overflow-hidden text-center py-16 px-6">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-zinc-800 mb-6 shadow-lg border border-zinc-700">
            <Settings2 className="h-10 w-10 text-zinc-500" />
          </div>
          
          <h3 className="text-xl font-bold text-zinc-100 mb-3">Nenhum serviço extra cadastrado</h3>
          <p className="text-sm text-zinc-400 max-w-xl mx-auto mb-8 leading-relaxed">
            Crie serviços extras para oferecer mais opções aos seus clientes durante a solicitação de envio. Aumente a satisfação e gere receita adicional!
          </p>

          {hasPermission("settings.edit") && <Link 
            href={`/admin/extra-services/create`} 
            className="inline-flex items-center gap-2 px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Criar Primeiro Serviço
          </Link>}
        </div>
      ) : (
        <div className="space-y-4" onDragOver={(e) => e.preventDefault()}>
          {services.map((service, index) => (
            <div 
              key={service.id} 
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragEnter={(e) => handleDragEnter(e, index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
              className={`bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center justify-between group cursor-move ${draggedItem === index ? 'opacity-50 border-2 border-dashed border-amber-500' : ''}`}
            >
              <div className="flex items-center gap-4">
                <div className="text-zinc-600 hover:text-zinc-400">
                  <GripVertical className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-zinc-100">{service.name}</h3>
                    {service.is_active ? (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 text-xs font-bold border border-emerald-500/20">Visível ao Cliente</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-400 text-xs font-bold border border-zinc-700">Inativo (Oculto)</span>
                    )}
                  </div>
                  <div className="text-sm text-zinc-400 mt-1 flex items-center gap-3">
                    <span>{currencySymbol} {Number(service.price).toFixed(2)}</span>
                    {Number(service.extra_weight) > 0 && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                        <span className="text-amber-500/80">+{Number(service.extra_weight).toFixed(3)} kg</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {hasPermission("settings.edit") && <Link 
                  href={`/admin/extra-services/${service.id}/edit`}
                  className="p-2 text-zinc-400 hover:text-amber-500 hover:bg-zinc-800 rounded-lg transition"
                >
                  <Edit className="w-4 h-4" />
                </Link>}
                <button
                  onClick={() => handleDelete(service.id)}
                  className="p-2 text-zinc-400 hover:text-red-500 hover:bg-zinc-800 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
