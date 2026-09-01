import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function CartPage() {
  return (
    <div className="py-6 max-w-5xl mx-auto w-full">
      {/* Header (opcional) */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 flex items-center gap-3">
          <span className="text-3xl">🛒</span>
          Meu Carrinho
        </h1>
        <p className="text-zinc-600 mt-1">Gerencie os produtos selecionados para o seu grupo de compra</p>
      </div>

      {/* Empty State */}
      <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-zinc-200">
        <div className="w-24 h-24 mx-auto mb-6 bg-violet-100 rounded-full flex items-center justify-center">
          <ShoppingBag className="w-12 h-12 text-violet-600" />
        </div>
        <h3 className="text-2xl font-bold text-zinc-900 mb-2">Carrinho vazio</h3>
        <p className="text-zinc-500 mb-8 max-w-md mx-auto">
          Explore nossos grupos de compras e encontre produtos incríveis com preços especiais
        </p>
        <Link
          href="/app/purchase-groups"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-violet-600 to-violet-500 text-white rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-violet-500/20"
        >
          <ShoppingBag className="w-5 h-5" />
          Explorar Grupos de Compras
        </Link>
      </div>
    </div>
  );
}
