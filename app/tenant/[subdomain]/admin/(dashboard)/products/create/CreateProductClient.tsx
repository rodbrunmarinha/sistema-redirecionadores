// @ts-nocheck
"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createProductByAdmin } from "@/app/actions/createProductByAdmin";
import { Package, Camera, Info, X, Printer, AlertTriangle } from "lucide-react";

export default function CreateProductClient({ box }: { box: any }) {
  const router = useRouter();
  
  const [barcode, setBarcode] = useState("");
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState<number | ''>(1);
  const [weightDisplay, setWeightDisplay] = useState("");
  const [weightType, setWeightType] = useState<"unit" | "total">("unit");
  const [pricePaid, setPricePaid] = useState("");
  const [notes, setNotes] = useState("");
  
  const [isPerishable, setIsPerishable] = useState(false);
  const [expiryDate, setExpiryDate] = useState("");
  
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  
  const [webcamOpen, setWebcamOpen] = useState(false);
  const [webcamError, setWebcamError] = useState("");
  const [webcamLoading, setWebcamLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  
  const [isSaving, setIsSaving] = useState(false);
  const [labelModal, setLabelModal] = useState(false);

  
  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (!val) { setWeightDisplay(""); return; }
    let num = parseInt(val, 10) / 1000;
    setWeightDisplay(num.toLocaleString("pt-BR", { minimumFractionDigits: 3, maximumFractionDigits: 3 }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (!val) { setPricePaid(""); return; }
    let num = parseInt(val, 10) / 100;
    setPricePaid(num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const openWebcam = async () => {
    setWebcamError("");
    setWebcamLoading(true);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setStream(mediaStream);
      setWebcamOpen(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
    } catch (err) {
      setWebcamError("Não foi possível acessar a câmera.");
    } finally {
      setWebcamLoading(false);
    }
  };

  const closeWebcam = () => {
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
      setStream(null);
    }
    setWebcamOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(blob => {
          if (blob) {
            const file = new File([blob], `webcam-${Date.now()}.jpg`, { type: "image/jpeg" });
            setPhotoFile(file);
            setPhotoPreview(URL.createObjectURL(file));
            closeWebcam();
          }
        }, "image/jpeg", 0.9);
      }
    }
  };

  const generateInternalCode = () => {
    const chars = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = 'BP-';
    for (let i = 0; i < 6; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    setBarcode(code);
  };

  const handleSubmit = async (saveAndAdd: boolean) => {
    if (isSaving || !name || !weightDisplay) {
        alert("Preencha o nome e o peso do produto!");
        return;
    }
    setIsSaving(true);
    
    const formData = new FormData();
    formData.append("received_box_id", box.id);
    if (barcode) formData.append("barcode", barcode);
    formData.append("name", name);
    formData.append("quantity", quantity.toString());
    
    const w = parseFloat(weightDisplay.replace(/\./g, '').replace(',', '.'));
    formData.append("weight", isNaN(w) ? "0" : w.toString());
    formData.append("weight_mode", weightType);
    if (pricePaid) {
      const p = parseFloat(pricePaid.replace(/,/g, ''));
      formData.append("price_paid", isNaN(p) ? "0" : p.toString());
    }
    if (notes) formData.append("notes", notes);
    formData.append("is_perishable", isPerishable.toString());
    if (isPerishable && expiryDate) formData.append("expiry_date", expiryDate);
    if (photoFile) formData.append("photo", photoFile);
    if (saveAndAdd) formData.append("save_and_add", "1");

    const res = await createProductByAdmin(formData);
    setIsSaving(false);
    
    if (res.error) {
      alert(res.error);
    } else {
      if (saveAndAdd) {
        setBarcode(""); setName(""); setQuantity(1); setWeightDisplay("");
        setPricePaid(""); setNotes(""); setPhotoFile(null); setPhotoPreview(null);
        setIsPerishable(false); setExpiryDate("");
        window.scrollTo({ top: 0, behavior: 'smooth' });
        alert("Produto cadastrado! Pode adicionar o próximo.");
      } else {
        router.push(`/admin/boxes/${box.id}`);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      
      <div className="flex flex-col gap-4">
        <nav className="flex items-center gap-2 text-sm">
          <Link href="/admin/boxes" className="text-zinc-400 hover:text-white transition-colors">Caixas</Link>
          <span className="text-zinc-600">/</span>
          <Link href={`/admin/boxes/${box.id}`} className="text-zinc-400 hover:text-white transition-colors uppercase font-mono">#{box.id.substring(0,6)}</Link>
          <span className="text-zinc-600">/</span>
          <span className="text-white font-medium">Catalogar Produto</span>
        </nav>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg shrink-0">
              <Package className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Catalogar Produto</h1>
              <div className="flex gap-2 mt-1.5 text-sm font-semibold">
                <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">Caixa #{box.id.substring(0,6).toUpperCase()}</span>
                <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">Dock {box.customer?.suite_number}</span>
              </div>
            </div>
          </div>
          <Link href={`/admin/boxes/${box.id}`} className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition text-zinc-400 hover:text-white hidden sm:block">
            <X className="w-5 h-5" />
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-lg border-l-4 border-l-blue-500">
          <div className="bg-zinc-900/50 px-6 py-4 border-b border-zinc-800">
            <h3 className="text-lg font-bold text-blue-400 flex items-center gap-2">
              <Info className="w-5 h-5" /> 1. Identificação do Produto
            </h3>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-zinc-300 mb-2">Código de Barras (Opcional)</label>
              <input type="text" value={barcode} onChange={e => setBarcode(e.target.value)} placeholder="Escaneie ou digite" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none font-mono text-lg" />
              <div className="mt-3 flex gap-2">
                <button type="button" onClick={generateInternalCode} className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 text-xs font-semibold transition">Gerar código</button>
                {barcode && <button type="button" onClick={() => setLabelModal(true)} className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:bg-zinc-700 text-xs font-semibold transition flex items-center gap-1"><Printer className="w-3.5 h-3.5" /> Etiqueta</button>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-zinc-300 mb-2">Nome do Produto <span className="text-red-500">*</span></label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Ex: Tênis Nike" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-lg border-l-4 border-l-purple-500">
          <div className="bg-zinc-900/50 px-6 py-4 border-b border-zinc-800">
            <h3 className="text-lg font-bold text-purple-400 flex items-center gap-2">
              <Package className="w-5 h-5" /> 2. Detalhes (Qtd e Peso)
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-zinc-300 mb-2">Quantidade <span className="text-red-500">*</span></label>
                <input type="number" min="1" value={quantity} onChange={e => setQuantity(parseInt(e.target.value.replace(/\D/g, '')) || '')} required className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 outline-none text-lg font-semibold" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-zinc-300">Peso (kg) <span className="text-red-500">*</span></label>
                  <div className="flex bg-zinc-950 p-1 rounded-lg border border-zinc-800">
                    <button type="button" onClick={() => setWeightType("unit")} className={`px-3 py-1 rounded text-xs font-semibold transition ${weightType === 'unit' ? 'bg-zinc-800 text-purple-400' : 'text-zinc-500 hover:text-zinc-300'}`}>Unit</button>
                    <button type="button" onClick={() => setWeightType("total")} className={`px-3 py-1 rounded text-xs font-semibold transition ${weightType === 'total' ? 'bg-zinc-800 text-purple-400' : 'text-zinc-500 hover:text-zinc-300'}`}>Total</button>
                  </div>
                </div>
                <input type="text" value={weightDisplay} onChange={handleWeightChange} placeholder="0,000" required className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 outline-none text-lg font-semibold" />
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-zinc-800">
              <label className="block text-sm font-semibold text-zinc-300 mb-2">Valor Declarado USD (Opcional)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-semibold">$</span>
                <input type="text" value={pricePaid} onChange={handlePriceChange} placeholder="0.00" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-4 py-3 text-white focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-lg border-l-4 border-l-emerald-500">
          <div className="bg-zinc-900/50 px-6 py-4 border-b border-zinc-800">
            <h3 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
              <Camera className="w-5 h-5" /> 3. Foto e Observações
            </h3>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-zinc-300 mb-3">Foto do Produto</label>
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="shrink-0">
                  {photoPreview ? (
                    <img src={photoPreview} className="w-32 h-32 rounded-xl object-cover ring-2 ring-emerald-500" alt="Preview" />
                  ) : (
                    <div className="w-32 h-32 rounded-xl bg-zinc-950 border-2 border-dashed border-zinc-800 flex items-center justify-center"><Camera className="w-8 h-8 text-zinc-600" /></div>
                  )}
                </div>
                <div className="flex-1 space-y-3">
                  <input type="file" ref={photoInputRef} accept="image/*" onChange={handleFileChange} className="hidden" />
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => photoInputRef.current?.click()} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-sm font-semibold transition">Escolher do Dispositivo</button>
                    <button type="button" onClick={openWebcam} className="px-4 py-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-xl text-sm font-semibold transition">Usar Câmera</button>
                    {photoPreview && <button type="button" onClick={() => { setPhotoPreview(null); setPhotoFile(null); }} className="px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl text-sm font-semibold transition">Remover</button>}
                  </div>
                  
                  {webcamOpen && (
                    <div className="mt-4 p-4 bg-zinc-950 border border-zinc-800 rounded-xl">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-zinc-300">Câmera Ativa</span>
                        <button type="button" onClick={closeWebcam} className="text-xs text-red-400 hover:text-red-300">Fechar</button>
                      </div>
                      <video ref={videoRef} playsInline className="w-full max-w-sm rounded-lg bg-black mb-3"></video>
                      <button type="button" onClick={capturePhoto} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-bold w-full max-w-sm">Capturar Agora</button>
                      <canvas ref={canvasRef} className="hidden"></canvas>
                    </div>
                  )}
                  {webcamError && <p className="text-xs text-red-400">{webcamError}</p>}
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-zinc-300 mb-2">Observações</label>
              <textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Produto com defeito, sem caixa original..." className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-lg border-l-4 border-l-orange-500">
          <div className="bg-zinc-900/50 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
               <AlertTriangle className="w-5 h-5 text-orange-500" />
               <div>
                 <h3 className="text-base font-bold text-zinc-200">Este produto é perecível?</h3>
                 <p className="text-xs text-zinc-500">Ative para informar validade</p>
               </div>
            </div>
            <button type="button" onClick={() => setIsPerishable(!isPerishable)} className={`relative inline-flex h-7 w-12 items-center rounded-full transition ${isPerishable ? 'bg-orange-500' : 'bg-zinc-700'}`}>
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${isPerishable ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          {isPerishable && (
            <div className="p-6 border-t border-zinc-800">
              <label className="block text-sm font-semibold text-zinc-300 mb-2">Data de Vencimento <span className="text-red-500">*</span></label>
              <input type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} required={isPerishable} className="w-full md:w-1/2 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orange-500 outline-none" />
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
          <Link href={`/admin/boxes/${box.id}`} className="px-6 py-3.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-semibold text-center transition">Voltar</Link>
          <button type="button" onClick={() => handleSubmit(true)} disabled={isSaving} className="px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/20 transition disabled:opacity-50">
            {isSaving ? "Salvando..." : "💨 Salvar e Adicionar Outro"}
          </button>
          <button type="button" onClick={() => handleSubmit(false)} disabled={isSaving} className="px-6 py-3.5 border-2 border-emerald-600 text-emerald-500 hover:bg-emerald-500/10 rounded-xl font-bold transition disabled:opacity-50">
            {isSaving ? "Salvando..." : "✓ Salvar e Concluir"}
          </button>
        </div>

      </div>

      {labelModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 print:bg-white print:p-0">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xs overflow-hidden relative print:w-full print:max-w-none print:shadow-none print:rounded-none">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 print:hidden">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2"><Printer className="w-5 h-5 text-purple-500" /> Etiqueta</h3>
              <button onClick={() => setLabelModal(false)} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="p-6 text-center bg-white print:p-0 print:m-0">
              <style>{`@media print { body * { visibility: hidden; } .fixed, .fixed * { visibility: visible; } .fixed { position: absolute; left: 0; top: 0; width: 100%; height: 100%; display: block; background: white !important;} }`}</style>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">DOCKDROP</p>
              <p className="text-sm font-extrabold text-gray-900 leading-tight mb-2 uppercase">{name || 'Novo Produto'}</p>
              <p className="text-xs text-gray-600 mb-1">Dock {box.customer?.suite_number}</p>
              <p className="text-xs text-gray-600 mb-4 font-mono font-bold">CAIXA: {box.id.substring(0,6).toUpperCase()}</p>
              <div className="flex justify-center mb-2">
                 <div className="w-24 h-24 border-4 border-black p-1 flex items-center justify-center">
                   <div className="grid grid-cols-3 grid-rows-3 gap-1 w-full h-full">
                     <div className="bg-black"></div><div className="bg-white"></div><div className="bg-black"></div>
                     <div className="bg-white"></div><div className="bg-black"></div><div className="bg-black"></div>
                     <div className="bg-black"></div><div className="bg-black"></div><div className="bg-white"></div>
                   </div>
                 </div>
              </div>
              <p className="font-mono text-[10px] font-bold text-gray-800 tracking-widest mt-2">{barcode}</p>
            </div>

            <div className="flex gap-3 px-5 py-4 border-t border-gray-200 bg-gray-50 print:hidden">
              <button onClick={() => setLabelModal(false)} className="flex-1 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-200 rounded-xl transition">Fechar</button>
              <button onClick={() => window.print()} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-xl transition"><Printer className="w-4 h-4" /> Imprimir</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
