"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Phone, Calendar, Lock, Eye, EyeOff, Hash, CheckCircle2, ShieldCheck, Clock, MapPin, Globe } from "lucide-react";
import { registerCustomerAction } from "@/app/actions/registerCustomer";
import { createClient } from "@/utils/supabase/client";

const phoneMasks: Record<string, { code: string, mask: string }> = {
  BR: { code: "+55", mask: "(11) 99999-9999" },
  US: { code: "+1", mask: "(555) 555-5555" },
  JP: { code: "+81", mask: "90-1234-5678" },
  CN: { code: "+86", mask: "138 1234 5678" },
  DE: { code: "+49", mask: "1512 3456789" },
  GB: { code: "+44", mask: "7911 123456" },
  FR: { code: "+33", mask: "6 12 34 56 78" },
  IT: { code: "+39", mask: "312 345 6789" },
  ES: { code: "+34", mask: "612 345 678" },
  PT: { code: "+351", mask: "912 345 678" },
  CA: { code: "+1", mask: "(555) 555-5555" },
  AU: { code: "+61", mask: "412 345 678" },
  MX: { code: "+52", mask: "55 1234 5678" },
  AR: { code: "+54", mask: "9 11 1234-5678" },
  CL: { code: "+56", mask: "9 1234 5678" },
  PY: { code: "+595", mask: "981 123456" },
  CO: { code: "+57", mask: "300 123 4567" },
  AE: { code: "+971", mask: "50 123 4567" },
};

export default function RegisterClient({ organizationName, subdomain, themeColor = "amber" }: { organizationName: string; subdomain: string; themeColor?: string }) {
  const themeStyles: Record<string, any> = {
    amber: { panel: "bg-amber-500", circle: "bg-amber-600", text: "text-amber-100", ring: "focus:ring-amber-500/20", border: "focus:border-amber-500", button: "bg-amber-500 hover:bg-amber-600 shadow-amber-500/25", link: "text-amber-600", checkbox: "text-amber-600 focus:ring-amber-600" },
    blue: { panel: "bg-blue-500", circle: "bg-blue-600", text: "text-blue-100", ring: "focus:ring-blue-500/20", border: "focus:border-blue-500", button: "bg-blue-500 hover:bg-blue-600 shadow-blue-500/25", link: "text-blue-600", checkbox: "text-blue-600 focus:ring-blue-600" },
    emerald: { panel: "bg-emerald-500", circle: "bg-emerald-600", text: "text-emerald-100", ring: "focus:ring-emerald-500/20", border: "focus:border-emerald-500", button: "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/25", link: "text-emerald-600", checkbox: "text-emerald-600 focus:ring-emerald-600" },
    rose: { panel: "bg-rose-500", circle: "bg-rose-600", text: "text-rose-100", ring: "focus:ring-rose-500/20", border: "focus:border-rose-500", button: "bg-rose-500 hover:bg-rose-600 shadow-rose-500/25", link: "text-rose-600", checkbox: "text-rose-600 focus:ring-rose-600" },
    violet: { panel: "bg-violet-500", circle: "bg-violet-600", text: "text-violet-100", ring: "focus:ring-violet-500/20", border: "focus:border-violet-500", button: "bg-violet-500 hover:bg-violet-600 shadow-violet-500/25", link: "text-violet-600", checkbox: "text-violet-600 focus:ring-violet-600" },
  };
  const theme = themeStyles[themeColor] || themeStyles.amber;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [country, setCountry] = useState("BR");
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const router = useRouter();
  const supabase = createClient();

  const applyPhoneMask = (value: string, countryCode: string) => {
    const numbers = value.replace(/\D/g, "");
    if (countryCode !== "BR") return numbers;
    
    // BR Mask: (00) 00000-0000
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = applyPhoneMask(e.target.value, country);
    setPhone(masked);
  };

  const applyCpfMask = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = applyCpfMask(e.target.value);
    setCpf(masked);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (password !== confirmPassword) {
      setErrorMsg("As senhas não coincidem.");
      return;
    }

    if (password.length < 8) {
      setErrorMsg("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Chamar a Server Action para criar o perfil e usuário no banco
      const res = await registerCustomerAction({
        subdomain,
        fullName,
        email,
        password,
        phone,
        cpf: country === "BR" ? cpf : ""
      });

      if (res.error) {
        setErrorMsg(res.error);
        setIsLoading(false);
        return;
      }

      // 2. Fazer o login real no Supabase Auth usando o client
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        setErrorMsg("Conta criada, mas houve erro ao fazer login automático. Tente fazer login manualmente.");
        setIsLoading(false);
        return;
      }

      // 3. Redirecionar para o painel do cliente
      router.push("/app");
      
    } catch (err: any) {
      setErrorMsg("Ocorreu um erro inesperado.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4 md:p-8">
      
      {/* Main Container */}
      <div className="bg-white w-full max-w-6xl rounded-[2rem] shadow-xl flex flex-col md:flex-row overflow-hidden min-h-[800px]">
        
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
                <Globe className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">{organizationName}</span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-extrabold mb-4">
              Comece hoje! 👋
            </h1>
            <p className={`${theme.text} text-lg mb-12 max-w-sm`}>
              Cadastre-se e tenha seu dock exclusivo para compras internacionais.
            </p>

            <div className="space-y-4 mt-auto">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-white" />
                <span className="font-medium">Rastreamento em Tempo Real</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-white" />
                <span className="font-medium">Histórico Completo</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-white" />
                <span className="font-medium">Suporte Dedicado</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="md:w-7/12 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white relative">
          <div className="max-w-md mx-auto w-full">
            <h2 className="text-3xl font-bold text-zinc-900 mb-2">Criar Conta</h2>
            <p className="text-zinc-500 mb-8">Preencha seus dados para começar</p>

            {errorMsg && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Nome Completo */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-700">Nome Completo <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                    <User className="w-5 h-5" />
                  </div>
                  <input 
                    type="text" 
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 ${theme.ring} ${theme.border} transition-all text-zinc-900 placeholder:text-zinc-400"
                    placeholder="João da Silva"
                  />
                </div>
              </div>

              {/* E-mail */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-700">E-mail <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 ${theme.ring} ${theme.border} transition-all text-zinc-900 placeholder:text-zinc-400"
                    placeholder="exemplo@email.com"
                  />
                </div>
              </div>

              {/* Telefone */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-700">Telefone (WhatsApp) <span className="text-red-500">*</span></label>
                <div className="flex gap-2">
                  <select 
                    value={country}
                    onChange={(e) => {
                      setCountry(e.target.value);
                      setPhone(""); // Reset phone when country changes to avoid bad masks
                    }}
                    className="w-32 px-3 py-3 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 ${theme.ring} ${theme.border} transition-all text-white"
                  >
                    {Object.entries(phoneMasks).map(([key, { code }]) => (
                      <option key={key} value={key}>
                        {key} {code}
                      </option>
                    ))}
                    <option value="OUTRO">🌐 Outro</option>
                  </select>
                  <div className="relative flex-1">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                      <Phone className="w-5 h-5" />
                    </div>
                    <input 
                      type="tel" 
                      required
                      value={phone}
                      onChange={handlePhoneChange}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 ${theme.ring} ${theme.border} transition-all text-zinc-900 placeholder:text-zinc-400"
                      placeholder={country === "OUTRO" ? "Número do telefone" : phoneMasks[country]?.mask || "Número"}
                    />
                  </div>
                </div>
              </div>

              {/* CPF - Somente se BR */}
              {country === "BR" && (
                <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="text-sm font-medium text-zinc-700">CPF <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                      <Hash className="w-5 h-5" />
                    </div>
                    <input 
                      type="text" 
                      required
                      value={cpf}
                      onChange={handleCpfChange}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 ${theme.ring} ${theme.border} transition-all text-zinc-900 placeholder:text-zinc-400"
                      placeholder="000.000.000-00"
                    />
                  </div>
                </div>
              )}

              {/* Data de Nascimento */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-700">Data de Nascimento <span className="text-zinc-400 font-normal">(opcional)</span></label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <input 
                    type="date" 
                    className="w-full pl-10 pr-4 py-3 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 ${theme.ring} ${theme.border} transition-all text-zinc-900 placeholder:text-zinc-400"
                  />
                </div>
              </div>

              {/* Senha */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-700">Senha <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 ${theme.ring} ${theme.border} transition-all text-zinc-900 placeholder:text-zinc-400"
                    placeholder="Mínimo 8 caracteres"
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

              {/* Confirmar Senha */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-700">Confirmar Senha <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 ${theme.ring} ${theme.border} transition-all text-zinc-900 placeholder:text-zinc-400"
                    placeholder="Digite a senha novamente"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 focus:outline-none"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 mt-4 ${theme.button} text-white rounded-xl font-medium transition-all flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Criar Minha Conta"
                )}
              </button>
            </form>

            <div className="mt-8 text-center space-y-6">
              <p className="text-sm text-zinc-600">
                Já tem uma conta? <Link href="/app/login" className="${theme.link} font-semibold hover:underline">Fazer login</Link>
              </p>

              <div className="pt-8 border-t border-zinc-100 flex flex-col items-center gap-4">
                <button className="flex items-center gap-1.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">
                  <Globe className="w-4 h-4" /> PT
                </button>
                
                <p className="text-xs text-zinc-400">
                  Ao criar uma conta, você concorda com nossos <a href="#" className="underline hover:text-zinc-600">Termos de Uso</a> e <a href="#" className="underline hover:text-zinc-600">Política de Privacidade</a>
                </p>
                
                <p className="text-xs text-zinc-400 mt-2">
                  Powered by <span className="font-semibold text-zinc-600">Cndck Hub</span>
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
