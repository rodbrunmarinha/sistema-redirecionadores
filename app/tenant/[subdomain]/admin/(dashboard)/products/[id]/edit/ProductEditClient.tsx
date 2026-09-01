"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { updateProductByAdmin } from "@/app/actions/updateProductByAdmin";

export default function ProductEditClient({ product, boxes, customers }: { product: any, boxes: any[], customers: any[] }) {
  const router = useRouter();

  // State initialization
  const [isMounted, setIsMounted] = useState(false);
  const [entryMode, setEntryMode] = useState(product.box_id ? "box" : "direct");
  const [boxId, setBoxId] = useState(product.box_id || "");
  const [customerId, setCustomerId] = useState(product.customer_id || "");
  
  const [barcode, setBarcode] = useState(product.code || "");
  const [name, setName] = useState(product.name || "");
  const [quantity, setQuantity] = useState<number | "">(product.quantity || 1);
  const [weightDisplay, setWeightDisplay] = useState(
    (product.unit_weight || 0).toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3, useGrouping: false })
  );
  const [weightType, setWeightType] = useState<"unit" | "total">("unit");
  
  const [notes, setNotes] = useState(product.notes || "");
  const [createdAt, setCreatedAt] = useState("");
  const [originalDateStr, setOriginalDateStr] = useState("");
  
  const [isPerishable, setIsPerishable] = useState(product.is_perishable || false);
  const [expiryDate, setExpiryDate] = useState(product.expiry_date || "");

  const [photoPreview, setPhotoPreview] = useState<string | null>(
    product.photos && product.photos.length > 0
      ? (product.photos[0].startsWith("http") ? product.photos[0] : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/products/${product.photos[0]}`)
      : null
  );
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  
  const [webcamOpen, setWebcamOpen] = useState(false);
  const [webcamError, setWebcamError] = useState("");
  const [webcamLoading, setWebcamLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  
  const [isSaving, setIsSaving] = useState(false);
  const [infoExpanded, setInfoExpanded] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (product.created_at) {
      const d = new Date(product.created_at);
      const original = d.toLocaleString('pt-BR');
      setOriginalDateStr(original);
      d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
      setCreatedAt(d.toISOString().slice(0, 16));
    }
  }, [product.created_at]);

  const currentDock = entryMode === "box"
    ? (() => { const c = boxes.find(b => b.id === boxId)?.customer; return Array.isArray(c) ? c[0]?.suite_number : c?.suite_number; })()
    : customers.find(c => c.id === customerId)?.suite_number;

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (!val) { setWeightDisplay(""); return; }
    let num = parseInt(val, 10) / 1000;
    setWeightDisplay(num.toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3, useGrouping: false }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
    closeWebcam();
  };

  const openPhotoPicker = (useCamera = false) => {
    setWebcamError("");
    closeWebcam();
    if (!photoInputRef.current) return;
    if (useCamera) {
      photoInputRef.current.setAttribute("capture", "environment");
    } else {
      photoInputRef.current.removeAttribute("capture");
    }
    photoInputRef.current.click();
  };

  const openWebcam = async () => {
    setWebcamError("");
    if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      setWebcamError("Webcam não suportada neste navegador.");
      return;
    }
    setWebcamLoading(true);
    closeWebcam();
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).catch(() => 
        navigator.mediaDevices.getUserMedia({ video: true })
      );
      setStream(newStream);
      setWebcamOpen(true);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        await videoRef.current.play().catch(() => {});
      }
    } catch (err) {
      setWebcamError("Erro ao acessar a câmera.");
    } finally {
      setWebcamLoading(false);
    }
  };

  const closeWebcam = () => {
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }
    setWebcamOpen(false);
  };

  const captureWebcam = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < 2) {
      setWebcamError("Erro ao capturar imagem.");
      return;
    }
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], `capture-${Date.now()}.jpg`, { type: "image/jpeg" });
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(blob));
      closeWebcam();
    }, "image/jpeg", 0.92);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData();
    formData.append("entry_mode", entryMode);
    if (entryMode === "box") formData.append("received_box_id", boxId);
    if (entryMode === "direct") formData.append("user_id", customerId);
    
    formData.append("barcode", barcode);
    formData.append("name", name);
    formData.append("quantity", quantity.toString());
    formData.append("weight", weightDisplay);
    formData.append("weight_mode", weightType);
    formData.append("notes", notes);
    formData.append("created_at", createdAt);
    formData.append("is_perishable", isPerishable ? "true" : "false");
    if (isPerishable && expiryDate) formData.append("expiry_date", expiryDate);
    if (photoFile) formData.append("photo", photoFile);

    const res = await updateProductByAdmin(product.id, formData);
    if (res?.error) {
      alert(res.error);
      setIsSaving(false);
    } else {
      router.push("/admin/products");
    }
  };
  
  const getDaysLeft = () => {
    if (!expiryDate) return null;
    const today = new Date(); today.setHours(0,0,0,0);
    const exp = new Date(expiryDate + 'T00:00:00');
    return Math.round((exp.getTime() - today.getTime()) / 86400000);
  };
  
  const addDays = (n: number) => {
    const d = new Date();
    d.setDate(d.getDate() + n);
    setExpiryDate(d.toISOString().split('T')[0]);
  };
  
  const daysLeft = getDaysLeft();
  
  const generateInternalCode = () => {
      const chars = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
      const array = new Uint8Array(10);
      window.crypto.getRandomValues(array);
      let code = 'BP';
      for (let i = 0; i < 10; i++) code += chars[array[i] % chars.length];
      setBarcode(code);
  };

  if (!isMounted) return <div className="min-h-screen bg-zinc-950 pb-12 flex justify-center items-center -m-8"><div className="animate-spin h-8 w-8 text-orange-500 border-4 border-current border-t-transparent rounded-full" /></div>;

  return (
    <div className="min-h-screen bg-zinc-950 pb-12 font-sans selection:bg-orange-500/30 -m-8">
      
      {/* Header Premium Dark Mode (Orange to Amber) */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 shadow-xl shadow-orange-900/20">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 blur-2xl"></div>
            <div className="absolute -bottom-16 -left-8 w-64 h-64 rounded-full bg-white/5 blur-2xl"></div>
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-8">
            <nav className="flex items-center gap-2 text-sm mb-4">
                <Link href="/admin" className="text-orange-100/70 hover:text-white transition-colors truncate">Dashboard</Link>
                <svg className="w-3.5 h-3.5 text-orange-100/50 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                <Link href="/admin/products" className="text-orange-100/70 hover:text-white transition-colors truncate">Produtos</Link>
                <svg className="w-3.5 h-3.5 text-orange-100/50 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                <span className="text-white font-medium truncate">Editar Produto</span>
            </nav>
            <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg shrink-0">
                    <svg className="w-8 h-8 text-white drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                    </svg>
                </div>
                <div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-md">Editar Produto</h1>
                    <p className="text-orange-100 text-sm mt-1 font-medium">{product.name || 'Produto sem nome'}</p>
                </div>
            </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Statistics Cards - Vibrant Mode */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 border border-blue-400/50 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg></div>
                <p className="text-white/90 text-xs font-bold uppercase tracking-wider">ID do Produto</p>
                <p className="text-2xl font-black mt-2 truncate max-w-[120px] text-white">{product.id.split('-')[0]}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 border border-purple-400/50 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path></svg></div>
                <p className="text-white/90 text-xs font-bold uppercase tracking-wider">Peso Atual</p>
                <p className="text-3xl font-black mt-2 text-white">{product.unit_weight} <span className="text-sm font-medium text-white/80">kg</span></p>
            </div>
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 border border-indigo-400/50 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg></div>
                <p className="text-white/90 text-xs font-bold uppercase tracking-wider">Quantidade</p>
                <p className="text-3xl font-black mt-2 text-white">{product.quantity}</p>
            </div>
            <div className="bg-gradient-to-br from-violet-500 to-violet-600 border border-violet-400/50 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>
                <p className="text-white/90 text-xs font-bold uppercase tracking-wider">Atualizado em</p>
                <p className="text-lg font-black mt-2 text-white">{originalDateStr.split(' ')[0]}</p>
                <p className="text-xs text-white/80 font-medium">{originalDateStr.split(' ')[1]}</p>
            </div>
        </div>
        
        {/* Audit History Card */}
        <div className="bg-gradient-to-r from-amber-900/40 to-orange-900/40 rounded-2xl shadow-lg border border-amber-700/50 overflow-hidden">
            <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="bg-amber-900/50 rounded-xl p-3 border border-amber-800">
                        <svg className="w-7 h-7 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-amber-100">📋 Histórico de Alterações</h3>
                        <p className="text-sm text-amber-300">Monitore todas as modificações deste produto</p>
                    </div>
                </div>
                <Link href={`/admin/audit?product_id=${product.id}`} className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white rounded-xl font-bold shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02]">
                    Ver Histórico
                </Link>
            </div>
        </div>

        {/* Info Collapsible */}
        <div className="bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 overflow-hidden">
            <button type="button" onClick={() => setInfoExpanded(!infoExpanded)} className="w-full px-6 py-4 flex items-center justify-between hover:bg-zinc-800/50 transition-colors">
                <div className="flex items-center space-x-3">
                    <div className="bg-emerald-900/50 text-emerald-400 rounded-lg p-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <div className="text-left">
                        <h3 className="text-base font-bold text-white">Informações sobre o Produto</h3>
                        <p className="text-xs text-zinc-400">Clique para ver os campos obrigatórios e opcionais</p>
                    </div>
                </div>
                <svg className={`w-5 h-5 text-zinc-400 transition-transform ${infoExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            {infoExpanded && (
                <div className="p-6 border-t border-zinc-800 bg-zinc-900">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-bold text-white mb-3 flex items-center text-sm">
                                <span className="bg-blue-900/40 text-blue-400 rounded-lg p-1 mr-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                                </span>
                                Campos Obrigatórios
                            </h4>
                            <ul className="space-y-2 text-sm text-zinc-400">
                                <li><span className="text-blue-500 mr-2">•</span><strong>Nome:</strong> Identificação clara</li>
                                <li><span className="text-blue-500 mr-2">•</span><strong>Peso:</strong> Usado para frete</li>
                                <li><span className="text-blue-500 mr-2">•</span><strong>Quantidade:</strong> Número de itens</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-3 flex items-center text-sm">
                                <span className="bg-purple-900/40 text-purple-400 rounded-lg p-1 mr-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                </span>
                                Campos Opcionais
                            </h4>
                            <ul className="space-y-2 text-sm text-zinc-400">
                                <li><span className="text-purple-500 mr-2">•</span><strong>Código de Barras:</strong> Rastreamento interno</li>
                                <li><span className="text-purple-500 mr-2">•</span><strong>Foto:</strong> Registro visual</li>
                                <li><span className="text-purple-500 mr-2">•</span><strong>Observações:</strong> Notas extras</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
        
        {/* Main Form */}
        <div className="bg-zinc-900 shadow-2xl rounded-2xl border border-zinc-800">
            <form onSubmit={handleUpdate} className="p-8 space-y-8">
                
                {/* Box Info */}
                <div className="space-y-6">
                    <div className="flex items-center space-x-3 pb-3 border-b-2 border-zinc-800">
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg p-2 shadow-sm">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                        </div>
                        <h3 className="text-lg font-extrabold text-white">Informações da Caixa</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {entryMode === 'box' && (
                            <div>
                                <label className="block text-sm font-bold text-zinc-300 mb-2">Caixa <span className="text-rose-500">*</span></label>
                                <select 
                                    value={boxId}
                                    onChange={(e) => setBoxId(e.target.value)}
                                    required={entryMode === 'box'}
                                    className="block w-full rounded-xl border border-zinc-700 bg-zinc-950 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition py-3 px-4 font-medium"
                                >
                                    <option value="">Selecione uma caixa</option>
                                    {boxes.map(b => (
                                        <option key={b.id} value={b.id}>
                                            [{Array.isArray(b.customer) ? b.customer[0]?.suite_number : b.customer?.suite_number}] {b.tracking_number} - {b.store_name} ({b.id.substring(0,6)})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                        {entryMode === 'direct' && (
                            <div>
                                <label className="block text-sm font-bold text-zinc-300 mb-2">Cliente <span className="text-rose-500">*</span></label>
                                <select 
                                    value={customerId}
                                    onChange={(e) => setCustomerId(e.target.value)}
                                    required={entryMode === 'direct'}
                                    className="block w-full rounded-xl border border-zinc-700 bg-zinc-950 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition py-3 px-4 font-medium"
                                >
                                    <option value="">Selecione o Cliente</option>
                                    {customers.map(c => (
                                        <option key={c.id} value={c.id}>
                                            {c.full_name} - Dock #{c.suite_number}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-bold text-zinc-300 mb-2">Dock</label>
                            <input 
                                type="text" 
                                value={currentDock || ""} 
                                readOnly 
                                className="block w-full rounded-xl border border-zinc-700 bg-zinc-800 text-zinc-400 py-3 px-4 font-bold cursor-not-allowed" 
                            />
                        </div>
                    </div>
                </div>

                {/* Product Details */}
                <div className="space-y-6">
                    <div className="flex items-center space-x-3 pb-3 border-b-2 border-zinc-800">
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg p-2 shadow-sm">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
                        </div>
                        <h3 className="text-lg font-extrabold text-white">Detalhes do Produto</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-zinc-300 mb-2">Código de Barras</label>
                            <input 
                                type="text" 
                                value={barcode}
                                onChange={e => setBarcode(e.target.value)}
                                placeholder="Escaneie ou digite..." 
                                className="block w-full rounded-xl border border-zinc-700 bg-zinc-950 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition py-3 px-4 font-medium placeholder-zinc-500" 
                            />
                            <div className="mt-2 flex gap-2">
                                <button type="button" onClick={generateInternalCode} className="text-xs px-3 py-1.5 bg-emerald-900/30 text-emerald-400 font-bold rounded-lg hover:bg-emerald-800/40 transition-colors">Gerar Código</button>
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-zinc-300 mb-2">Nome do Produto <span className="text-rose-500">*</span></label>
                            <input 
                                type="text" 
                                required 
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="block w-full rounded-xl border border-zinc-700 bg-zinc-950 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition py-3 px-4 font-medium" 
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-zinc-300 mb-2">Quantidade <span className="text-rose-500">*</span></label>
                            <input 
                                type="number" 
                                min="1" 
                                required 
                                value={quantity}
                                onChange={e => setQuantity(e.target.value === "" ? "" : Number(e.target.value))}
                                className="block w-full rounded-xl border border-zinc-700 bg-zinc-950 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition py-3 px-4 font-bold text-lg" 
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-bold text-zinc-300">Peso (kg) <span className="text-rose-500">*</span></label>
                                <div className="flex bg-zinc-800 p-1 rounded-lg">
                                    <button type="button" onClick={() => setWeightType('unit')} className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${weightType === 'unit' ? 'bg-zinc-700 text-emerald-400 shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}>Unitário</button>
                                    <button type="button" onClick={() => setWeightType('total')} className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${weightType === 'total' ? 'bg-zinc-700 text-teal-400 shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}>Total</button>
                                </div>
                            </div>
                            <input 
                                type="text" 
                                required 
                                value={weightDisplay}
                                onChange={handleWeightChange}
                                className="block w-full rounded-xl border border-zinc-700 bg-zinc-950 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition py-3 px-4 font-bold text-lg" 
                            />
                        </div>
                    </div>

                    <div className="bg-amber-900/20 border border-amber-800 rounded-xl p-5 mt-4">
                        <div className="flex gap-3">
                            <svg className="w-5 h-5 text-amber-400 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                            <div>
                                <label className="block text-sm font-bold text-amber-300 mb-2">Atenção: Alteração de Data de Cadastro</label>
                                <input 
                                    type="datetime-local" 
                                    value={createdAt}
                                    onChange={e => setCreatedAt(e.target.value)}
                                    className="block w-full md:w-auto rounded-xl border border-amber-600/50 bg-zinc-950 text-white font-medium py-2 px-3 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                                />
                                <p className="mt-2 text-xs text-amber-400/80">Ficará registrado no histórico de auditoria.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Photo & Notes */}
                <div className="space-y-6">
                    <div className="flex items-center space-x-3 pb-3 border-b-2 border-zinc-800">
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg p-2 shadow-sm">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        </div>
                        <h3 className="text-lg font-extrabold text-white">Imagem e Observações</h3>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-zinc-300 mb-3">Foto do Produto</label>
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-shrink-0">
                                {photoPreview ? (
                                    <img src={photoPreview} className="h-32 w-32 rounded-2xl object-cover border border-zinc-800 shadow-lg" alt="Preview" />
                                ) : (
                                    <div className="h-32 w-32 rounded-2xl bg-zinc-800 flex items-center justify-center border border-zinc-700 shadow-inner" />
                                )}
                            </div>
                            <div className="flex-1 space-y-3">
                                <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                                <div className="flex flex-wrap gap-3">
                                    <button type="button" onClick={() => openPhotoPicker(false)} className="px-4 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 text-sm font-bold border border-zinc-700 hover:bg-zinc-700 transition-colors shadow-sm">Escolher imagem</button>
                                    <button type="button" onClick={() => openPhotoPicker(true)} className="px-4 py-2.5 rounded-xl bg-emerald-900/20 text-emerald-400 text-sm font-bold border border-emerald-800 hover:bg-emerald-900/40 transition-colors shadow-sm">Tirar foto</button>
                                    <button type="button" onClick={openWebcam} className="px-4 py-2.5 rounded-xl bg-teal-900/20 text-teal-400 text-sm font-bold border border-teal-800 hover:bg-teal-900/40 transition-colors shadow-sm">Usar webcam</button>
                                </div>
                                {photoFile && <p className="text-sm font-medium text-emerald-400">Nova foto selecionada: {photoFile.name}</p>}
                                
                                {webcamOpen && (
                                    <div className="rounded-xl border border-sky-800 bg-sky-900/20 p-4 shadow-inner mt-4">
                                        <video ref={videoRef} autoPlay playsInline muted className="w-full max-w-sm rounded-xl bg-black mb-3 shadow-lg" />
                                        <div className="flex gap-3">
                                            <button type="button" onClick={captureWebcam} className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold shadow-md hover:scale-105 transition-transform">Capturar</button>
                                            <button type="button" onClick={closeWebcam} className="px-5 py-2.5 bg-zinc-800 rounded-xl text-sky-300 font-bold border border-sky-700 shadow-sm">Fechar</button>
                                        </div>
                                        <canvas ref={canvasRef} className="hidden" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-zinc-300 mb-2">Observações</label>
                        <textarea 
                            rows={4} 
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            className="block w-full rounded-xl border border-zinc-700 bg-zinc-950 py-3 px-4 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition font-medium" 
                        />
                    </div>
                </div>

                {/* Perishable */}
                <div className="bg-orange-950/30 rounded-2xl border border-orange-900/50 overflow-hidden shadow-inner mt-4">
                    <div className="px-6 py-5 border-b border-orange-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-orange-900 p-2 rounded-lg">
                                <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <div>
                                <p className="text-base font-extrabold text-orange-100">Este produto é perecível?</p>
                                <p className="text-xs font-medium text-orange-400 mt-0.5">Ative para informar a data de vencimento</p>
                            </div>
                        </div>
                        <button 
                            type="button" 
                            onClick={() => { setIsPerishable(!isPerishable); if(isPerishable) setExpiryDate(""); }}
                            className={`${isPerishable ? 'bg-orange-500' : 'bg-zinc-700'} relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out shadow-inner focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-zinc-900`}
                        >
                            <span className={`${isPerishable ? 'translate-x-6' : 'translate-x-0'} pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}></span>
                        </button>
                    </div>
                    {isPerishable && (
                        <div className="p-6 space-y-6">
                            <div>
                                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Atalhos rápidos</p>
                                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                                    {[7, 15, 30, 60, 90, 365].map(d => (
                                        <button 
                                            key={d}
                                            type="button" 
                                            onClick={() => addDays(d)}
                                            className={`px-3 py-2.5 rounded-xl border text-sm font-bold transition-all duration-150 text-center ${daysLeft === d ? 'ring-2 ring-orange-500 bg-orange-900/50 text-orange-300 border-orange-500/50' : 'bg-zinc-900 text-zinc-300 border-zinc-700 hover:bg-orange-900/30 hover:border-orange-500/50 hover:text-orange-400'}`}
                                        >
                                            {d >= 30 ? (d % 365 === 0 ? '1 ano' : `${d/30} meses`) : `${d} dias`}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-zinc-300 mb-2">Data de Vencimento</label>
                                <input 
                                    type="date" 
                                    value={expiryDate}
                                    onChange={e => setExpiryDate(e.target.value)}
                                    className="block w-full md:w-64 rounded-xl border border-zinc-700 bg-zinc-950 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none py-3 px-4 font-bold shadow-sm" 
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between pt-8 border-t-2 border-zinc-800">
                    <button type="button" onClick={() => router.back()} className="px-6 py-3 border border-zinc-700 rounded-xl font-bold text-zinc-300 bg-zinc-900 transition-colors hover:bg-zinc-800">
                        Cancelar
                    </button>
                    <button type="submit" disabled={isSaving} className="px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white rounded-xl font-bold disabled:opacity-50 transition-all shadow-lg hover:shadow-orange-500/30">
                        {isSaving ? "Salvando..." : "Atualizar Produto"}
                    </button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
}
