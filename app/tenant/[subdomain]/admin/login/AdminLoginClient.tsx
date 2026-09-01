"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, Globe } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function AdminLoginClient() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg("E-mail ou senha incorretos.");
      setIsLoading(false);
      return;
    }

    if (data?.user) {
      router.push("/admin");
      router.refresh();
    }
  };

  return (
    <>
      {errorMsg && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
          <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
          </div>
          <p className="text-sm font-medium text-red-400">{errorMsg}</p>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-zinc-300">E-mail corporativo</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
              <Mail className="w-5 h-5" />
            </div>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all text-white placeholder:text-zinc-600"
              placeholder="admin@dockdrop.com"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-zinc-300">Senha</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
              <Lock className="w-5 h-5" />
            </div>
            <input 
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-12 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all text-white placeholder:text-zinc-600"
              placeholder="••••••••"
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 focus:outline-none"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded bg-zinc-950 border-zinc-700 text-amber-500 focus:ring-amber-500 focus:ring-offset-zinc-900" />
            <span className="text-sm text-zinc-400 font-medium hover:text-zinc-300 transition-colors">Lembrar de mim</span>
          </label>
          <a href="#" className="text-sm font-medium text-amber-500 hover:text-amber-400 transition-colors">Esqueceu a senha?</a>
        </div>

        <button 
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 mt-2 bg-amber-500 hover:bg-amber-600 text-zinc-950 rounded-xl font-bold transition-all shadow-lg shadow-amber-500/20 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin" />
          ) : (
            "Entrar no Painel Admin"
          )}
        </button>
      </form>

      <div className="mt-8 pt-8 border-t border-zinc-800 flex items-center justify-between">
        <p className="text-sm text-zinc-500">
          Precisa de ajuda? <a href="#" className="text-amber-500 font-semibold hover:underline">Contate o suporte</a>
        </p>

        <button className="flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-300 transition-colors">
          <Globe className="w-4 h-4" /> PT
        </button>
      </div>
    </>
  );
}
