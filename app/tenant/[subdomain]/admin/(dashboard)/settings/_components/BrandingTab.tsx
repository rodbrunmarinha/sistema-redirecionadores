import { Upload, Image as ImageIcon, Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import toast from "react-hot-toast";

export function BrandingTab({ data, onChange, tenantId }: { data?: any, onChange?: (data: any) => void, tenantId?: string }) {
  const supabase = createClient();
  
  const darkModeDefault = data?.darkModeDefault ?? true;
  const setDarkModeDefault = (val: boolean) => onChange?.({ ...data, darkModeDefault: val });

  const logoHorizontal = data?.logoHorizontal ?? null;
  const setLogoHorizontal = (val: string | null) => onChange?.({ ...data, logoHorizontal: val });

  const logoSquare = data?.logoSquare ?? null;
  const setLogoSquare = (val: string | null) => onChange?.({ ...data, logoSquare: val });

  const [uploadingHorizontal, setUploadingHorizontal] = useState(false);
  const [uploadingSquare, setUploadingSquare] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'horizontal' | 'square') => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
        toast.error("O arquivo deve ter no máximo 2MB.");
        return;
    }

    const setUploading = type === 'horizontal' ? setUploadingHorizontal : setUploadingSquare;
    const setter = type === 'horizontal' ? setLogoHorizontal : setLogoSquare;
    
    setUploading(true);
    
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${tenantId || 'global'}_${type}_${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage.from('branding').upload(fileName, file, {
            upsert: true
        });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage.from('branding').getPublicUrl(fileName);
        setter(publicUrl);
        toast.success("Logo enviada com sucesso!");
    } catch (error: any) {
        console.error("Erro no upload", error);
        toast.error("Erro ao enviar a imagem. Tente novamente.");
    } finally {
        setUploading(false);
        // Reset input value to allow uploading the same file again if needed
        e.target.value = '';
    }
  };

  return (
    <div className="bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 p-4 sm:p-8 space-y-10">
      
      {/* SECTION: Logotipos */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-amber-500" />
          <span>Logotipos da Empresa</span>
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Logo Horizontal */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-300 mb-3">Logo Horizontal (Header do Menu)</h4>
            <div className="flex flex-col gap-4">
              <div className="w-full sm:w-64 h-24 border-2 border-dashed border-zinc-700 rounded-xl flex items-center justify-center bg-zinc-800/50 overflow-hidden relative">
                {uploadingHorizontal ? (
                  <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                ) : logoHorizontal ? (
                  <img src={logoHorizontal} alt="Logo Horizontal" className="max-w-full max-h-full object-contain" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-zinc-400" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-xs text-zinc-400 mb-3">
                  Aparece no topo do menu lateral. Recomendado: PNG transparente, máx 2MB, proporção retangular (ex: 400x120px).
                </p>
                <div className="flex gap-2">
                  <label className={`cursor-pointer inline-flex items-center gap-2 px-3 py-2 ${uploadingHorizontal ? 'bg-zinc-700 opacity-50 cursor-not-allowed' : 'bg-zinc-800 hover:bg-zinc-700'} text-zinc-300 text-sm font-medium rounded-lg transition-colors`}>
                    <Upload className="w-4 h-4" />
                    <span>{uploadingHorizontal ? 'Enviando...' : 'Fazer Upload'}</span>
                    <input type="file" className="hidden" accept="image/png, image/jpeg, image/svg+xml" disabled={uploadingHorizontal} onChange={(e) => handleFileUpload(e, 'horizontal')} />
                  </label>
                  {!uploadingHorizontal && logoHorizontal && (
                      <button type="button" onClick={() => setLogoHorizontal(null)} className="px-3 py-2 text-sm text-red-500 hover:text-red-600 font-medium">Remover</button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Logo Ícone */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-300 mb-3">Logo Quadrado (Ícone/Avatar)</h4>
            <div className="flex flex-col gap-4">
              <div className="w-24 h-24 border-2 border-dashed border-zinc-700 rounded-xl flex items-center justify-center bg-zinc-800/50 overflow-hidden relative">
                {uploadingSquare ? (
                  <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                ) : logoSquare ? (
                  <img src={logoSquare} alt="Logo Square" className="max-w-full max-h-full object-contain" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-zinc-400" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-xs text-zinc-400 mb-3">
                  Usado em avatares e favicon. Recomendado: PNG transparente, máx 2MB, proporção 1:1 (ex: 200x200px).
                </p>
                <div className="flex gap-2">
                  <label className={`cursor-pointer inline-flex items-center gap-2 px-3 py-2 ${uploadingSquare ? 'bg-zinc-700 opacity-50 cursor-not-allowed' : 'bg-zinc-800 hover:bg-zinc-700'} text-zinc-300 text-sm font-medium rounded-lg transition-colors`}>
                    <Upload className="w-4 h-4" />
                    <span>{uploadingSquare ? 'Enviando...' : 'Fazer Upload'}</span>
                    <input type="file" className="hidden" accept="image/png, image/jpeg, image/svg+xml" disabled={uploadingSquare} onChange={(e) => handleFileUpload(e, 'square')} />
                  </label>
                  {!uploadingSquare && logoSquare && (
                      <button type="button" onClick={() => setLogoSquare(null)} className="px-3 py-2 text-sm text-red-500 hover:text-red-600 font-medium">Remover</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr className="border-zinc-800" />

      {/* SECTION: Tema */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span>Tema do Cliente</span>
        </h3>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Tema Padrão Inicial
          </label>
          <div className="flex gap-4">
            <label className={`cursor-pointer flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${!darkModeDefault ? 'border-amber-500 bg-amber-500/10 text-amber-500' : 'border-zinc-700 text-zinc-400 hover:border-amber-300'}`}>
              <input type="radio" name="theme" checked={!darkModeDefault} onChange={() => setDarkModeDefault(false)} className="hidden" />
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Modo Claro (Light)</span>
            </label>
            <label className={`cursor-pointer flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${darkModeDefault ? 'border-amber-500 bg-amber-500/10 text-amber-500' : 'border-zinc-700 text-zinc-400 hover:border-amber-300'}`}>
              <input type="radio" name="theme" checked={darkModeDefault} onChange={() => setDarkModeDefault(true)} className="hidden" />
              <span className="text-sm font-medium">Modo Escuro (Dark)</span>
            </label>
          </div>
          <p className="text-xs text-zinc-400 mt-2">
            O cliente sempre poderá alternar o tema manualmente no próprio painel dele.
          </p>
        </div>
      </div>

    </div>
  );
}
