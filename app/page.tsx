"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { PackageSearch, Store, ShieldCheck, Wallet, ArrowRight, CheckCircle2, Globe, Box, Target, Zap } from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as any } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-amber-500/30 font-sans overflow-hidden">
      
      {/* HEADER / NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/landing-logo.png" alt="Dock Drop" className="h-10 w-auto object-contain" />
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="#recursos" className="hover:text-amber-500 transition-colors">Recursos</a>
            <a href="#como-funciona" className="hover:text-amber-500 transition-colors">Como Funciona</a>
            <a href="#vantagens" className="hover:text-amber-500 transition-colors">Vantagens</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-semibold text-zinc-300 hover:text-white transition-colors">
              Fazer Login
            </Link>
            <Link href="/register" className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_25px_rgba(245,158,11,0.4)]">
              Crie sua conta já!
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="pt-40 pb-20 px-6 relative">
        {/* Background Glows */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-500/10 blur-[120px] rounded-[100%] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col items-center"
          >
            <motion.div variants={fadeIn} className="mb-8 p-4 bg-white rounded-3xl shadow-[0_0_40px_rgba(255,255,255,0.05)] border border-zinc-800">
              <img src="/landing-logo.png" alt="Dock Drop" className="w-64 md:w-80 object-contain drop-shadow-xl" />
            </motion.div>

            <motion.h1 variants={fadeIn} className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
              Seu endereço no mundo. <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                Suas compras no Brasil.
              </span>
            </motion.h1>

            <motion.p variants={fadeIn} className="text-lg md:text-xl text-zinc-400 max-w-3xl mb-10 leading-relaxed">
              A plataforma definitiva para empresas de redirecionamento de encomendas.
              Gerencie seus clientes, armazene produtos, ofereça uma loja virtual integrada e controle seus envios de forma automatizada e profissional.
            </motion.p>

            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center gap-4">
              <Link href="/register" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-extrabold rounded-2xl transition-all shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:shadow-[0_0_40px_rgba(245,158,11,0.5)] flex items-center justify-center gap-2 text-lg">
                Crie sua conta já!
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="recursos" className="py-24 bg-zinc-900/50 border-y border-zinc-800/50 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Tudo que seu negócio precisa</h2>
            <p className="text-zinc-400">Substitua planilhas desorganizadas por um sistema robusto e completo.</p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {/* Feature 1 */}
            <motion.div variants={fadeIn} className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center mb-6 group-hover:bg-amber-500/10 group-hover:text-amber-500 transition-colors text-zinc-300">
                <Box className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Gestão de Estoque (Docks)</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Cada cliente recebe um Dock virtual. Você cadastra fotos, pesos e valores dos produtos recebidos em segundos.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div variants={fadeIn} className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center mb-6 group-hover:bg-amber-500/10 group-hover:text-amber-500 transition-colors text-zinc-300">
                <PackageSearch className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Gerador de Envios Automático</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Seu cliente escolhe o que quer enviar e o sistema gera a declaração alfandegária, calcula fretes e cobra suas taxas de serviço automaticamente.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div variants={fadeIn} className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center mb-6 group-hover:bg-amber-500/10 group-hover:text-amber-500 transition-colors text-zinc-300">
                <Store className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Loja Virtual Integrada</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Venda produtos que já estão no seu armazém. O cliente compra com 1 clique e o item cai direto no Dock dele, pronto para envio.
              </p>
            </motion.div>

            {/* Feature 4 */}
            <motion.div variants={fadeIn} className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center mb-6 group-hover:bg-amber-500/10 group-hover:text-amber-500 transition-colors text-zinc-300">
                <Wallet className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Carteira Virtual (Wallet)</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Acabe com o pinga-pinga de comprovantes. O cliente adiciona saldo na plataforma e o dinheiro é debitado de forma automatizada nas compras e fretes.
              </p>
            </motion.div>

            {/* Feature 5 */}
            <motion.div variants={fadeIn} className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center mb-6 group-hover:bg-amber-500/10 group-hover:text-amber-500 transition-colors text-zinc-300">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Segurança e Permissões</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Banco de dados isolado via RLS (Row Level Security). Seus dados e os dados dos seus clientes estão 100% protegidos e confidenciais.
              </p>
            </motion.div>

            {/* Feature 6 */}
            <motion.div variants={fadeIn} className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center mb-6 group-hover:bg-amber-500/10 group-hover:text-amber-500 transition-colors text-zinc-300">
                <Target className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Painel White-Label</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Use seu próprio subdomínio, coloque sua logo, suas cores e configure suas próprias regras de negócio, taxas e opções de frete.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="como-funciona" className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Fluxo de Trabalho Descomplicado</h2>
            <p className="text-zinc-400">Do recebimento da caixa até o envio internacional em passos simples.</p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-zinc-800 -translate-y-1/2 z-0" />
            
            {[
              { step: "01", title: "Recebimento", desc: "A caixa chega no seu armazém. Você tira fotos, cadastra o peso e assinala para o dono do Dock." },
              { step: "02", title: "Aviso ao Cliente", desc: "O cliente recebe a notificação, vê os produtos no painel dele e pode até comprar mais na loja virtual." },
              { step: "03", title: "Montagem do Envio", desc: "O próprio cliente seleciona o que quer enviar, preenche a declaração e escolhe o frete." },
              { step: "04", title: "Pagamento e Despacho", desc: "O cliente paga usando o saldo da Wallet (incluindo sua taxa de serviço!) e você só precisa despachar." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.5 }}
                className="relative z-10 flex flex-col items-center text-center group"
              >
                <div className="w-16 h-16 rounded-full bg-zinc-950 border-4 border-zinc-800 group-hover:border-amber-500 transition-colors flex items-center justify-center text-xl font-black text-amber-500 mb-6">
                  {item.step}
                </div>
                <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
                <p className="text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-amber-500/5" />
        <div className="max-w-4xl mx-auto relative z-10 bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 p-12 md:p-16 rounded-[3rem] text-center shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[80px] rounded-full pointer-events-none" />
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="flex flex-col items-center"
          >
            <motion.div variants={fadeIn} className="mb-6 w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center">
              <Zap className="w-10 h-10 text-amber-500" />
            </motion.div>
            <motion.h2 variants={fadeIn} className="text-3xl md:text-5xl font-bold text-white mb-6">
              Pronto para evoluir o seu <span className="text-amber-500">Redirecionamento?</span>
            </motion.h2>
            <motion.p variants={fadeIn} className="text-zinc-400 mb-10 max-w-xl text-lg">
              Deixe a tecnologia cuidar da burocracia para você ter tempo de escalar suas operações e conquistar mais clientes.
            </motion.p>
            <motion.div variants={fadeIn}>
              <Link href="/register" className="px-10 py-5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold rounded-2xl transition-all shadow-[0_0_30px_rgba(245,158,11,0.2)] hover:shadow-[0_0_40px_rgba(245,158,11,0.4)] text-lg inline-block">
                Crie sua conta já!
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-zinc-900 bg-zinc-950 text-center">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between opacity-50 text-sm">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
             <img src="/landing-logo.png" alt="Dock Drop" className="h-6 w-auto grayscale" />
             <span className="font-bold text-white ml-2">Dock Drop © {new Date().getFullYear()}</span>
          </div>
          <p className="text-zinc-400">Todos os direitos reservados.</p>
        </div>
      </footer>

    </div>
  );
}
