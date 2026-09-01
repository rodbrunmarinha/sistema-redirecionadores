'use client';
import { useState } from 'react';
import { updateTenantSettings } from '../_actions/settings';
import { sendTestEmail } from '../_actions/email';
import { Mail, Save, Loader2, Server, KeyRound, User, Lock, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export function EmailSettingsClient({ 
  tenantId, 
  subdomain, 
  initialSettings 
}: { 
  tenantId: string; 
  subdomain: string; 
  initialSettings: any;
}) {
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [data, setData] = useState(initialSettings?.email_smtp || {});

  const handleChange = (field: string, value: string) => {
    setData((prev: any) => ({ ...prev, [field]: value }));
  };

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const payload = {
        ...initialSettings,
        email_smtp: data
      };
      const result = await updateTenantSettings(tenantId, payload, subdomain);
      if (result.success) {
        toast.success('Configurações de SMTP salvas com sucesso!');
      } else {
        toast.error(result.error || 'Erro ao salvar configurações.');
      }
    } catch (err) {
      toast.error('Erro de conexão ao salvar.');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleTestEmail() {
    const testEmail = prompt('Digite o e-mail de destino para o teste:');
    if (!testEmail) return;

    setIsTesting(true);
    const loadingToast = toast.loading('Tentando conectar ao servidor SMTP...');
    
    try {
      const result = await sendTestEmail(tenantId, testEmail);
      if (result.success) {
        toast.success('E-mail enviado com sucesso! Verifique sua caixa de entrada.', { id: loadingToast });
      } else {
        toast.error(result.error || 'Falha ao enviar e-mail de teste.', { id: loadingToast, duration: 6000 });
      }
    } catch (err) {
      toast.error('Erro ao chamar o servidor para envio.', { id: loadingToast });
    } finally {
      setIsTesting(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      <form onSubmit={handleSave} className="bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 overflow-hidden">
        
        <div className="p-6 sm:p-8 space-y-8">
          
          {/* Sessão 1: Remetente */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-zinc-100 flex items-center gap-2 border-b border-zinc-800 pb-3">
              <User className="w-5 h-5 text-amber-500" />
              <span>Dados do Remetente</span>
            </h3>
            <p className="text-sm text-zinc-400">
              Como o seu cliente verá o remetente ao receber o e-mail na caixa de entrada.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">E-mail de Envio (From Email) *</label>
                <input 
                  type="email" 
                  value={data.fromEmail || ''}
                  onChange={(e) => handleChange('fromEmail', e.target.value)}
                  placeholder="ex: contato@meuredirecionador.com"
                  required
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white focus:border-amber-500 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Nome do Remetente (From Name) *</label>
                <input 
                  type="text" 
                  value={data.fromName || ''}
                  onChange={(e) => handleChange('fromName', e.target.value)}
                  placeholder="ex: Meu Redirecionador (Suporte)"
                  required
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white focus:border-amber-500 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Sessão 2: Servidor SMTP */}
          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-semibold text-zinc-100 flex items-center gap-2 border-b border-zinc-800 pb-3">
              <Server className="w-5 h-5 text-amber-500" />
              <span>Credenciais do Servidor SMTP</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-zinc-300 mb-2">Host SMTP *</label>
                <input 
                  type="text" 
                  value={data.host || ''}
                  onChange={(e) => handleChange('host', e.target.value)}
                  placeholder="ex: smtp.hostinger.com"
                  required
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white focus:border-amber-500 focus:ring-amber-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Porta SMTP *</label>
                <input 
                  type="number" 
                  value={data.port || ''}
                  onChange={(e) => handleChange('port', e.target.value)}
                  placeholder="ex: 465 ou 587"
                  required
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white focus:border-amber-500 focus:ring-amber-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Criptografia *</label>
                <select 
                  value={data.encryption || 'tls'}
                  onChange={(e) => handleChange('encryption', e.target.value)}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white focus:border-amber-500 focus:ring-amber-500"
                >
                  <option value="tls">TLS</option>
                  <option value="ssl">SSL</option>
                  <option value="none">Nenhuma</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Usuário (E-mail de Login) *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-zinc-500" />
                  </div>
                  <input 
                    type="text" 
                    value={data.username || ''}
                    onChange={(e) => handleChange('username', e.target.value)}
                    placeholder="ex: contato@meuredirecionador.com"
                    required
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-800 pl-10 pr-4 py-3 text-white focus:border-amber-500 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Senha do E-mail *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-zinc-500" />
                  </div>
                  <input 
                    type="password" 
                    value={data.password || ''}
                    onChange={(e) => handleChange('password', e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-800 pl-10 pr-4 py-3 text-white focus:border-amber-500 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Rodapé Formulário */}
        <div className="bg-zinc-800/50 px-6 py-4 flex items-center justify-between border-t border-zinc-800">
          <button 
            type="button" 
            onClick={handleTestEmail}
            disabled={isTesting || isSaving}
            className="text-sm font-medium text-amber-500 hover:text-amber-400 flex items-center gap-2 disabled:opacity-50"
          >
            {isTesting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {isTesting ? 'Enviando teste...' : 'Disparar e-mail de teste'}
          </button>
          
          <button 
            type="submit" 
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition shadow-sm disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {isSaving ? 'Salvando...' : 'Salvar Credenciais'}
          </button>
        </div>
      </form>
    </div>
  );
}
