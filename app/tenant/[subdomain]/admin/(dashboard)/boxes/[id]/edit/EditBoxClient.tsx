"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { toast } from "react-hot-toast";
import {
  ChevronRight,
  Package,
  Printer,
  Calendar,
  User,
  Info,
  MapPin,
  Clock,
  Camera,
  Upload,
  X,
  FileText
} from "lucide-react";

export default function EditBoxClient({ box, creatorName, subdomain }: { box: any, creatorName: string, subdomain: string }) {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [dock, setDock] = useState(box.customer?.suite_number || "");
  const [trackingCode, setTrackingCode] = useState(box.tracking_number || "");
  const [storeName, setStoreName] = useState(box.store_name || "");
  const [storeLocation, setStoreLocation] = useState(box.store_location || "");
  const [receivedAt, setReceivedAt] = useState(
    box.received_at ? new Date(box.received_at).toISOString().slice(0, 16) : ""
  );
  const [notes, setNotes] = useState(box.notes || "");

  // Photo state
  const initialPhotoUrl = box.photos && box.photos.length > 0 
    ? (box.photos[0].startsWith('http') ? box.photos[0] : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/boxes/${box.photos[0]}`)
    : null;
    
  const [photoPreview, setPhotoPreview] = useState<string | null>(initialPhotoUrl);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  
  // Webcam state
  const [webcamOpen, setWebcamOpen] = useState(false);
  const [webcamLoading, setWebcamLoading] = useState(false);
  const [webcamError, setWebcamError] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const getStatusText = (status: string) => {
    switch (status) {
      case 'received': return 'Recebida';
      case 'processing': return 'Em Processamento';
      case 'shipped': return 'Enviada';
      default: return status;
    }
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
      closeWebcam();
    }
  };

  const openWebcam = async () => {
    setWebcamError("");
    setWebcamLoading(true);
    closeWebcam();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false
      });
      streamRef.current = stream;
      setWebcamOpen(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 100);
    } catch (error) {
      console.error(error);
      setWebcamError("Não foi possível acessar a câmera. Verifique as permissões.");
    } finally {
      setWebcamLoading(false);
    }
  };

  const closeWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }
    setWebcamOpen(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(blob => {
        if (blob) {
          const file = new File([blob], `webcam-${Date.now()}.jpg`, { type: 'image/jpeg' });
          setPhotoFile(file);
          setPhotoPreview(URL.createObjectURL(file));
          closeWebcam();
        }
      }, 'image/jpeg', 0.9);
    }
  };

  useEffect(() => {
    return () => closeWebcam();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Resolve Customer by Dock
      let customerId = box.customer_id;
      if (dock.toString() !== (box.customer?.suite_number || "").toString()) {
        const { data: customer, error: custErr } = await supabase
          .from('profiles')
          .select('id')
          .eq('suite_number', dock)
          
          .single();
          
        if (custErr || !customer) {
          throw new Error(`Dock ${dock} não encontrada.`);
        }
        customerId = customer.id;
      }

      // 2. Upload photo if exists
      let uploadedPhotoPaths = box.photos || [];
      if (photoFile) {
        const fileExt = photoFile.name.split('.').pop();
        const fileName = `${box.id}-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('boxes')
          .upload(fileName, photoFile);
          
        if (uploadError) throw uploadError;
        uploadedPhotoPaths = [fileName]; // Replace with new photo
      }


      // 3. Update box
      const { error: updateError } = await supabase
        .from('boxes')
        .update({
          customer_id: customerId,
          tracking_number: trackingCode,
          store_name: storeName,
          store_location: storeLocation,
          received_at: receivedAt ? new Date(receivedAt).toISOString() : null,
          notes: notes,
          photos: uploadedPhotoPaths
        })
        .eq('id', box.id);

      if (updateError) throw updateError;
      
      // 4. Cascade Ownership: Update products if customer changed
      if (customerId !== box.customer_id) {
         await supabase
           .from('products')
           .update({ customer_id: customerId })
           .eq('box_id', box.id);
      }

      
      toast.success("Caixa atualizada com sucesso!");
      router.push(`/admin/boxes/${box.id}`);
      router.refresh();
      
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Erro ao atualizar a caixa");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 pb-20">
      {/* Header Gradient */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 shadow-lg shadow-orange-500/10">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10"></div>
            <div className="absolute -bottom-16 -left-8 w-64 h-64 rounded-full bg-white/5"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <nav className="flex items-center gap-2 text-sm mb-4 text-orange-100/70" aria-label="Breadcrumb">
                <Link href="/admin" className="hover:text-white transition-colors truncate">Dashboard</Link>
                <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                <Link href="/admin/boxes" className="hover:text-white transition-colors truncate">Caixas Recebidas</Link>
                <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                <Link href={`/admin/boxes/${box.id}`} className="hover:text-white transition-colors truncate">#{box.id.substring(0,4)}</Link>
                <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                <span className="text-white font-medium truncate">Editar Caixa</span>
            </nav>
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                    <div className="p-3 bg-white/20 rounded-2xl shadow-lg shrink-0">
                        <Package className="w-8 h-8 text-white" />
                    </div>
                    <div className="min-w-0">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-white truncate tracking-tight">Editar Caixa Recebida</h1>
                        <p className="text-orange-100 text-sm mt-0.5 truncate font-medium">Caixa #{box.id.substring(0,8)}</p>
                    </div>
                </div>
                <a href={`/admin/boxes/${box.id}/label`} target="_blank" className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 border border-white/30 text-white font-bold rounded-xl transition shadow-sm active:scale-95 text-sm shrink-0">
                    <Printer className="w-4 h-4" />
                    Etiqueta
                </a>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Stats Cards Native Dark Mode */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {/* Total Produtos */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex items-center justify-between">
                <div>
                    <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1">Produtos</p>
                    <p className="text-3xl font-extrabold text-white">{box.products?.length || 0}</p>
                </div>
                <div className="bg-orange-500/10 text-orange-500 p-3 rounded-xl">
                    <Package className="w-7 h-7" />
                </div>
            </div>

            {/* Status */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex items-center justify-between">
                <div>
                    <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1">Status</p>
                    <p className="text-2xl font-extrabold text-emerald-400">{getStatusText(box.status)}</p>
                </div>
                <div className="bg-emerald-500/10 text-emerald-500 p-3 rounded-xl">
                    <Info className="w-7 h-7" />
                </div>
            </div>

            {/* Data Recebimento */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex items-center justify-between">
                <div>
                    <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1">Recebido em</p>
                    <p className="text-xl font-extrabold text-white">
                      {box.received_at ? new Date(box.received_at).toLocaleDateString('pt-BR') : "-"}
                    </p>
                    <p className="text-zinc-500 text-xs mt-0.5 font-medium">
                      {box.received_at ? new Date(box.received_at).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'}) : ""}
                    </p>
                </div>
                <div className="bg-blue-500/10 text-blue-500 p-3 rounded-xl">
                    <Calendar className="w-7 h-7" />
                </div>
            </div>

            {/* Criado por */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex items-center justify-between">
                <div>
                    <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1">Registrado por</p>
                    <p className="text-lg font-extrabold text-white truncate max-w-[120px]">{creatorName}</p>
                    <p className="text-zinc-500 text-xs mt-0.5 font-medium">
                      {new Date(box.created_at).toLocaleDateString('pt-BR')}
                    </p>
                </div>
                <div className="bg-purple-500/10 text-purple-500 p-3 rounded-xl">
                    <User className="w-7 h-7" />
                </div>
            </div>
        </div>

        {/* Form Card */}
        <div className="bg-zinc-900 shadow-xl rounded-3xl border border-zinc-800 overflow-hidden">
            {/* Header do Form */}
            <div className="bg-zinc-800/50 px-8 py-6 border-b border-zinc-800">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-zinc-800 rounded-xl text-zinc-300 border border-zinc-700">
                        <FileText className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-extrabold text-white">Informações da Caixa</h3>
                        <p className="text-zinc-400 text-sm mt-0.5">Atualize os dados da caixa recebida</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Dock */}
                    <div>
                        <label className="block text-sm font-bold text-zinc-300 mb-2">
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-orange-500" />
                                Número do Dock
                                <span className="text-red-500">*</span>
                            </div>
                        </label>
                        <input type="text" value={dock} onChange={e => setDock(e.target.value)} required placeholder="Ex: 1001" className="block w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-white font-semibold" />
                    </div>

                    {/* Código de Rastreio */}
                    <div>
                        <label className="block text-sm font-bold text-zinc-300 mb-2">
                            <div className="flex items-center gap-2">
                                <Package className="w-4 h-4 text-orange-500" />
                                Código de Rastreio
                            </div>
                        </label>
                        <input type="text" value={trackingCode} onChange={e => setTrackingCode(e.target.value)} placeholder="Ex: BR123456789US" className="block w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-white font-semibold" />
                    </div>

                    {/* Loja */}
                    <div>
                        <label className="block text-sm font-bold text-zinc-300 mb-2">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-orange-500" />
                                Nome da Loja
                            </div>
                        </label>
                        <input type="text" value={storeName} onChange={e => setStoreName(e.target.value)} placeholder="Ex: Amazon, Shein, AliExpress" className="block w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-white font-semibold" />
                    </div>

                    {/* Filial */}
                    <div>
                        <label className="block text-sm font-bold text-zinc-300 mb-2">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-orange-500" />
                                Filial
                                <span className="text-xs font-normal text-zinc-500">(opcional)</span>
                            </div>
                        </label>
                        <input type="text" value={storeLocation} onChange={e => setStoreLocation(e.target.value)} placeholder="Ex: Orlando, FL" className="block w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-white font-semibold" />
                    </div>

                    {/* Data de Recebimento */}
                    <div>
                        <label className="block text-sm font-bold text-zinc-300 mb-2">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-orange-500" />
                                Data de Recebimento
                            </div>
                        </label>
                        <input type="datetime-local" value={receivedAt} onChange={e => setReceivedAt(e.target.value)} className="block w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-white font-semibold" />
                    </div>
                </div>

                {/* Foto da Caixa */}
                <div className="mt-8">
                    <label className="block text-sm font-bold text-zinc-300 mb-3">
                        <div className="flex items-center gap-2">
                            <Camera className="w-4 h-4 text-orange-500" />
                            Foto da Caixa
                        </div>
                    </label>
                    
                    <div className="flex flex-col sm:flex-row items-start gap-6">
                        {/* Preview */}
                        <div className="flex-shrink-0">
                            <div className="relative group">
                                {!photoPreview ? (
                                  <div className="h-40 w-40 rounded-2xl overflow-hidden bg-zinc-950 flex items-center justify-center border-2 border-dashed border-zinc-800">
                                      <div className="text-center">
                                          <Camera className="h-10 w-10 text-zinc-700 mx-auto" />
                                          <p className="text-xs font-semibold text-zinc-500 mt-2">Sem foto</p>
                                      </div>
                                  </div>
                                ) : (
                                  <div className="h-40 w-40 rounded-2xl overflow-hidden border-2 border-orange-500/50 relative">
                                      <img src={photoPreview} className="h-full w-full object-cover" />
                                      <button type="button" onClick={() => { setPhotoPreview(null); setPhotoFile(null); }} className="absolute top-2 right-2 h-7 w-7 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-red-500 transition">
                                        <X className="w-4 h-4" />
                                      </button>
                                  </div>
                                )}
                            </div>
                        </div>
                        
                        {/* Upload Controls */}
                        <div className="flex-1 w-full">
                            <div className="border-2 border-dashed border-zinc-800 rounded-2xl p-6 hover:border-orange-500/50 transition-colors bg-zinc-950/50">
                                <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handlePhotoSelect} />

                                <div className="flex flex-wrap gap-3">
                                    <button type="button" onClick={() => { fileInputRef.current?.removeAttribute('capture'); fileInputRef.current?.click(); }} className="inline-flex items-center gap-2 rounded-xl bg-zinc-800 px-4 py-2.5 text-sm font-bold text-zinc-300 transition hover:bg-zinc-700 hover:text-white">
                                        <Upload className="h-4 w-4" />
                                        Escolher imagem
                                    </button>

                                    <button type="button" onClick={() => { fileInputRef.current?.setAttribute('capture', 'environment'); fileInputRef.current?.click(); }} className="inline-flex items-center gap-2 rounded-xl bg-orange-500/10 px-4 py-2.5 text-sm font-bold text-orange-500 transition hover:bg-orange-500/20">
                                        <Camera className="h-4 w-4" />
                                        Tirar foto (Celular)
                                    </button>

                                    <button type="button" onClick={openWebcam} className="inline-flex items-center gap-2 rounded-xl bg-amber-500/10 px-4 py-2.5 text-sm font-bold text-amber-500 transition hover:bg-amber-500/20">
                                        <Camera className="h-4 w-4" />
                                        Webcam (PC)
                                    </button>
                                </div>

                                <p className="mt-3 text-xs font-medium text-zinc-500">PNG, JPG até 5MB</p>
                                
                                {photoFile && (
                                  <p className="mt-2 text-sm text-zinc-400">
                                      Arquivo: <span className="font-bold text-zinc-300">{photoFile.name}</span>
                                  </p>
                                )}

                                {/* Webcam UI */}
                                {(webcamOpen || webcamLoading || webcamError) && (
                                  <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                                      <div className="flex items-center justify-between gap-3 mb-3">
                                          <p className="text-sm font-bold text-zinc-300">Câmera ao vivo</p>
                                          {webcamOpen && (
                                            <button type="button" onClick={closeWebcam} className="text-xs font-bold text-zinc-500 hover:text-zinc-300">
                                                Fechar
                                            </button>
                                          )}
                                      </div>

                                      {webcamLoading && <p className="text-sm text-zinc-400 font-medium animate-pulse">Acessando câmera...</p>}
                                      {webcamError && <p className="text-sm text-red-400 font-medium">{webcamError}</p>}

                                      <div className={webcamOpen ? "block" : "hidden"}>
                                          <video ref={videoRef} autoPlay playsInline muted className="w-full max-w-md rounded-xl bg-black shadow-lg mb-4"></video>
                                          <div className="flex flex-wrap gap-3">
                                              <button type="button" onClick={capturePhoto} className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-orange-600 shadow-lg shadow-orange-500/20">
                                                  <Camera className="h-4 w-4" />
                                                  Capturar Foto
                                              </button>
                                          </div>
                                      </div>
                                      <canvas ref={canvasRef} className="hidden"></canvas>
                                  </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Observações */}
                <div className="mt-8">
                    <label className="block text-sm font-bold text-zinc-300 mb-2">
                        <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-orange-500" />
                            Observações Internas
                        </div>
                    </label>
                    <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4} placeholder="Adicione observações sobre a caixa, condições de recebimento, etc..." className="block w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-white font-semibold resize-none"></textarea>
                </div>

                {/* Botões de Ação */}
                <div className="flex flex-col sm:flex-row items-center justify-end gap-3 mt-10 pt-8 border-t border-zinc-800">
                    <Link href={`/admin/boxes/${box.id}`} className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl font-bold text-sm text-zinc-300 transition-all">
                        Cancelar
                    </Link>
                    
                    <button type="submit" disabled={loading} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold text-sm text-white shadow-lg shadow-orange-500/20 transition-all">
                        {loading ? "Salvando..." : "Atualizar Caixa"}
                    </button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
}
