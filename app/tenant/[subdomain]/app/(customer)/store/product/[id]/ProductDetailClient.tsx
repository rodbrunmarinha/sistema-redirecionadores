"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ChevronRight, Package, Heart, ShoppingCart, 
  Minus, Plus, ShieldCheck, MapPin, CreditCard, Headphones, 
  MessageSquare, X 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useCart } from '@/utils/store/useCart';
import { useTenantSettings } from '../../../components/TenantSettingsContext';

export default function ProductDetailClient({ 
  tenant, 
  subdomain, 
  product,
  images
}: { 
  tenant: any, 
  subdomain: string, 
  product: any,
  images: any[]
}) {
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');
  const [quantity, setQuantity] = useState(1);
  const [cartOpen, setCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  const { settings } = useTenantSettings();
  const currency = settings?.operations?.currency || 'USD';
  
  const addItem = useCart(state => state.addItem);
  const cartCount = useCart(state => state.getTotalItems());
  const cartItems = useCart(state => state.items);
  const cartTotal = useCart(state => state.getSubtotal());

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Default main image
  const [mainImage, setMainImage] = useState(product.main_image || null);
  
  // Create an array with main image at pos 0 and rest from `images`
  const allImages = product.main_image 
    ? [{ id: 'main', image_url: product.main_image }, ...images] 
    : images;

  const currentImageIndex = allImages.findIndex(img => img.image_url === mainImage);
  const imageIndexDisplay = currentImageIndex !== -1 ? currentImageIndex + 1 : 1;

  const handleDecreaseQty = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  const handleIncreaseQty = () => {
    if (quantity < (product.max_per_customer || product.stock_quantity || 99)) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleAddToCart = (e: React.FormEvent) => {
    e.preventDefault();
    if (product.stock_quantity === 0) return;
    
    addItem({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      quantity: quantity,
      image_url: product.main_image || ''
    });
    
    toast.success('Produto adicionado ao carrinho!');
    setCartOpen(true);
  };

  if (!isMounted) return null;

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden relative">
      
      {/* Header (Simplified for Product Page) */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <Link href={`/app/store`} className="flex items-center gap-2.5 shrink-0 min-w-0 group">
              <span className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 bg-gradient-to-br from-amber-600 to-amber-500 group-hover:scale-105 transition-transform">
                <Package className="w-5 h-5" />
              </span>
              <span className="font-bold text-zinc-900 dark:text-white truncate">
                {tenant.organization_name}
              </span>
            </Link>

            <div className="flex items-center gap-2">
              <Link href={`/app/store`} className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-500 hidden sm:block mr-2 transition">
                Voltar para loja
              </Link>
              <button onClick={() => setCartOpen(true)} className="relative p-2.5 rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold text-white flex items-center justify-center bg-gradient-to-r from-amber-600 to-amber-500">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="border-b border-amber-500/20 bg-gradient-to-r from-amber-600 to-amber-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-white/80">
            <Link href={`/app/store`} className="hover:text-white transition-opacity">Loja</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="truncate text-white font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* Left: Product Gallery */}
          <div>
            <div className="relative rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 mb-4 bg-white dark:bg-zinc-900 shadow-sm">
              {/* Main Image */}
              <div className="aspect-square relative flex items-center justify-center bg-zinc-50 dark:bg-zinc-900">
                {mainImage ? (
                  <img src={mainImage} alt={product.name} className="w-full h-full object-contain" />
                ) : (
                  <Package className="w-24 h-24 text-zinc-300 dark:text-zinc-700" />
                )}
                
                {allImages.length > 0 && (
                  <div className="absolute bottom-4 right-4 px-3 py-1.5 text-xs font-semibold rounded-full bg-black/60 text-white backdrop-blur-sm border border-white/20">
                    {imageIndexDisplay} / {allImages.length}
                  </div>
                )}
              </div>
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className="px-2 py-1 text-xs font-bold text-zinc-900 bg-amber-500 rounded-lg shadow-sm">Novo</span>
              </div>

              {/* Stock Status */}
              {product.stock_quantity > 0 && product.stock_quantity <= 5 && (
                <span className="absolute top-4 right-4 bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow">
                  Últimas {product.stock_quantity} unidades!
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {allImages.map((img, idx) => (
                  <button 
                    key={idx}
                    type="button" 
                    onClick={() => setMainImage(img.image_url)}
                    className={`aspect-square bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border-2 transition-all ${
                      mainImage === img.image_url 
                        ? 'border-amber-500 ring-2 ring-amber-500/20' 
                        : 'border-zinc-200 dark:border-zinc-800 hover:border-amber-300'
                    }`}
                  >
                    <img src={img.image_url} alt={`Thumb ${idx + 1}`} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white mb-4">
              {product.name}
            </h1>

            <div className="mb-6">
              <span className="text-3xl sm:text-4xl font-extrabold text-amber-500">
                {currency} {Number(product.price).toFixed(2)}
              </span>
            </div>

            <p className="text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
              {product.short_description || product.name}
            </p>
            
            {/* Add to Cart Form */}
            <form onSubmit={handleAddToCart} className="mb-8">
              
              <div className="flex items-center gap-4 mb-6">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Quantidade:</label>
                <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700">
                  <button type="button" onClick={handleDecreaseQty} className="w-10 h-10 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-amber-600 transition">
                    <Minus className="w-4 h-4" />
                  </button>
                  <input 
                    type="number" 
                    value={quantity}
                    readOnly
                    className="w-12 text-center bg-transparent border-0 focus:ring-0 font-bold text-zinc-900 dark:text-white"
                  />
                  <button type="button" onClick={handleIncreaseQty} className="w-10 h-10 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-amber-600 transition">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {product.stock_quantity > 0 && (
                  <span className="text-sm text-zinc-500 font-medium">{product.stock_quantity} disponíveis</span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  type="submit" 
                  disabled={product.stock_quantity === 0}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 text-zinc-950 rounded-xl font-bold text-lg transition disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl hover:scale-105 bg-gradient-to-r from-amber-500 to-amber-600"
                >
                  <ShoppingCart className="w-6 h-6" />
                  {product.stock_quantity === 0 ? 'Esgotado' : 'Adicionar ao Carrinho'}
                </button>
              </div>
            </form>

            {/* Product Features Grid */}
            <div className="grid grid-cols-2 gap-4 pb-8 border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                <span className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">Garantia de qualidade</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/30">
                <MapPin className="w-6 h-6 text-blue-600" />
                <span className="text-sm text-blue-700 dark:text-blue-400 font-medium">Direto pra Suíte</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
                <CreditCard className="w-6 h-6 text-indigo-600" />
                <span className="text-sm text-indigo-700 dark:text-indigo-400 font-medium">Pagamento seguro</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-900/30">
                <Headphones className="w-6 h-6 text-amber-600" />
                <span className="text-sm text-amber-700 dark:text-amber-400 font-medium">Suporte dedicado</span>
              </div>
            </div>

            {/* SKU & Category */}
            <div className="pt-6 text-sm text-zinc-500 dark:text-zinc-400 space-y-1">
              <p><span className="font-medium text-zinc-700 dark:text-zinc-300">SKU:</span> {product.sku || 'N/A'}</p>
              <p><span className="font-medium text-zinc-700 dark:text-zinc-300">Categoria:</span> {product.store_categories?.name || 'N/A'}</p>
            </div>

            {/* Warning Message */}
            <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/30 rounded-xl text-xs text-orange-800 dark:text-orange-300 space-y-1">
              <p className="flex items-start gap-1.5 font-bold">
                <Package className="w-4 h-4 mt-0.5 shrink-0" />
                O frete internacional e o imposto de importação não estão inclusos.
              </p>
              <p className="flex items-start gap-1.5 pl-5">O frete será calculado por peso ao solicitar o envio, e o imposto conforme o valor declarado.</p>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="mt-16">
          <div className="border-b border-zinc-200 dark:border-zinc-800">
            <nav className="flex gap-8">
              <button 
                onClick={() => setActiveTab('description')} 
                className={`pb-4 text-sm font-bold border-b-2 transition ${
                  activeTab === 'description' 
                    ? 'border-amber-500 text-amber-600 dark:text-amber-500' 
                    : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                }`}
              >
                Descrição
              </button>
              <button 
                onClick={() => setActiveTab('reviews')} 
                className={`pb-4 text-sm font-bold border-b-2 transition ${
                  activeTab === 'reviews' 
                    ? 'border-amber-500 text-amber-600 dark:text-amber-500' 
                    : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                }`}
              >
                Avaliações (0)
              </button>
            </nav>
          </div>

          <div className="py-8 min-h-[200px]">
            {activeTab === 'description' && (
              <div className="prose dark:prose-invert max-w-none text-zinc-700 dark:text-zinc-300">
                {product.full_description ? (
                  <div dangerouslySetInnerHTML={{ __html: product.full_description }} />
                ) : (
                  <p>Nenhuma descrição detalhada fornecida.</p>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                <MessageSquare className="w-16 h-16 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-1">Nenhuma avaliação ainda.</h3>
                <p className="text-zinc-500">Seja o primeiro a avaliar este produto!</p>
                <p className="mt-6 text-sm text-zinc-400">Somente clientes que compraram este produto podem avaliar.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Cart Button */}
      <button onClick={() => setCartOpen(true)} className="fixed bottom-6 right-6 z-50 group">
        <div className="relative">
          <div className="absolute inset-0 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition bg-gradient-to-r from-amber-600 to-amber-500"></div>
          <div className="relative flex items-center gap-3 pl-5 pr-6 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all group-hover:scale-105 bg-gradient-to-r from-amber-600 to-amber-500 text-zinc-950">
            <ShoppingCart className="w-6 h-6" />
            <span className="font-bold">{cartCount}</span>
          </div>
        </div>
      </button>

      {/* Mini Cart Drawer (Overlay + Panel) */}
      {cartOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] transition-opacity" 
            onClick={() => setCartOpen(false)}
          ></div>
          
          <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-zinc-900 shadow-2xl z-[71] flex flex-col border-l border-zinc-200 dark:border-zinc-800 animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl flex items-center justify-center text-zinc-950 bg-gradient-to-r from-amber-500 to-amber-600">
                  <ShoppingCart className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-zinc-900 dark:text-white">Seu carrinho</h3>
                  <p className="text-xs text-zinc-500">{cartCount} item(ns)</p>
                </div>
              </div>
              <button onClick={() => setCartOpen(false)} className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 custom-scrollbar">
              {cartItems.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingCart className="w-14 h-14 text-zinc-200 dark:text-zinc-700 mx-auto mb-3" />
                  <p className="text-zinc-400">Seu carrinho está vazio.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                      <div className="w-16 h-16 rounded-xl bg-zinc-50 dark:bg-zinc-800 overflow-hidden shrink-0 flex items-center justify-center">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.name} className="w-full h-full object-contain" />
                        ) : (
                          <Package className="w-6 h-6 text-zinc-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">{item.name}</p>
                        <p className="text-xs text-zinc-500 mt-1">{item.quantity} × {currency} {Number(item.price).toFixed(2)}</p>
                      </div>
                      <p className="text-sm font-bold text-amber-500 shrink-0">
                        {currency} {(Number(item.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="border-t border-zinc-100 dark:border-zinc-800 px-5 py-4 space-y-4 bg-white dark:bg-zinc-900">
                <div className="flex justify-between font-bold text-zinc-900 dark:text-white text-lg">
                  <span>Total</span>
                  <span className="text-amber-500">{currency} {cartTotal.toFixed(2)}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link href={`/app/store/cart`} className="px-4 py-3 text-center rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-sm font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition">
                    Ver carrinho
                  </Link>
                  <Link href={`/app/store/checkout`} className="px-4 py-3 text-center rounded-xl text-zinc-950 text-sm font-bold transition hover:opacity-90 bg-gradient-to-r from-amber-500 to-amber-600">
                    Finalizar
                  </Link>
                </div>
                <button onClick={() => setCartOpen(false)} className="w-full text-center text-xs text-zinc-400 hover:text-zinc-600 transition">
                  Continuar comprando
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Footer */}
      <footer className="mt-auto bg-zinc-900 text-zinc-400 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Package className="w-6 h-6 text-amber-500" />
              <span className="font-bold text-white text-xl">{tenant.organization_name}</span>
            </div>
            <p className="text-sm">© {new Date().getFullYear()} {tenant.organization_name}. Todos os direitos reservados.</p>
            <p className="text-xs flex items-center gap-1">
              Powered by <span className="text-amber-500 font-bold">DockDrop</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
