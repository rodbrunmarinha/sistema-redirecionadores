"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ChevronRight, Tags, CheckCircle2, Layers, FolderTree, Edit, Trash2, Plus
} from 'lucide-react';
import { toast } from 'react-hot-toast';

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

  // Computed stats
  const totalCategories = categories.length;
  const activeCategories = categories.filter(c => c.is_active).length;
  const mainCategories = categories.filter(c => !c.parent_id).length;
  const subCategories = categories.filter(c => c.parent_id).length;

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta categoria?')) return;
    
    // Fake deletion for now since we don't have the action here yet,
    // but we can update state to reflect UI change.
    toast.success('Categoria excluída (Simulação)');
    setCategories(categories.filter(c => c.id !== id));
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
            
            <Link href={`/admin/store/categories/create`} className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-zinc-950 font-bold rounded-xl transition shadow-lg active:scale-95 text-sm shrink-0">
              <Plus className="w-4 h-4 shrink-0" />
              Nova Categoria
            </Link>
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
                    <tr key={category.id} className="hover:bg-zinc-800/50 transition">
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-zinc-800 rounded-xl overflow-hidden flex-shrink-0 border border-zinc-700 flex items-center justify-center">
                            <Tags className="w-5 h-5 text-zinc-500" />
                          </div>
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
                            className="p-2.5 text-zinc-400 hover:text-amber-500 hover:bg-zinc-800 rounded-xl transition"
                            title="Editar"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleDelete(category.id)}
                            className="p-2.5 text-zinc-400 hover:text-red-500 hover:bg-zinc-800 rounded-xl transition"
                            title="Excluir"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
