"use client";

import React, { useState, useTransition, useEffect } from 'react';
import Link from 'next/link';
import { 
  ChevronRight, Package, Wallet, CreditCard, ShieldCheck, 
  Check, Info, FileText, Ticket
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { checkoutStoreCart, validateCoupon } from './_actions/checkout';
import { useCart } from '@/utils/store/useCart';

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
};

import { createClient } from '@/utils/supabase/client';

export default function CheckoutClient({ 
  tenant, 
  subdomain,
  currency 
}: { 
  tenant: any, 
  subdomain: string,
  currency: string 
}) {
  const router = useRouter();
  
  // Zustand Cart
  const cartItems = useCart(state => state.items);
  const clearCart = useCart(state => state.clearCart);
  const subtotal = useCart(state => state.getSubtotal());
  
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [isPending, startTransition] = useTransition();
  const [couponCode, setCouponCode] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{code: string, discount: number} | null>(null);

  // Handle client-side hydration issues with persist
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Fetch real wallet balance
    const fetchWallet = async () => {
      try {
        const supabase = createClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) throw userError;
        if (!user) throw new Error('No user found');

        const { data: wallet, error: dbError } = await supabase
          .from('wallets')
          .select('balance')
          .eq('tenant_id', tenant.id)
          .eq('customer_id', user.id)
          .maybeSingle();
        
        if (dbError) throw dbError;

        if (wallet) {
          setWalletBalance(wallet.balance);
        } else {
          // It's possible the user's wallet wasn't created yet if the trigger failed
          setWalletBalance(0);
          setWalletError("Sua carteira não foi encontrada no banco de dados.");
        }
      } catch (err: any) {
        console.error("Erro ao buscar a carteira do cliente:", err);
        setWalletError(err.message || "Erro desconhecido ao buscar carteira");
        // Fallback to prevent breaking the UI entirely
        setWalletBalance(0);
      }
    };
    
    fetchWallet();
  }, [tenant.id]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(value);
  };

  const total = Math.max(0, subtotal - (appliedCoupon?.discount || 0));

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    setIsApplyingCoupon(true);
    try {
      const res = await validateCoupon(subdomain, couponCode, subtotal);
      if (res.success && res.discount !== undefined) {
        setAppliedCoupon({ code: res.code, discount: res.discount });
        toast.success(`Cupom aplicado! Desconto de ${formatCurrency(res.discount)}`);
      } else {
        setAppliedCoupon(null);
        toast.error(res.error || 'Cupom inválido.');
      }
    } catch (err) {
      setAppliedCoupon(null);
      toast.error('Erro ao validar cupom.');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    toast.success('Cupom removido.');
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (walletBalance === null || (walletBalance ?? 0) < total) {
      toast.error('Saldo insuficiente na carteira.');
      return;
    }
    
    startTransition(async () => {
      const payload = {
        items: cartItems.map(item => ({ product_id: item.id, quantity: item.quantity })),
        notes: notes,
        coupon_code: appliedCoupon?.code
      };
      
      const res = await checkoutStoreCart(subdomain, payload);
      
      if (res.success) {
        toast.success('Pedido confirmado! Itens adicionados à sua Suíte.');
        clearCart(); // Real clear!
        setWalletBalance(res.newBalance);
        setTimeout(() => {
          router.push(`/app/store/orders/${res.orderId}`);
        }, 1500);
      } else {
        toast.error(res.error || 'Erro ao processar pedido.');
      }
    });
  };

  if (!isMounted) return null;

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden relative">
      
      {/* Header */}
      <div className="border-b border-amber-500/20 bg-gradient-to-r from-amber-600 to-amber-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <nav className="flex items-center gap-2 text-sm mb-2 text-white/80">
            <Link href={`/app/store`} className="hover:text-white transition">Loja</Link>
            <ChevronRight className="w-4 h-4 text-white/60" />
            <Link href={`/app/store/cart`} className="hover:text-white transition">Carrinho</Link>
            <ChevronRight className="w-4 h-4 text-white/60" />
            <span className="text-white font-medium">Checkout</span>
          </nav>
          <h1 className="text-2xl font-bold text-white drop-shadow-md">Finalizar Compra</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-10">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-8 h-8 bg-amber-500 text-zinc-950 rounded-full font-bold text-sm shadow-md">
              <Check className="w-4 h-4" />
            </div>
            <span className="ml-2 text-sm font-bold text-amber-600 dark:text-amber-500 hidden sm:block">Carrinho</span>
          </div>
          <div className="w-12 h-1 bg-amber-500 mx-2 rounded-full"></div>
          <div className="flex items-center">
            <div className="flex items-center justify-center w-8 h-8 bg-amber-500 text-zinc-950 rounded-full font-bold text-sm shadow-md ring-4 ring-amber-500/20">
              2
            </div>
            <span className="ml-2 text-sm font-bold text-amber-600 dark:text-amber-500 hidden sm:block">Checkout</span>
          </div>
          <div className="w-12 h-1 bg-zinc-200 dark:bg-zinc-800 mx-2 rounded-full"></div>
          <div className="flex items-center">
            <div className="flex items-center justify-center w-8 h-8 bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 rounded-full font-bold text-sm">
              3
            </div>
            <span className="ml-2 text-sm font-medium text-zinc-500 dark:text-zinc-400 hidden sm:block">Confirmação</span>
          </div>
        </div>

        <form onSubmit={handleCheckout}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Delivery Type Selection */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center">
                    <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Como deseja receber?</h2>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <label className="cursor-pointer block relative">
                    <input type="radio" name="delivery_type" value="suite" defaultChecked className="peer sr-only" />
                    <div className="p-6 bg-blue-50/50 dark:bg-blue-900/10 border-2 border-blue-500 rounded-2xl ring-4 ring-blue-500/10 transition-all">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                          <Package className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-blue-900 dark:text-blue-300 mb-1">Enviar para Suíte</h3>
                          <p className="text-sm text-blue-700/80 dark:text-blue-400/80 mb-3">O produto vai direto para sua suíte na DockDrop</p>
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-xs text-blue-800 dark:text-blue-300 font-medium">
                              <Check className="w-4 h-4 text-emerald-500" />
                              <span>Sem taxa de envio local</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-blue-800 dark:text-blue-300 font-medium">
                              <Check className="w-4 h-4 text-emerald-500" />
                              <span>Consolidação disponível</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-blue-800 dark:text-blue-300 font-medium">
                              <Check className="w-4 h-4 text-emerald-500" />
                              <span>Você decide quando enviar para o Brasil</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute top-6 right-6 w-6 h-6 rounded-full border-2 border-blue-500 bg-blue-500 flex items-center justify-center transition shadow-sm">
                        <Check className="w-4 h-4 text-white" strokeWidth={3} />
                      </div>
                    </div>
                  </label>
                </div>
                
                <div className="mt-4 p-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl flex gap-3">
                  <Info className="w-5 h-5 text-zinc-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Produtos da loja vão direto para sua suíte</p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Após a compra, os produtos estarão disponíveis na sua suíte para consolidação e envio internacional quando você desejar.</p>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Método de Pagamento</h2>
                </div>

                <div className="space-y-3">
                  <label className="cursor-pointer block relative">
                    <input type="radio" name="payment_method" value="wallet" defaultChecked className="peer sr-only" />
                    <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800 border-2 border-emerald-500 rounded-xl transition ring-4 ring-emerald-500/10">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center shadow-sm shrink-0">
                          <Wallet className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-4 mb-1">
                            <p className="font-bold text-zinc-900 dark:text-white">Carteira Digital</p>
                          </div>
                          {walletBalance === null ? (
                            <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-700 animate-pulse rounded"></div>
                          ) : (
                            <p className="text-sm text-zinc-500">Saldo disponível: <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(walletBalance)}</span></p>
                          )}
                          {walletError && (
                            <p className="text-xs text-red-500 font-medium mt-1">{walletError}</p>
                          )}
                        </div>
                      </div>
                      <div className="w-6 h-6 rounded-full border-2 border-emerald-500 bg-emerald-500 flex items-center justify-center transition shrink-0">
                        <Check className="w-4 h-4 text-white" strokeWidth={3} />
                      </div>
                    </div>
                  </label>

                  {/* Insufficient funds warning */}
                  {(walletBalance ?? 0) < total && (
                    <div className="mt-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl p-4 flex gap-3">
                      <Wallet className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-red-900 dark:text-red-300">
                          {walletError ? "Carteira Indisponível" : "Saldo insuficiente"}
                        </p>
                        <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                          {walletError 
                            ? "Tivemos um problema ao conectar com a sua carteira digital. Por favor, tente novamente ou contate o suporte." 
                            : `Você precisa adicionar ${formatCurrency(total - (walletBalance ?? 0))} para completar esta compra.`
                          }
                        </p>
                        <Link href="/app/wallet" className="inline-block mt-2 text-sm font-bold text-red-600 dark:text-red-500 hover:underline">
                          {walletError ? "Acessar Carteira" : "Adicionar saldo →"}
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Notes */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center">
                    <FileText className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                  </div>
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Observações (Opcional)</h2>
                </div>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3} 
                  placeholder="Instruções especiais..." 
                  className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition text-zinc-900 dark:text-white resize-none"
                ></textarea>
              </div>
            </div>

            {/* Order Summary (Right Column) */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 lg:p-8 sticky top-4 shadow-xl">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">Resumo do Pedido</h2>

                {/* Items List */}
                <div className="space-y-4 pb-6 border-b border-zinc-200 dark:border-zinc-800 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center border border-zinc-200 dark:border-zinc-700">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-6 h-6 text-zinc-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">{item.name}</p>
                        <p className="text-xs text-zinc-500 font-medium">Qtd: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold text-zinc-900 dark:text-white">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Coupon Input */}
                <div className="pt-6 pb-2">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Ticket className="h-5 w-5 text-zinc-400" />
                      </div>
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        disabled={!!appliedCoupon || isApplyingCoupon}
                        placeholder="Cupom de desconto"
                        className="block w-full pl-10 pr-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-500 focus:ring-amber-500 focus:border-amber-500 sm:text-sm disabled:opacity-60"
                      />
                    </div>
                    {appliedCoupon ? (
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="px-4 py-2 border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/40 transition"
                      >
                        Remover
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={!couponCode.trim() || isApplyingCoupon}
                        className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isApplyingCoupon ? 'Aplicando' : 'Aplicar'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Totals */}
                <div className="space-y-3 py-6 border-b border-zinc-200 dark:border-zinc-800">
                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400 font-medium">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  
                  {appliedCoupon && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-500 font-medium">
                      <span>Desconto ({appliedCoupon.code})</span>
                      <span>-{formatCurrency(appliedCoupon.discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400 font-medium">
                    <span>Frete p/ Suíte</span>
                    <span className="text-emerald-600 dark:text-emerald-500 font-bold">Grátis</span>
                  </div>
                </div>

                <div className="flex justify-between items-center py-6">
                  <span className="text-lg font-bold text-zinc-900 dark:text-white">Total</span>
                  <span className="text-3xl font-extrabold text-amber-500">{formatCurrency(total)}</span>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  disabled={(walletBalance ?? 0) < total}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 text-zinc-950 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl font-bold text-lg transition shadow-xl hover:shadow-2xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-xl"
                >
                  <ShieldCheck className="w-6 h-6" />
                  Confirmar Pedido
                </button>

                {/* Secure Badge */}
                <div className="mt-6 text-center">
                  <div className="inline-flex items-center gap-2 text-sm text-zinc-500 font-medium">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    Compra 100% segura e criptografada
                  </div>
                </div>
              </div>
            </div>

          </div>
        </form>
      </div>

      {/* Footer */}
      <footer className="mt-auto bg-zinc-900 text-zinc-400 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Package className="w-6 h-6 text-amber-500" />
              <span className="font-bold text-white text-xl">{tenant.organization_name}</span>
            </div>
            <p className="text-sm">© {new Date().getFullYear()} {tenant.organization_name}. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
