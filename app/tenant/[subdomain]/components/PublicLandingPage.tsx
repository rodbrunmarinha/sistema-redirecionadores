import React from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import * as LucideIcons from "lucide-react";

export default function PublicLandingPage({ config, subdomain }: { config: any, subdomain: string }) {
  const c = {
    heroTitle: config.heroTitle || "Seu endereço no mundo. Suas compras no Brasil.",
    heroSubtitle: config.heroSubtitle || "A melhor plataforma para gerenciar suas compras internacionais.",
    heroImage: config.heroImage || "",
    heroBanner: config.heroBanner || "",
    secondaryBanner: config.secondaryBanner || "",
    themeColor: config.themeColor || "amber", // can map to tailwind colors or use custom hex
    services: config.services || [],
    howItWorks: config.howItWorks || [],
    social: config.social || { whatsapp: "", instagram: "", tiktok: "" },
  };

  // Convert theme name to class names
  const themeColors: Record<string, { bg: string, text: string, button: string, glow: string }> = {
    amber: { bg: "bg-amber-500", text: "text-amber-500", button: "bg-amber-500 hover:bg-amber-600 text-zinc-950", glow: "from-amber-400 to-orange-500" },
    blue: { bg: "bg-blue-500", text: "text-blue-500", button: "bg-blue-500 hover:bg-blue-600 text-white", glow: "from-blue-400 to-cyan-500" },
    emerald: { bg: "bg-emerald-500", text: "text-emerald-500", button: "bg-emerald-500 hover:bg-emerald-600 text-white", glow: "from-emerald-400 to-teal-500" },
    rose: { bg: "bg-rose-500", text: "text-rose-500", button: "bg-rose-500 hover:bg-rose-600 text-white", glow: "from-rose-400 to-pink-500" },
    violet: { bg: "bg-violet-500", text: "text-violet-500", button: "bg-violet-500 hover:bg-violet-600 text-white", glow: "from-violet-400 to-fuchsia-500" },
  };

  const theme = themeColors[c.themeColor] || themeColors.amber;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans overflow-x-hidden">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-zinc-900">
            {c.heroImage ? (
              <img src={c.heroImage} alt="Logo" className="h-10 w-auto object-contain" />
            ) : (
              <span>{subdomain.toUpperCase()}</span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <a href="/app/login" className="text-sm font-semibold text-zinc-600 hover:text-zinc-900 transition-colors">
              Entrar
            </a>
            <a href="/app/register" className={`hidden sm:flex items-center gap-2 px-5 py-2.5 font-bold rounded-xl transition-all text-white ${theme.bg} hover:brightness-110`}>
              Criar Conta
            </a>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="pt-40 pb-20 px-6 relative overflow-hidden">
        {c.heroBanner && (
          <div className="absolute inset-0 z-0">
            <img src={c.heroBanner} alt="Banner" className="w-full h-full object-cover opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-50" />
          </div>
        )}
        <div className={`absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] ${theme.bg} opacity-10 blur-[120px] rounded-[100%] pointer-events-none z-0`} />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-zinc-900 mb-6">
            <span className={`text-transparent bg-clip-text bg-gradient-to-r whitespace-pre-line ${theme.glow}`}>
              {c.heroTitle}
            </span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-600 max-w-2xl mx-auto mb-10 leading-relaxed whitespace-pre-line">
            {c.heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/app/register" className={`px-8 py-4 font-extrabold rounded-2xl transition-all flex items-center justify-center gap-2 text-lg text-white ${theme.bg} hover:brightness-110 shadow-lg shadow-${c.themeColor}-500/20`}>
              Crie sua conta já!
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>

          {c.secondaryBanner && (
            <div className="mt-16 relative rounded-3xl overflow-hidden shadow-2xl border border-zinc-200">
              <img src={c.secondaryBanner} alt="Destaque" className="w-full object-cover max-h-[500px]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </div>
          )}
        </div>
      </section>

      {/* SERVICES SECTION */}
      {c.services.length > 0 && (
        <section className="py-24 bg-white border-y border-zinc-200 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">Nossos Serviços</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {c.services.map((srv: any, i: number) => {
                const IconComponent = (LucideIcons as any)[srv.icon] || LucideIcons.Box;
                return (
                  <div key={i} className="p-8 rounded-3xl bg-zinc-50 border border-zinc-200 hover:border-zinc-300 hover:shadow-md transition-all">
                    <div className={`w-14 h-14 rounded-2xl bg-white shadow-sm border border-zinc-100 flex items-center justify-center mb-6 ${theme.text}`}>
                      <IconComponent className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900 mb-3">{srv.title}</h3>
                    <p className="text-zinc-600 text-sm leading-relaxed">{srv.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* HOW IT WORKS */}
      {c.howItWorks.length > 0 && (
        <section className="py-24 px-6 relative overflow-hidden bg-zinc-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">Como Funciona</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-zinc-200 -translate-y-1/2 z-0" />
              {c.howItWorks.map((step: any, i: number) => (
                <div key={i} className="relative z-10 flex flex-col items-center text-center">
                  <div className={`w-16 h-16 rounded-full bg-white shadow-sm border-4 border-zinc-100 flex items-center justify-center text-xl font-black ${theme.text} mb-6`}>
                    0{i + 1}
                  </div>
                  <h4 className="text-lg font-bold text-zinc-900 mb-2">{step.title}</h4>
                  <p className="text-zinc-600 text-sm leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="py-12 border-t border-zinc-200 bg-white text-center">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-center text-sm">
          <p className="text-zinc-500 mb-2">© {new Date().getFullYear()} {subdomain.toUpperCase()}. Todos os direitos reservados.</p>
          <div className="flex gap-4">
            {c.social.instagram && <a href={c.social.instagram} target="_blank" className="text-zinc-400 hover:text-zinc-900">Instagram</a>}
            {c.social.whatsapp && <a href={c.social.whatsapp} target="_blank" className="text-zinc-400 hover:text-zinc-900">WhatsApp</a>}
            {c.social.tiktok && <a href={c.social.tiktok} target="_blank" className="text-zinc-400 hover:text-zinc-900">TikTok</a>}
          </div>
        </div>
      </footer>
    </div>
  );
}
