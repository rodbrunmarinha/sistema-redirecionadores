"use client";

import React, { useState, useTransition } from 'react';
import { createStoreCategory, createStoreProduct } from '../_actions/products';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { 
  ArrowLeft, Plus, ChevronRight, X, Check, Info, Trash2
} from 'lucide-react';

export default function ProductCreateClient({ tenantId, initialCategories }: { tenantId: string, initialCategories: any[] }) {
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categories, setCategories] = useState(initialCategories);
  const [categoryId, setCategoryId] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [keepData, setKeepData] = useState(false);
  const [quickMode, setQuickMode] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [fullDesc, setFullDesc] = useState('');

  const [price, setPrice] = useState(0);
  const [cost, setCost] = useState(0);
  const [comparePrice, setComparePrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [maxPerCustomer, setMaxPerCustomer] = useState<number | null>(null);
  const [weight, setWeight] = useState(0);
  const [sortOrder, setSortOrder] = useState(0);

  const [hasVariations, setHasVariations] = useState(false);
  const [variations, setVariations] = useState<{name: string, sku: string, stock: number, price: string}[]>([]);

  const [mainImage, setMainImage] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);

  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [trackStock, setTrackStock] = useState(true);
  const [allowBackorders, setAllowBackorders] = useState(false);

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>, isMain: boolean = false) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Regra de segurança: Apenas imagens
    const validImages = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (validImages.length !== files.length) {
      toast.error('Apenas arquivos de imagem são permitidos!');
    }
    
    // Regra de segurança: max 5MB
    const validSizedImages = validImages.filter(f => f.size <= 5 * 1024 * 1024);
    if (validSizedImages.length !== validImages.length) {
      toast.error('Algumas imagens excederam o limite de 5MB e foram ignoradas.');
    }

    if (validSizedImages.length === 0) return;

    const supabase = createClient();
    toast.loading(isMain ? 'Enviando imagem principal...' : `Enviando ${validSizedImages.length} imagem(ns)...`, { id: 'upload-toast' });

    const uploadedUrls: string[] = [];

    for (const file of validSizedImages) {
       const fileExt = file.name.split('.').pop();
       // Regra de segurança: isolamento de Tenant no storage path
       const fileName = `${tenantId}/${Date.now()}-${Math.random().toString(36).substring(2,9)}.${fileExt}`;
       
       const { error: uploadError } = await supabase.storage
         .from('products')
         .upload(fileName, file);

       if (uploadError) {
         console.error('Upload erro:', uploadError);
         toast.error(`Falha ao enviar ${file.name}`);
         continue;
       }

       const { data: { publicUrl } } = supabase.storage
         .from('products')
         .getPublicUrl(fileName);
       
       uploadedUrls.push(publicUrl);
    }

    toast.dismiss('upload-toast');
    if (uploadedUrls.length > 0) {
      if (isMain) {
        setMainImage(uploadedUrls[0]);
        toast.success('Imagem principal atualizada!');
      } else {
        setGalleryImages(prev => [...prev, ...uploadedUrls]);
        toast.success(`${uploadedUrls.length} imagem(ns) adicionada(s) à galeria!`);
      }
    }
    
    // Clear the input so it can be used again without visual confusion
    e.target.value = '';
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index));
  };

  const numPrice = Number(price.toString().replace(',', '.')) || 0;
  const numCost = Number(cost?.toString().replace(',', '.')) || 0;

  const calculateMargin = () => {
    if (numPrice > 0 && numCost >= 0) {
      const margin = ((numPrice - numCost) / numPrice) * 100;
      return margin.toFixed(1);
    }
    return '0.0';
  };


  const handleCreateCategory = () => {
    if (!newCategoryName.trim()) return;
    startTransition(async () => {
      const res = await createStoreCategory(tenantId, newCategoryName);
      if (res.error) {
        toast.error(res.error);
      } else if (res.data) {
        toast.success("Categoria criada!");
        setCategories([...categories, res.data]);
        setCategoryId(res.data.id);
        setShowCategoryModal(false);
        setNewCategoryName('');
      }
    });
  };

  const handleSaveProduct = () => {
    if (!name.trim()) return toast.error("O nome é obrigatório");
    if (numPrice <= 0) return toast.error("O preço é obrigatório e deve ser maior que zero");
    
    startTransition(async () => {
      const payload = {
        name,
        sku,
        category_id: categoryId || null,
        short_description: shortDesc,
        full_description: fullDesc,
        price: Number(price.toString().replace(',', '.')),
        compare_at_price: comparePrice ? Number(comparePrice.toString().replace(',', '.')) : null,
        cost: cost ? Number(cost.toString().replace(',', '.')) : null,
        stock_quantity: stock,
        max_per_customer: maxPerCustomer || null,
        weight_kg: Number(weight.toString().replace(',', '.')),
        sort_order: sortOrder,
        is_active: isActive,
        is_featured: isFeatured,
        track_stock: trackStock,
        allow_backorders: allowBackorders,
        has_variations: hasVariations,
        variations: hasVariations ? variations : [],
        main_image: mainImage,
        gallery_images: galleryImages
      };

      const res = await createStoreProduct(tenantId, payload);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Produto criado com sucesso!");
        if (keepData) {
          setName('');
          setSku('');
          setShortDesc('');
          setFullDesc('');
          setPrice(0);
          setComparePrice(0);
          setCost(0);
          setWeight(0);
          setHasVariations(false);
          setVariations([]);
          setMainImage(null);
          setGalleryImages([]);
          // Reset file inputs visually
          document.querySelectorAll('input[type=file]').forEach(el => (el as HTMLInputElement).value = '');
        } else {
          router.push('/admin/store/products');
        }
      }
    });
  };

  const addVariation = () => {
    setVariations([...variations, { name: '', sku: '', stock: 0, price: '' }]);
  };

  const removeVariation = (index: number) => {
    const newVars = [...variations];
    newVars.splice(index, 1);
    setVariations(newVars);
    if (newVars.length === 0) setHasVariations(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 -m-8 text-zinc-300 pb-20">
      {/* Header */}
      <div className="relative overflow-hidden bg-zinc-900 border-b border-zinc-800 shadow-lg">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5 pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-8 w-64 h-64 rounded-full bg-white/5 pointer-events-none"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-sm mb-3" aria-label="Breadcrumb">
            <Link href={`/admin/store`} className="text-zinc-500 hover:text-white transition-colors truncate">Loja Virtual</Link>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
            <Link href={`/admin/store/products`} className="text-zinc-500 hover:text-white transition-colors truncate">Produtos</Link>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
            <span className="text-white font-medium truncate">Novo Produto</span>
          </nav>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4 min-w-0">
              <Link href={`/admin/store/products`} className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-2xl shadow-lg shrink-0 transition border border-zinc-700">
                <ArrowLeft className="w-5 h-5 text-zinc-300" />
              </Link>
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-white truncate">Novo Produto</h1>
                <p className="text-zinc-400 text-sm mt-0.5">Adicione um novo produto à sua loja virtual</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-4 sm:py-8">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6">
          
          {/* Progress Indicator */}
          <div className="bg-zinc-900 rounded-2xl p-4 sm:p-6 border border-zinc-800 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white">Progresso do Cadastro</h3>
              <span className="text-xs text-zinc-500">Preencha todos os campos obrigatórios</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold">1</div>
                <span className="font-medium text-zinc-300">Básico</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-500 flex items-center justify-center font-bold">2</div>
                <span className="font-medium text-zinc-300">Preço</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-400 flex items-center justify-center font-bold">3</div>
                <span className="font-medium text-zinc-300">Imagens</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold">4</div>
                <span className="font-medium text-zinc-300">Opções</span>
              </div>
            </div>
          </div>

          <form className="space-y-6">
            {/* Cadastro em série */}
            <div className="bg-zinc-900 rounded-2xl p-4 sm:p-6 border border-zinc-800 shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">⚡</span>
                    <h3 className="text-base sm:text-lg font-bold text-white">Cadastro em série</h3>
                    {keepData && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20">Manter dados</span>
                    )}
                  </div>
                  <p className="text-sm text-zinc-400">Ideal para cadastrar vários produtos da mesma seção sem repetir as mesmas escolhas.</p>
                  <p className="text-xs text-zinc-500 mt-2">Mantém categoria, status do produto e opções de estoque ao usar "Salvar e cadastrar próximo".</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button type="button" onClick={() => setKeepData(true)} className={`px-4 py-2.5 rounded-xl border-2 font-semibold transition-all duration-200 ${keepData ? 'bg-amber-600 text-white border-amber-600' : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:border-zinc-600'}`}>
                    Manter dados
                  </button>
                  <button type="button" onClick={() => setKeepData(false)} className="px-4 py-2.5 rounded-xl border-2 border-zinc-700 bg-zinc-800 text-zinc-300 font-semibold transition-all duration-200 hover:border-red-500/50 hover:text-red-400">
                    Limpar dados
                  </button>
                </div>
              </div>
            </div>

            {/* Config & Resumo */}
            <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-4">
              {/* Modo de cadastro */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 sm:p-5 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-white">Modo de cadastro</h3>
                    <p className="text-sm text-zinc-400">Use o modo rápido para cadastrar em sequência sem se perder nos campos opcionais.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => setQuickMode(true)} className={`px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all duration-200 ${quickMode ? 'bg-amber-600 text-white border-amber-600' : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:border-zinc-600'}`}>
                      Modo rápido
                    </button>
                    <button type="button" onClick={() => setQuickMode(false)} className={`px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all duration-200 ${!quickMode ? 'bg-amber-600 text-white border-amber-600' : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:border-zinc-600'}`}>
                      Modo completo
                    </button>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm">
                  <div className={`rounded-xl border p-3 transition-all duration-200 ${quickMode ? 'border-amber-500/30 bg-amber-500/10 text-amber-500' : 'border-zinc-800 bg-zinc-800/50 text-zinc-400'}`}>
                    <div className="font-bold mb-1">Modo rápido</div>
                    <div>Mostra só o essencial para cadastrar mais rápido: descrição curta, preço, estoque, imagens e opções principais.</div>
                  </div>
                  <div className={`rounded-xl border p-3 transition-all duration-200 ${!quickMode ? 'border-amber-500/30 bg-amber-500/10 text-amber-500' : 'border-zinc-800 bg-zinc-800/50 text-zinc-400'}`}>
                    <div className="font-bold mb-1">Modo completo</div>
                    <div>Abre descrição completa e campos avançados como preço comparativo, custo, peso e ordem de exibição.</div>
                  </div>
                </div>
              </div>

              {/* Resumo ao vivo */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 sm:p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">📋</span>
                  <h3 className="text-base font-bold text-white">Resumo ao vivo</h3>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-zinc-800/80 p-3 border border-zinc-700">
                    <div className="text-xs uppercase tracking-wide text-zinc-500">Categoria</div>
                    <div className="mt-1 font-semibold text-white">{categories.find((c: any) => c.id === categoryId)?.name || "Sem categoria"}</div>
                  </div>
                  <div className="rounded-xl bg-zinc-800/80 p-3 border border-zinc-700">
                    <div className="text-xs uppercase tracking-wide text-zinc-500">Preço de Venda *</div>
                    <div className="mt-1 font-semibold text-white">$ {numPrice.toFixed(2)}</div>
                  </div>
                  <div className="rounded-xl bg-zinc-800/80 p-3 border border-zinc-700">
                    <div className="text-xs uppercase tracking-wide text-zinc-500">Imagem Principal</div>
                    <div className="mt-1 font-semibold text-white">{mainImage ? 'Imagem pronta' : 'Imagem pendente'}</div>
                  </div>
                  <div className="rounded-xl bg-zinc-800/80 p-3 border border-zinc-700">
                    <div className="text-xs uppercase tracking-wide text-zinc-500">Galeria de Imagens</div>
                    <div className="mt-1 font-semibold text-white">{galleryImages.length ? `${galleryImages.length} imagens` : 'Sem galeria'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 1. Basic Info */}
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-xl overflow-hidden">
              <div className="bg-zinc-800 px-4 sm:px-6 py-3 sm:py-4 border-b border-zinc-700">
                <h2 className="text-lg font-bold text-white flex items-center gap-3">
                  <span className="w-10 h-10 bg-zinc-700 rounded-xl flex items-center justify-center text-2xl">📝</span>
                  <div>
                    <div>Informações Básicas</div>
                    <div className="text-xs font-normal text-zinc-400">Nome, descrição e categoria do produto</div>
                  </div>
                </h2>
              </div>
              <div className="p-4 sm:p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-white mb-2">
                      <span className="text-lg">🏷️</span> Nome do Produto *
                    </label>
                    <input type="text" className="w-full px-4 py-3.5 border-2 border-zinc-700 bg-zinc-800 text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all" placeholder="Ex: iPhone 15 Pro Max 256GB" value={name} onChange={e => setName(e.target.value)} />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-white mb-2">
                      <span className="text-lg">🔖</span> SKU / Código
                    </label>
                    <input type="text" className="w-full px-4 py-3.5 border-2 border-zinc-700 bg-zinc-800 text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all" placeholder="Ex: IP15PM-256" value={sku} onChange={e => setSku(e.target.value)} />
                    <p className="text-xs text-zinc-500 mt-1.5">Se deixar em branco, o sistema gera um código automaticamente</p>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-white mb-2">
                      <span className="text-lg">📂</span> Categoria
                    </label>
                    <div className="flex gap-2">
                      <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="flex-1 px-4 py-3.5 border-2 border-zinc-700 bg-zinc-800 text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all">
                        <option value="">Selecione uma categoria</option>
                        {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                      <button type="button" onClick={() => setShowCategoryModal(true)} className="px-4 py-3.5 bg-zinc-800 border-2 border-zinc-700 hover:border-amber-500 text-amber-500 rounded-xl font-bold transition-all flex items-center gap-2">
                        <Plus className="w-5 h-5" /> Nova
                      </button>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <div className="flex items-center justify-between mb-2">
                      <label className="flex items-center gap-2 text-sm font-bold text-white">
                        <span className="text-lg">💬</span> Descrição Curta
                      </label>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${charCount > 160 ? 'text-red-500' : 'text-amber-500'}`}>{charCount}/160</span>
                        <div className="w-16 h-2 bg-zinc-800 rounded-full overflow-hidden">
                          <div className={`h-full transition-all ${charCount > 160 ? 'bg-red-500' : 'bg-amber-500'}`} style={{ width: `${Math.min((charCount / 160) * 100, 100)}%` }}></div>
                        </div>
                      </div>
                    </div>
                    <input type="text" maxLength={160} className="w-full px-4 py-3.5 border-2 border-zinc-700 bg-zinc-800 text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all" placeholder="Uma breve descrição chamativa do produto" value={shortDesc} onChange={e => {setShortDesc(e.target.value); setCharCount(e.target.value.length)}} />
                  </div>

                  <div className="md:col-span-2 rounded-2xl border border-dashed border-zinc-700 bg-zinc-800/50 p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <div className="text-sm font-bold text-white">Descrição completa opcional</div>
                        <div className="text-xs text-zinc-400">Abra isso só quando precisar caprichar mais no detalhe do produto.</div>
                      </div>
                      <button type="button" onClick={() => setShowFullDesc(!showFullDesc)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-zinc-600 text-zinc-300 bg-zinc-800 font-semibold hover:border-amber-500 hover:text-amber-500 transition-all">
                        {showFullDesc ? 'Ocultar descrição' : 'Adicionar descrição completa'}
                      </button>
                    </div>
                  </div>

                  {(showFullDesc || !quickMode) && (
                    <div className="md:col-span-2">
                      <label className="flex items-center gap-2 text-sm font-bold text-white mb-2">
                        <span className="text-lg">📄</span> Descrição Completa
                      </label>
                      <textarea rows={6} className="w-full px-4 py-3.5 border-2 border-zinc-700 bg-zinc-800 text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all resize-none" placeholder="Descrição detalhada do produto..." value={fullDesc} onChange={e => setFullDesc(e.target.value)}></textarea>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 2. Preço e Estoque */}
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-xl overflow-hidden mt-6">
              <div className="bg-zinc-800 px-4 sm:px-6 py-3 sm:py-4 border-b border-zinc-700">
                <h2 className="text-lg font-bold text-white flex items-center gap-3">
                  <span className="w-10 h-10 bg-zinc-700 rounded-xl flex items-center justify-center text-2xl">💰</span>
                  <div>
                    <div>Preço e Estoque</div>
                    <div className="text-xs font-normal text-zinc-400">Defina preços, custos e controle de estoque</div>
                  </div>
                </h2>
              </div>
              <div className="p-4 sm:p-6 space-y-6">
                
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
                  <span className="text-2xl">💡</span>
                  <div>
                    <h4 className="font-bold text-white text-sm mb-1">Calculadora de Margem</h4>
                    <p className="text-xs text-amber-400">Margem de lucro: {calculateMargin()}%</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-zinc-700 bg-zinc-800/50 p-4">
                  <div>
                    <div className="text-sm font-bold text-white">Campos avançados</div>
                    <div className="text-xs text-zinc-400">Comparativo, custo, peso e ordem podem ficar recolhidos no cadastro rápido.</div>
                  </div>
                  <button type="button" onClick={() => setShowAdvanced(!showAdvanced)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-zinc-600 text-zinc-300 bg-zinc-800 font-semibold hover:border-amber-500 hover:text-amber-500 transition-all">
                    {showAdvanced ? 'Ocultar campos avançados' : 'Mostrar campos avançados'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-white mb-2">
                      <span className="text-lg">💵</span> Preço de Venda *
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold text-lg">¥</span>
                      <input type="text" inputMode="decimal" value={price || ''} onChange={(e) => setPrice(e.target.value as any)} className="w-full pl-10 pr-4 py-3.5 border-2 border-zinc-700 bg-zinc-800 text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-lg font-semibold" placeholder="0,00" />
                    </div>
                  </div>

                  {(showAdvanced || !quickMode) && (
                    <>
                      <div>
                        <label className="flex items-center gap-2 text-sm font-bold text-white mb-2">
                          <span className="text-lg">🏷️</span> Preço Comparativo
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">¥</span>
                          <input type="text" inputMode="decimal" className="w-full pl-10 pr-4 py-3.5 border-2 border-zinc-700 bg-zinc-800 text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all" placeholder="0,00" value={comparePrice || ''} onChange={(e) => setComparePrice(e.target.value as any)} />
                        </div>
                      </div>
                      <div>
                        <label className="flex items-center gap-2 text-sm font-bold text-white mb-2">
                          <span className="text-lg">📊</span> Custo do Produto
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">¥</span>
                          <input type="text" inputMode="decimal" value={cost || ''} onChange={(e) => setCost(e.target.value as any)} className="w-full pl-10 pr-4 py-3.5 border-2 border-zinc-700 bg-zinc-800 text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all" placeholder="0,00" />
                        </div>
                      </div>
                    </>
                  )}

                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-white mb-2">
                      <span className="text-lg">📦</span> Quantidade em Estoque *
                    </label>
                    <input type="number" disabled={hasVariations} className="w-full px-4 py-3.5 border-2 border-zinc-700 bg-zinc-800 text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-lg font-semibold disabled:opacity-50" placeholder="0" value={stock || ''} onChange={e => setStock(Number(e.target.value))} />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-white mb-2">
                      <span className="text-lg">🛍️</span> Máximo por cliente
                    </label>
                    <input type="number" className="w-full px-4 py-3.5 border-2 border-zinc-700 bg-zinc-800 text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-lg font-semibold" placeholder="1" value={maxPerCustomer || ''} onChange={e => setMaxPerCustomer(Number(e.target.value))} />
                  </div>

                  <div className="md:col-span-3 bg-zinc-800/50 rounded-2xl border border-zinc-700 p-5 space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h4 className="text-base font-bold text-white">Variações do Produto</h4>
                        <p className="text-xs text-zinc-400">Ex: Tamanho 37, 38, 39 com estoque separado por variação.</p>
                      </div>
                      <label className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-300">
                        <input type="checkbox" checked={hasVariations} onChange={(e) => setHasVariations(e.target.checked)} className="w-5 h-5 rounded border-zinc-600 bg-zinc-800 text-amber-500 focus:ring-amber-500" />
                        Ativar variações
                      </label>
                    </div>

                    {hasVariations && (
                      <div className="space-y-3 pt-3 border-t border-zinc-700">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-amber-500">Estoque total pelas variações: 0</p>
                          <button type="button" onClick={addVariation} className="px-3 py-2 bg-zinc-800 border border-zinc-600 hover:border-amber-500 text-amber-500 rounded-lg text-sm font-semibold transition">
                            + Adicionar variação
                          </button>
                        </div>
                        {variations.length === 0 && (
                          <p className="text-sm text-zinc-500">Nenhuma variação adicionada.</p>
                        )}
                        {variations.map((v, i) => (
                          <div key={i} className="grid grid-cols-1 md:grid-cols-5 gap-3 p-3 bg-zinc-800 rounded-xl border border-zinc-700">
                            <div className="md:col-span-2">
                              <input type="text" className="mt-1 w-full px-3 py-2 border border-zinc-600 rounded-lg bg-zinc-900 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500" placeholder="Ex: Tamanho 42" value={v.name} onChange={e => { const newVars = [...variations]; newVars[i].name = e.target.value; setVariations(newVars); }} />
                            </div>
                            <div>
                              <input type="text" className="mt-1 w-full px-3 py-2 border border-zinc-600 rounded-lg bg-zinc-900 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500" value={v.sku} onChange={e => { const newVars = [...variations]; newVars[i].sku = e.target.value; setVariations(newVars); }} />
                            </div>
                            <div>
                              <input type="number" className="mt-1 w-full px-3 py-2 border border-zinc-600 rounded-lg bg-zinc-900 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500" value={v.stock} onChange={e => { const newVars = [...variations]; newVars[i].stock = Number(e.target.value); setVariations(newVars); }} />
                            </div>
                            <div className="flex gap-2 items-end">
                              <div className="flex-1">
                                <input type="number" className="mt-1 w-full px-3 py-2 border border-zinc-600 rounded-lg bg-zinc-900 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500" value={v.price} onChange={e => { const newVars = [...variations]; newVars[i].price = e.target.value; setVariations(newVars); }} />
                              </div>
                              <button type="button" onClick={() => removeVariation(i)} className="px-3 py-2 text-red-500 border border-red-500/20 bg-red-500/10 hover:bg-red-500 hover:text-white transition-colors rounded-lg font-semibold">
                                Remover
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-white mb-2">
                      <span className="text-lg">⚖️</span> Peso (kg) <span className="text-amber-500">*</span>
                    </label>
                    <input type="text" inputMode="decimal" className="w-full px-4 py-3.5 border-2 border-zinc-700 bg-zinc-800 text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all" placeholder="0,000" value={weight || ''} onChange={e => setWeight(e.target.value as any)} />
                  </div>

                  {(showAdvanced || !quickMode) && (
                    <div>
                      <label className="flex items-center gap-2 text-sm font-bold text-white mb-2">
                        <span className="text-lg">🔢</span> Ordem de Exibição
                      </label>
                      <input type="number" className="w-full px-4 py-3.5 border-2 border-zinc-700 bg-zinc-800 text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all" placeholder="0" value={sortOrder} onChange={e => setSortOrder(Number(e.target.value))} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 3. Imagens */}
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-xl overflow-hidden mt-6">
              <div className="bg-zinc-800 px-4 sm:px-6 py-3 sm:py-4 border-b border-zinc-700">
                <h2 className="text-lg font-bold text-white flex items-center gap-3">
                  <span className="w-10 h-10 bg-zinc-700 rounded-xl flex items-center justify-center text-2xl">🖼️</span>
                  <div>
                    <div>Imagens do Produto</div>
                    <div className="text-xs font-normal text-zinc-400">Adicione fotos atraentes do seu produto</div>
                  </div>
                </h2>
              </div>
              <div className="p-4 sm:p-6 space-y-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-white mb-3">
                    <span className="text-lg">⭐</span> Imagem Principal
                  </label>
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <div className="w-32 h-32 bg-zinc-800 rounded-2xl flex items-center justify-center border-2 border-dashed border-zinc-600 flex-shrink-0 relative overflow-hidden group">
                      {mainImage ? (
                        <>
                          <img src={mainImage} alt="Principal" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-xs font-bold">Alterar</span>
                          </div>
                        </>
                      ) : (
                        <span className="text-5xl">🖼️</span>
                      )}
                    </div>
                    <div className="flex-1 space-y-3 w-full">
                      <div className="relative">
                        <input type="file" accept="image/*" onChange={(e) => handleUploadImage(e, true)} className="w-full px-4 py-3 border-2 border-zinc-700 bg-zinc-800 text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-zinc-700 file:text-zinc-300 hover:file:bg-zinc-600 cursor-pointer" />
                      </div>
                      <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
                        <Info className="w-5 h-5 shrink-0" />
                        <span>Dica: Use imagens de alta qualidade (1200x1200px ou maior), formato JPG ou PNG. Essa será a primeira imagem que os clientes verão!</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-white mb-3">
                    <span className="text-lg">🎨</span> Galeria de Imagens
                  </label>
                  <input type="file" multiple accept="image/*" onChange={(e) => handleUploadImage(e, false)} className="w-full px-4 py-3 border-2 border-zinc-700 bg-zinc-800 text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-zinc-700 file:text-zinc-300 hover:file:bg-zinc-600 cursor-pointer" />
                  
                  <div className="mt-4 bg-zinc-800/50 border border-zinc-700 rounded-2xl p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-bold text-white text-sm">Imagens na galeria</h4>
                      <span className="text-xs text-zinc-400">Total: {galleryImages.length}</span>
                    </div>
                    
                    {galleryImages.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                        {galleryImages.map((imgUrl, idx) => (
                          <div key={idx} className="relative group rounded-xl overflow-hidden bg-zinc-950 border border-zinc-700 aspect-square">
                            <img src={imgUrl} alt={`Galeria ${idx + 1}`} className="w-full h-full object-cover" />
                            <button 
                              type="button" 
                              onClick={() => removeGalleryImage(idx)}
                              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                              title="Remover imagem"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-3">
                        <p className="text-zinc-500 text-sm">Nenhuma imagem extra selecionada.</p>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 mt-2">Selecione múltiplas imagens para mostrar diferentes ângulos do produto</p>
                </div>
              </div>
            </div>

            {/* 4. Configurações */}
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-xl overflow-hidden mt-6">
              <div className="bg-zinc-800 px-4 sm:px-6 py-3 sm:py-4 border-b border-zinc-700">
                <h2 className="text-lg font-bold text-white flex items-center gap-3">
                  <span className="w-10 h-10 bg-zinc-700 rounded-xl flex items-center justify-center text-2xl">⚙️</span>
                  <div>
                    <div>Configurações do Produto</div>
                    <div className="text-xs font-normal text-zinc-400">Ative os recursos que deseja para este produto</div>
                  </div>
                </h2>
              </div>
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className={`group relative flex items-start gap-4 cursor-pointer p-5 border-2 rounded-2xl transition-all duration-200 ${isActive ? 'border-amber-500 bg-amber-500/5' : 'border-zinc-700 bg-zinc-800 hover:border-zinc-600'}`}>
                    <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="mt-1 w-6 h-6 rounded bg-zinc-800 border-zinc-600 text-amber-500 focus:ring-amber-500" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 font-bold text-white">
                        <span className="text-2xl">✅</span> Produto Ativo
                      </div>
                      <p className="text-sm text-zinc-400 mt-1">Produto visível e disponível para compra na loja virtual</p>
                    </div>
                  </label>

                  <label className={`group relative flex items-start gap-4 cursor-pointer p-5 border-2 rounded-2xl transition-all duration-200 ${isFeatured ? 'border-amber-500 bg-amber-500/5' : 'border-zinc-700 bg-zinc-800 hover:border-zinc-600'}`}>
                    <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="mt-1 w-6 h-6 rounded bg-zinc-800 border-zinc-600 text-amber-500 focus:ring-amber-500" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 font-bold text-white">
                        <span className="text-2xl">⭐</span> Produto Destaque
                      </div>
                      <p className="text-sm text-zinc-400 mt-1">Exibir na seção de destaques da página inicial</p>
                    </div>
                  </label>

                  <label className={`group relative flex items-start gap-4 cursor-pointer p-5 border-2 rounded-2xl transition-all duration-200 ${trackStock ? 'border-amber-500 bg-amber-500/5' : 'border-zinc-700 bg-zinc-800 hover:border-zinc-600'}`}>
                    <input type="checkbox" checked={trackStock} onChange={(e) => setTrackStock(e.target.checked)} className="mt-1 w-6 h-6 rounded bg-zinc-800 border-zinc-600 text-amber-500 focus:ring-amber-500" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 font-bold text-white">
                        <span className="text-2xl">📊</span> Controlar Estoque
                      </div>
                      <p className="text-sm text-zinc-400 mt-1">Decrementar automaticamente o estoque a cada venda</p>
                    </div>
                  </label>

                  <label className={`group relative flex items-start gap-4 cursor-pointer p-5 border-2 rounded-2xl transition-all duration-200 ${allowBackorders ? 'border-amber-500 bg-amber-500/5' : 'border-zinc-700 bg-zinc-800 hover:border-zinc-600'}`}>
                    <input type="checkbox" checked={allowBackorders} onChange={(e) => setAllowBackorders(e.target.checked)} className="mt-1 w-6 h-6 rounded bg-zinc-800 border-zinc-600 text-amber-500 focus:ring-amber-500" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 font-bold text-white">
                        <span className="text-2xl">🔄</span> Permitir Pré-venda
                      </div>
                      <p className="text-sm text-zinc-400 mt-1">Aceitar pedidos mesmo quando o estoque estiver zerado</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="sticky bottom-6 z-10 mt-6">
              <div className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-2xl p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">🚀</span>
                    <div className="text-center sm:text-left">
                      <div className="font-bold text-white">Pronto para publicar?</div>
                      <div className="text-sm text-zinc-400">Revise as informações e salve</div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                    <Link href="/admin/store/products" className="w-full sm:w-auto text-center justify-center px-6 py-3.5 text-zinc-300 bg-zinc-800 border-2 border-zinc-700 rounded-xl font-bold hover:bg-zinc-700 transition-all duration-200 flex items-center gap-2">
                      <X className="w-5 h-5" /> Cancelar
                    </Link>
                    <button type="button" className="w-full sm:w-auto justify-center px-6 py-3.5 bg-zinc-800 text-amber-500 border-2 border-amber-500/30 rounded-xl font-bold hover:bg-zinc-700 hover:border-amber-500 transition-all duration-200 flex items-center gap-2">
                      <Plus className="w-5 h-5" /> Salvar e cadastrar próximo
                    </button>
                    <button type="button" onClick={handleSaveProduct} disabled={isPending} className="w-full sm:w-auto justify-center px-8 py-3.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold transition-all duration-200 flex items-center gap-2 shadow-lg disabled:opacity-50">
                      <Check className="w-5 h-5" /> 🎉 Criar Produto
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </form>

          {/* Help Card */}
          <div className="bg-blue-500/10 rounded-2xl border border-blue-500/20 p-4 sm:p-6 mt-6">
            <div className="flex items-start gap-4">
              <span className="text-4xl flex-shrink-0">💡</span>
              <div>
                <h3 className="font-bold text-lg text-white mb-2">Dicas para um produto de sucesso</h3>
                <ul className="space-y-2 text-sm text-zinc-300">
                  <li className="flex items-start gap-2"><span className="text-amber-500 font-bold">✓</span> <span><strong>Título claro:</strong> Use nomes descritivos que seus clientes procurariam</span></li>
                  <li className="flex items-start gap-2"><span className="text-amber-500 font-bold">✓</span> <span><strong>Fotos de qualidade:</strong> Imagens nítidas e profissionais aumentam as vendas em até 40%</span></li>
                  <li className="flex items-start gap-2"><span className="text-amber-500 font-bold">✓</span> <span><strong>Descrição completa:</strong> Detalhe características, benefícios e especificações técnicas</span></li>
                  <li className="flex items-start gap-2"><span className="text-amber-500 font-bold">✓</span> <span><strong>Preço competitivo:</strong> Pesquise o mercado e ofereça valor aos seus clientes</span></li>
                  <li className="flex items-start gap-2"><span className="text-amber-500 font-bold">✓</span> <span><strong>Estoque atualizado:</strong> Mantenha a quantidade sempre correta para evitar vendas perdidas</span></li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-amber-600 p-5 relative">
              <button onClick={() => setShowCategoryModal(false)} type="button" className="absolute top-4 right-4 text-amber-200 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-2xl">✨</span> Nova Categoria
              </h3>
              <p className="text-amber-200 text-sm mt-1">Crie uma nova categoria rapidamente</p>
            </div>
            
            <div className="p-5 space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-white mb-2">
                  <span className="text-lg">🏷️</span> Nome da Categoria *
                </label>
                <input type="text" className="w-full px-4 py-3.5 border-2 border-zinc-700 bg-zinc-800 text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all" placeholder="Ex: Eletrônicos, Roupas, Acessórios..." value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleCreateCategory()} />
                <p className="text-xs text-zinc-500 mt-2 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" /> Pressione Enter para criar rapidamente
                </p>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 p-4 rounded-xl flex items-start gap-3 text-sm">
                <Info className="w-5 h-5 shrink-0" />
                <p>A categoria será criada e automaticamente selecionada neste produto.</p>
              </div>
            </div>

            <div className="p-5 bg-zinc-800/50 border-t border-zinc-800 flex items-center justify-end gap-3">
              <button type="button" onClick={() => setShowCategoryModal(false)} className="px-5 py-2.5 rounded-xl font-bold text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors border border-transparent hover:border-zinc-700">
                Cancelar
              </button>
              <button type="button" onClick={handleCreateCategory} disabled={isPending} className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50">
                <Plus className="w-4 h-4" /> Criar Categoria
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

