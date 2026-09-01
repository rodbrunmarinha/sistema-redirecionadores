"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Package, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { usePermissions } from "@/app/providers/PermissionsProvider";
import { redirect } from "next/navigation";
import { editCustomer } from "@/app/actions/editCustomer";

export default function EditClientPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const router = useRouter();
  const { hasPermission } = usePermissions();

  useEffect(() => {
    if (!hasPermission("users.edit")) {
      router.replace(`/admin/clients`);
    }
  }, [hasPermission, router]);

  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [clientData, setClientData] = useState<any>(null);
  const [fetchError, setFetchError] = useState("");

  // Unwrap params depending on if it's a Promise or not
  const resolvedParams = params instanceof Promise ? use(params) : params;
  const id = resolvedParams.id;

  useEffect(() => {
    async function fetchClient() {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching client:", error);
        setFetchError(error.message);
      } else {
        setClientData(data);
      }
      setLoading(false);
    }
    fetchClient();
  }, [id, supabase]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    formData.append("id", id);

    // checkbox n\u00e3o envia valor se n\u00e3o marcado, ent\u00e3o mandamos "0" pra action
    if (!formData.get("is_active")) {
      formData.append("is_active", "0");
    }

    try {
      const res = await editCustomer(formData);
      if (res?.error) {
        setErrorMsg(res.error);
        setSaving(false);
      } else {
        router.push("/admin/clients");
      }
    } catch (err: any) {
      setErrorMsg("Erro inesperado ao salvar cliente.");
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!clientData && !loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-white space-y-4">
        <p className="text-xl font-medium">Cliente não encontrado.</p>
        {fetchError && (
          <p className="text-red-400 text-sm bg-red-500/10 p-4 rounded-xl border border-red-500/20 max-w-md text-center">
            Detalhes do erro: {fetchError}
          </p>
        )}
        <Link href="/admin/clients" className="px-6 py-2.5 bg-zinc-800 text-zinc-300 font-semibold rounded-xl hover:bg-zinc-700 hover:text-white transition-colors">
          Voltar para Clientes
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 pb-12">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 shadow-lg shadow-orange-500/20">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10"></div>
          <div className="absolute -bottom-16 -left-8 w-64 h-64 rounded-full bg-white/5"></div>
        </div>
        
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-sm mb-4 text-white/70">
            <Link href="/admin" className="hover:text-white transition-colors">Dashboard</Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            <Link href="/admin/clients" className="hover:text-white transition-colors">Clientes</Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            <span className="text-white font-medium truncate">{clientData.full_name || "Sem Nome"}</span>
          </nav>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shadow-lg shrink-0 border border-white/10">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Editar Cliente</h1>
              <p className="text-orange-100 text-sm mt-1 font-medium">Dock: #{clientData.suite_number}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-zinc-900 rounded-2xl shadow-xl overflow-hidden border border-zinc-800">
          <div className="px-6 py-5 border-b border-zinc-800 bg-zinc-950/50">
            <h3 className="text-lg font-bold text-white">Informações do Cliente</h3>
            <p className="text-sm text-zinc-400 mt-1">Dock: #{clientData.suite_number}</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {errorMsg && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-medium">
                {errorMsg}
              </div>
            )}

            {/* Nome */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-2">
                Nome Completo <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                defaultValue={clientData.full_name || ""} 
                required 
                className="w-full px-4 py-3 rounded-xl border border-zinc-700 bg-zinc-950 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all outline-none"
              />
            </div>

            {/* E-mail */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">
                E-mail <span className="text-red-500">*</span>
              </label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                defaultValue={clientData.email || ""} 
                required 
                className="w-full px-4 py-3 rounded-xl border border-zinc-700 bg-zinc-950 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all outline-none"
              />
            </div>

            {/* Telefone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-zinc-300 mb-2">
                Telefone
              </label>
              <input 
                type="text" 
                id="phone" 
                name="phone" 
                defaultValue={clientData.phone || ""} 
                placeholder="(00) 00000-0000" 
                className="w-full px-4 py-3 rounded-xl border border-zinc-700 bg-zinc-950 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all outline-none"
              />
            </div>

            {/* Tarifa Customizada */}
            <div>
              <label htmlFor="custom_freight_rate" className="block text-sm font-medium text-zinc-300 mb-2">
                Tarifa especial de frete (por peso)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-medium">$</span>
                <input 
                  type="number" 
                  step="0.01" 
                  min="0" 
                  id="custom_freight_rate" 
                  name="custom_freight_rate" 
                  defaultValue={clientData.custom_freight_rate || ""} 
                  placeholder="Vazio = tarifa padrão" 
                  className="w-full pl-10 pr-16 py-3 rounded-xl border border-zinc-700 bg-zinc-950 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all outline-none"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-zinc-500">/ kg</span>
              </div>
              <p className="mt-1.5 text-xs text-zinc-500">Substitui o valor por peso dos tipos de envio só para este cliente. Não afeta serviços extras nem tarifas fixas.</p>
            </div>

            {/* Status */}
            <div className="pt-2">
              <label htmlFor="is_active" className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input 
                    type="checkbox" 
                    id="is_active" 
                    name="is_active" 
                    value="1" 
                    defaultChecked={clientData.is_active !== false}
                    className="peer w-5 h-5 rounded border-zinc-700 bg-zinc-950 text-orange-500 focus:ring-orange-500/50 checked:bg-orange-500 checked:border-orange-500 transition-all appearance-none"
                  />
                  <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">Cliente Ativo</span>
              </label>
              <p className="mt-1.5 ml-8 text-xs text-zinc-500">Desmarque para desativar temporariamente o acesso do cliente</p>
            </div>

            {/* Divisor */}
            <div className="border-t border-zinc-800 pt-6 mt-2">
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-white">Alterar Senha (Opcional)</h4>
                  <p className="mt-1 text-xs text-zinc-400">Se o cliente estiver com dificuldade para recuperar o acesso, gere uma senha temporária.</p>
                </div>
                <button type="button" onClick={() => {
                  const newPass = Math.random().toString(36).slice(-8);
                  (document.getElementById('password') as HTMLInputElement).value = newPass;
                  (document.getElementById('password_confirmation') as HTMLInputElement).value = newPass;
                  alert(`Senha gerada: ${newPass}`);
                }} className="inline-flex items-center justify-center rounded-xl bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-400 hover:bg-orange-500/20 border border-orange-500/20 transition-colors">
                  Gerar nova senha
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-2">
                    Nova Senha
                  </label>
                  <input 
                    type="text" 
                    id="password" 
                    name="password" 
                    className="w-full px-4 py-3 rounded-xl border border-zinc-700 bg-zinc-950 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all outline-none"
                  />
                  <p className="mt-1 text-xs text-zinc-500">Deixe em branco para manter a senha atual. Mínimo de 8 caracteres.</p>
                </div>

                <div>
                  <label htmlFor="password_confirmation" className="block text-sm font-medium text-zinc-300 mb-2">
                    Confirmar Nova Senha
                  </label>
                  <input 
                    type="text" 
                    id="password_confirmation" 
                    name="password_confirmation" 
                    className="w-full px-4 py-3 rounded-xl border border-zinc-700 bg-zinc-950 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Bot\u00f5es */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-zinc-800">
              <Link href="/admin/clients" className="px-6 py-2.5 bg-zinc-800 text-zinc-300 font-semibold rounded-xl hover:bg-zinc-700 hover:text-white transition-colors">
                Cancelar
              </Link>
              <button 
                type="submit" 
                disabled={saving}
                className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-orange-500/20 flex items-center gap-2 disabled:opacity-70"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                Atualizar Cliente
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
