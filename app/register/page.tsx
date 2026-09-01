"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, ArrowRight, User, X, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { registerTenantAction } from "@/app/actions/registerTenant";

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

export default function Register() {
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [organizationName, setOrganizationName] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  
  const [isCheckingSubdomain, setIsCheckingSubdomain] = useState(false);
  const [isSubdomainAvailable, setIsSubdomainAvailable] = useState<boolean | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (subdomain.length < 3) {
      setIsSubdomainAvailable(null);
      return;
    }

    const checkSubdomain = async () => {
      setIsCheckingSubdomain(true);
      const { data, error } = await supabase
        .from('tenants')
        .select('id')
        .eq('subdomain', subdomain)
        .maybeSingle();
      
      setIsSubdomainAvailable(data === null);
      setIsCheckingSubdomain(false);
    };

    const debounce = setTimeout(checkSubdomain, 500);
    return () => clearTimeout(debounce);
  }, [subdomain, supabase]);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMsg("As senhas não coincidem.");
      return;
    }
    setErrorMsg("");
    setStep(2);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubdomainAvailable === false) {
      setErrorMsg("Este subdomínio já está em uso.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    });

    if (authError) {
      setErrorMsg(authError.message);
      setIsLoading(false);
      return;
    }

    const actionResult = await registerTenantAction({
      userId: authData.user!.id,
      email: email,
      fullName: fullName,
      organizationName: organizationName,
      subdomain: subdomain,
      country: country,
      phone: phone
    });

    if (!actionResult.success) {
      setErrorMsg(actionResult.error || "Erro desconhecido ao criar empresa.");
      setIsLoading(false);
      return;
    }
    
    alert("Conta criada com sucesso! Redirecionando para o seu painel...");
    window.location.href = `${window.location.protocol}//${subdomain}.${window.location.host}/admin/login`;
  };

  return (
    <div className="min-h-screen flex w-full bg-zinc-950">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex w-5/12 bg-zinc-900 p-12 flex-col justify-between relative overflow-hidden border-r border-zinc-800">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-600/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10">
          <div className="mb-16">
            <Link href="/">
              <img src="/dockdrop-logo.png" alt="Dock Drop" className="h-12 w-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:scale-105 transition-transform" />
            </Link>
          </div>

          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
            Eleve sua empresa ao <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">próximo nível</span>
          </h1>
          
          <div className="space-y-6 mt-12">
            {[
              "Diga adeus ao controle manual de pacotes e docks",
              "Lojas virtuais que convertem e facilitam seu giro de estoque",
              "Geração automática de declarações aduaneiras e etiquetas",
              "White-label: seu painel, sua marca, suas regras"
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0 mt-0.5 border border-amber-500/20">
                  <Check className="w-3.5 h-3.5 text-amber-500" />
                </div>
                <p className="text-zinc-300 leading-relaxed font-medium">{feature}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-zinc-500 text-sm flex items-center gap-2">
          <span>🔒</span> Seus dados e clientes 100% blindados por RLS
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col bg-zinc-950">
        <div className="p-8 flex justify-end">
          <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-amber-500 transition-colors flex items-center gap-1">
            Já tenho conta <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex-1 flex flex-col items-center pt-8 px-4 sm:px-8 pb-12">
          <div className="flex items-center justify-center w-full max-w-lg mb-12">
            <div className="flex flex-col items-center relative z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${step >= 1 ? 'bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/20' : 'bg-zinc-800 text-zinc-500'}`}>
                1
              </div>
              <span className={`text-xs font-medium mt-2 ${step >= 1 ? 'text-amber-500' : 'text-zinc-500'}`}>Admin</span>
            </div>
            
            <div className={`flex-1 h-0.5 mx-2 rounded-full transition-colors ${step >= 2 ? 'bg-amber-500/50' : 'bg-zinc-800'}`} />
            
            <div className="flex flex-col items-center relative z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${step >= 2 ? 'bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/20' : 'bg-zinc-800 text-zinc-500'}`}>
                2
              </div>
              <span className={`text-xs font-medium mt-2 ${step >= 2 ? 'text-amber-500' : 'text-zinc-500'}`}>Empresa</span>
            </div>
          </div>

          <div className="w-full max-w-md bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-800 p-8 sm:p-10">
            {step === 1 && (
              <>
                <div className="flex flex-col items-center text-center mb-8">
                  <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-4 border border-amber-500/20">
                    <User className="w-6 h-6 text-amber-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Conta de Administrador</h2>
                  <p className="text-sm text-zinc-400">Estes serão seus dados de acesso ao painel.</p>
                </div>

                <form onSubmit={handleNextStep} className="space-y-4">
                  {errorMsg && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium text-center">
                      {errorMsg}
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-300">Nome Completo</label>
                    <input 
                      type="text" 
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all text-white placeholder:text-zinc-600"
                      placeholder="João Silva"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-300">E-mail Comercial</label>
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all text-white placeholder:text-zinc-600"
                      placeholder="joao@empresa.com"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-zinc-300">Senha</label>
                      <input 
                        type="password" 
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all text-white placeholder:text-zinc-600"
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-zinc-300">Confirmar</label>
                      <input 
                        type="password" 
                        required
                        minLength={6}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all text-white placeholder:text-zinc-600"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3.5 mt-4 bg-amber-500 hover:bg-amber-600 text-zinc-950 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] flex justify-center items-center gap-2"
                  >
                    Próximo passo
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </>
            )}

            {step === 2 && (
              <>
                <div className="flex flex-col items-center text-center mb-8">
                  <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-4 border border-amber-500/20">
                    <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Dados da Empresa</h2>
                  <p className="text-sm text-zinc-400">Configure o ambiente do seu redirecionamento.</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                  {errorMsg && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium text-center">
                      {errorMsg}
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-300">Nome da Empresa</label>
                    <input 
                      type="text" 
                      required
                      value={organizationName}
                      onChange={(e) => {
                        setOrganizationName(e.target.value);
                        if (!subdomain || subdomain === organizationName.toLowerCase().replace(/[^a-z0-9]/g, '')) {
                          const autoSubdomain = e.target.value
                            .toLowerCase()
                            .replace(/\s+/g, '-')
                            .normalize('NFD')
                            .replace(/[\u0300-\u036f]/g, "")
                            .replace(/[^a-z0-9-]/g, '');
                          setSubdomain(autoSubdomain);
                        }
                      }}
                      className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all text-white placeholder:text-zinc-600"
                      placeholder="Ex: Dock Drop Redirecionamentos"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-300">Sede (País)</label>
                    <div className="relative">
                      <select
                        required
                        value={country}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCountry(val);
                          if (val && phoneMasks[val]) {
                            setPhone(phoneMasks[val].code + " ");
                          }
                        }}
                        className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all text-white appearance-none"
                      >
                        <option value="" disabled>Selecione o país...</option>
                        <option value="BR">🇧🇷 Brasil</option>
                        <option value="US">🇺🇸 Estados Unidos</option>
                        <option value="JP">🇯🇵 Japão</option>
                        <option value="CN">🇨🇳 China</option>
                        <option value="DE">🇩🇪 Alemanha</option>
                        <option value="GB">🇬🇧 Reino Unido</option>
                        <option value="FR">🇫🇷 França</option>
                        <option value="IT">🇮🇹 Itália</option>
                        <option value="ES">🇪🇸 Espanha</option>
                        <option value="PT">🇵🇹 Portugal</option>
                        <option value="CA">🇨🇦 Canadá</option>
                        <option value="AU">🇦🇺 Austrália</option>
                        <option value="MX">🇲🇽 México</option>
                        <option value="AR">🇦🇷 Argentina</option>
                        <option value="CL">🇨🇱 Chile</option>
                        <option value="PY">🇵🇾 Paraguai</option>
                        <option value="CO">🇨🇴 Colômbia</option>
                        <option value="AE">🇦🇪 Emirados Árabes Unidos</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-300">WhatsApp Comercial</label>
                    <input 
                      type="text" 
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={!country}
                      className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all text-white placeholder:text-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder={country && phoneMasks[country] ? phoneMasks[country].mask : "Selecione o país primeiro"}
                    />
                    <p className="text-xs text-zinc-500 mt-1">
                      {country && phoneMasks[country] 
                        ? `Exemplo: ${phoneMasks[country].code} ${phoneMasks[country].mask}` 
                        : "Selecione o país para aplicar a máscara correta"}
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <label className="text-sm font-medium text-zinc-300">Subdomínio do Painel</label>
                    <div className="flex items-center">
                      <div className="relative flex-1">
                        <input 
                          type="text" 
                          required
                          value={subdomain}
                          onChange={(e) => {
                            const val = e.target.value
                              .toLowerCase()
                              .replace(/\s+/g, '-')
                              .normalize('NFD')
                              .replace(/[\u0300-\u036f]/g, "")
                              .replace(/[^a-z0-9-]/g, '');
                            setSubdomain(val);
                          }}
                          className={`w-full px-4 py-3 bg-zinc-950 border rounded-l-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all text-white placeholder:text-zinc-600 pr-10 ${isSubdomainAvailable === false ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-zinc-800'}`}
                          placeholder="minha-empresa"
                        />
                        {subdomain.length >= 3 && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            {isCheckingSubdomain ? (
                              <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
                            ) : isSubdomainAvailable ? (
                              <Check className="w-4 h-4 text-emerald-500" />
                            ) : (
                              <X className="w-4 h-4 text-red-500" />
                            )}
                          </div>
                        )}
                      </div>
                      <div className="px-4 py-3 bg-zinc-800 border border-l-0 border-zinc-800 rounded-r-xl text-sm text-zinc-400 font-medium">
                        .cndck.com.br
                      </div>
                    </div>
                    <div className="mt-3 p-4 bg-zinc-950/50 border border-zinc-800/50 rounded-xl">
                      <p className="text-xs font-medium text-zinc-500 mb-1">Sua plataforma ficará em:</p>
                      <p className="text-sm font-mono text-zinc-300">
                        https://<span className="text-amber-500 font-bold">{subdomain || "sua-empresa"}</span>.cndck.com.br
                      </p>
                    </div>
                    {subdomain.length >= 3 && !isCheckingSubdomain && isSubdomainAvailable === true && (
                      <p className="text-sm text-emerald-500 font-medium mt-3 flex items-center gap-1.5">
                        <Check className="w-4 h-4" /> Disponível!
                      </p>
                    )}
                    {subdomain.length >= 3 && !isCheckingSubdomain && isSubdomainAvailable === false && (
                      <p className="text-sm text-red-500 font-medium mt-3 flex items-center gap-1.5">
                        <X className="w-4 h-4" /> Este domínio já está em uso
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button 
                      type="button"
                      onClick={() => setStep(1)}
                      className="py-3.5 px-6 bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl font-medium transition-all"
                    >
                      Voltar
                    </button>
                    <button 
                      type="submit"
                      disabled={isLoading || isSubdomainAvailable === false || subdomain.length < 3}
                      className="flex-1 py-3.5 bg-amber-500 hover:bg-amber-600 text-zinc-950 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin" />
                      ) : (
                        "Criar Conta Agora"
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
