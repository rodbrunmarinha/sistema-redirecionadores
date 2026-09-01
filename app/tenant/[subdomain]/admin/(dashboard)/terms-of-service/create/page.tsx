import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronRight, FileText } from "lucide-react";
import { TermsOfServiceCreateClient } from "./TermsOfServiceCreateClient";

export default async function TermsOfServiceCreatePage(props: { params: Promise<{ subdomain: string }> }) {
  const params = await props.params;
  const subdomain = params.subdomain;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-zinc-950 -m-8">
      <div className="bg-zinc-900 border-b border-zinc-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-sm mb-4" aria-label="Breadcrumb">
            <Link 
              href={`/admin`} 
              className="text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Dashboard
            </Link>
            <ChevronRight className="w-4 h-4 text-zinc-600" />
            <Link 
              href={`/admin/terms-of-service`} 
              className="text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Termos de Uso
            </Link>
            <ChevronRight className="w-4 h-4 text-zinc-600" />
            <span className="text-zinc-100 font-medium">Novo Termo</span>
          </nav>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center flex-shrink-0 border border-zinc-700">
              <FileText className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Novo Termos de Uso</h1>
              <p className="text-zinc-400 text-sm mt-1">
                Crie um termo para o aceite no cadastro
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-6 sm:py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <TermsOfServiceCreateClient subdomain={subdomain} />
        </div>
      </div>
    </div>
  );
}
