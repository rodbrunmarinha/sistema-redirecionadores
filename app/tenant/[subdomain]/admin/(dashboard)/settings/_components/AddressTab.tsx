import { MapPin, Info } from "lucide-react";
import { useState } from "react";

export function AddressTab({ data, onChange }: { data?: any, onChange?: (data: any) => void }) {
  const suitePosition = data?.suitePosition ?? 'address2';
  const setSuitePosition = (val: string) => onChange?.({ ...data, suitePosition: val });

  return (
    <div className="bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 p-4 sm:p-8 space-y-10">
      
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-amber-500" />
          <span>Endereço do Armazém</span>
        </h3>
        
        <p className="text-sm text-zinc-400">
          Este é o endereço que seus clientes usarão para enviar as compras. O identificador do Dock será injetado automaticamente conforme as regras abaixo.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-zinc-300 mb-1">Nome / Aos Cuidados de</label>
            <input type="text" value={data?.name || ""} onChange={e => onChange?.({...data, name: e.target.value})} placeholder="Ex: Cndck Hub" className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-2 text-sm focus:ring-amber-500 focus:border-amber-500" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-zinc-300 mb-1">Endereço (Linha 1)</label>
            <input type="text" value={data?.address1 || ""} onChange={e => onChange?.({...data, address1: e.target.value})} placeholder="Ex: 123 Main St" className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-2 text-sm focus:ring-amber-500 focus:border-amber-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Endereço (Linha 2)</label>
            <input type="text" value={data?.address2 || ""} onChange={e => onChange?.({...data, address2: e.target.value})} placeholder="Ex: Dock, Apt, Unit" className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-2 text-sm focus:ring-amber-500 focus:border-amber-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Cidade</label>
            <input type="text" value={data?.city || ""} onChange={e => onChange?.({...data, city: e.target.value})} placeholder="Ex: Orlando" className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-2 text-sm focus:ring-amber-500 focus:border-amber-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Estado / Província</label>
            <input type="text" value={data?.state || ""} onChange={e => onChange?.({...data, state: e.target.value})} placeholder="Ex: FL" className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-2 text-sm focus:ring-amber-500 focus:border-amber-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">CEP / Zip Code</label>
            <input type="text" value={data?.zip || ""} onChange={e => onChange?.({...data, zip: e.target.value})} placeholder="Ex: 32801" className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-2 text-sm focus:ring-amber-500 focus:border-amber-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Telefone</label>
            <input type="text" value={data?.phone || ""} onChange={e => onChange?.({...data, phone: e.target.value})} placeholder="Ex: +1 (555) 123-4567" className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-2 text-sm focus:ring-amber-500 focus:border-amber-500" />
          </div>
        </div>
      </div>

      <hr className="border-zinc-800" />

      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-zinc-100">Configuração do Dock</h3>
        <p className="text-sm text-zinc-400 mb-4">
          Defina onde o número do dock do cliente aparecerá quando ele copiar o endereço no painel.
        </p>

        <div className="grid grid-cols-1 gap-3">
          <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${suitePosition === 'address2' ? 'border-amber-500 bg-amber-500/10' : 'border-zinc-700 hover:border-zinc-600'}`}>
            <input type="radio" checked={suitePosition === 'address2'} onChange={() => setSuitePosition('address2')} className="hidden" />
            <div className={`mt-0.5 w-4 h-4 flex-shrink-0 rounded border flex items-center justify-center ${suitePosition === 'address2' ? 'border-amber-500 bg-amber-500' : 'border-zinc-600'}`}>
              {suitePosition === 'address2' && <div className="w-2 h-2 rounded-sm bg-white" />}
            </div>
            <div>
              <p className="font-medium text-zinc-100 text-sm">Na Linha 2 (Recomendado)</p>
              <p className="text-xs text-zinc-400 mt-1">Exemplo: Address Line 2: Dock 12345</p>
            </div>
          </label>

          <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${suitePosition === 'name' ? 'border-amber-500 bg-amber-500/10' : 'border-zinc-700 hover:border-zinc-600'}`}>
            <input type="radio" checked={suitePosition === 'name'} onChange={() => setSuitePosition('name')} className="hidden" />
            <div className={`mt-0.5 w-4 h-4 flex-shrink-0 rounded border flex items-center justify-center ${suitePosition === 'name' ? 'border-amber-500 bg-amber-500' : 'border-zinc-600'}`}>
              {suitePosition === 'name' && <div className="w-2 h-2 rounded-sm bg-white" />}
            </div>
            <div>
              <p className="font-medium text-zinc-100 text-sm">Ao lado do Nome</p>
              <p className="text-xs text-zinc-400 mt-1">Exemplo: Name: João Silva - Dock 12345</p>
            </div>
          </label>

          <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${suitePosition === 'address1_suffix' ? 'border-amber-500 bg-amber-500/10' : 'border-zinc-700 hover:border-zinc-600'}`}>
            <input type="radio" checked={suitePosition === 'address1_suffix'} onChange={() => setSuitePosition('address1_suffix')} className="hidden" />
            <div className={`mt-0.5 w-4 h-4 flex-shrink-0 rounded border flex items-center justify-center ${suitePosition === 'address1_suffix' ? 'border-amber-500 bg-amber-500' : 'border-zinc-600'}`}>
              {suitePosition === 'address1_suffix' && <div className="w-2 h-2 rounded-sm bg-white" />}
            </div>
            <div>
              <p className="font-medium text-zinc-100 text-sm">Sufixo do ADDRESS 1</p>
              <p className="text-xs text-zinc-400 mt-1">O número do dock é anexado após o endereço principal — útil para países como o Japão.<br/>Exemplo: ADDRESS 1: 123 Test Street Dock #1234</p>
            </div>
          </label>
        </div>

        <div className="bg-blue-900/20 p-4 rounded-xl flex gap-3 text-sm text-blue-400 border border-blue-900/30">
          <Info className="w-5 h-5 flex-shrink-0" />
          <p>Dica: É importante instruir seus clientes sobre como preencher o endereço no checkout de lojas conhecidas (ex: Amazon, eBay), pois cada loja pode formatar campos de endereço de forma diferente.</p>
        </div>
      </div>

    </div>
  );
}
