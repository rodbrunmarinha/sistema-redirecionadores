"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShoppingCart, ChevronRight, Package, Trash2, 
  Minus, Plus, Tag, ArrowRight, X, AlertTriangle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useCart } from '@/utils/store/useCart';

export default function CartClient({ 
  tenant, 
  subdomain 
}: { 
  tenant: any, 
  subdomain: string 
}) {
  const items = useCart(state => state.items);
  const removeItem = useCart(state => state.removeItem);
  const updateQuantity = useCart(state => state.updateQuantity);
  const subtotal = useCart(state => state.getSubtotal());

  const [isMounted, setIsMounted] = useState(false);
  
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const total = subtotal - discount;

  const handleUpdateQuantity = (id: string, delta: number) => {
    const item = items.find(i => i.id === id);
    if (item) {
      updateQuantity(id, item.quantity + delta);
    }
  };

  const handleRemoveItem = () => {
    if (itemToRemove) {
      removeItem(itemToRemove);
      setItemToRemove(null);
      toast.success('Item removido do carrinho');
    }
  };

  if (!isMounted) return null;

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'DESCONTO10') {
      setDiscount(subtotal * 0.1);
      toast.success('Cupom aplicado!');
    } else {
      toast.error('Cupom inválido ou expirado.');
      setDiscount(0);
    }
  };

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden relative">
      
      {/* Header Moderno com Gradient */}
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-600 to-amber-500">
        <div className="absolute inset-0 bg-black/10"></div>
        {/* Subtle Pattern */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-6 text-white/80">
            <Link href={`/app/store`} className="hover:text-white transition flex items-center gap-1">
              Loja
            </Link>
            <ChevronRight className="w-4 h-4 text-white/60" />
            <span className="text-white font-medium">Carrinho</span>
          </nav>

          {/* Título */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white/20 backdrop-blur-md border border-white/20 shadow-inner">
              <ShoppingCart className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white drop-shadow-md">Carrinho de Compras</h1>
              <p className="text-amber-100 mt-1 font-medium">{items.length} {items.length === 1 ? 'item' : 'itens'} no carrinho</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 min-h-[60vh]">
        
        {items.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-12 h-12 text-zinc-300 dark:text-zinc-600" />
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Seu carrinho está vazio</h2>
            <p className="text-zinc-500 dark:text-zinc-400 mb-8">Navegue pela loja e adicione produtos incríveis ao seu carrinho!</p>
            <Link href={`/app/store`} className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg">
              Explorar Loja
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map(item => (
                <div key={item.id} className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-4 sm:p-6 hover:shadow-md transition-all">
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    
                    {/* Product Image */}
                    <Link href={`/app/store/product/${item.id}`} className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 bg-zinc-100 dark:bg-zinc-800 rounded-xl overflow-hidden flex items-center justify-center group">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                      ) : (
                        <Package className="w-8 h-8 text-zinc-400 group-hover:scale-110 transition-transform duration-300" />
                      )}
                    </Link>
                    
                    {/* Product Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <Link href={`/app/store/product/${item.id}`} className="font-bold text-lg text-zinc-900 dark:text-white hover:text-amber-500 transition line-clamp-2">
                            {item.name}
                          </Link>
                        </div>
                        <button onClick={() => setItemToRemove(item.id)} className="flex-shrink-0 p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="mt-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                        {/* Quantity */}
                        <div>
                          <label className="text-xs font-medium text-zinc-500 mb-1.5 block">Quantidade</label>
                          <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
                            <button type="button" onClick={() => handleUpdateQuantity(item.id, -1)} className="w-10 h-10 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-amber-500 transition">
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-12 text-center font-bold text-zinc-900 dark:text-white">
                              {item.quantity}
                            </span>
                            <button type="button" onClick={() => handleUpdateQuantity(item.id, 1)} className="w-10 h-10 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-amber-500 transition">
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="text-left sm:text-right">
                          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">
                            ¥{item.price.toFixed(2)} cada
                          </p>
                          <p className="text-xl font-extrabold text-amber-500">
                            ¥{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Continue Shopping */}
              <Link href={`/app/store`} className="inline-flex items-center gap-2 font-bold mt-6 text-zinc-600 dark:text-zinc-400 hover:text-amber-500 dark:hover:text-amber-500 transition">
                <ArrowRight className="w-5 h-5 rotate-180" />
                Continuar Comprando
              </Link>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-6 lg:p-8 sticky top-32">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg">
                    <ShoppingCart className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Resumo do Pedido</h2>
                </div>
                
                {/* Coupon */}
                <div className="mb-8">
                  <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-zinc-400" />
                    Cupom de desconto
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Ex: DESCONTO10" 
                      className="flex-1 px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition text-sm font-medium uppercase" 
                    />
                    <button 
                      type="button" 
                      onClick={handleApplyCoupon}
                      className="px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-bold transition shadow-md hover:shadow-lg active:scale-95"
                    >
                      Aplicar
                    </button>
                  </div>
                </div>

                {/* Totals */}
                <div className="space-y-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400 font-medium">
                    <span>Subtotal</span>
                    <span className="text-zinc-900 dark:text-white">¥{subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span>Desconto (Cupom)</span>
                      <span>- ¥{discount.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center py-6">
                  <span className="text-lg font-bold text-zinc-900 dark:text-white">Total</span>
                  <span className="text-3xl font-extrabold text-amber-500">
                    ¥{total.toFixed(2)}
                  </span>
                </div>

                {/* Checkout Button */}
                <Link href={`/app/store/checkout`} className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 text-zinc-950 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl font-bold text-lg transition shadow-xl hover:shadow-2xl hover:scale-[1.02]">
                  Finalizar Compra
                  <ArrowRight className="w-6 h-6" />
                </Link>

                {/* Info Text */}
                <p className="mt-4 text-xs text-center text-zinc-500 dark:text-zinc-500 font-medium">
                  Taxas de envio e impostos serão calculados na próxima etapa, se aplicável.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Confirmação */}
      {itemToRemove && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl max-w-md w-full border border-zinc-200 dark:border-zinc-800 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
            <div className="p-8 text-center">
              <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-500">
                <AlertTriangle className="w-10 h-10" />
              </div>
              
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">Remover Item?</h3>
              <p className="text-zinc-500 dark:text-zinc-400 mb-8 text-lg">Tem certeza que deseja remover este produto do seu carrinho?</p>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setItemToRemove(null)} 
                  className="flex-1 px-6 py-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xl font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleRemoveItem} 
                  className="flex-1 px-6 py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition shadow-lg hover:shadow-red-500/25"
                >
                  Sim, Remover
                </button>
              </div>
            </div>
          </div>
        </div>
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
