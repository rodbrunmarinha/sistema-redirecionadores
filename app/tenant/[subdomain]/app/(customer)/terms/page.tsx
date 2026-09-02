import { FileText, Shield } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="font-semibold text-2xl text-zinc-800 dark:text-zinc-200 leading-tight">
          Termos de Uso
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
          Consulte os termos de uso que você aceitou e as políticas em vigor.
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-700 p-10 text-center">
        <div className="mx-auto w-16 h-16 bg-zinc-100 dark:bg-zinc-700 rounded-2xl flex items-center justify-center mb-5">
          <FileText className="w-8 h-8 text-zinc-400" />
        </div>
        
        <h3 className="font-bold text-zinc-900 dark:text-white text-xl">
          Nenhum termo específico publicado
        </h3>
        
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 mb-8 max-w-lg mx-auto">
          Este serviço ainda não publicou termos de uso próprios. Você pode consultar os termos e a política da plataforma Dock Drop abaixo.
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
          <a 
            href="#" 
            target="_blank" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-yellow-500 hover:from-orange-700 hover:to-yellow-600 text-white font-semibold rounded-xl transition-all shadow-md focus:ring-4 focus:ring-orange-500/20"
          >
            <FileText className="w-4 h-4" />
            Termos da plataforma
          </a>
          <a 
            href="#" 
            target="_blank" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 text-zinc-800 dark:text-zinc-200 font-semibold rounded-xl transition-all"
          >
            <Shield className="w-4 h-4" />
            Política de Privacidade
          </a>
        </div>
      </div>
    </div>
  );
}
