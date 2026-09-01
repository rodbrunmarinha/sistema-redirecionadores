import { createClient } from "@/utils/supabase/server";
import { ShieldCheck, Home } from "lucide-react";
import { notFound } from "next/navigation";
import AdminLoginClient from "./AdminLoginClient";

export default async function AdminLogin(props: { params: Promise<{ subdomain: string }> }) {
  const params = await props.params;
  const subdomain = params.subdomain;

  const supabase = await createClient();
  
  const { data: tenant } = await supabase
    .from('tenants')
    .select('organization_name')
    .eq('subdomain', subdomain)
    .maybeSingle();

  if (!tenant) {
    notFound();
  }

  const organizationName = tenant.organization_name;

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 md:p-8">
      {/* Main Container */}
      <div className="w-full max-w-5xl rounded-[2.5rem] shadow-2xl shadow-amber-500/5 flex flex-col md:flex-row overflow-hidden min-h-[650px] border border-zinc-800/50">
        
        {/* Left Panel - Branding */}
        <div className="md:w-5/12 bg-zinc-900 relative flex flex-col items-center justify-center p-10 overflow-hidden border-r border-zinc-800/50">
          {/* Subtle gradient background */}
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-800/50 to-zinc-900" />
          
          <div className="relative z-10 w-full flex flex-col items-center justify-center text-center">
            <img 
              src="/dockdrop-logo.png" 
              alt="Dock Drop Logo" 
              className="w-full max-w-[280px] h-auto object-contain transition-transform duration-700 hover:scale-105 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            />
            <p className="mt-6 text-zinc-400 font-medium text-sm md:text-base max-w-[250px]">
              Seu endereço no mundo. Suas compras no Brasil.
            </p>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="md:w-7/12 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-zinc-900 relative">
          
          {/* Subtle background glow */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-amber-500/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[40%] bg-zinc-800/50 rounded-full blur-[80px]" />
          </div>

          <div className="max-w-sm mx-auto w-full relative z-10">
            
            <div className="flex items-center justify-center border border-dashed border-zinc-800 rounded-2xl p-4 mb-10 bg-zinc-950/50">
              <div className="flex flex-col items-center">
                <p className="text-xs font-medium text-zinc-500 mb-1">Administração</p>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-zinc-800 rounded-md flex items-center justify-center border border-zinc-700">
                    <Home className="w-3.5 h-3.5 text-amber-500" />
                  </div>
                  <span className="font-bold text-zinc-100">{organizationName}</span>
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-white mb-2">Bem-vindo de volta!</h2>
            <p className="text-zinc-400 mb-8 text-sm">Faça login para acessar o painel administrativo</p>

            <AdminLoginClient />

          </div>
        </div>

      </div>
    </div>
  );
}
