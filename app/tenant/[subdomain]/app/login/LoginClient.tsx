"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Mail, Lock, Eye, EyeOff, Check, Package, Globe, Loader2, AlertTriangle } from "lucide-react";

export default function LoginClient({ organizationName, themeColor = "amber", initialError }: { organizationName: string, themeColor?: string, initialError?: string }) {
  const themeStyles: Record<string, any> = {
    amber: { panel: "bg-amber-500", circle: "bg-amber-600", text: "text-amber-100", ring: "focus:ring-amber-500/20", border: "focus:border-amber-500", button: "bg-amber-500 hover:bg-amber-600 shadow-amber-500/25", link: "text-amber-600", checkbox: "text-amber-600 focus:ring-amber-600" },
    blue: { panel: "bg-blue-500", circle: "bg-blue-600", text: "text-blue-100", ring: "focus:ring-blue-500/20", border: "focus:border-blue-500", button: "bg-blue-500 hover:bg-blue-600 shadow-blue-500/25", link: "text-blue-600", checkbox: "text-blue-600 focus:ring-blue-600" },
    emerald: { panel: "bg-emerald-500", circle: "bg-emerald-600", text: "text-emerald-100", ring: "focus:ring-emerald-500/20", border: "focus:border-emerald-500", button: "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/25", link: "text-emerald-600", checkbox: "text-emerald-600 focus:ring-emerald-600" },
    rose: { panel: "bg-rose-500", circle: "bg-rose-600", text: "text-rose-100", ring: "focus:ring-rose-500/20", border: "focus:border-rose-500", button: "bg-rose-500 hover:bg-rose-600 shadow-rose-500/25", link: "text-rose-600", checkbox: "text-rose-600 focus:ring-rose-600" },
    violet: { panel: "bg-violet-500", circle: "bg-violet-600", text: "text-violet-100", ring: "focus:ring-violet-500/20", border: "focus:border-violet-500", button: "bg-violet-500 hover:bg-violet-600 shadow-violet-500/25", link: "text-violet-600", checkbox: "text-violet-600 focus:ring-violet-600" },
  };

  const theme = themeStyles[themeColor] || themeStyles.amber;

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialError === 'cross_tenant_forbidden') {
      setError("Esta conta pertence a outra loja. Por favor, acesse a loja onde você se cadastrou.");
    }
  }, [initialError]);
  
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError("E-mail ou senha incorretos.");
        setIsLoading(false);
        return;
      }

      if (data?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();
          
        if (profile && profile.role !== 'CUSTOMER') {
          router.push("/admin");
          router.refresh();
          return;
        }
      }

      // Se login deu certo, recarregar a rota principal do painel do cliente
      router.push("/app");
      router.refresh();

    } catch (err) {
      setError("Ocorreu um erro ao tentar fazer login.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4 md:p-8">
      
      {/* Main Container */}
      <div className="bg-white w-full max-w-5xl rounded-[2rem] shadow-xl flex flex-col md:flex-row overflow-hidden min-h-[600px]">
        
        {/* Left Panel - Branding */}
        <div className={`md:w-5/12 ${theme.panel} p-10 lg:p-12 flex flex-col relative overflow-hidden text-white`}>
          {/* Decorative Circles */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className={`absolute top-[20%] -left-[20%] w-[120%] h-[120%] ${theme.circle} rounded-full blur-[80px] opacity-60 mix-blend-multiply`} />
            <div className="absolute bottom-[-10%] right-[-20%] w-[100%] h-[100%] bg-white/10 rounded-full blur-[60px]" />
          </div>
          
          <div className="relative z-10">
            {/* Tenant Header */}
            <div className="flex items-center gap-3 mb-24">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">{organizationName}</span>
            </div>

            <h1 className="text-4xl lg:text-4xl font-bold mb-4">
              Bem-vindo de volta! 👋
            </h1>
            <p className={`${theme.text} text-lg mb-12 max-w-sm`}>
              Acesse sua conta para rastrear encomendas, gerenciar envios e muito mais.
            </p>

            <div className="space-y-4 mt-auto">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-white" />
                <span className="font-medium">Gerencie seus produtos</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-white" />
                <span className="font-medium">Histórico completo de pedidos</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-white" />
                <span className="font-medium">Suporte dedicado</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="md:w-7/12 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white relative">
          <div className="max-w-md mx-auto w-full">
            <h2 className="text-3xl font-bold text-zinc-900 mb-2">Login</h2>
            <p className="text-zinc-500 mb-8">Entre com suas credenciais para continuar</p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium flex items-center gap-2">
                <span className="w-5 h-5 flex items-center justify-center bg-red-100 rounded-full flex-shrink-0 text-red-600 font-bold">!</span>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              
              {/* E-mail */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-700">E-mail</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 ${theme.ring} ${theme.border} transition-all text-zinc-900 placeholder:text-zinc-400`}
                    placeholder="exemplo@email.com"
                  />
                </div>
              </div>

              {/* Senha */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-700">Senha</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full pl-10 pr-12 py-3 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 ${theme.ring} ${theme.border} transition-all text-zinc-900 placeholder:text-zinc-400`}
                    placeholder="••••••••"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Extras (Lembrar de mim / Esqueceu a senha) */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className={`w-4 h-4 rounded border-zinc-300 ${theme.checkbox}`} />
                  <span className="text-sm text-zinc-600">Lembrar de mim</span>
                </label>
                
                <div className="flex flex-col items-end">
                  <Link href="/app/forgot-password" className={`text-sm ${theme.link} font-semibold hover:underline`}>
                    Esqueceu a senha?
                  </Link>
                  <Link href="/app/register" className="text-xs text-zinc-500 mt-0.5 hover:text-zinc-700">
                    Primeiro acesso? Criar senha
                  </Link>
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                disabled={isLoading}
                className={`w-full py-3.5 mt-4 ${theme.button} text-white rounded-xl font-medium transition-all flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed`}
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Entrar"}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-zinc-600">
                Não tem uma conta? <Link href="/app/register" className={`${theme.link} font-semibold hover:underline`}>Criar conta grátis</Link>
              </p>
            </div>

            <div className="mt-12 pt-6 border-t border-zinc-100 flex flex-col items-center gap-3">
              <button className="flex items-center gap-1.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">
                <Globe className="w-4 h-4" /> PT
              </button>
              
              <p className="text-xs text-zinc-400 text-center">
                Powered by <span className="font-semibold text-zinc-600">Dock Drop</span> - Seu endereço no mundo. Suas compras no Brasil.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
