import { ShoppingCart, MousePointerClick, MessageCircle, BarChart } from "lucide-react";
import { useState } from "react";

export function ConversionTab({ data, onChange }: { data?: any, onChange?: (data: any) => void }) {
  const guestCart = data?.guestCart ?? "checkout_only";
  const setGuestCart = (val: string) => onChange?.({ ...data, guestCart: val });
  
  const pixelId = data?.pixelId ?? "";
  const setPixelId = (val: string) => onChange?.({ ...data, pixelId: val });
  
  const whatsapp = data?.whatsapp ?? "";
  const setWhatsapp = (val: string) => onChange?.({ ...data, whatsapp: val });

  return (
    <div className="bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 p-4 sm:p-8 space-y-10">
      
      {/* Carrinho para Visitantes */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-amber-500" />
          <span>Carrinho para Visitantes</span>
        </h3>
        
        <p className="text-sm text-zinc-400">
          Configure se os visitantes (não logados) podem adicionar serviços ou criar envios antes de criar uma conta.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className={`cursor-pointer p-4 rounded-xl border-2 transition-colors ${guestCart === 'checkout_only' ? 'border-amber-500 bg-amber-500/10' : 'border-zinc-700 hover:border-amber-300'}`}>
            <div className="flex items-start gap-3">
              <input type="radio" checked={guestCart === 'checkout_only'} onChange={() => setGuestCart('checkout_only')} className="mt-1" />
              <div>
                <p className="font-medium text-zinc-100 text-sm">Cadastro apenas no checkout</p>
                <p className="text-xs text-zinc-400 mt-1">O visitante pode simular e montar a caixa. Só pede login na hora de pagar (Maior conversão).</p>
              </div>
            </div>
          </label>

          <label className={`cursor-pointer p-4 rounded-xl border-2 transition-colors ${guestCart === 'cart_requires_account' ? 'border-amber-500 bg-amber-500/10' : 'border-zinc-700 hover:border-amber-300'}`}>
            <div className="flex items-start gap-3">
              <input type="radio" checked={guestCart === 'cart_requires_account'} onChange={() => setGuestCart('cart_requires_account')} className="mt-1" />
              <div>
                <p className="font-medium text-zinc-100 text-sm">Exigir conta imediata</p>
                <p className="text-xs text-zinc-400 mt-1">Visitantes não podem simular ou adicionar itens sem antes criar a conta.</p>
              </div>
            </div>
          </label>
        </div>
      </div>

      <hr className="border-zinc-800" />

      {/* Rastreamento e Pixels */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
          <BarChart className="w-5 h-5 text-amber-500" />
          <span>Rastreamento e Pixels</span>
        </h3>
        
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">
            Meta Pixel ID (Facebook/Instagram)
          </label>
          <input 
            type="text" 
            value={pixelId}
            onChange={(e) => setPixelId(e.target.value)}
            placeholder="Ex: 123456789012345" 
            className="w-full max-w-md bg-zinc-900 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-2 text-sm focus:ring-amber-500 focus:border-amber-500" 
          />
          <p className="text-xs text-zinc-400 mt-2">Dispara eventos padrão como PageView, AddToCart, e Purchase (apenas no checkout da sua loja).</p>
        </div>
      </div>

      <hr className="border-zinc-800" />

      {/* Botão do WhatsApp */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-amber-500" />
          <span>Atendimento via WhatsApp</span>
        </h3>
        
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">
            Número do WhatsApp (Com código do país)
          </label>
          <input 
            type="text" 
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="Ex: 5511999999999" 
            className="w-full max-w-md bg-zinc-900 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-2 text-sm focus:ring-amber-500 focus:border-amber-500" 
          />
          <p className="text-xs text-zinc-400 mt-2">Se preenchido, exibirá um botão flutuante de WhatsApp no painel do seu cliente.</p>
        </div>
      </div>

    </div>
  );
}
