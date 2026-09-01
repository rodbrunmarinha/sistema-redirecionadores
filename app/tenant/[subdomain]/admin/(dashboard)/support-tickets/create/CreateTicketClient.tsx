"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, ChevronLeft, Loader2, X } from "lucide-react";
import { searchClients, createTicketAction } from "../actions";

export default function CreateTicketClient({ subdomain }: { subdomain: string }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  const [selectedClient, setSelectedClient] = useState<any>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const searchRef = useRef<NodeJS.Timeout | null>(null);
  
  // Debounced search
  useEffect(() => {
    if (search.length < 2) {
      setResults([]);
      return;
    }
    
    setIsSearching(true);
    if (searchRef.current) clearTimeout(searchRef.current);
    
    searchRef.current = setTimeout(async () => {
      try {
        const data = await searchClients(subdomain, search);
        setResults(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      if (searchRef.current) clearTimeout(searchRef.current);
    };
  }, [search, subdomain]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedClient) {
      setError("Selecione um cliente.");
      return;
    }
    
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    formData.append("user_id", selectedClient.id);

    try {
      const res = await createTicketAction(subdomain, formData);
      if (res.error) {
        setError(res.error);
        setIsSubmitting(false);
      } else {
        router.push(`/admin/support-tickets`);
      }
    } catch (err: any) {
      setError(err.message || "Erro ao criar chamado");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-zinc-900 rounded-2xl shadow-xl border border-zinc-800 overflow-hidden relative z-10">
      
      <div className="p-6 space-y-6">
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        {/* Seleção do Cliente */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Cliente <span className="text-red-500">*</span>
          </label>

          {selectedClient ? (
            <div className="flex items-center justify-between gap-3 rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold shrink-0">
                  {selectedClient.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{selectedClient.name}</p>
                  <p className="text-xs text-orange-200/70 truncate">
                    {selectedClient.suite_number ? `#${selectedClient.suite_number} · ` : ''}{selectedClient.email}
                  </p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => { setSelectedClient(null); setSearch(""); }} 
                className="text-xs font-semibold text-orange-400 hover:text-orange-300 hover:underline shrink-0 px-2 py-1"
              >
                Trocar
              </button>
            </div>
          ) : (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input 
                type="text" 
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowResults(true);
                }}
                onFocus={() => setShowResults(true)}
                autoComplete="off" 
                placeholder="Busque por nome, e-mail, dock..." 
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-800 bg-zinc-950 text-white text-sm focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition outline-none placeholder-zinc-600"
              />
              
              {showResults && search.length >= 2 && (
                <div className="absolute z-20 mt-2 w-full bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl max-h-64 overflow-y-auto overflow-x-hidden">
                  {isSearching ? (
                    <div className="p-4 text-center text-zinc-500 text-sm flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Buscando...
                    </div>
                  ) : results.length > 0 ? (
                    results.map(c => (
                      <button 
                        key={c.id}
                        type="button" 
                        onClick={() => {
                          setSelectedClient(c);
                          setShowResults(false);
                        }} 
                        className="w-full text-left px-4 py-3 hover:bg-zinc-800 transition flex items-center gap-3 border-b border-zinc-800/50 last:border-0"
                      >
                        <div className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-300 flex items-center justify-center text-sm font-bold shrink-0">
                          {c.name ? c.name.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white truncate">{c.name}</p>
                          <p className="text-xs text-zinc-500 truncate">
                            {c.suite_number ? `#${c.suite_number} · ` : ''}{c.email}
                          </p>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-center text-zinc-500 text-sm">
                      Nenhum cliente encontrado.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          <p className="mt-2 text-xs text-zinc-500">O chamado será vinculado a este cliente, que poderá acompanhá-lo e responder pelo painel dele.</p>
        </div>

        {/* Assunto */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-zinc-300 mb-2">Assunto <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            name="subject" 
            id="subject" 
            required 
            className="w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-950 text-white text-sm focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition outline-none placeholder-zinc-600" 
            placeholder="Resumo do problema"
          />
        </div>

        {/* Categoria e Prioridade */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-zinc-300 mb-2">Categoria</label>
            <select name="category" id="category" required className="w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-950 text-white text-sm focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none">
              <option value="general">Geral</option>
              <option value="financial">Financeiro</option>
              <option value="technical">Técnico</option>
              <option value="shipping">Envios</option>
              <option value="store">Loja Online</option>
              <option value="account">Minha Conta</option>
              <option value="groups">Grupo de Compras</option>
              <option value="other">Outro</option>
            </select>
          </div>
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-zinc-300 mb-2">Prioridade</label>
            <select name="priority" id="priority" required className="w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-950 text-white text-sm focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none">
              <option value="low">Baixa</option>
              <option value="medium">Média</option>
              <option value="high">Alta</option>
              <option value="urgent">Urgente</option>
            </select>
          </div>
        </div>

        {/* Mensagem */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-zinc-300 mb-2">Mensagem Inicial <span className="text-red-500">*</span></label>
          <textarea 
            name="message" 
            id="message" 
            rows={6} 
            required 
            className="w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-950 text-white text-sm focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition outline-none placeholder-zinc-600" 
            placeholder="Descreva detalhadamente..."
          />
        </div>

        {/* Anexos (Somente UI por enquanto) */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Anexos</label>
          <input 
            type="file" 
            name="attachments[]" 
            multiple 
            className="w-full text-sm text-zinc-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-zinc-800 file:text-zinc-300 hover:file:bg-zinc-700 transition"
          />
        </div>
      </div>

      <div className="px-6 py-5 bg-zinc-950/50 border-t border-zinc-800 flex justify-end gap-3">
        <Link href="/admin/support-tickets" className="px-5 py-2.5 text-sm font-medium text-zinc-400 hover:text-white transition">
          Cancelar
        </Link>
        <button 
          type="submit" 
          disabled={!selectedClient || isSubmitting} 
          className="px-6 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 text-white text-sm font-bold rounded-xl hover:from-orange-500 hover:to-amber-500 shadow-lg shadow-orange-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Salvando...
            </>
          ) : 'Enviar Chamado'}
        </button>
      </div>
    </form>
  );
}
