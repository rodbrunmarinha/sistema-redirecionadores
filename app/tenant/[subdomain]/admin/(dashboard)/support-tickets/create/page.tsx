import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";
import CreateTicketClient from "./CreateTicketClient";

export default async function CreateTicketPage(props: {
  params: Promise<{ subdomain: string }>;
}) {
  const params = await props.params;
  const subdomain = params.subdomain;
  
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: tenant } = await supabase
    .from('tenants')
    .select('id')
    .eq('subdomain', subdomain)
    .single();

  if (!tenant) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      
      {/* Header Premium */}
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 shadow-lg shadow-orange-500/10">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 pointer-events-none blur-xl"></div>
        <div className="absolute -bottom-16 -left-8 w-64 h-64 rounded-full bg-white/5 pointer-events-none blur-2xl"></div>
        
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-sm mb-4" aria-label="Breadcrumb">
            <Link href="/admin" className="text-white/70 hover:text-white transition-colors">
              Dashboard
            </Link>
            <ChevronRight className="w-4 h-4 text-white/50 shrink-0" />
            <Link href="/admin/support-tickets" className="text-white/70 hover:text-white transition-colors">
              Tickets de Clientes
            </Link>
            <ChevronRight className="w-4 h-4 text-white/50 shrink-0" />
            <span className="text-white font-medium">Abrir chamado</span>
          </nav>
          
          <div className="flex items-center gap-4">
            <Link href="/admin/support-tickets" className="p-2.5 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white rounded-xl transition shrink-0 border border-white/20">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Abrir chamado para um cliente</h1>
              <p className="text-amber-100/80 text-sm mt-1">Registre uma solicitação em nome do cliente</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CreateTicketClient subdomain={subdomain} />
      </div>
    </div>
  );
}
