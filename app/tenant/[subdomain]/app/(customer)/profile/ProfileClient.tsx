"use client";

import { useState } from "react";
import { 
  User, 
  Shield, 
  Settings, 
  Lock, 
  AlertTriangle, 
  Mail, 
  Phone, 
  Calendar, 
  CheckCircle2, 
  Download, 
  ExternalLink,
  ChevronRight,
  Info,
  XCircle,
  Save,
  Loader2
} from "lucide-react";
import { updatePersonalData, updateEmail, updatePassword, deleteAccount } from "@/app/actions/profileActions";

type Profile = {
  full_name: string | null;
  cpf: string | null;
  phone: string | null;
  birth_date: string | null;
  suite_number: string | null;
  created_at: string;
};

export default function ProfileClient({ profile, email }: { profile: Profile | null, email: string }) {
  const [activeTab, setActiveTab] = useState('personal');
  const [savingPersonal, setSavingPersonal] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);
  const [savingPass, setSavingPass] = useState(false);
  const [savingLocale, setSavingLocale] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedLocale, setSelectedLocale] = useState('pt_BR');
  const [showRequirements, setShowRequirements] = useState(false);

  const joinDate = profile?.created_at ? new Date(profile.created_at) : new Date();
  const joinDateFormatted = new Intl.DateTimeFormat('pt-BR', { month: 'short', year: 'numeric' }).format(joinDate);
  const initials = profile?.full_name ? profile.full_name.substring(0, 2).toUpperCase() : "US";

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* Header Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
        {/* Banner */}
        <div className="relative h-28 sm:h-36 bg-gradient-to-br from-orange-600 to-yellow-500">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.06%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-40"></div>
        </div>

        {/* Profile Info */}
        <div className="relative px-6 sm:px-8 pb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-14 sm:-mt-16">
            
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl shadow-xl flex items-center justify-center text-4xl sm:text-5xl font-bold text-white border-4 border-white ring-2 ring-orange-500/20 bg-gradient-to-br from-orange-600 to-yellow-500">
                {initials}
              </div>
              <div className="absolute -bottom-1 -right-1 p-1.5 rounded-xl border-2 border-white shadow-lg bg-orange-500">
                <Shield className="w-3.5 h-3.5 text-white" />
              </div>
            </div>

            {/* Details */}
            <div className="flex-1 text-center sm:text-left pb-1">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 mb-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900">{profile?.full_name || "Cliente"}</h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-700 ring-1 ring-amber-500/20">
                  <AlertTriangle className="w-3 h-3" /> E-mail não verificado
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-5 gap-y-1 text-sm text-zinc-500 mt-1">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  {email}
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  {profile?.phone || "Telefone não cadastrado"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 flex-shrink-0" />
                  Membro desde {joinDateFormatted}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
        
        {/* Navigation */}
        <div className="border-b border-zinc-200 bg-zinc-50/80 px-2 pt-2">
          <nav className="flex gap-1 overflow-x-auto scrollbar-hide -mb-px" aria-label="Tabs">
            <button 
              onClick={() => setActiveTab('personal')} 
              className={`whitespace-nowrap py-3 px-5 rounded-t-xl font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'personal' 
                ? 'bg-white shadow-sm border-b-2 border-orange-500 text-orange-600 -mb-px' 
                : 'text-zinc-500 hover:text-zinc-700 hover:bg-white/60'
              }`}
            >
              <User className="w-4 h-4" />
              Dados Pessoais
            </button>

            <button 
              onClick={() => setActiveTab('security')} 
              className={`whitespace-nowrap py-3 px-5 rounded-t-xl font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'security' 
                ? 'bg-white text-emerald-600 shadow-sm border-b-2 border-emerald-500 -mb-px' 
                : 'text-zinc-500 hover:text-zinc-700 hover:bg-white/60'
              }`}
            >
              <Lock className="w-4 h-4" />
              Segurança
            </button>

            <button 
              onClick={() => setActiveTab('preferences')} 
              className={`whitespace-nowrap py-3 px-5 rounded-t-xl font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'preferences' 
                ? 'bg-white text-blue-600 shadow-sm border-b-2 border-blue-500 -mb-px' 
                : 'text-zinc-500 hover:text-zinc-700 hover:bg-white/60'
              }`}
            >
              <Settings className="w-4 h-4" />
              Preferências
            </button>

            <button 
              onClick={() => setActiveTab('privacy')} 
              className={`whitespace-nowrap py-3 px-5 rounded-t-xl font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'privacy' 
                ? 'bg-white text-indigo-600 shadow-sm border-b-2 border-indigo-500 -mb-px' 
                : 'text-zinc-500 hover:text-zinc-700 hover:bg-white/60'
              }`}
            >
              <Shield className="w-4 h-4" />
              Privacidade
            </button>

            <button 
              onClick={() => setActiveTab('danger')} 
              className={`whitespace-nowrap py-3 px-5 rounded-t-xl font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'danger' 
                ? 'bg-white text-red-600 shadow-sm border-b-2 border-red-500 -mb-px' 
                : 'text-zinc-500 hover:text-red-600 hover:bg-red-50/50'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              Zona de Perigo
            </button>
          </nav>
        </div>

        {/* Tab Contents */}
        <div className="p-5 sm:p-8">

          {/* Dados Pessoais */}
          {activeTab === 'personal' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div>
                <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-orange-100 text-orange-600">
                    <User className="w-5 h-5" />
                  </div>
                  Informações Pessoais
                </h2>
                <p className="text-sm text-zinc-500 mt-1 ml-11">Atualize seus dados de contato e informações básicas</p>
              </div>
              
              <form 
                className="space-y-6" 
                onSubmit={async (e) => {
                  e.preventDefault();
                  setSavingPersonal(true);
                  const formData = new FormData(e.currentTarget);
                  const res = await updatePersonalData(formData);
                  if (res.error) alert(res.error);
                  setSavingPersonal(false);
                }}
              >
                <div className="grid gap-5 md:grid-cols-2">
                  
                  <div className="md:col-span-2">
                    <label htmlFor="name" className="flex items-center gap-1.5 text-sm font-semibold text-zinc-700 mb-2">
                      <User className="w-4 h-4 text-zinc-400" />
                      Nome Completo
                      <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      id="name"
                      name="name"
                      defaultValue={profile?.full_name || ""} 
                      required 
                      className="w-full px-4 py-3 border border-zinc-300 rounded-xl bg-white text-zinc-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-shadow outline-none" 
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="flex items-center gap-1.5 text-sm font-semibold text-zinc-700 mb-2">
                      <Phone className="w-4 h-4 text-zinc-400" />
                      Telefone
                    </label>
                    <input 
                      type="tel" 
                      id="phone"
                      name="phone"
                      defaultValue={profile?.phone || ""} 
                      className="w-full px-4 py-3 border border-zinc-300 rounded-xl bg-white text-zinc-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-shadow outline-none" 
                    />
                  </div>

                  <div>
                    <label htmlFor="cpf" className="flex items-center gap-1.5 text-sm font-semibold text-zinc-700 mb-2">
                      <Shield className="w-4 h-4 text-zinc-400" />
                      CPF
                      <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      id="cpf"
                      name="cpf"
                      defaultValue={profile?.cpf || ""} 
                      required 
                      className="w-full px-4 py-3 border border-zinc-300 rounded-xl bg-white text-zinc-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-shadow outline-none" 
                    />
                  </div>

                  <div>
                    <label htmlFor="birth_date" className="flex items-center gap-1.5 text-sm font-semibold text-zinc-700 mb-2">
                      <Calendar className="w-4 h-4 text-zinc-400" />
                      Data de Nascimento
                      <span className="text-xs font-normal text-zinc-400">(opcional)</span>
                    </label>
                    <input 
                      type="date" 
                      id="birth_date"
                      name="birth_date"
                      defaultValue={profile?.birth_date || ""} 
                      className="w-full px-4 py-3 border border-zinc-300 rounded-xl bg-white text-zinc-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-shadow outline-none" 
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-5 border-t border-zinc-200">
                  <p className="text-xs text-zinc-500 flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5" />
                    Seus dados estão protegidos
                  </p>
                  <button 
                    type="submit" 
                    disabled={savingPersonal} 
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 text-white font-semibold rounded-xl shadow-lg bg-gradient-to-r from-orange-600 to-yellow-500 hover:from-orange-700 hover:to-yellow-600 disabled:opacity-60 transition-all focus:ring-4 focus:ring-orange-500/20"
                  >
                    {savingPersonal ? (
                      <>
                        <Loader2 className="animate-spin w-4 h-4" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Salvar Alterações
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Segurança */}
          {activeTab === 'security' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div>
                <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
                  <div className="p-2 bg-emerald-100 rounded-xl">
                    <Lock className="w-5 h-5 text-emerald-600" />
                  </div>
                  Segurança da Conta
                </h2>
                <p className="text-sm text-zinc-500 mt-1 ml-11">Gerencie seu e-mail e senha para manter sua conta segura</p>
              </div>

              {/* Alterar E-mail */}
              <div className="rounded-2xl border border-zinc-200 overflow-hidden">
                <div className="bg-zinc-50 px-6 py-4 border-b border-zinc-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-zinc-200 rounded-xl">
                      <Mail className="w-5 h-5 text-zinc-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-zinc-900">Alterar E-mail</h3>
                      <p className="text-xs text-zinc-500">Atualize o endereço de e-mail associado à sua conta</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <form 
                    className="space-y-5"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setSavingEmail(true);
                      const formData = new FormData(e.currentTarget);
                      const res = await updateEmail(formData);
                      if (res.error) alert(res.error);
                      else alert("E-mail atualizado e pendente de confirmação!");
                      setSavingEmail(false);
                    }}
                  >
                    <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl">
                      <div className="flex gap-2.5">
                        <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-amber-800">
                          <p className="font-semibold">Importante:</p>
                          <p className="text-xs mt-0.5">Ao alterar seu e-mail, você precisará confirmar a senha atual. O novo e-mail não pode estar em uso por outro usuário.</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-5">
                      <div>
                        <label className="flex items-center gap-1.5 text-sm font-semibold text-zinc-700 mb-2">
                          <Mail className="w-4 h-4 text-zinc-400" />
                          E-mail Atual
                        </label>
                        <div className="px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-500 text-sm">
                          {email}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="new_email" className="flex items-center gap-1.5 text-sm font-semibold text-zinc-700 mb-2">
                          <Mail className="w-4 h-4 text-zinc-400" />
                          Novo E-mail <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="email" 
                          id="new_email"
                          name="email"
                          required 
                          placeholder="seunovo@email.com" 
                          className="w-full px-4 py-3 border border-zinc-300 rounded-xl bg-white text-zinc-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow outline-none" 
                        />
                      </div>

                      <div>
                        <label htmlFor="current_password_email" className="flex items-center gap-1.5 text-sm font-semibold text-zinc-700 mb-2">
                          <Lock className="w-4 h-4 text-zinc-400" />
                          Confirme sua Senha <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="password" 
                          id="current_password_email"
                          name="current_password"
                          required 
                          placeholder="••••••••" 
                          className="w-full px-4 py-3 border border-zinc-300 rounded-xl bg-white text-zinc-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow outline-none" 
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button 
                        type="submit" 
                        disabled={savingEmail} 
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-60 text-white font-semibold rounded-xl shadow-lg transition-all"
                      >
                        {savingEmail ? (
                          <>
                            <Loader2 className="animate-spin w-4 h-4" />
                            Salvando...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Atualizar E-mail
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Alterar Senha */}
              <div className="rounded-2xl border border-emerald-200 overflow-hidden">
                <div className="bg-emerald-50 px-6 py-4 border-b border-emerald-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-100 rounded-xl">
                      <Lock className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-zinc-900">Alterar Senha</h3>
                      <p className="text-xs text-zinc-500">Mantenha sua conta protegida com uma senha forte</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <form 
                    className="space-y-5"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setSavingPass(true);
                      const formData = new FormData(e.currentTarget);
                      if (formData.get("password") !== formData.get("password_confirmation")) {
                        alert("As senhas não coincidem!");
                        setSavingPass(false);
                        return;
                      }
                      const res = await updatePassword(formData);
                      if (res.error) alert(res.error);
                      else {
                        alert("Senha atualizada com sucesso!");
                        (e.target as HTMLFormElement).reset();
                      }
                      setSavingPass(false);
                    }}
                  >
                    <div className="grid gap-5">
                      <div>
                        <label htmlFor="current_password" className="flex items-center gap-1.5 text-sm font-semibold text-zinc-700 mb-2">
                          <Lock className="w-4 h-4 text-zinc-400" />
                          Senha Atual <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="password" 
                          id="current_password"
                          name="current_password"
                          required 
                          placeholder="••••••••" 
                          className="w-full px-4 py-3 border border-zinc-300 rounded-xl bg-white text-zinc-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow outline-none" 
                        />
                      </div>

                      <div className="grid gap-5 md:grid-cols-2">
                        <div>
                          <label htmlFor="password" className="flex items-center gap-1.5 text-sm font-semibold text-zinc-700 mb-2">
                            <Lock className="w-4 h-4 text-zinc-400" />
                            Nova Senha <span className="text-red-500">*</span>
                          </label>
                          <input 
                            type="password" 
                            id="password"
                            name="password"
                            required 
                            placeholder="••••••••" 
                            onFocus={() => setShowRequirements(true)} 
                            className="w-full px-4 py-3 border border-zinc-300 rounded-xl bg-white text-zinc-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow outline-none" 
                          />
                        </div>

                        <div>
                          <label htmlFor="password_confirmation" className="flex items-center gap-1.5 text-sm font-semibold text-zinc-700 mb-2">
                            <CheckCircle2 className="w-4 h-4 text-zinc-400" />
                            Confirme sua Senha <span className="text-red-500">*</span>
                          </label>
                          <input 
                            type="password" 
                            id="password_confirmation"
                            name="password_confirmation"
                            required 
                            placeholder="••••••••" 
                            className="w-full px-4 py-3 border border-zinc-300 rounded-xl bg-white text-zinc-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow outline-none"
                          />
                        </div>
                      </div>

                      {showRequirements && (
                        <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl animate-in fade-in">
                          <p className="text-sm font-semibold text-zinc-700 mb-2 flex items-center gap-1.5">
                            <Info className="w-4 h-4 text-zinc-400" />
                            Requisitos da senha:
                          </p>
                          <ul className="text-sm text-zinc-500 space-y-1.5">
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                              Mínimo de 8 caracteres
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                              Recomendado: letras, números e caracteres especiais
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end pt-2">
                      <button 
                        type="submit" 
                        disabled={savingPass} 
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-60 text-white font-semibold rounded-xl shadow-lg transition-all"
                      >
                        {savingPass ? (
                          <>
                            <Loader2 className="animate-spin w-4 h-4" />
                            Salvando...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Atualizar Senha
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Preferências */}
          {activeTab === 'preferences' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div>
                <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
                  <div className="p-2 bg-blue-100 rounded-xl">
                    <Settings className="w-5 h-5 text-blue-600" />
                  </div>
                  Preferências
                </h2>
                <p className="text-sm text-zinc-500 mt-1 ml-11">Personalize sua experiência na plataforma</p>
              </div>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  setSavingLocale(true);
                  setTimeout(() => setSavingLocale(false), 1000);
                }}
              >
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-zinc-700 mb-4">
                      Idioma Preferido
                    </label>
                    
                    <div className="grid gap-3 sm:grid-cols-3">
                      
                      <label 
                        className={`relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all group ${
                          selectedLocale === 'pt_BR' 
                          ? 'border-blue-500 bg-blue-50 shadow-sm' 
                          : 'border-zinc-200 hover:border-blue-300'
                        }`}
                      >
                        <input 
                          type="radio" 
                          name="locale" 
                          value="pt_BR" 
                          checked={selectedLocale === 'pt_BR'}
                          onChange={() => setSelectedLocale('pt_BR')}
                          className="sr-only" 
                        />
                        <div className="flex items-center gap-3 w-full">
                          <div className="text-3xl">🇧🇷</div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-zinc-900">Português</p>
                            <p className="text-xs text-zinc-500">Brasil</p>
                          </div>
                          {selectedLocale === 'pt_BR' && (
                            <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0 animate-in zoom-in" />
                          )}
                        </div>
                      </label>

                      <label 
                        className={`relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all group ${
                          selectedLocale === 'en' 
                          ? 'border-blue-500 bg-blue-50 shadow-sm' 
                          : 'border-zinc-200 hover:border-blue-300'
                        }`}
                      >
                        <input 
                          type="radio" 
                          name="locale" 
                          value="en" 
                          checked={selectedLocale === 'en'}
                          onChange={() => setSelectedLocale('en')}
                          className="sr-only" 
                        />
                        <div className="flex items-center gap-3 w-full">
                          <div className="text-3xl">🇺🇸</div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-zinc-900">English</p>
                            <p className="text-xs text-zinc-500">United States</p>
                          </div>
                          {selectedLocale === 'en' && (
                            <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0 animate-in zoom-in" />
                          )}
                        </div>
                      </label>

                      <label 
                        className={`relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all group ${
                          selectedLocale === 'es' 
                          ? 'border-blue-500 bg-blue-50 shadow-sm' 
                          : 'border-zinc-200 hover:border-blue-300'
                        }`}
                      >
                        <input 
                          type="radio" 
                          name="locale" 
                          value="es" 
                          checked={selectedLocale === 'es'}
                          onChange={() => setSelectedLocale('es')}
                          className="sr-only" 
                        />
                        <div className="flex items-center gap-3 w-full">
                          <div className="text-3xl">🇪🇸</div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-zinc-900">Español</p>
                            <p className="text-xs text-zinc-500">España</p>
                          </div>
                          {selectedLocale === 'es' && (
                            <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0 animate-in zoom-in" />
                          )}
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="flex gap-2.5">
                      <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-semibold mb-1">Sobre a mudança de idioma:</p>
                        <ul className="list-disc list-inside space-y-0.5 text-xs opacity-80">
                          <li>A página será recarregada automaticamente após salvar</li>
                          <li>O idioma selecionado será usado em todo o sistema</li>
                          <li>Você pode alterar o idioma a qualquer momento</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-zinc-200">
                    <button 
                      type="submit" 
                      disabled={savingLocale} 
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 text-white font-semibold rounded-xl shadow-lg transition-all"
                    >
                      {savingLocale ? (
                        <>
                          <Loader2 className="animate-spin w-4 h-4" />
                          Salvando...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Salvar Idioma
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Privacidade */}
          {activeTab === 'privacy' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div>
                <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
                  <div className="p-2 bg-indigo-100 rounded-xl">
                    <Shield className="w-5 h-5 text-indigo-600" />
                  </div>
                  Privacidade e Dados
                </h2>
                <p className="text-sm text-zinc-500 mt-1 ml-11">Gerencie e proteja suas informações pessoais</p>
              </div>

              <div className="space-y-5">
                {/* Exportar Dados */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-indigo-50 rounded-2xl border border-indigo-100 transition-all hover:border-indigo-200">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm flex-shrink-0 text-indigo-600">
                      <Download className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-zinc-900">Exportar meus dados</p>
                      <p className="text-sm text-zinc-600">Baixe uma cópia completa de todas as suas informações</p>
                    </div>
                  </div>
                  <button className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all shadow-md flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    Exportar
                  </button>
                </div>

                {/* Termos de Uso */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-zinc-50 rounded-2xl border border-zinc-200 transition-all hover:border-zinc-300">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm flex-shrink-0 text-zinc-600">
                      <ExternalLink className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-zinc-900">Termos de Uso</p>
                      <p className="text-sm text-zinc-600">Consulte os termos que você aceitou ao criar sua conta.</p>
                    </div>
                  </div>
                  <a href="/app/terms" className="w-full sm:w-auto px-5 py-2.5 bg-zinc-800 hover:bg-zinc-900 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2">
                    Ver termos
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </div>

                {/* Direitos */}
                <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl">
                  <div className="flex gap-4">
                    <div className="p-2.5 bg-blue-100 rounded-xl flex-shrink-0 h-fit text-blue-600">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div className="text-sm text-blue-900">
                      <p className="font-bold text-base mb-2">Seus direitos (LGPD/GDPR)</p>
                      <p className="mb-3 text-blue-800/80">Você tem direito a acessar, corrigir e solicitar a exclusão dos seus dados pessoais a qualquer momento.</p>
                      <ul className="space-y-2 text-xs text-blue-800">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-500" />
                          <span>Direito ao acesso e portabilidade dos seus dados</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-500" />
                          <span>Direito à correção de dados incorretos ou desatualizados</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-500" />
                          <span>Direito à eliminação dos seus dados pessoais</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-500" />
                          <span>Direito à informação sobre o uso dos seus dados</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Zona de Perigo */}
          {activeTab === 'danger' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div>
                <h2 className="text-xl font-bold text-red-700 flex items-center gap-2">
                  <div className="p-2 bg-red-100 rounded-xl">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  Zona de Perigo
                </h2>
                <p className="text-sm text-red-500 mt-1 ml-11">Ações irreversíveis que afetam permanentemente sua conta</p>
              </div>

              <div className="p-6 bg-red-50 rounded-2xl border border-red-200">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-red-100 rounded-xl flex-shrink-0 text-red-600">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-red-800 mb-1">Excluir minha conta permanentemente</h3>
                    <p className="text-sm text-red-600 mb-4">Após a exclusão, todos os seus dados serão permanentemente removidos e não poderão ser recuperados. Esta ação não pode ser desfeita.</p>
                    
                    <div className="bg-white rounded-xl p-4 mb-5 border border-red-100">
                      <p className="text-sm font-semibold text-zinc-700 mb-2.5">Ao excluir sua conta, você perderá:</p>
                      <ul className="space-y-2 text-sm text-zinc-600">
                        <li className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                          Todas as informações pessoais e de contato
                        </li>
                        <li className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                          Histórico completo de compras e pedidos
                        </li>
                        <li className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                          Todo o saldo de créditos na carteira
                        </li>
                        <li className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                          Endereços salvos e configurações personalizadas
                        </li>
                      </ul>
                    </div>

                    <button 
                      onClick={() => setShowDeleteModal(true)}
                      className="w-full sm:w-auto px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      <AlertTriangle className="w-5 h-5" />
                      Excluir Minha Conta Permanentemente
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-end sm:items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setShowDeleteModal(false)}
          ></div>

          <div className="relative bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
            <form 
              onSubmit={async (e) => {
                e.preventDefault();
                setDeleting(true);
                const formData = new FormData(e.currentTarget);
                const res = await deleteAccount(formData);
                if (res.error) {
                  alert(res.error);
                  setDeleting(false);
                } else {
                  alert("Conta excluída com sucesso.");
                  window.location.href = "/app/login";
                }
              }}
            >
              <div className="p-6">
                <div className="flex items-center gap-4 mb-5">
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center text-red-600">
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-zinc-900">Excluir Conta Permanentemente</h3>
                    <p className="text-sm text-zinc-500">Esta ação não pode ser desfeita</p>
                  </div>
                </div>
                
                <p className="text-zinc-600 text-sm mb-5">Tem certeza absoluta que deseja excluir sua conta? Esta é uma ação permanente e irreversível.</p>

                <div>
                  <label htmlFor="delete_password" className="flex items-center gap-1.5 text-sm font-semibold text-zinc-700 mb-2">
                    <Lock className="w-4 h-4 text-zinc-400" />
                    Confirme sua senha para continuar <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="password" 
                    id="delete_password"
                    name="password"
                    required 
                    placeholder="••••••••" 
                    className="w-full px-4 py-3 border border-zinc-300 rounded-xl bg-white text-zinc-900 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-shadow outline-none"
                  />
                </div>
              </div>
              
              <div className="bg-zinc-50 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowDeleteModal(false)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-white border border-zinc-300 text-zinc-700 font-semibold rounded-xl hover:bg-zinc-50 transition"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={deleting}
                  className="w-full sm:w-auto px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-semibold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="animate-spin w-4 h-4" />
                      Excluindo...
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4" />
                      Excluir Permanentemente
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
