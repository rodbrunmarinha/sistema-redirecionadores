"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ChevronRight, Box, Upload, Download, FileText, Plus, X, Image as ImageIcon, 
  Search, Edit, Copy, EyeOff, Trash2, Tag
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { deleteStoreProduct } from './_actions/products';
import { useRouter } from 'next/navigation';
export default function ProductListClient({ 
  tenantId, 
  subdomain, 
  initialProducts, 
  categories 
}: { 
  tenantId: string, 
  subdomain: string, 
  initialProducts: any[], 
  categories: any[] 
}) {
  const [products, setProducts] = useState(initialProducts);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importTab, setImportTab] = useState<'upload' | 'guia'>('upload');
  const [lightbox, setLightbox] = useState<{ url: string, alt: string } | null>(null);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (productId: string) => {
    if (!window.confirm("Tem certeza que deseja excluir este produto?")) return;
    
    setIsDeleting(productId);
    const res = await deleteStoreProduct(tenantId, productId);
    setIsDeleting(null);
    
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Produto excluído com sucesso!");
      setProducts(products.filter(p => p.id !== productId));
      router.refresh();
    }
  };
  const filteredProducts = products.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.sku?.toLowerCase().includes(search.toLowerCase())) return false;
    if (categoryId && p.category_id !== categoryId) return false;
    if (statusFilter === 'active' && !p.is_active) return false;
    if (statusFilter === 'inactive' && p.is_active) return false;
    // stock logic can be added here
    return true;
  });

  return (
    <div className="min-h-screen bg-zinc-950 -m-8">
      {/* Header */}
      <div className="bg-zinc-900 border-b border-zinc-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-sm mb-4" aria-label="Breadcrumb">
            <Link href={`/admin/dashboard`} className="text-zinc-500 hover:text-zinc-300 transition-colors">Loja Virtual</Link>
            <ChevronRight className="w-4 h-4 text-zinc-600" />
            <span className="text-zinc-100 font-medium">Produtos</span>
          </nav>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center flex-shrink-0 border border-zinc-700">
                <Box className="w-6 h-6 text-amber-500" />
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-white truncate">Produtos da Loja</h1>
                <p className="text-zinc-400 text-sm mt-0.5">Gerencie o catálogo de produtos da sua loja</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button onClick={() => setShowImportModal(true)} className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 rounded-xl text-sm font-semibold transition active:scale-95">
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">Importar CSV</span>
                <span className="sm:hidden">Importar</span>
              </button>
              
              <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 rounded-xl text-sm font-semibold transition active:scale-95">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Exportar CSV</span>
                <span className="sm:hidden">Exportar</span>
              </button>
              
              <Link href={`/admin/store/products/create`} className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition shadow-lg active:scale-95 text-sm">
                <Plus className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">Novo Produto</span>
                <span className="sm:hidden">Novo</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
        {/* Filters */}
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-4 shadow-sm">
          <div className="space-y-3 sm:space-y-0 sm:flex sm:flex-wrap sm:gap-3">
            <div className="flex-1 min-w-full sm:min-w-[200px] relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input 
                type="text" 
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar produtos..." 
                className="w-full pl-10 pr-4 py-2.5 text-base border-2 border-zinc-700 bg-zinc-800 text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none" 
              />
            </div>
            <select 
              value={categoryId}
              onChange={e => setCategoryId(e.target.value)}
              className="w-full sm:w-auto px-4 py-2.5 text-base border-2 border-zinc-700 bg-zinc-800 text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
            >
              <option value="">Todas categorias</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <select 
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto px-4 py-2.5 text-base border-2 border-zinc-700 bg-zinc-800 text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
            >
              <option value="">Todos status</option>
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
            </select>
          </div>
        </div>

        {/* Cadastro Rapido Banner */}
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 sm:p-5 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-amber-500">Cadastro rápido</h3>
              <p className="text-sm text-zinc-400 mt-1">Comece um novo cadastro em sequência ou reaproveite um produto já existente como modelo.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link href={`/admin/store/products/create`} className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-800 text-amber-500 rounded-xl font-semibold hover:bg-zinc-700 transition shadow-sm border border-zinc-700">
                <Plus className="w-4 h-4" />
                Novo em sequência
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-4">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-zinc-900 rounded-2xl shadow-md border border-zinc-800 overflow-hidden">
              <div className="relative aspect-square bg-zinc-800/50 flex items-center justify-center">
                {product.main_image ? (
                  <button type="button" className="group/img w-full h-full block cursor-zoom-in" onClick={() => setLightbox({url: product.main_image, alt: product.name})}>
                    <img src={product.main_image} alt={product.name} className="w-full h-full object-contain" />
                  </button>
                ) : (
                  <ImageIcon className="w-12 h-12 text-zinc-600" />
                )}
                <div className="absolute bottom-2 left-2">
                  <span className="px-2 py-1 text-xs font-semibold bg-amber-500 text-zinc-950 rounded-lg shadow-lg">{product.stock_quantity} un.</span>
                </div>
              </div>
              
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-white line-clamp-2 mb-1">{product.name}</h3>
                  <p className="text-xs text-zinc-500">SKU: {product.sku || 'N/A'}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <p className="text-lg font-bold text-amber-500">¥{Number(product.price).toFixed(2)}</p>
                </div>
                
                <div className="flex gap-2 pt-2 border-t border-zinc-800">
                  <Link href={`/admin/store/products/${product.id}/edit`} className="flex-1 px-3 py-2 text-center text-sm font-medium text-amber-500 bg-amber-500/10 hover:bg-amber-500/20 rounded-lg transition active:scale-95">
                    Editar
                  </Link>
                  <button className="flex-1 px-3 py-2 text-sm font-medium text-purple-400 bg-purple-500/10 hover:bg-purple-500/20 rounded-lg transition active:scale-95">
                    Duplicar
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredProducts.length === 0 && (
            <div className="col-span-full py-12 text-center bg-zinc-900 rounded-2xl border border-zinc-800">
              <Box className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
              <p className="text-zinc-400 font-medium">Nenhum produto encontrado.</p>
            </div>
          )}
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-800">
              <thead className="bg-zinc-900/50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-left">Produto</th>
                  <th scope="col" className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-left">Categoria</th>
                  <th scope="col" className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-right">Preço</th>
                  <th scope="col" className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-center">Estoque</th>
                  <th scope="col" className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-center">Status</th>
                  <th scope="col" className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {filteredProducts.map(product => (
                  <tr key={product.id} className="hover:bg-zinc-800/50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {product.main_image ? (
                            <img src={product.main_image} alt={product.name} className="w-full h-full object-contain cursor-zoom-in" onClick={() => setLightbox({url: product.main_image, alt: product.name})} />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-zinc-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-white">{product.name}</p>
                          <p className="text-sm text-zinc-500">SKU: {product.sku || 'N/A'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-300">
                      {product.store_categories?.name || <span className="text-zinc-600">-</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="font-bold text-white">¥{Number(product.price).toFixed(2)}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-800 text-amber-500 border border-zinc-700">
                        {product.stock_quantity} un.
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {product.is_active ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">Ativo</span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">Inativo</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/admin/store/products/${product.id}/edit`} className="p-2 text-zinc-400 hover:text-amber-500 hover:bg-zinc-800 rounded-lg transition" title="Editar">
                          <Edit className="w-5 h-5" />
                        </Link>
                        <button className="p-2 text-zinc-400 hover:text-purple-400 hover:bg-zinc-800 rounded-lg transition" title="Duplicar">
                          <Copy className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800 rounded-lg transition" title="Desativar">
                          <EyeOff className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDelete(product.id)} disabled={isDeleting === product.id} className="p-2 text-zinc-400 hover:text-red-500 hover:bg-zinc-800 rounded-lg transition disabled:opacity-50" title="Excluir">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <Box className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                      <p className="text-zinc-400 font-medium">Nenhum produto encontrado.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* CSV Import Modal (simplified structure for brevity, styled nicely) */}
      {showImportModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-zinc-800">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 flex-shrink-0">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-amber-500" />
                Importar Produtos via CSV
              </h3>
              <button onClick={() => setShowImportModal(false)} className="p-1 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex border-b border-zinc-800 flex-shrink-0 px-6">
              <button onClick={() => setImportTab('upload')} className={`px-4 py-3 text-sm font-semibold border-b-2 transition ${importTab === 'upload' ? 'border-amber-500 text-amber-500' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}>
                📤 Fazer Upload
              </button>
              <button onClick={() => setImportTab('guia')} className={`px-4 py-3 text-sm font-semibold border-b-2 transition ${importTab === 'guia' ? 'border-amber-500 text-amber-500' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}>
                📖 Guia de Importação
              </button>
            </div>
            
            <div className="overflow-y-auto flex-1 p-6">
              {importTab === 'upload' ? (
                <div className="space-y-6">
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-sm text-amber-200/80">
                    <p className="font-bold text-amber-500 mb-2">📋 Passos rápidos:</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Baixe o modelo CSV e preencha seus produtos</li>
                      <li>Coloque as fotos numa pasta chamada `imagens`</li>
                      <li>Compacte tudo em .zip ou envie só o .csv</li>
                      <li>Faça upload e confirme o preview</li>
                    </ol>
                  </div>
                  
                  <div className="relative flex flex-col items-center justify-center border-2 border-dashed border-zinc-700 rounded-xl p-8 cursor-pointer hover:border-amber-500 transition bg-zinc-800/50">
                    <Upload className="w-10 h-10 text-zinc-500 mb-2" />
                    <p className="text-sm text-zinc-400">
                      Clique para selecionar <span className="font-semibold text-amber-500">.csv</span> ou <span className="font-semibold text-amber-500">.zip</span>
                    </p>
                  </div>
                  
                  <div className="flex gap-3">
                    <button onClick={() => setShowImportModal(false)} className="flex-1 px-4 py-3 text-sm font-semibold text-zinc-300 border border-zinc-700 rounded-xl hover:bg-zinc-800 transition">Cancelar</button>
                    <button className="flex-1 px-4 py-3 text-sm font-bold text-zinc-950 bg-amber-500 rounded-xl hover:bg-amber-600 transition shadow-lg">Fazer Upload</button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 text-zinc-300 text-sm">
                  <h4 className="font-bold text-white text-base">Guia de Importação Simplificado</h4>
                  <p>O recurso de importação aceita arquivos separados por ponto-e-vírgula (;) em codificação UTF-8.</p>
                  {/* Detailed guide content would go here, simplified for now */}
                  <div className="p-4 bg-zinc-800 rounded-xl border border-zinc-700">
                    <p className="font-semibold text-amber-500">Colunas obrigatórias:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1 text-zinc-400">
                      <li>nome</li>
                      <li>preco</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 p-2 text-white/50 hover:text-white bg-white/10 rounded-full transition" onClick={() => setLightbox(null)}>
            <X className="w-6 h-6" />
          </button>
          <img src={lightbox.url} alt={lightbox.alt} className="max-w-full max-h-[90vh] rounded-xl shadow-2xl object-contain" onClick={e => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}
