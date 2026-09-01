"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, UploadCloud, X, CheckCircle2 } from "lucide-react";

export default function NewTicketPage() {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles].slice(0, 5)); // max 5
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/app/support" 
          className="p-2 hover:bg-zinc-100 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-zinc-500" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 leading-tight">
            Novo Chamado
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
            Abra um ticket e nossa equipe responderá em breve.
          </p>
        </div>
      </div>

      {/* Form Card */}
      <form className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Assunto */}
          <div>
            <label htmlFor="subject" className="block text-sm font-semibold text-zinc-900 mb-2">
              Assunto
            </label>
            <input 
              type="text" 
              id="subject" 
              name="subject" 
              required
              placeholder="Digite o assunto do ticket..."
              className="w-full rounded-xl border border-zinc-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm py-2.5 px-4 outline-none transition-shadow"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Categoria */}
            <div>
              <label htmlFor="category" className="block text-sm font-semibold text-zinc-900 mb-2">
                Categoria
              </label>
              <select 
                id="category" 
                name="category" 
                required
                className="w-full rounded-xl border border-zinc-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm py-2.5 px-4 outline-none appearance-none bg-white transition-shadow"
                style={{
                  backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center',
                  backgroundSize: '1em'
                }}
              >
                <option value="general">Geral</option>
                <option value="financial">Financeiro</option>
                <option value="technical">Técnico</option>
                <option value="shipping">Envios</option>
                <option value="store">Loja Online</option>
                <option value="account">Minha Conta</option>
                <option value="groups">Grupo de Compras</option>
                <option value="other">Outro</option>
              </select>
            </div>

            {/* Prioridade */}
            <div>
              <label htmlFor="priority" className="block text-sm font-semibold text-zinc-900 mb-2">
                Prioridade
              </label>
              <select 
                id="priority" 
                name="priority" 
                required
                defaultValue="medium"
                className="w-full rounded-xl border border-zinc-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm py-2.5 px-4 outline-none appearance-none bg-white transition-shadow"
                style={{
                  backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center',
                  backgroundSize: '1em'
                }}
              >
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
                <option value="urgent">Urgente</option>
              </select>
            </div>
          </div>

          {/* Mensagem */}
          <div>
            <label htmlFor="message" className="block text-sm font-semibold text-zinc-900 mb-2">
              Mensagem
            </label>
            <textarea 
              id="message" 
              name="message" 
              rows={6} 
              required
              placeholder="Conte-nos mais detalhes sobre sua solicitação..."
              className="w-full rounded-xl border border-zinc-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm py-3 px-4 outline-none transition-shadow resize-y"
            ></textarea>
          </div>

          {/* Anexos */}
          <div>
            <label className="block text-sm font-semibold text-zinc-900 mb-2">
              Anexos (opcional)
            </label>
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-zinc-300 rounded-xl p-6 text-center hover:border-blue-500 hover:bg-blue-50/50 transition-colors cursor-pointer group"
            >
              <UploadCloud className="w-8 h-8 mx-auto text-zinc-400 mb-3 group-hover:text-blue-500 transition-colors" />
              <p className="text-sm font-medium text-zinc-700">
                Clique para fazer upload ou arraste arquivos aqui
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                Máximo 5 arquivos, 10MB cada (Imagens, PDF, DOC, TXT, ZIP)
              </p>
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple 
              accept="image/*,.pdf,.doc,.docx,.txt,.zip"
              className="hidden" 
            />

            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                {files.map((file, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-zinc-200 bg-zinc-50">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span className="text-sm text-zinc-700 font-medium truncate">
                        {file.name}
                      </span>
                      <span className="text-xs text-zinc-500 flex-shrink-0">
                        {(file.size / 1024 / 1024).toFixed(1)} MB
                      </span>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => removeFile(i)}
                      className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 sm:px-8 py-5 bg-zinc-50 border-t border-zinc-200 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 sm:gap-4">
          <Link 
            href="/app/support" 
            className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-zinc-600 hover:text-zinc-900 transition-colors text-center"
          >
            Cancelar
          </Link>
          <button 
            type="submit" 
            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5"
          >
            Enviar Chamado
          </button>
        </div>
      </form>
    </div>
  );
}
