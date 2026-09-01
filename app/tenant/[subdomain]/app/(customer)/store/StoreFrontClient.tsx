"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, Heart, ShoppingCart, User, X, Plus, Check, ChevronRight, Package, LayoutGrid
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useCart } from '@/utils/store/useCart';

export default function StoreFrontClient({ 
  tenant, 
  subdomain, 
  categories, 
  products 
}: { 
  tenant: any, 
  subdomain: string, 
  categories: any[], 
  products: any[] 
}) {
  const [search, setSearch] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  
  const addItem = useCart(state => state.addItem);
  const cartCount = useCart(state => state.getTotalItems());
  const cartItems = useCart(state => state.items);
  const cartTotal = useCart(state => state.getSubtotal());

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock_quantity === 0) return;
    
    addItem({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      quantity: 1,
      image_url: product.main_image || ''
    });
    
    toast.success('Produto adicionado ao carrinho!');
    setCartOpen(true);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast.success('Adicionado aos favoritos!');
  };

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden relative">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 sm:gap-5 py-3">
            
            <Link href={`/app/store`} className="flex items-center gap-2.5 shrink-0 min-w-0">
              <span className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 bg-gradient-to-br from-amber-600 to-amber-500">
                <Package className="w-5 h-5" />
              </span>
              <span className="font-bold text-zinc-900 dark:text-white truncate hidden sm:block">
                {tenant.organization_name}
              </span>
            </Link>

            <form className="hidden md:block flex-1 max-w-xl mx-auto relative">
              <input 
                type="text" 
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar produtos..." 
                className="w-full pl-11 pr-4 py-2.5 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-transparent text-sm text-zinc-900 dark:text-white focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition outline-none" 
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            </form>

            <div className="flex items-center gap-1 sm:gap-2 ml-auto shrink-0">
              <button onClick={handleWishlist} className="p-2.5 rounded-xl text-zinc-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition">
                <Heart className="w-5 h-5" />
              </button>
              <button onClick={() => setCartOpen(true)} className="relative p-2.5 rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">
                <ShoppingCart className="w-5 h-5" />
                {isMounted && cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold text-white flex items-center justify-center bg-gradient-to-r from-amber-600 to-amber-500">
                    {cartCount}
                  </span>
                )}
              </button>
              <Link href={`/app/dashboard`} className="p-2.5 rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">
                <User className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Mobile Search */}
          <form className="md:hidden pb-3">
            <div className="relative">
              <input 
                type="text" 
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar produtos..." 
                className="w-full pl-11 pr-4 py-2.5 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-transparent text-sm text-zinc-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none" 
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            </div>
          </form>
        </div>

        {/* Categories Nav */}
        <nav className="border-t border-zinc-100 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto scrollbar-none py-1.5">
            <Link href={`/app/store`} className="shrink-0 px-3.5 py-1.5 rounded-full text-sm font-semibold transition text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800">
              Todos os produtos
            </Link>
            {categories.map(cat => (
              <Link key={cat.id} href={`/app/store/category/${cat.id}`} className="shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                {cat.name}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-orange-500/5 to-yellow-500/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 bg-amber-500/10 text-amber-600 dark:text-amber-500">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                Loja Online
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-zinc-900 dark:text-white mb-6 leading-tight">
                Encontre os{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-amber-400">
                  melhores produtos
                </span>
              </h1>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
                Navegue por nossa coleção cuidadosamente selecionada de produtos com os melhores preços e entrega rápida para sua suíte.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="inline-flex items-center justify-center gap-2 px-8 py-4 text-white rounded-xl font-semibold transition shadow-xl hover:shadow-2xl hover:scale-105 group bg-gradient-to-r from-amber-600 to-amber-500">
                  Ver Todos os Produtos
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
            
            {/* Hero Image Illustration */}
            <div className="hidden lg:flex justify-center relative">
              <div className="absolute inset-0 rounded-3xl blur-3xl bg-gradient-to-br from-amber-500/20 to-orange-500/20"></div>
              <div className="relative w-72 h-72 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center shadow-2xl animate-bounce" style={{animationDuration: '3s'}}>
                <Package className="w-32 h-32 text-white opacity-90" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">🆕 Novidades</h2>
            <p className="text-zinc-600 dark:text-zinc-400 mt-2">Produtos recém adicionados</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {products.map(product => (
            <div key={product.id} className="group bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-zinc-200 dark:border-zinc-800 hover:-translate-y-0.5 flex flex-col">
              {/* Image */}
              <Link href={`/app/store/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                {product.main_image ? (
                  <img src={product.main_image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-12 h-12 text-zinc-300 dark:text-zinc-700" />
                  </div>
                )}

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  <span className="px-2 py-1 text-xs font-bold text-zinc-900 bg-amber-500 rounded-lg shadow-sm">
                    Novo
                  </span>
                  {product.stock_quantity > 0 && product.stock_quantity <= 5 && (
                    <span className="px-2 py-1 text-xs font-bold text-white bg-orange-500 rounded-lg shadow-sm">
                      Últimas unidades
                    </span>
                  )}
                </div>

                {/* Wishlist btn */}
                <button 
                  onClick={handleWishlist}
                  className="absolute top-2 right-2 w-9 h-9 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm shadow-md flex items-center justify-center text-zinc-400 hover:text-red-500 hover:scale-110 transition-all"
                >
                  <Heart className="w-5 h-5" />
                </button>
                
                {/* Quick Add */}
                <button 
                  onClick={(e) => handleAddToCart(e, product)}
                  className="absolute bottom-0 left-0 right-0 text-zinc-950 py-3 font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg bg-gradient-to-r from-amber-500 to-amber-600"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Adicionar
                </button>
              </Link>

              {/* Content */}
              <div className="p-4 flex flex-col flex-grow">
                <Link href={`/app/store/product/${product.id}`} className="flex-grow">
                  <h3 className="font-semibold text-zinc-900 dark:text-white transition line-clamp-2 text-sm sm:text-base group-hover:text-amber-500">
                    {product.name}
                  </h3>
                </Link>

                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-lg sm:text-xl font-bold text-amber-500">
                    ¥{Number(product.price).toFixed(2)}
                  </span>
                </div>

                {product.stock_quantity > 0 && product.stock_quantity <= 5 && (
                  <p className="text-xs mt-2 text-orange-500 font-medium">
                    Restam apenas {product.stock_quantity}
                  </p>
                )}
                {product.stock_quantity === 0 && (
                  <p className="text-xs mt-2 text-red-500 font-medium">
                    Esgotado
                  </p>
                )}
              </div>
            </div>
          ))}

          {products.length === 0 && (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl">
              <Package className="w-16 h-16 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Nenhum produto cadastrado</h3>
              <p className="text-zinc-500">A loja ainda está sendo configurada.</p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Cart Button */}
      {isMounted && cartCount > 0 && (
        <button onClick={() => setCartOpen(true)} className="fixed bottom-6 right-6 z-50 group">
          <div className="relative">
            <div className="absolute inset-0 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition bg-gradient-to-r from-amber-600 to-amber-500"></div>
            <div className="relative flex items-center gap-3 pl-5 pr-6 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all group-hover:scale-105 bg-gradient-to-r from-amber-600 to-amber-500 text-zinc-950">
              <ShoppingCart className="w-6 h-6" />
              <span className="font-bold">{cartCount}</span>
            </div>
          </div>
        </button>
      )}

      {/* Footer */}
      <footer className="mt-16 bg-zinc-900 text-zinc-400 border-t border-zinc-800">
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
                            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-6 h-6 text-zinc-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">{item.name}</p>
                          <p className="text-xs text-zinc-500 mt-1">{item.quantity} × ${Number(item.price).toFixed(2)}</p>
                        </div>
                        <p className="text-sm font-bold text-amber-500 shrink-0">
                          ${(Number(item.price) * item.quantity).toFixed(2)}
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
                    <span className="text-amber-500">${cartTotal.toFixed(2)}</span>
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
    </div>
  );
}
