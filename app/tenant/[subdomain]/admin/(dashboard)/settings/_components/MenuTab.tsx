import { Menu as MenuIcon, Eye, EyeOff, GripVertical } from "lucide-react";
import { useState } from "react";

export function MenuTab({ data, onChange }: { data?: any, onChange?: (data: any) => void }) {
    const menus = data?.menus ?? [
    { id: 'dashboard', label: 'Início', visible: true },
    { id: 'my_suite', label: 'Meu Dock', visible: true },
    { id: 'shipments', label: 'Meus Envios', visible: true },
    { id: 'service_orders', label: 'Serviços', visible: true },
    { id: 'boxes', label: 'Caixas Recebidas', visible: true },
    { id: 'pre_alerts', label: 'Pré-alertas', visible: true },
    { id: 'wallet', label: 'Créditos', visible: true },
    { id: 'vip', label: 'VIP Membership', visible: true },
    { id: 'purchase_groups', label: 'Grupos de Compras', visible: true },
    { id: 'online_purchases', label: 'Compra Assistida', visible: true },
    { id: 'store', label: 'Loja Online', visible: true },
    { id: 'addresses', label: 'Meus Endereços', visible: true },
    { id: 'shipping_simulator', label: 'Simulador de Frete', visible: true },
    { id: 'import_calculator', label: 'Calculadora de Importação', visible: true },
    { id: 'support', label: 'Central de Ajuda', visible: true },
    { id: 'profile', label: 'Meu Perfil', visible: true },
  ];

  const setMenus = (val: any) => onChange?.({ ...data, menus: val });

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const toggleVisibility = (index: number) => {
    const newMenus = [...menus];
    newMenus[index].visible = !newMenus[index].visible;
    setMenus(newMenus);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    // Força um pequeno delay para que o estilo do elemento que está sendo arrastado não quebre o layout
    setTimeout(() => {
      // (Opcional) Pode ser usado para dar opacity ao elemento original
    }, 0);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    if (draggedIndex === null) return;
    
    if (draggedIndex !== index) {
      const newMenus = [...menus];
      const draggedItem = newMenus[draggedIndex];
      newMenus.splice(draggedIndex, 1);
      newMenus.splice(index, 0, draggedItem);
      setMenus(newMenus);
    }
    
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 p-4 sm:p-8 space-y-10">
      
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
          <MenuIcon className="w-5 h-5 text-amber-500" />
          <span>Visibilidade do Menu Lateral</span>
        </h3>
        
        <p className="text-sm text-zinc-400">
          Oculte ou exiba itens no menu lateral do painel dos seus clientes. Arraste e solte usando o ícone para reordenar.
        </p>

        <div className="space-y-2 max-w-2xl" onDragOver={(e) => e.preventDefault()}>
          {menus.map((menu: any, index: number) => {
            const isDragging = draggedIndex === index;
            const isDragOver = dragOverIndex === index && draggedIndex !== index;

            return (
              <div 
                key={menu.id} 
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={`flex items-center gap-4 p-3 rounded-xl border transition-all 
                  ${isDragging ? 'opacity-50 border-amber-500 scale-95' : 'scale-100'}
                  ${isDragOver ? 'border-t-4 border-t-amber-500 mt-4' : ''}
                  ${menu.visible ? 'bg-zinc-800/50 border-zinc-700 hover:border-amber-500/50' : 'bg-zinc-950/50 border-zinc-800 opacity-60 hover:border-zinc-700'}
                  cursor-grab active:cursor-grabbing
                `}
              >
                <div className="flex items-center justify-center p-1 text-zinc-500 hover:text-amber-500 transition-colors pointer-events-none">
                  <GripVertical className="w-5 h-5" />
                </div>
                
                <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold pointer-events-none">
                  {index + 1}
                </div>

                <div className="flex-1 font-medium text-sm text-zinc-200 pointer-events-none">
                  {menu.label}
                </div>

                <button
                  type="button"
                  onClick={() => toggleVisibility(index)}
                  className={`p-2 rounded-lg transition-colors ${menu.visible ? 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700' : 'text-zinc-500 hover:text-red-400 hover:bg-zinc-800'}`}
                >
                  {menu.visible ? <Eye className="w-5 h-5 pointer-events-none" /> : <EyeOff className="w-5 h-5 pointer-events-none" />}
                </button>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
