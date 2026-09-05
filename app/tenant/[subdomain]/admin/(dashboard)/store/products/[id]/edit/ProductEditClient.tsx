"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { toast } from "react-hot-toast";
import { 
  ChevronRight, 
  ArrowLeft, 
  FileText, 
  Tag, 
  Folder, 
  MessageSquare, 
  AlignLeft, 
  DollarSign, 
  Package, 
  Scale, 
  ListOrdered, 
  Image as ImageIcon, 
  Settings, 
  CheckCircle2, 
  Star, 
  BarChart2, 
  RefreshCw,
  Plus,
  X,
  Save,
  AlertTriangle,
  Lightbulb,
  Loader2
} from "lucide-react";
import { updateStoreProduct, createStoreCategory } from "../../_actions/products";
import { useTenantSettings } from "../../../../../../app/(customer)/components/TenantSettingsContext";

interface Variation {
  key?: string;
  name: string;
  sku: string;
  stock_quantity: number;
  price: string;
}

interface ProductEditClientProps {
  tenantId: string;
  subdomain: string;
  product: {
    id: string;
    name: string;
    sku: string;
    categoryId: string;
    shortDescription: string;
    description: string;
    price: number;
    compareAtPrice: number | null;
    cost: number | null;
    stockQuantity: number;
    maxPerCustomer: number | null;
    weight: number;
    sortOrder: number;
    isActive: boolean;
    isFeatured: boolean;
    trackStock: boolean;
    allowBackorders: boolean;
    mainImage: string;
    galleryImages: { id: string; url: string }[];
    variations: Variation[];
    stats: {
      sales: number;
      views: number;
    }
  };
  categories: { id: string; name: string }[];
}

export default function ProductEditClient({ product, categories: initialCategories, tenantId, subdomain }: ProductEditClientProps) {
  const router = useRouter();
  const { currencySymbol, currency } = useTenantSettings();

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<any>>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (!val) val = "0";
    const num = Number(val) / 100;
    setter(num);
  };

  const formatCurrency = (val: number | string | null | undefined) => {
    if (val === null || val === undefined || val === "") return "";
    const num = Number(val);
    if (isNaN(num)) return "";
    return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const [categories, setCategories] = useState(initialCategories);
  const [charCount, setCharCount] = useState(product.shortDescription?.length || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form states
  const [name, setName] = useState(product.name);
  const [sku, setSku] = useState(product.sku || "");
  const [categoryId, setCategoryId] = useState(product.categoryId);
  const [shortDescription, setShortDescription] = useState(product.shortDescription || "");
  const [description, setDescription] = useState(product.description || "");
  const [priceValue, setPriceValue] = useState(product.price);
  const [compareAtPrice, setCompareAtPrice] = useState(product.compareAtPrice || "");
  const [costValue, setCostValue] = useState(product.cost || 0);
  const [stockQuantity, setStockQuantity] = useState(product.stockQuantity);
  const [maxPerCustomer, setMaxPerCustomer] = useState(product.maxPerCustomer || "");
  const [weight, setWeight] = useState(product.weight);
  const [sortOrder, setSortOrder] = useState(product.sortOrder);
  
  const [isActive, setIsActive] = useState(product.isActive);
  const [isFeatured, setIsFeatured] = useState(product.isFeatured);
  const [trackStock, setTrackStock] = useState(product.trackStock);
  const [allowBackorders, setAllowBackorders] = useState(product.allowBackorders);
  
  // Category Modal
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  
  // Variations
  const [hasVariationsEnabled, setHasVariationsEnabled] = useState(product.variations.length > 0);
  const [variationRows, setVariationRows] = useState<Variation[]>(
    product.variations.map(v => ({ ...v, key: 'var-' + Math.random().toString(36).substring(2, 10), price: v.price ? String(v.price) : "" }))
  );

  // Images
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<{name: string, url: string}[]>([]);
  const [markedForRemoval, setMarkedForRemoval] = useState<Set<string>>(new Set());

  const toggleRemoval = (id: string) => {
    const newSet = new Set(markedForRemoval);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setMarkedForRemoval(newSet);
  };

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>, isMain: boolean = false) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const validImages = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (validImages.length !== files.length) {
      toast.error('Apenas arquivos de imagem são permitidos!');
    }
    
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
        setImagePreview(uploadedUrls[0]);
        toast.success('Imagem principal pronta para salvar!');
      } else {
        setGalleryPreviews(prev => [...prev, ...uploadedUrls.map(url => ({ name: 'Nova imagem', url }))]);
        toast.success(`${uploadedUrls.length} imagem(ns) pronta(s)!`);
      }
    }
    
    e.target.value = '';
  };

  const calculateMargin = () => {
    if (priceValue > 0 && costValue >= 0) {
      return ((priceValue - costValue) / priceValue * 100).toFixed(1);
    }
    return '0.0';
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    setIsCreatingCategory(true);
    
    try {
      const result = await createStoreCategory(tenantId, newCategoryName);
      if (result.data) {
        setCategories([...categories, result.data]);
        setCategoryId(result.data.id);
        setNewCategoryName("");
        setShowCategoryModal(false);
      } else {
        alert(result.error || "Erro ao criar categoria");
      }
    } catch (e) {
      alert("Erro ao criar categoria");
    } finally {
      setIsCreatingCategory(false);
    }
  };

  const addVariation = () => {
    setVariationRows([...variationRows, {
      key: 'var-' + Math.random().toString(36).substring(2, 10),
      name: '',
      sku: '',
      stock_quantity: 0,
      price: ''
    }]);
  };

  const removeVariation = (index: number) => {
    const newRows = [...variationRows];
    newRows.splice(index, 1);
    setVariationRows(newRows);
    if (newRows.length === 0) setHasVariationsEnabled(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const currentGalleryUrls = product.galleryImages
         .filter(img => !markedForRemoval.has(img.id))
         .map(img => img.url);
      
      const newGalleryUrls = galleryPreviews.map(p => p.url);
      const finalGalleryImages = [...currentGalleryUrls, ...newGalleryUrls];

      const productData = {
        name,
        sku: sku || null,
        category_id: categoryId || null,
        short_description: shortDescription,
        full_description: description,
        price: Number(priceValue),
        compare_at_price: compareAtPrice ? Number(compareAtPrice) : null,
        cost: Number(costValue),
        stock_quantity: Number(stockQuantity),
        max_per_customer: maxPerCustomer ? Number(maxPerCustomer) : null,
        weight_kg: Number(weight.toString().replace(',', '.')),
        sort_order: Number(sortOrder),
        is_active: isActive,
        is_featured: isFeatured,
        track_stock: trackStock,
        allow_backorders: allowBackorders,
        has_variations: hasVariationsEnabled,
        variations: hasVariationsEnabled ? variationRows : [],
        main_image: imagePreview || undefined,
        gallery_images: finalGalleryImages
      };
      
      const res = await updateStoreProduct(tenantId, product.id, productData);
      
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Produto salvo com sucesso!");
        router.push(`/admin/store/products`);
        router.refresh();
      }
    } catch (e) {
      console.error(e);
      alert("Erro ao atualizar o produto.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalVariationStock = variationRows.reduce((acc, row) => acc + (Number(row.stock_quantity) || 0), 0);

  return (
    <div className="min-h-screen bg-zinc-950 pb-28">
      
      {/* Header */}
      <div className="bg-zinc-900 border-b border-zinc-800 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-amber-500/5 pointer-events-none blur-3xl"></div>
        <div className="absolute -bottom-16 -left-8 w-64 h-64 rounded-full bg-amber-500/5 pointer-events-none blur-3xl"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-sm mb-4 text-zinc-400" aria-label="Breadcrumb">
            <Link href={`/admin/store`} className="hover:text-zinc-100 transition-colors truncate max-w-[45vw] sm:max-w-[220px]">
              Loja Virtual
            </Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            <Link href={`/admin/store/products`} className="hover:text-zinc-100 transition-colors truncate max-w-[45vw] sm:max-w-[220px]">
              Produtos
            </Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            <span className="text-zinc-100 font-medium truncate max-w-[45vw] sm:max-w-[220px]">
              Editar Produto
            </span>
          </nav>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4 min-w-0">
              <Link href={`/admin/store/products`} className="p-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-2xl shadow-sm border border-zinc-700 shrink-0 transition">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 truncate">Editar Produto</h1>
                <p className="text-zinc-400 text-sm mt-0.5">Atualize as informações do produto</p>
              </div>
            </div>

            {/* Quick Stats (only in edit mode) */}
            <div className="hidden lg:flex items-center gap-3 shrink-0">
              <div className="bg-zinc-800/50 border border-zinc-700 text-zinc-100 px-4 py-2 rounded-xl">
                <div className="text-xs font-medium text-zinc-400">Vendas</div>
                <div className="text-xl font-bold text-amber-500">{product.stats?.sales || 0}</div>
              </div>
              <div className="bg-zinc-800/50 border border-zinc-700 text-zinc-100 px-4 py-2 rounded-xl">
                <div className="text-xs font-medium text-zinc-400">Visualizações</div>
                <div className="text-xl font-bold text-amber-500">{product.stats?.views || 0}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-6 sm:py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Basic Info */}
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-sm overflow-hidden">
              <div className="bg-zinc-950 px-4 sm:px-6 py-4 border-b border-zinc-800">
                <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center text-amber-500">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div>Informações Básicas</div>
                    <div className="text-xs font-normal text-zinc-500 mt-0.5">Nome, descrição e categoria do produto</div>
                  </div>
                </h2>
              </div>
              <div className="p-4 sm:p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Name */}
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-zinc-300 mb-2">
                      <Tag className="w-4 h-4 text-zinc-500" />
                      Nome do Produto *
                    </label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full px-4 py-3.5 border-2 border-zinc-800 bg-zinc-950 text-zinc-100 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all" placeholder="Ex: iPhone 15 Pro Max 256GB" />
                  </div>

                  {/* SKU */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-zinc-300 mb-2">
                      <Tag className="w-4 h-4 text-zinc-500" />
                      SKU / Código
                    </label>
                    <input type="text" value={sku} onChange={e => setSku(e.target.value)} className="w-full px-4 py-3.5 border-2 border-zinc-800 bg-zinc-950 text-zinc-100 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all" placeholder="Ex: IP15PM-256" />
                    <p className="text-xs text-zinc-500 mt-1.5 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Se deixar em branco, o sistema gera um código
                    </p>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-zinc-300 mb-2">
                      <Folder className="w-4 h-4 text-zinc-500" />
                      Categoria
                    </label>
                    <div className="flex gap-2">
                      <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="flex-1 px-4 py-3.5 border-2 border-zinc-800 bg-zinc-950 text-zinc-100 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all appearance-none pr-10 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%24%2024%22%20fill%3D%22none%22%20stroke%3D%22%2371717a%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat">
                        <option value="">Selecione uma categoria</option>
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                      <button type="button" onClick={() => setShowCategoryModal(true)} className="px-4 py-3.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-100 rounded-xl font-bold transition-all flex items-center gap-2 whitespace-nowrap">
                        <Plus className="w-5 h-5" />
                        Nova
                      </button>
                    </div>
                    <p className="text-xs text-zinc-500 mt-1.5 flex items-center gap-1">
                      <Folder className="w-3.5 h-3.5" />
                      Organizar produtos por categoria
                    </p>
                  </div>

                  {/* Short Description */}
                  <div className="md:col-span-2">
                    <div className="flex items-center justify-between mb-2">
                      <label className="flex items-center gap-2 text-sm font-bold text-zinc-300">
                        <MessageSquare className="w-4 h-4 text-zinc-500" />
                        Descrição Curta
                      </label>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${charCount <= 120 ? 'text-emerald-500' : charCount <= 160 ? 'text-amber-500' : 'text-red-500'}`}>
                          {charCount}/160
                        </span>
                        <div className="w-16 h-2 bg-zinc-800 rounded-full overflow-hidden">
                          <div className={`h-full transition-all duration-300 ${charCount <= 120 ? 'bg-emerald-500' : charCount <= 160 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${Math.min((charCount / 160) * 100, 100)}%` }}></div>
                        </div>
                      </div>
                    </div>
                    <input type="text" value={shortDescription} maxLength={160} onChange={(e) => { setShortDescription(e.target.value); setCharCount(e.target.value.length); }} className="w-full px-4 py-3.5 border-2 border-zinc-800 bg-zinc-950 text-zinc-100 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all" placeholder="Uma breve descrição chamativa do produto" />
                    <p className="text-xs text-zinc-500 mt-1.5 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Exibida nos cards de produtos
                    </p>
                  </div>

                  {/* Full Description */}
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-zinc-300 mb-2">
                      <AlignLeft className="w-4 h-4 text-zinc-500" />
                      Descrição Completa
                    </label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} rows={6} className="w-full px-4 py-3.5 border-2 border-zinc-800 bg-zinc-950 text-zinc-100 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all resize-none" placeholder="Descrição detalhada do produto, características, benefícios, especificações técnicas..."></textarea>
                  </div>

                </div>
              </div>
            </div>

            {/* Pricing & Stock */}
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-sm overflow-hidden">
              <div className="bg-zinc-950 px-4 sm:px-6 py-4 border-b border-zinc-800">
                <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center text-amber-500">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <div>Preço e Estoque</div>
                    <div className="text-xs font-normal text-zinc-500 mt-0.5">Defina preços, custos e controle de estoque</div>
                  </div>
                </h2>
              </div>
              <div className="p-4 sm:p-6 space-y-6">

                {/* Margin Calculator Alert */}
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-bold text-amber-500 text-sm mb-1">Calculadora de Margem</h4>
                      <p className="text-xs text-amber-500/80">Margem de lucro: {calculateMargin()}%</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Price */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-zinc-300 mb-2">
                      <DollarSign className="w-4 h-4 text-zinc-500" />
                      Preço de Venda *
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold text-lg">{currencySymbol || 'R$'}</span>
                      <input type="text" value={formatCurrency(priceValue)} onChange={(e) => handleCurrencyChange(e, setPriceValue as any)} required className="w-full pl-12 pr-4 py-3.5 border-2 border-zinc-800 bg-zinc-950 text-zinc-100 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-lg font-semibold" placeholder="0,00" />
                    </div>
                  </div>

                  {/* Compare Price */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-zinc-300 mb-2">
                      <Tag className="w-4 h-4 text-zinc-500" />
                      Preço Comparativo
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">{currencySymbol || 'R$'}</span>
                      <input type="text" value={compareAtPrice ? formatCurrency(compareAtPrice) : ''} onChange={(e) => handleCurrencyChange(e, ((val: any) => setCompareAtPrice(val || "")) as any)} className="w-full pl-12 pr-4 py-3.5 border-2 border-zinc-800 bg-zinc-950 text-zinc-100 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all" placeholder="0,00" />
                    </div>
                    <p className="text-xs text-zinc-500 mt-1.5 flex items-center gap-1">
                      Preço "De:" (mostra desconto)
                    </p>
                  </div>

                  {/* Cost */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-zinc-300 mb-2">
                      <BarChart2 className="w-4 h-4 text-zinc-500" />
                      Custo do Produto
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">{currencySymbol || 'R$'}</span>
                      <input type="text" value={formatCurrency(costValue)} onChange={(e) => handleCurrencyChange(e, setCostValue as any)} className="w-full pl-12 pr-4 py-3.5 border-2 border-zinc-800 bg-zinc-950 text-zinc-100 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all" placeholder="0,00" />
                    </div>
                  </div>

                  {/* Stock Quantity */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-zinc-300 mb-2">
                      <Package className="w-4 h-4 text-zinc-500" />
                      Qtd em Estoque *
                    </label>
                    <input type="number" min="0" value={stockQuantity} onChange={e => setStockQuantity(Number(e.target.value))} readOnly={hasVariationsEnabled} className="w-full px-4 py-3.5 border-2 border-zinc-800 bg-zinc-950 text-zinc-100 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-lg font-semibold read-only:opacity-50" placeholder="0" />
                  </div>

                  {/* Max per Customer */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-zinc-300 mb-2">
                      <Package className="w-4 h-4 text-zinc-500" />
                      Max por cliente
                    </label>
                    <input type="number" min="1" value={maxPerCustomer} onChange={e => setMaxPerCustomer(e.target.value)} className="w-full px-4 py-3.5 border-2 border-zinc-800 bg-zinc-950 text-zinc-100 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-lg font-semibold" placeholder="Ilimitado" />
                  </div>

                  <div className="md:col-span-3 bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h4 className="text-base font-bold text-zinc-100">Variações do Produto</h4>
                        <p className="text-xs text-zinc-500">Ex: Tamanho 37, 38, 39 com estoque separado por variação.</p>
                      </div>
                      <label className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-300 cursor-pointer">
                        <input type="checkbox" checked={hasVariationsEnabled} onChange={(e) => setHasVariationsEnabled(e.target.checked)} className="w-5 h-5 rounded border-zinc-700 bg-zinc-900 text-amber-500 focus:ring-amber-500/20" />
                        Ativar variações
                      </label>
                    </div>

                    {hasVariationsEnabled && (
                      <div className="space-y-3 pt-3 border-t border-zinc-800">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-amber-500">Estoque total: {totalVariationStock}</p>
                          <button type="button" onClick={addVariation} className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-100 rounded-lg text-sm font-semibold transition">
                            + Adicionar variação
                          </button>
                        </div>

                        {variationRows.map((variation, index) => (
                          <div key={variation.key} className="grid grid-cols-1 md:grid-cols-5 gap-3 p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                            <div className="md:col-span-2">
                              <label className="text-xs font-semibold text-zinc-400">Nome *</label>
                              <input type="text" value={variation.name} onChange={(e) => {
                                const newRows = [...variationRows];
                                newRows[index].name = e.target.value;
                                setVariationRows(newRows);
                              }} className="mt-1 w-full px-3 py-2 border-2 border-zinc-800 bg-zinc-950 rounded-lg text-zinc-100 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none" placeholder="Ex: Tamanho 42" required />
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-zinc-400">SKU (opcional)</label>
                              <input type="text" value={variation.sku} onChange={(e) => {
                                const newRows = [...variationRows];
                                newRows[index].sku = e.target.value;
                                setVariationRows(newRows);
                              }} className="mt-1 w-full px-3 py-2 border-2 border-zinc-800 bg-zinc-950 rounded-lg text-zinc-100 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none" placeholder="TENIS-42" />
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-zinc-400">Estoque *</label>
                              <input type="number" min="0" value={variation.stock_quantity} onChange={(e) => {
                                const newRows = [...variationRows];
                                newRows[index].stock_quantity = parseInt(e.target.value) || 0;
                                setVariationRows(newRows);
                              }} className="mt-1 w-full px-3 py-2 border-2 border-zinc-800 bg-zinc-950 rounded-lg text-zinc-100 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none" required />
                            </div>
                            <div className="flex gap-2 items-end">
                              <div className="flex-1">
                                <label className="text-xs font-semibold text-zinc-400">Preço (opcional) - {currencySymbol || 'R$'}</label>
                                <input type="text" value={variation.price ? formatCurrency(variation.price) : ''} onChange={(e) => {
                                  const valStr = e.target.value.replace(/\D/g, "");
                                  const valNum = valStr ? Number(valStr) / 100 : 0;
                                  const newRows = [...variationRows];
                                  newRows[index].price = valNum ? String(valNum) : "";
                                  setVariationRows(newRows);
                                }} className="mt-1 w-full px-3 py-2 border-2 border-zinc-800 bg-zinc-950 rounded-lg text-zinc-100 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none" placeholder="0,00" />
                              </div>
                              <button type="button" onClick={() => removeVariation(index)} className="px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg font-semibold h-10 border border-transparent hover:border-red-500/20">
                                Remover
                              </button>
                            </div>
                          </div>
                        ))}
                        {variationRows.length === 0 && (
                          <p className="text-sm text-zinc-500">Nenhuma variação adicionada.</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Weight */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-zinc-300 mb-2">
                      <Scale className="w-4 h-4 text-zinc-500" />
                      Peso (kg) *
                    </label>
                    <input type="text" inputMode="decimal" value={weight} onChange={e => setWeight(e.target.value as any)} required className="w-full px-4 py-3.5 border-2 border-zinc-800 bg-zinc-950 text-zinc-100 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all" placeholder="0,000" />
                  </div>

                  {/* Sort Order */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-zinc-300 mb-2">
                      <ListOrdered className="w-4 h-4 text-zinc-500" />
                      Ordem de Exibição
                    </label>
                    <input type="number" min="0" value={sortOrder} onChange={e => setSortOrder(Number(e.target.value))} className="w-full px-4 py-3.5 border-2 border-zinc-800 bg-zinc-950 text-zinc-100 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all" placeholder="0" />
                  </div>
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-sm overflow-hidden">
              <div className="bg-zinc-950 px-4 sm:px-6 py-4 border-b border-zinc-800">
                <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center text-amber-500">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div>Imagens do Produto</div>
                    <div className="text-xs font-normal text-zinc-500 mt-0.5">Adicione fotos atraentes do seu produto</div>
                  </div>
                </h2>
              </div>
              <div className="p-4 sm:p-6 space-y-6">

                {/* Main Image */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-zinc-300 mb-3">
                    <Star className="w-4 h-4 text-zinc-500" />
                    Imagem Principal
                  </label>
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    {imagePreview ? (
                      <div className="relative w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-amber-500 bg-zinc-950">
                        <img src={imagePreview} alt="Nova Imagem" className="w-full h-full object-contain" />
                        <div className="absolute inset-0 bg-black/50 flex items-end justify-center p-2">
                          <span className="text-amber-500 text-xs font-bold">Nova Imagem</span>
                        </div>
                      </div>
                    ) : (
                      <div className="relative group w-32 h-32 bg-zinc-950 border-2 border-zinc-800 rounded-2xl overflow-hidden flex-shrink-0">
                        <img src={product.mainImage} alt="Atual" className="w-full h-full object-contain" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                          <span className="text-white text-xs font-bold">Alterar</span>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex-1 space-y-2 w-full">
                      <input type="file" accept="image/*" onChange={(e) => handleUploadImage(e, true)} className="w-full px-4 py-3.5 border-2 border-zinc-800 bg-zinc-950 text-zinc-300 rounded-xl focus:ring-2 focus:ring-amber-500 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-zinc-800 file:text-zinc-100 hover:file:bg-zinc-700" />
                      <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-3">
                        <p className="text-xs text-zinc-400 flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500" />
                          <span>Dica: Use imagens de alta qualidade (1200x1200px ou maior), formato JPG ou PNG. Essa será a primeira imagem que os clientes verão!</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gallery */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-zinc-300 mb-3">
                    <ImageIcon className="w-4 h-4 text-zinc-500" />
                    Galeria de Imagens
                  </label>
                  
                  {product.galleryImages.length > 0 && (
                    <>
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <p className="text-sm font-bold text-zinc-300">Imagens atuais da galeria</p>
                        <p className="text-xs text-zinc-500">Clique para marcá-las para remoção ao salvar.</p>
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
                        {product.galleryImages.map(img => {
                          const isMarked = markedForRemoval.has(img.id);
                          return (
                            <label key={img.id} className={`relative group rounded-2xl overflow-hidden shadow-sm border-2 bg-zinc-950 cursor-pointer transition-all duration-200 ${isMarked ? 'border-red-500 ring-2 ring-red-500/20 opacity-75' : 'border-zinc-800 hover:border-zinc-700'}`}>
                              <input type="checkbox" className="sr-only" checked={isMarked} onChange={() => toggleRemoval(img.id)} />
                              <img src={img.url} alt="Gallery" className={`w-full h-28 object-contain ${isMarked ? 'grayscale' : ''}`} />
                              <div className={`p-2 text-xs font-bold text-center ${isMarked ? 'text-red-400 bg-red-500/10' : 'text-zinc-400 bg-zinc-900'}`}>
                                {isMarked ? 'Será removida' : 'Marcar p/ remover'}
                              </div>
                              {isMarked && (
                                <div className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-zinc-950">
                                  <X className="w-4 h-4" />
                                </div>
                              )}
                            </label>
                          );
                        })}
                      </div>
                    </>
                  )}

                  <input type="file" multiple accept="image/*" onChange={(e) => handleUploadImage(e, false)} className="w-full px-4 py-3.5 border-2 border-zinc-800 bg-zinc-950 text-zinc-300 rounded-xl focus:ring-2 focus:ring-amber-500 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-zinc-800 file:text-zinc-100 hover:file:bg-zinc-700" />
                  
                  {galleryPreviews.length > 0 && (
                    <div className="mt-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <p className="text-sm font-bold text-amber-500">Novas imagens selecionadas</p>
                        <p className="text-xs text-amber-500/70">Selecionadas: {galleryPreviews.length}</p>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                        {galleryPreviews.map((preview, i) => (
                          <div key={i} className="rounded-2xl overflow-hidden bg-zinc-950 border border-amber-500/30">
                            <img src={preview.url} alt={preview.name} className="w-full h-28 object-contain" />
                            <div className="p-2 text-xs text-zinc-400 truncate">{preview.name}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Options */}
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-sm overflow-hidden">
              <div className="bg-zinc-950 px-4 sm:px-6 py-4 border-b border-zinc-800">
                <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center text-amber-500">
                    <Settings className="w-5 h-5" />
                  </div>
                  <div>
                    <div>Configurações do Produto</div>
                    <div className="text-xs font-normal text-zinc-500 mt-0.5">Ative os recursos que deseja para este produto</div>
                  </div>
                </h2>
              </div>
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="group relative flex items-start gap-4 cursor-pointer p-5 border-2 border-zinc-800 bg-zinc-950 rounded-2xl hover:border-emerald-500/50 hover:shadow-lg transition-all duration-200 has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-500/5">
                    <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="mt-1 w-6 h-6 text-emerald-500 bg-zinc-900 border-zinc-700 rounded-lg focus:ring-emerald-500 focus:ring-2 transition-all" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 font-bold text-zinc-100">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        Produto Ativo
                      </div>
                      <p className="text-sm text-zinc-500 mt-1">Produto visível e disponível para compra na loja virtual</p>
                    </div>
                  </label>

                  <label className="group relative flex items-start gap-4 cursor-pointer p-5 border-2 border-zinc-800 bg-zinc-950 rounded-2xl hover:border-amber-500/50 hover:shadow-lg transition-all duration-200 has-[:checked]:border-amber-500 has-[:checked]:bg-amber-500/5">
                    <input type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} className="mt-1 w-6 h-6 text-amber-500 bg-zinc-900 border-zinc-700 rounded-lg focus:ring-amber-500 focus:ring-2 transition-all" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 font-bold text-zinc-100">
                        <Star className="w-5 h-5 text-amber-500" />
                        Produto Destaque
                      </div>
                      <p className="text-sm text-zinc-500 mt-1">Exibir na seção de destaques da página inicial</p>
                    </div>
                  </label>

                  <label className="group relative flex items-start gap-4 cursor-pointer p-5 border-2 border-zinc-800 bg-zinc-950 rounded-2xl hover:border-blue-500/50 hover:shadow-lg transition-all duration-200 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-500/5">
                    <input type="checkbox" checked={trackStock} onChange={e => setTrackStock(e.target.checked)} className="mt-1 w-6 h-6 text-blue-500 bg-zinc-900 border-zinc-700 rounded-lg focus:ring-blue-500 focus:ring-2 transition-all" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 font-bold text-zinc-100">
                        <BarChart2 className="w-5 h-5 text-blue-500" />
                        Controlar Estoque
                      </div>
                      <p className="text-sm text-zinc-500 mt-1">Decrementar automaticamente o estoque a cada venda</p>
                    </div>
                  </label>

                  <label className="group relative flex items-start gap-4 cursor-pointer p-5 border-2 border-zinc-800 bg-zinc-950 rounded-2xl hover:border-purple-500/50 hover:shadow-lg transition-all duration-200 has-[:checked]:border-purple-500 has-[:checked]:bg-purple-500/5">
                    <input type="checkbox" checked={allowBackorders} onChange={e => setAllowBackorders(e.target.checked)} className="mt-1 w-6 h-6 text-purple-500 bg-zinc-900 border-zinc-700 rounded-lg focus:ring-purple-500 focus:ring-2 transition-all" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 font-bold text-zinc-100">
                        <RefreshCw className="w-5 h-5 text-purple-500" />
                        Permitir Pré-venda
                      </div>
                      <p className="text-sm text-zinc-500 mt-1">Aceitar pedidos mesmo quando o estoque estiver zerado</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Actions Sticky Footer */}
            <div className="sticky bottom-6 z-10">
              <div className="bg-zinc-900/90 backdrop-blur-xl rounded-2xl border border-zinc-800 shadow-2xl p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500 shrink-0">
                      <Save className="w-6 h-6" />
                    </div>
                    <div className="text-center sm:text-left">
                      <div className="font-bold text-zinc-100">Pronto para publicar?</div>
                      <div className="text-sm text-zinc-400">Revise as informações e salve</div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                    <Link href={`/admin/store/products`} className="w-full sm:w-auto text-center justify-center px-6 py-3.5 text-zinc-300 bg-zinc-800 border border-zinc-700 rounded-xl font-bold hover:bg-zinc-700 transition-all duration-200 flex items-center gap-2">
                      <X className="w-5 h-5" />
                      Cancelar
                    </Link>
                    <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto justify-center px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-zinc-950 rounded-xl font-bold transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-amber-500/20 disabled:opacity-70 disabled:cursor-not-allowed">
                      {isSubmitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Save className="w-5 h-5" />
                      )}
                      {isSubmitting ? "Salvando..." : "Salvar Alterações"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
          </form>

        </div>
      </div>

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm" onClick={() => setShowCategoryModal(false)}></div>
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95">
            <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
              <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                <Folder className="w-5 h-5 text-amber-500" />
                Nova Categoria
              </h3>
              <button onClick={() => setShowCategoryModal(false)} className="text-zinc-500 hover:text-zinc-300 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-zinc-300 mb-2">Nome da Categoria *</label>
                <input type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleCreateCategory()} className="w-full px-4 py-3.5 border-2 border-zinc-800 bg-zinc-950 text-zinc-100 rounded-xl focus:ring-2 focus:ring-amber-500 transition-all" placeholder="Ex: Eletrônicos, Roupas..." autoFocus />
                <p className="text-xs text-zinc-500 mt-1.5 flex items-center gap-1">
                  Pressione Enter para criar rapidamente
                </p>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                <p className="text-xs text-amber-500/80 flex items-start gap-2">
                  A categoria será criada e automaticamente selecionada neste produto.
                </p>
              </div>
            </div>
            <div className="bg-zinc-950 px-6 py-4 flex items-center justify-end gap-3 border-t border-zinc-800">
              <button onClick={() => setShowCategoryModal(false)} className="px-5 py-2.5 text-zinc-400 font-bold hover:text-zinc-200 transition">
                Cancelar
              </button>
              <button onClick={handleCreateCategory} disabled={!newCategoryName.trim() || isCreatingCategory} className="px-6 py-2.5 bg-amber-500 text-zinc-950 rounded-xl font-bold transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                {isCreatingCategory ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                {isCreatingCategory ? 'Criando...' : 'Criar Categoria'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
