"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, ArrowLeft, Loader2, Users } from "lucide-react";
import toast from "react-hot-toast";
import { createCustomerByAdmin } from "@/app/actions/createCustomerByAdmin";
import { usePermissions } from "@/app/providers/PermissionsProvider";

export default function CreateClientPage() {
  const router = useRouter();
  const { hasPermission } = usePermissions();
  const [loading, setLoading] = useState(false);

  // Regra de permissão aplicada!
  useEffect(() => {
    if (!hasPermission('users.create')) {
      toast.error("Você não tem permissão para criar clientes.", { id: "no-perm-toast" });
      router.replace("/admin/clients");
    }
  }, [hasPermission, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await createCustomerByAdmin(formData);

    setLoading(false);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Cliente criado com sucesso!");
      router.push("/admin/clients");
    }
  }

  // Prevenir flash of unauthorized content
  if (!hasPermission('users.create')) return null;

  return (
    <div className="min-h-screen bg-zinc-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 shadow-lg shadow-orange-500/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-y-24"></div>
          <div className="absolute top-1/2 left-2/3 w-32 h-32 bg-amber-300/20 rounded-full blur-2xl"></div>
          
          <div className="relative px-5 py-6 sm:px-6">
            <div className="flex items-center gap-4">
              <Link href="/admin/clients" className="p-2 bg-white/20 hover:bg-white/30 border border-white/30 text-white rounded-xl transition">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 backdrop-blur rounded-2xl shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-orange-200 text-xs font-semibold uppercase tracking-widest">Admin · Clientes</p>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">Novo Cliente</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-zinc-900 backdrop-blur-xl rounded-2xl shadow-lg overflow-hidden border border-zinc-800">
          <div className="px-6 py-5 border-b border-zinc-800 bg-zinc-950/50">
            <h3 className="text-lg font-bold text-white">Informações do Cliente</h3>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Nome */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-2">
                Nome Completo <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                required 
                className="w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-950 text-white focus:border-orange-500 focus:ring-orange-500 outline-none transition" 
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
                required 
                className="w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-950 text-white focus:border-orange-500 focus:ring-orange-500 outline-none transition" 
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
                placeholder="(00) 00000-0000" 
                className="w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-950 text-white focus:border-orange-500 focus:ring-orange-500 outline-none transition" 
              />
            </div>

            {/* Senha */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-2">
                Senha <span className="text-red-500">*</span>
              </label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                required 
                className="w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-950 text-white focus:border-orange-500 focus:ring-orange-500 outline-none transition" 
              />
              <p className="mt-1 text-xs text-zinc-500">Mínimo de 8 caracteres</p>
            </div>

            {/* Confirmar Senha */}
            <div>
              <label htmlFor="password_confirmation" className="block text-sm font-medium text-zinc-300 mb-2">
                Confirmar Senha <span className="text-red-500">*</span>
              </label>
              <input 
                type="password" 
                id="password_confirmation" 
                name="password_confirmation" 
                required 
                className="w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-950 text-white focus:border-orange-500 focus:ring-orange-500 outline-none transition" 
              />
            </div>

            {/* Botões */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-zinc-800">
              <Link 
                href="/admin/clients" 
                className="px-6 py-3 bg-zinc-800 text-zinc-300 font-semibold rounded-xl hover:bg-zinc-700 transition"
              >
                Cancelar
              </Link>
              <button 
                type="submit" 
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-amber-700 transition shadow-lg shadow-orange-500/30 flex items-center gap-2 disabled:opacity-50"
              >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                Cadastrar Cliente
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
