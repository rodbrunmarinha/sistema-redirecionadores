"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg("E-mail ou senha incorretos.");
      setIsLoading(false);
    } else {
      router.push("/admin");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-900 px-4">
      <div className="max-w-md w-full bg-zinc-800 rounded-2xl shadow-2xl overflow-hidden border border-zinc-700">
        
        {/* Header Section */}
        <div className="p-8 text-center space-y-2">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-tr from-brand-orange to-brand-yellow flex items-center justify-center shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Dock Drop</h1>
          <p className="text-sm text-zinc-400">Entre com suas credenciais para acessar a plataforma.</p>
        </div>

        {/* Form Section */}
        <div className="p-8 pt-0">
          <form onSubmit={handleLogin} className="space-y-5">
            {errorMsg && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm font-medium text-center">
                {errorMsg}
              </div>
            )}
            <div className="space-y-1">
              <label className="text-sm font-medium text-zinc-300">E-mail</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full px-4 py-3 rounded-lg border border-zinc-700 bg-zinc-900 text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all outline-none placeholder:text-zinc-600"
              />
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-zinc-300">Senha</label>
                <a href="#" className="text-xs text-brand-orange hover:text-brand-yellow transition-colors font-medium">Esqueceu a senha?</a>
              </div>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                className="w-full px-4 py-3 rounded-lg border border-zinc-700 bg-zinc-900 text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all outline-none placeholder:text-zinc-600"
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-brand-yellow to-brand-orange text-white font-bold rounded-lg shadow-md hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-70 flex justify-center items-center"
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                "Acessar Plataforma"
              )}
            </button>
            
            <div className="pt-4 text-center">
              <p className="text-center text-sm text-zinc-500 mt-8">
                Ainda nÃ£o tem uma conta? <a href="/register" className="text-amber-500 hover:text-orange-500 font-medium transition-colors">Criar conta</a>
              </p>
            </div>
          </form>
        </div>

        {/* Footer Section */}
        <div className="bg-zinc-800/50 px-8 py-4 border-t border-zinc-700 text-center">
          <p className="text-xs text-zinc-500">
            Powered by <span className="font-semibold text-zinc-400">Dock Drop</span>
          </p>
        </div>
      </div>
    </div>
  );
}
