// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import QRCode from "react-qr-code";
import { usePermissions } from "@/app/providers/PermissionsProvider";
import { deleteBoxByAdmin } from "@/app/actions/deleteBoxByAdmin";
import { deleteProductByAdmin } from "@/app/actions/deleteProductByAdmin";
import { transferBox } from "@/app/actions/transferBox";
import { createClient } from "@/utils/supabase/client";
import { MapPin, History } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Package, Scale, Store, Calendar, Info, Image as ImageIcon, 
  Truck, FileText, User, Plus, Printer, Edit, Trash2, 
  AlertTriangle, ChevronLeft, X, ArrowRightLeft, Search
} from "lucide-react";

export default function BoxDetailsClient({ box, initialProducts, initialMovements = [] }: { box: any; initialProducts: any[]; initialMovements?: any[] }) {
  const router = useRouter();
  const supabase = createClient();
  const { hasPermission } = usePermissions();
  const [isDeleting, setIsDeleting] = useState(false);
  const [products, setProducts] = useState(initialProducts);

  // Modals state
  const [lightbox, setLightbox] = useState({ open: false, src: '', alt: '' });
  
  // Transfer Modal
  const [transferModal, setTransferModal] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Label Modal
  const [labelModal, setLabelModal] = useState(false);
  const [labelProduct, setLabelProduct] = useState<any>(null);

  useEffect(() => {
    if (transferModal && customers.length === 0) {
      const fetchCustomers = async () => {
        const { data } = await supabase
          .from('profiles')
          .select('id, full_name, suite_number')
          .eq('role', 'CUSTOMER')
          .order('full_name');
        if (data) setCustomers(data);
      };
      fetchCustomers();
    }
  }, [transferModal]);

  const totalProducts = products.reduce((acc, curr) => acc + (curr.quantity || 1), 0);
  const totalWeight = products.reduce((acc, curr) => acc + (curr.total_weight || 0), 0);

  const handleDeleteBox = async () => {
    if (!confirm("Tem certeza que deseja excluir esta caixa e TODOS os produtos associados?")) return;
    setIsDeleting(true);
    const res = await deleteBoxByAdmin(box.id);
    if (res.error) {
      alert(res.error);
      setIsDeleting(false);
    } else {
      router.push("/admin/boxes");
      router.refresh();
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;
    const res = await deleteProductByAdmin(productId, box.id);
    if (res.error) {
      alert(res.error);
    } else {
      setProducts(products.filter((p: any) => p.id !== productId));
      router.refresh();
    }
  };

  const handleTransfer = async () => {
    if (!selectedCustomer) return;
    setIsTransferring(true);
    const res = await transferBox(box.id, selectedCustomer.id);
    setIsTransferring(false);
    if (res.error) {
      alert(res.error);
    } else {
      setTransferModal(false);
      // Atualizar info local do cliente na box se quiser, ou apenas router.refresh()
      router.refresh(); 
      setTimeout(() => window.location.reload(), 500); // Força reload pra atualizar server components props
    }
  };

  const boxPhotoUrl = box.photos && box.photos.length > 0 
    ? (box.photos[0].startsWith("http") ? box.photos[0] : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/boxes/${box.photos[0]}`) 
    : null;

  const filteredCustomers = customers.filter(c => 
    c.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    String(c.suite_number).includes(searchQuery)
  ).slice(0, 50);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div>
          <Link 
            href="/admin/boxes"
            className="inline-flex items-center text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Voltar para Lista
          </Link>
          <div className="flex items-center gap-3 mt-2">
            <div className="p-2 bg-white/10 rounded-xl">
              <Package className="w-6 h-6 text-orange-400" />
            </div>
            <h1 className="text-2xl font-bold text-white font-mono uppercase">#{box.id.substring(0,6)}</h1>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {hasPermission('packages.edit') && (
            <button 
              onClick={() => setTransferModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-xl transition font-semibold text-sm"
            >
              <ArrowRightLeft className="w-4 h-4" />
              Transferir Dock
            </button>
          )}
          {hasPermission('packages.edit') && (
            <Link 
              href={`/admin/boxes/${box.id}/edit`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-xl transition font-semibold text-sm"
            >
              <Edit className="w-4 h-4" />
              Editar Caixa
            </Link>
          )}
          {hasPermission('packages.create') && (
            <Link 
              href={`/admin/products/create?box_id=${box.id}`} 
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl transition shadow-lg font-bold text-sm"
            >
              <Plus className="w-4 h-4" />
              Novo Produto
            </Link>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Produtos */}
        <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-800 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Total Produtos</p>
              <p className="text-4xl font-bold mt-2 text-white">{products.length}</p>
              <p className="text-orange-400 font-bold text-xs mt-1">{totalProducts} unidades</p>
            </div>
            <div className="bg-orange-500/10 rounded-xl p-3">
              <Package className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Peso Total */}
        <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-800 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Peso Total</p>
              <p className="text-3xl font-bold mt-2 text-white">{totalWeight.toFixed(3).replace('.', ',')} kg</p>
            </div>
            <div className="bg-cyan-500/10 rounded-xl p-3">
              <Scale className="w-8 h-8 text-cyan-500" />
            </div>
          </div>
        </div>

        {/* Loja */}
        <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-800 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Loja</p>
              <p className="text-xl font-bold mt-2 text-white truncate">{box.store_name || 'Não informada'}</p>
            </div>
            <div className="bg-violet-500/10 rounded-xl p-3 flex-shrink-0 ml-2">
              <Store className="w-8 h-8 text-violet-500" />
            </div>
          </div>
        </div>

        {/* Data Recebimento */}
        <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-800 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Recebido em</p>
              <p className="text-xl font-bold mt-2 text-white">{new Date(box.created_at).toLocaleDateString('pt-BR')}</p>
              <p className="text-emerald-400 font-bold text-xs mt-1">{new Date(box.created_at).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</p>
            </div>
            <div className="bg-emerald-500/10 rounded-xl p-3">
              <Calendar className="w-8 h-8 text-emerald-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Informações Detalhadas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Foto e Detalhes */}
        <div className="lg:col-span-1">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-lg h-full">
            <div className="bg-gradient-to-r from-zinc-800 to-zinc-900 px-6 py-4 border-b border-zinc-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Info className="w-5 h-5 text-orange-500" />
                Informações
              </h3>
            </div>

            <div className="p-6 space-y-6">
              {/* Foto */}
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Foto da Caixa</label>
                {boxPhotoUrl ? (
                  <div className="relative group cursor-pointer" onClick={() => setLightbox({ open: true, src: boxPhotoUrl, alt: 'Foto da Caixa' })}>
                    <img 
                      src={boxPhotoUrl} 
                      alt="Foto da caixa" 
                      className="w-full h-48 object-cover rounded-2xl ring-2 ring-zinc-700/50 group-hover:ring-orange-500/50 transition-all" 
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-2xl transition-all">
                       <Search className="w-8 h-8 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-48 rounded-2xl bg-zinc-800/50 border-2 border-dashed border-zinc-700 flex items-center justify-center flex-col text-zinc-500">
                    <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
                    <span className="text-sm">Sem foto</span>
                  </div>
                )}
              </div>
              
              {/* Tracking */}
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Código de Rastreio</label>
                <div className="flex items-center gap-2 p-3 bg-zinc-950 rounded-xl border border-zinc-800">
                  <Truck className="w-5 h-5 text-orange-500" />
                  <p className="text-sm font-mono font-bold text-zinc-300">{box.tracking_number}</p>
                </div>
              </div>

              {/* Observações */}
              {box.notes && (
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Observações</label>
                  <div className="p-4 bg-orange-950/20 rounded-xl border border-orange-900/50">
                    <p className="text-sm text-zinc-300 leading-relaxed">{box.notes}</p>
                  </div>
                </div>
              )}
              
              {/* Cliente */}
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Cliente / Dock</label>
                <div className="flex items-center gap-3 p-3 bg-zinc-950 rounded-xl border border-zinc-800">
                  <div className="p-2 bg-zinc-800 rounded-lg">
                    <User className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{box.customer?.full_name}</p>
                    <p className="text-xs text-orange-400 font-bold">Dock {box.customer?.suite_number}</p>
                  </div>
                </div>
              </div>
            
              {/* Localização no Warehouse */}
              <div className="mt-8">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 -mx-6 px-6 py-4 flex items-center gap-2 text-white">
                  <MapPin className="w-5 h-5" />
                  <h3 className="text-sm font-bold">Localização no Warehouse</h3>
                </div>
                <div className="pt-6 space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Localização Atual</label>
                    <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800">
                      {box.warehouse_locations?.code ? (
                        <div>
                          <p className="text-xl font-bold text-purple-400">{box.warehouse_locations.code}</p>
                          {initialMovements.length > 0 && (
                            <p className="text-xs text-zinc-500 mt-1">Localizada em {format(new Date(initialMovements[0].created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}</p>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-zinc-500 font-medium">Sem localização no momento.</p>
                      )}
                    </div>
                  </div>

                  {initialMovements.length > 0 && (
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Histórico de Localização</label>
                      <div className="space-y-2">
                        {initialMovements.map((mov: any) => (
                          <div key={mov.id} className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
                            <div className="flex items-center gap-2 text-sm font-bold text-zinc-300">
                              <span className="text-zinc-500">De</span> {mov.old_location?.code || 'Sem localização'} 
                              <span className="text-zinc-600">→</span> 
                              <span className="text-zinc-500">Para</span> <span className="text-purple-400">{mov.new_location?.code || 'Sem localização'}</span>
                            </div>
                            <p className="text-xs text-zinc-500 mt-1">
                              {mov.profiles?.full_name} · {format(new Date(mov.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
</div>
          </div>
        </div>

        {/* Lista de Produtos */}
        <div className="lg:col-span-2">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-lg h-full">
            <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 px-6 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Produtos</h3>
                    <p className="text-orange-100 text-sm">{products.length} itens cadastrados</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabela de Produtos */}
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                 <Package className="w-16 h-16 text-zinc-700 mb-4" />
                 <h4 className="text-lg font-semibold text-white">Nenhum produto cadastrado</h4>
                 <p className="text-zinc-500 mt-2 text-sm">Adicione os produtos que vieram nesta caixa.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-zinc-950 border-b border-zinc-800">
                      <th className="px-6 py-4 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">Produto</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">Código</th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-zinc-500 uppercase tracking-wider">Qtd</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">Peso Un.</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">Peso Total</th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-zinc-500 uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-zinc-800/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {product.photos && product.photos.length > 0 ? (
                              <img 
                                src={(product.photos[0].startsWith("http") ? product.photos[0] : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/products/${product.photos[0]}`)}
                                alt={product.name} 
                                onClick={() => setLightbox({ open: true, src: (product.photos[0].startsWith("http") ? product.photos[0] : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/products/${product.photos[0]}`), alt: product.name })}
                                className="h-12 w-12 rounded-xl object-cover ring-2 ring-zinc-700 cursor-pointer hover:ring-orange-500 transition-all hover:scale-110" 
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-xl bg-zinc-800 flex items-center justify-center ring-2 ring-zinc-700">
                                <Package className="w-6 h-6 text-zinc-500" />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-bold text-white truncate">{product.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-zinc-500 text-sm font-mono">{product.code || '—'}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-800 text-sm font-bold text-orange-500">
                            {product.quantity}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-zinc-400">{product.unit_weight} kg</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-white">{product.total_weight} kg</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => { setLabelProduct(product); setLabelModal(true); }}
                              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-amber-400" 
                              title="Imprimir Etiqueta"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                            {hasPermission('packages.edit') && (
                              <Link href={`/admin/products/${product.id}/edit`} className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-blue-400" title="Editar">
                                <Edit className="w-4 h-4" />
                              </Link>
                            )}
                            {hasPermission('packages.delete') && (
                              <button onClick={() => handleDeleteProduct(product.id)} className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-red-400" title="Excluir">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Zona de Perigo */}
      {hasPermission('packages.delete') && (
        <div className="bg-red-950/20 border border-red-900/50 shadow-lg rounded-3xl overflow-hidden mt-8">
          <div className="p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-red-900/30 rounded-2xl">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-red-500 mb-2">Zona de Perigo</h3>
                <p className="text-red-400/80 leading-relaxed">
                  Excluir esta caixa também excluirá todos os produtos associados. Esta ação não pode ser desfeita.
                </p>
              </div>
            </div>
            <button 
              onClick={handleDeleteBox}
              disabled={isDeleting}
              className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-lg shadow-red-900/20 transition-all disabled:opacity-50"
            >
              <Trash2 className="w-6 h-6" />
              {isDeleting ? 'Excluindo...' : 'Excluir Caixa e Todos os Produtos'}
            </button>
          </div>
        </div>
      )}

      {/* MODALS */}

      {/* Transfer Modal */}
      {transferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <ArrowRightLeft className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Transferir Caixa</h3>
                </div>
              </div>
              <button onClick={() => setTransferModal(false)} className="p-2 text-white/70 hover:text-white hover:bg-white/20 rounded-xl transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="flex items-start gap-3 p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-200/80 leading-relaxed">
                  A caixa <strong>#{box.id.substring(0,6).toUpperCase()}</strong> e todos os seus <strong>{products.length} produto(s)</strong> serão transferidos para a dock do cliente selecionado.
                </p>
              </div>

              <div className="flex items-center gap-3 p-4 bg-zinc-950 border border-zinc-800 rounded-2xl">
                <User className="w-5 h-5 text-zinc-500 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Dock atual</p>
                  <p className="text-sm font-semibold text-white">
                    {box.customer?.full_name} — Dock {box.customer?.suite_number}
                  </p>
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-bold text-zinc-300 mb-2">Transferir para <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Search className="absolute left-3 top-3.5 w-5 h-5 text-zinc-500" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setDropdownOpen(true); setSelectedCustomer(null); }}
                    onFocus={() => setDropdownOpen(true)}
                    placeholder="Buscar por nome ou dock..."
                    className="w-full pl-10 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:ring-2 focus:ring-violet-500 focus:outline-none"
                  />
                </div>
                
                {dropdownOpen && filteredCustomers.length > 0 && !selectedCustomer && (
                  <div className="absolute z-10 w-full mt-2 bg-zinc-800 border border-zinc-700 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                    {filteredCustomers.map(c => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setSelectedCustomer(c);
                          setSearchQuery(`${c.full_name} — Dock ${c.suite_number}`);
                          setDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-zinc-700 flex items-center gap-3 border-b border-zinc-700/50 last:border-0"
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {c.full_name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-white truncate">{c.full_name}</p>
                          <p className="text-xs text-violet-400 font-bold">Dock {c.suite_number}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setTransferModal(false)} className="flex-1 px-5 py-3 bg-zinc-800 text-white rounded-xl hover:bg-zinc-700 font-semibold text-sm transition-colors">
                  Cancelar
                </button>
                <button 
                  onClick={handleTransfer}
                  disabled={!selectedCustomer || isTransferring}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl hover:from-violet-500 hover:to-fuchsia-500 font-bold text-sm disabled:opacity-50 transition-all"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                  {isTransferring ? 'Transferindo...' : 'Confirmar Transferência'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightbox.open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 p-4" onClick={() => setLightbox({ open: false, src: '', alt: '' })}>
          <button className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors" onClick={() => setLightbox({ open: false, src: '', alt: '' })}>
            <X className="w-8 h-8" />
          </button>
          <img src={lightbox.src} alt={lightbox.alt} className="max-w-full max-h-[90vh] object-contain rounded-lg" onClick={e => e.stopPropagation()} />
        </div>
      )}

      {/* Label Modal */}
      {labelModal && labelProduct && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xs overflow-hidden relative">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Printer className="w-5 h-5 text-amber-500" />
                Etiqueta
              </h3>
              <button onClick={() => setLabelModal(false)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Area to print */}
            <div id="product-label-print" className="p-6 text-center bg-white print:p-0 print:m-0">
              <style>{`
                @media print {
                  body * { visibility: hidden; }
                  #product-label-print, #product-label-print * { visibility: visible; }
                  #product-label-print { position: absolute; left: 0; top: 0; width: 100%; height: 100%; }
                }
              `}</style>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">DOCKDROP</p>
              <p className="text-sm font-extrabold text-gray-900 leading-tight mb-2 uppercase">{labelProduct.name}</p>
              <p className="text-xs text-gray-600 mb-1">Dock {box.customer?.suite_number}</p>
              <p className="text-xs text-gray-600 mb-4 font-mono font-bold">CAIXA: {box.id.substring(0,6).toUpperCase()}</p>
              
              <div className="flex justify-center mb-2">
                 <div className="w-24 h-24 flex items-center justify-center bg-white p-1 border-2 border-black rounded-lg">
                   <QRCode value={box.id} size={80} level="M" />
                 </div>
              </div>
              <p className="font-mono text-[10px] font-bold text-gray-800 tracking-widest mt-2">{labelProduct.id.toUpperCase()}</p>
            </div>

            <div className="flex gap-3 px-5 py-4 border-t border-gray-200 bg-gray-50">
              <button onClick={() => setLabelModal(false)} className="flex-1 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-200 rounded-xl transition-colors">
                Fechar
              </button>
              <button onClick={() => window.print()} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-xl transition-colors shadow-lg">
                <Printer className="w-4 h-4" />
                Imprimir
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
