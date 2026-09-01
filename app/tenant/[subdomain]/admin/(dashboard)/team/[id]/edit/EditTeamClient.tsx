"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Edit, Eye, EyeOff, Save, ShieldCheck, BarChart3, MessageSquareText, ShieldAlert } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { updateTeamMember } from "../../actions";

export default function EditTeamClient({ member, isOwner }: { member: any, isOwner: boolean }) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);

  // Map DB role to form role
  let initialRole = "support";
  if (member.role === "ADMIN") initialRole = "admin";
  if (member.role === "MANAGER") initialRole = "manager";
  if (member.role === "SUPPORT") initialRole = "support";

  // Calculate password strength
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const pwIdx = Math.max(0, Math.min(score - 1, 3));
  const pwWidth = password.length === 0 ? 0 : (pwIdx + 1) * 25;
  const levels = ["Fraca", "Razoável", "Boa", "Forte"];
  const colors = ["#ef4444", "#f59e0b", "#3b82f6", "#10b981"];
  const currentColor = colors[pwIdx];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const pwd = formData.get("password") as string;
    const confirm = formData.get("password_confirmation") as string;
    
    if (pwd && pwd !== confirm) {
      toast.error("As senhas não coincidem!");
      return;
    }

    if (pwd && pwd.length < 8) {
      toast.error("A senha deve ter no mínimo 8 caracteres");
      return;
    }

    setSaving(true);
    const result = await updateTeamMember(formData, member.id);
    
    if (result.success) {
      toast.success("Membro atualizado com sucesso!");
      router.push("/admin/team");
    } else {
      toast.error(result.error || "Erro ao atualizar membro.");
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 pb-12">
      
      {/* Header */}
      <div className="relative overflow-hidden bg-zinc-900 border-b border-zinc-800 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-amber-600/20 opacity-50"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-sm mb-4 text-zinc-400">
            <Link href="/admin" className="hover:text-zinc-200 transition-colors">Dashboard</Link>
            <ChevronRight className="w-4 h-4 shrink-0" />
            <Link href="/admin/team" className="hover:text-zinc-200 transition-colors">Equipe</Link>
            <ChevronRight className="w-4 h-4 shrink-0" />
            <span className="text-white font-medium">Editar Membro</span>
          </nav>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-2xl shrink-0 text-orange-500">
              <Edit className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Editar Membro</h1>
              <p className="text-zinc-400 text-sm mt-1">Atualize as informações de {member.full_name || "este membro"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-800 overflow-hidden">
          <form onSubmit={handleSubmit}>
            <div className="p-6 sm:p-8 space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-zinc-300 mb-2">Nome Completo *</label>
                  <input type="text" name="name" required defaultValue={member.full_name || ""} 
                         className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all placeholder-zinc-600" />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-zinc-300 mb-2">Email</label>
                  <input type="email" defaultValue={member.email} disabled
                         className="w-full px-4 py-3 bg-zinc-950/50 border border-zinc-800 rounded-xl text-zinc-500 cursor-not-allowed outline-none" />
                  <p className="mt-1.5 text-xs text-zinc-500">O email de login não pode ser alterado por aqui.</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-zinc-300 mb-2">Nova Senha</label>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} name="password" minLength={8} 
                           value={password} onChange={e => setPassword(e.target.value)}
                           placeholder="Deixe em branco para manter" 
                           className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all placeholder-zinc-600" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  
                  {password.length > 0 && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-300" style={{ width: `${pwWidth}%`, backgroundColor: currentColor }}></div>
                      </div>
                      <span className="text-xs font-semibold w-16 text-right" style={{ color: currentColor }}>
                        {levels[pwIdx]}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-zinc-300 mb-2">Confirmar Nova Senha</label>
                  <div className="relative">
                    <input type={showConfirm ? "text" : "password"} name="password_confirmation" minLength={8} 
                           placeholder="Repita se for alterar" 
                           className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all placeholder-zinc-600" />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
                      {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-zinc-300 mb-4">Nível de Acesso *</label>
                
                {isOwner ? (
                  <div className="p-4 border border-zinc-800 rounded-xl bg-purple-500/10">
                    <div className="flex items-center gap-2 mb-1">
                      <ShieldAlert className="w-5 h-5 text-purple-500" />
                      <span className="font-bold text-white">Proprietário Principal</span>
                    </div>
                    <p className="text-sm text-purple-200/70">O nível de acesso do dono da conta não pode ser rebaixado.</p>
                    {/* Hidden input to pass the role since it's disabled for changes */}
                    <input type="hidden" name="role" value="admin" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="relative flex items-start p-4 border border-zinc-800 rounded-xl cursor-pointer transition-all hover:border-blue-500 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-500/10 group">
                      <input type="radio" name="role" value="admin" defaultChecked={initialRole === 'admin'} className="mt-1 accent-blue-500 shrink-0" />
                      <div className="ml-3">
                        <div className="flex items-center gap-2 mb-1">
                          <ShieldCheck className="w-5 h-5 text-zinc-400 group-has-[:checked]:text-blue-500 transition-colors" />
                          <span className="font-bold text-white">Administrador</span>
                        </div>
                        <p className="text-sm text-zinc-400 group-has-[:checked]:text-blue-200/70 transition-colors">Gerencia clientes, produtos e envios.</p>
                      </div>
                    </label>

                    <label className="relative flex items-start p-4 border border-zinc-800 rounded-xl cursor-pointer transition-all hover:border-emerald-500 has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-500/10 group">
                      <input type="radio" name="role" value="manager" defaultChecked={initialRole === 'manager'} className="mt-1 accent-emerald-500 shrink-0" />
                      <div className="ml-3">
                        <div className="flex items-center gap-2 mb-1">
                          <BarChart3 className="w-5 h-5 text-zinc-400 group-has-[:checked]:text-emerald-500 transition-colors" />
                          <span className="font-bold text-white">Gerente</span>
                        </div>
                        <p className="text-sm text-zinc-400 group-has-[:checked]:text-emerald-200/70 transition-colors">Visualiza relatórios e operações.</p>
                      </div>
                    </label>

                    <label className="relative flex items-start p-4 border border-zinc-800 rounded-xl cursor-pointer transition-all hover:border-amber-500 has-[:checked]:border-amber-500 has-[:checked]:bg-amber-500/10 group">
                      <input type="radio" name="role" value="support" defaultChecked={initialRole === 'support'} className="mt-1 accent-amber-500 shrink-0" />
                      <div className="ml-3">
                        <div className="flex items-center gap-2 mb-1">
                          <MessageSquareText className="w-5 h-5 text-zinc-400 group-has-[:checked]:text-amber-500 transition-colors" />
                          <span className="font-bold text-white">Suporte</span>
                        </div>
                        <p className="text-sm text-zinc-400 group-has-[:checked]:text-amber-200/70 transition-colors">Atende clientes e solicitações básicas.</p>
                      </div>
                    </label>
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-5 sm:px-8 bg-zinc-950/50 border-t border-zinc-800 flex items-center justify-between">
              <Link href="/admin/team" className="px-6 py-2.5 bg-zinc-800 text-white font-semibold rounded-xl hover:bg-zinc-700 transition">
                Cancelar
              </Link>
              <button type="submit" disabled={saving} className="px-8 py-2.5 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-500 transition shadow-lg shadow-orange-600/20 flex items-center gap-2 disabled:opacity-50">
                {saving ? (
                  <>Salvando...</>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Salvar Alterações
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
