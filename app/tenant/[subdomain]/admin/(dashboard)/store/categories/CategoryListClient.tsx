"use client";

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { 
  ChevronRight, Tags, CheckCircle2, Layers, FolderTree, Edit, Trash2, Plus, X, Info, ChevronDown, ChevronUp, Package
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { createClient } from '@/utils/supabase/client';
import { createStoreCategory, updateStoreCategory, deleteStoreCategory } from '../products/_actions/products';

export default function CategoryListClient({ 
  tenantId, 
  subdomain, 
  initialCategories = [] 
}: { 
  tenantId: string, 
  subdomain: string, 
  initialCategories?: any[] 
}) {
  const [categories, setCategories] = useState(initialCategories);
  const [isPending, startTransition] = useTransition();

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Expand states
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedCats(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Computed stats
  const totalCategories = categories.length;
  const activeCategories = categories.filter(c => c.is_active).length;
  const mainCategories = categories.filter(c => !c.parent_id).length;
  const subCategories = categories.filter(c => c.parent_id).length;

  const handleOpenModal = (category: any = null) => {
    setEditingCategory(category);
    setCategoryName(category ? category.name : '');
    setCategoryImage(category ? category.image_url : null);
    setShowModal(true);
  };

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Imagem deve ter no máximo 2MB');
      return;
    }
    
    setIsUploading(true);
    const toastId = toast.loading('Enviando imagem...');
    
    try {
      const supabase = createClient();
      const fileExt = file.name.split('.').pop();
      const fileName = `${tenantId}/categories/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(fileName, file);
        
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(fileName);
        
      setCategoryImage(publicUrl);
      toast.success('Imagem enviada!', { id: toastId });
    } catch (err: any) {
      console.error(err);
      toast.error('Erro ao enviar imagem', { id: toastId });
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleSaveCategory = () => {
    if (!categoryName.trim()) {
      toast.error('O nome da categoria é obrigatório.');
      return;
    }
    startTransition(async () => {
      if (editingCategory) {
        const res = await updateStoreCategory(tenantId, editingCategory.id, categoryName, categoryImage || undefined);
        if (res.error) {
          toast.error(res.error);
        } else if (res.data) {
          toast.success('Categoria atualizada com sucesso!');
          setCategories(categories.map(c => c.id === editingCategory.id ? { ...c, name: res.data.name, image_url: res.data.image_url } : c));
          setShowModal(false);
        }
      } else {
        const res = await createStoreCategory(tenantId, categoryName, categoryImage || undefined);
        if (res.error) {
          toast.error(res.error);
        } else if (res.data) {
          toast.success('Categoria criada com sucesso!');
          setCategories([...categories, { ...res.data, is_active: true, parent_id: null }]);
          setShowModal(false);
        }
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta categoria?')) return;
    
    startTransition(async () => {
      const res = await deleteStoreCategory(tenantId, id);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success('Categoria excluída com sucesso!');
        setCategories(categories.filter(c => c.id !== id));
      }
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950 -m-8">
      {/* Header */}
      <div className="bg-zinc-900 border-b border-zinc-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-sm mb-4" aria-label="Breadcrumb">
            <Link href={`/admin/dashboard`} className="text-zinc-500 hover:text-zinc-300 transition-colors">Loja Virtual</Link>
            <ChevronRight className="w-4 h-4 text-zinc-600" />
            <span className="text-zinc-100 font-medium">Categorias</span>
          </nav>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center flex-shrink-0 border border-zinc-700">
                <Tags className="w-6 h-6 text-amber-500" />
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-white truncate">Categorias da Loja</h1>
                <p className="text-zinc-400 text-sm mt-0.5">Organize seus produtos em categorias hierárquicas</p>
              </div>
            </div>
            
            <button onClick={() => handleOpenModal()} className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-zinc-950 font-bold rounded-xl transition shadow-lg active:scale-95 text-sm shrink-0">
              <Plus className="w-4 h-4 shrink-0" />
              Nova Categoria
            </button>
          </div>
        </div>
      </div>

      <div className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-zinc-800 rounded-xl">
                <Tags className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-white">{totalCategories}</p>
                <p className="text-xs sm:text-sm text-zinc-400">Total de Categorias</p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-zinc-800 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-white">{activeCategories}</p>
                <p className="text-xs sm:text-sm text-zinc-400">Categorias Ativas</p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-zinc-800 rounded-xl">
                <Layers className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-white">{mainCategories}</p>
                <p className="text-xs sm:text-sm text-zinc-400">Categorias Principais</p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-zinc-800 rounded-xl">
                <FolderTree className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-white">{subCategories}</p>
                <p className="text-xs sm:text-sm text-zinc-400">Subcategorias</p>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Table */}
        <div className="bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-900/50 border-b-2 border-zinc-800">
                <tr>
                  <th className="text-left px-4 sm:px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Categoria</th>
                  <th className="text-left px-4 sm:px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-wider hidden sm:table-cell">Categoria Pai</th>
                  <th className="text-center px-4 sm:px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-wider hidden sm:table-cell">Produtos</th>
                  <th className="text-center px-4 sm:px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Status</th>
                  <th className="text-center px-4 sm:px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-wider hidden sm:table-cell">Ordem</th>
                  <th className="text-right px-4 sm:px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                      <Tags className="w-12 h-12 mx-auto text-zinc-700 mb-4" />
                      <p className="font-medium text-zinc-400">Nenhuma categoria encontrada</p>
                    </td>
                  </tr>
                ) : (
                  categories.map(category => (
                    <React.Fragment key={category.id}>
                      <tr 
                        className={`hover:bg-zinc-800/50 transition cursor-pointer ${expandedCats[category.id] ? 'bg-zinc-800/30' : ''}`}
                        onClick={() => toggleExpand(category.id)}
                      >
                        <td className="px-4 sm:px-6 py-4">
                          <div className="flex items-center gap-3">
                            {category.image_url ? (
                              <img src={category.image_url} alt={category.name} className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover bg-zinc-800 border border-zinc-700 flex-shrink-0" />
                            ) : (
                              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-zinc-800 rounded-xl overflow-hidden flex-shrink-0 border border-zinc-700 flex items-center justify-center">
                                <Tags className="w-5 h-5 text-amber-500" />
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-white text-base">
                                {category.name}
                              </p>
                              <p className="text-xs text-zinc-500">{category.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 hidden sm:table-cell text-zinc-500">
                          {category.parent_id || '-'}
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-center hidden sm:table-cell">
                          <span className="inline-flex items-center justify-center min-w-[2rem] px-2 h-8 rounded-lg text-sm font-bold bg-zinc-800 text-amber-500 border border-zinc-700">
                            {category.products_count}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-center">
                          <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold ${category.is_active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                            {category.is_active ? <CheckCircle2 className="w-3.5 h-3.5" /> : null}
                            {category.is_active ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-center hidden sm:table-cell">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-semibold bg-zinc-800 text-zinc-400">
                            {category.sort_order}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <div className="flex items-center justify-end gap-1 sm:gap-2">
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleOpenModal(category); }}
                              className="p-2.5 text-zinc-400 hover:text-amber-500 hover:bg-zinc-800 rounded-xl transition"
                              title="Editar"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleDelete(category.id); }}
                              className="p-2.5 text-zinc-400 hover:text-red-500 hover:bg-zinc-800 rounded-xl transition"
                              title="Excluir"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                            <button className="p-2.5 text-zinc-400 hover:text-white rounded-xl transition">
                              {expandedCats[category.id] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                      {/* Expanded Products Row */}
                      {expandedCats[category.id] && (
                        <tr>
                          <td colSpan={6} className="p-0 border-t-0">
                            <div className="px-6 py-6 bg-zinc-900/50 border-y border-zinc-800 shadow-inner">
                              <div className="flex items-center gap-2 mb-4">
                                <Package className="w-4 h-4 text-amber-500" />
                                <h4 className="text-sm font-bold text-white">Produtos nesta categoria ({category.products_count})</h4>
                              </div>
                              
                              {category.products && category.products.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                  {category.products.map((product: any) => (
                                    <Link key={product.id} href={`/admin/store/products/${product.id}/edit`} className="flex items-center gap-3 p-3 rounded-xl border border-zinc-800 bg-zinc-950/50 hover:border-amber-500/50 hover:bg-zinc-900 transition cursor-pointer">
                                      {product.main_image ? (
                                        <img src={product.main_image} alt={product.name} className="w-12 h-12 rounded-lg object-cover bg-zinc-900 border border-zinc-800" />
                                      ) : (
                                        <div className="w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                                          <Package className="w-5 h-5 text-zinc-600" />
                                        </div>
                                      )}
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-white truncate" title={product.name}>{product.name}</p>
                                        <p className="text-xs text-emerald-500 font-medium mt-0.5">R$ {product.price?.toFixed(2).replace('.', ',')}</p>
                                      </div>
                                    </Link>
                                  ))}
                                </div>
                              ) : (
                                <div className="flex flex-col items-center justify-center py-8 text-zinc-500 bg-zinc-950/30 rounded-xl border border-zinc-800/50 border-dashed">
                                  <Package className="w-8 h-8 mb-2 opacity-50" />
                                  <p className="text-sm">Nenhum produto cadastrado nesta categoria.</p>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Category Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Tags className="w-5 h-5 text-amber-500" />
                {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-white mb-2">
                  Nome da Categoria *
                </label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 border-2 border-zinc-700 bg-zinc-800 text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all" 
                  placeholder="Ex: Roupas" 
                  value={categoryName} 
                  onChange={e => setCategoryName(e.target.value)} 
                  onKeyDown={e => e.key === 'Enter' && handleSaveCategory()} 
                  autoFocus
                />
              </div>

              <div className="space-y-4 mt-6">
                <label className="block text-sm font-semibold text-zinc-300">
                  Imagem da Categoria (Opcional)
                </label>
                <div className="flex items-center gap-4">
                  {categoryImage ? (
                    <div className="relative group w-20 h-20 rounded-xl overflow-hidden bg-zinc-800 border border-zinc-700">
                      <img src={categoryImage} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => setCategoryImage(null)}
                        className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-5 h-5 text-red-500" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-zinc-800/50 border border-dashed border-zinc-700 flex items-center justify-center text-zinc-500">
                      <Package className="w-6 h-6 opacity-50" />
                    </div>
                  )}
                  <div className="flex-1">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleUploadImage}
                      disabled={isUploading}
                      className="w-full px-4 py-2 border-2 border-zinc-700 bg-zinc-800 text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-zinc-700 file:text-zinc-300 hover:file:bg-zinc-600 cursor-pointer disabled:opacity-50 text-sm" 
                    />
                    <p className="text-xs text-zinc-500 mt-2">Formatos recomendados: JPG, PNG, WEBP (Max 2MB)</p>
                  </div>
                </div>
              </div>

              {!editingCategory && (
                <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 p-4 rounded-xl flex items-start gap-3 text-sm">
                  <Info className="w-5 h-5 shrink-0" />
                  <p>A categoria ficará disponível para ser associada a qualquer produto.</p>
                </div>
              )}
            </div>

            <div className="p-5 bg-zinc-800/50 border-t border-zinc-800 flex items-center justify-end gap-3">
              <button 
                type="button" 
                onClick={() => setShowModal(false)} 
                className="px-5 py-2.5 rounded-xl font-bold text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors border border-transparent hover:border-zinc-700"
              >
                Cancelar
              </button>
              <button 
                type="button" 
                onClick={handleSaveCategory} 
                disabled={isPending} 
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {isPending ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
