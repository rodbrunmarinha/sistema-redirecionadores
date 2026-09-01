'use client';

import Link from 'next/link';
import { useState } from 'react';
import { 
  ChevronRight, 
  Bot, 
  Plus, 
  Users, 
  UserCheck, 
  UserMinus, 
  Info, 
  MessageCircle, 
  HelpCircle, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Smartphone,
  Hash,
  Link as LinkIcon,
  ShieldAlert,
  Save
} from 'lucide-react';

export default function TelegramUsersPage() {
  const [activeTab, setActiveTab] = useState('authorize');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [telegramSalesEnabled, setTelegramSalesEnabled] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300">
      
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 shadow-lg shadow-orange-500/20">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-8 w-64 h-64 rounded-full bg-white/5 pointer-events-none"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          <nav className="flex items-center gap-2 text-sm mb-4" aria-label="Breadcrumb">
            <Link href="/admin" className="text-white/70 hover:text-white transition-colors truncate max-w-[45vw] sm:max-w-[220px]">
              Dashboard
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-white/50 shrink-0" />
            <Link href="/admin/purchase-groups" className="text-white/70 hover:text-white transition-colors truncate max-w-[45vw] sm:max-w-[220px]">
              Grupos de Compras
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-white/50 shrink-0" />
            <span className="text-white font-medium truncate max-w-[45vw] sm:max-w-[220px]">
              Telegram Bot
            </span>
          </nav>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4 min-w-0">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 border border-white/20 shadow-md">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-white truncate">Usuários Autorizados</h1>
                <p className="text-orange-100 text-sm mt-1">Telegram Bot - Usuários Autorizados</p>
              </div>
            </div>
            
            <button 
              type="button" 
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-orange-600 hover:bg-orange-50 font-bold rounded-xl transition shadow-lg active:scale-95 text-sm shrink-0"
            >
              <Plus className="w-4 h-4 shrink-0" strokeWidth={2.5} />
              Adicionar Usuário
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6">

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <Link href="/admin/settings/telegram-users" className="relative overflow-hidden bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-lg transition hover:border-orange-500/50 active:scale-95 group">
            <div className="absolute -right-3 -top-3 w-20 h-20 bg-orange-500/5 rounded-full group-hover:bg-orange-500/10 transition-colors"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400 group-hover:text-zinc-300">Total</span>
                <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-700">
                  <Users className="w-4 h-4 text-zinc-400 group-hover:text-orange-400" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">0</p>
            </div>
          </Link>
          
          <Link href="/admin/settings/telegram-users?status=active" className="relative overflow-hidden bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-lg transition hover:border-emerald-500/50 active:scale-95 group">
            <div className="absolute -right-3 -top-3 w-20 h-20 bg-emerald-500/5 rounded-full group-hover:bg-emerald-500/10 transition-colors"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400 group-hover:text-zinc-300">Ativos</span>
                <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-700">
                  <UserCheck className="w-4 h-4 text-zinc-400 group-hover:text-emerald-400" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">0</p>
            </div>
          </Link>

          <Link href="/admin/settings/telegram-users?status=inactive" className="relative overflow-hidden bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-lg transition hover:border-zinc-500/50 active:scale-95 group">
            <div className="absolute -right-3 -top-3 w-20 h-20 bg-zinc-500/5 rounded-full group-hover:bg-zinc-500/10 transition-colors"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400 group-hover:text-zinc-300">Inativos</span>
                <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-700">
                  <UserMinus className="w-4 h-4 text-zinc-400 group-hover:text-zinc-300" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">0</p>
            </div>
          </Link>
        </div>

        {/* Telegram Sales Config */}
        <div className="mb-6 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">Telegram de Vendas</h3>
              <p className="mt-1 text-sm text-zinc-400">Ative o bot compartilhado de compras para esta empresa. Quando desativado, os clientes continuam comprando apenas pelo portal web.</p>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-semibold ${telegramSalesEnabled ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'}`}>
                  <span className={`h-2 w-2 rounded-full ${telegramSalesEnabled ? 'bg-emerald-500' : 'bg-zinc-500'}`}></span>
                  {telegramSalesEnabled ? 'Ativado para esta empresa' : 'Desativado para esta empresa'}
                </span>

                <span className="text-zinc-400">
                  Bot global: <strong className="text-white">CndckHubBot</strong>
                </span>
              </div>
            </div>

            <form className="flex flex-col gap-2 sm:min-w-[340px]">
              <label className="inline-flex items-center gap-3 text-sm font-medium text-zinc-200 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={telegramSalesEnabled}
                  onChange={(e) => setTelegramSalesEnabled(e.target.checked)}
                  className="h-5 w-5 rounded border-zinc-700 bg-zinc-950 text-orange-500 focus:ring-orange-500/50 focus:ring-offset-zinc-900" 
                />
                <span>Permitir compras pelo bot do Telegram</span>
              </label>
              <p className="text-xs text-zinc-500">A alteração é salva automaticamente ao marcar ou desmarcar.</p>

              <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-950/50 p-4">
                <p className="flex items-center gap-2 text-sm font-bold text-white">
                  <Bot className="w-5 h-5 text-orange-500" />
                  Como colocar o bot no seu grupo do Telegram
                </p>
                <p className="mt-1 text-xs text-zinc-400">Para o bot divulgar os produtos no seu grupo, ele precisa estar dentro do grupo e você precisa informar o Chat ID do grupo abaixo. Siga os passos:</p>
                <ol className="mt-4 space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-zinc-800 text-zinc-300 rounded-full flex items-center justify-center font-bold text-xs border border-zinc-700">1</span>
                    <p className="text-xs leading-5 text-zinc-300 mt-0.5">Crie (ou abra) no Telegram o grupo onde você divulga os produtos aos clientes.</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-zinc-800 text-zinc-300 rounded-full flex items-center justify-center font-bold text-xs border border-zinc-700">2</span>
                    <p className="text-xs leading-5 text-zinc-300 mt-0.5">Adicione o bot <a href="https://t.me/CndckHubBot" target="_blank" rel="noreferrer" className="font-bold text-orange-500 hover:text-orange-400 transition-colors hover:underline">@CndckHubBot</a> como membro do grupo.</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-zinc-800 text-zinc-300 rounded-full flex items-center justify-center font-bold text-xs border border-zinc-700">3</span>
                    <p className="text-xs leading-5 text-zinc-300 mt-0.5">Torne o bot <strong>administrador</strong> do grupo. Sem isso ele não consegue publicar as fotos.</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-zinc-800 text-zinc-300 rounded-full flex items-center justify-center font-bold text-xs border border-zinc-700">4</span>
                    <p className="text-xs leading-5 text-zinc-300 mt-0.5">Descubra o Chat ID do grupo: adicione o <a href="https://t.me/getidsbot" target="_blank" rel="noreferrer" className="font-bold text-orange-500 hover:text-orange-400 transition-colors hover:underline">@getidsbot</a> ao grupo — ele responde com o ID do grupo. Depois pode removê-lo.</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-zinc-800 text-zinc-300 rounded-full flex items-center justify-center font-bold text-xs border border-zinc-700">5</span>
                    <p className="text-xs leading-5 text-zinc-300 mt-0.5">Cole esse Chat ID no campo "Grupo padrão" abaixo e clique em Salvar.</p>
                  </li>
                </ol>
                <div className="mt-4 rounded-lg bg-orange-500/10 border border-orange-500/20 p-3 text-xs text-orange-200">
                  <p className="flex items-start gap-2">
                    <span className="text-orange-500 mt-0.5">💡</span>
                    <span><strong>Dica:</strong> cada grupo de compras pode ter o seu próprio grupo de Telegram. O campo abaixo é o destino padrão, usado quando o grupo de compras não tiver um próprio.</span>
                  </p>
                </div>
              </div>

              <div className="mt-3 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                <label htmlFor="telegram_default_group_id" className="block text-sm font-medium text-zinc-200">
                  Grupo principal de divulgação
                </label>
                <div className="mt-2 relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input 
                    id="telegram_default_group_id" 
                    type="text" 
                    placeholder="-1001234567890" 
                    className="w-full pl-9 rounded-xl border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-white focus:border-orange-500 focus:ring-orange-500 outline-none transition" 
                  />
                </div>
                <p className="mt-2 text-xs text-zinc-500 leading-relaxed">
                  Opcional. Se um grupo de compras não tiver um grupo de Telegram próprio, o sistema usa este Chat ID como destino padrão para divulgar as fotos e produtos.
                </p>
                
                <div className="mt-4 pt-4 border-t border-zinc-800">
                  <p className="text-sm font-medium text-zinc-200 flex items-center gap-2">
                    <LinkIcon className="w-4 h-4 text-zinc-400" />
                    Link de entrada para os clientes
                  </p>
                  <p className="mt-2 text-xs text-orange-400 bg-orange-500/10 border border-orange-500/20 p-2 rounded-lg inline-block">
                    Ainda não gerado. Salve com o Chat ID preenchido.
                  </p>
                  <p className="mt-2 text-xs text-zinc-500 leading-relaxed">
                    Gerado a partir do Chat ID acima quando você salva. O bot precisa ser administrador do grupo com permissão de convidar. É este link que aparece para o cliente na vitrine.
                  </p>
                </div>
              </div>

              <button type="button" className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-500 shadow-md">
                <Save className="w-4 h-4" />
                Salvar Telegram de vendas
              </button>
            </form>
          </div>

          <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-950/50 p-4 text-xs text-zinc-400">
            <p className="font-semibold text-white flex items-center gap-2 mb-1">
              <ShieldAlert className="w-4 h-4 text-zinc-500" />
              Como testar
            </p>
            <p className="leading-relaxed">Depois de ativar: abra o perfil do cliente, conecte o Telegram, divulgue um produto no grupo e clique em Comprar para validar o carrinho no bot.</p>
          </div>
        </div>

        {/* Instructions Card with Tabs */}
        <div className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800">
          <div className="flex overflow-x-auto border-b border-zinc-800 bg-zinc-950/50">
            <button 
              onClick={() => setActiveTab('authorize')}
              className={`flex-1 px-4 sm:px-6 py-4 font-medium text-sm transition-all flex items-center justify-center gap-2 whitespace-nowrap ${activeTab === 'authorize' ? 'border-b-2 border-orange-500 text-orange-500 bg-zinc-900' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'}`}
            >
              <UserCheck className="w-4 h-4" />
              1. Autorizar Admin
            </button>
            <button 
              onClick={() => setActiveTab('register')}
              className={`flex-1 px-4 sm:px-6 py-4 font-medium text-sm transition-all flex items-center justify-center gap-2 whitespace-nowrap ${activeTab === 'register' ? 'border-b-2 border-orange-500 text-orange-500 bg-zinc-900' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'}`}
            >
              <Smartphone className="w-4 h-4" />
              2. Produtos via Bot
            </button>
            <button 
              onClick={() => setActiveTab('faq')}
              className={`flex-1 px-4 sm:px-6 py-4 font-medium text-sm transition-all flex items-center justify-center gap-2 whitespace-nowrap ${activeTab === 'faq' ? 'border-b-2 border-orange-500 text-orange-500 bg-zinc-900' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'}`}
            >
              <HelpCircle className="w-4 h-4" />
              FAQ
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'authorize' && (
              <div className="animate-in fade-in duration-300">
                <div className="flex items-start gap-4">
                  <div className="mt-1 p-2 bg-zinc-800 rounded-lg text-zinc-400 shrink-0 border border-zinc-700">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-5">Como Autorizar um Administrador</h3>
                    
                    <ol className="space-y-4 text-sm text-zinc-300">
                      <li className="flex items-start gap-4 p-4 bg-zinc-950/50 border border-zinc-800/50 rounded-xl">
                        <span className="flex-shrink-0 w-7 h-7 bg-zinc-800 text-white rounded-full flex items-center justify-center font-bold text-sm border border-zinc-700">1</span>
                        <div>
                          <p className="font-semibold text-white mb-1">Abrir o Telegram</p>
                          <p className="text-zinc-400">O administrador que será autorizado deve abrir o Telegram no celular ou computador.</p>
                        </div>
                      </li>

                      <li className="flex items-start gap-4 p-4 bg-zinc-950/50 border border-zinc-800/50 rounded-xl">
                        <span className="flex-shrink-0 w-7 h-7 bg-zinc-800 text-white rounded-full flex items-center justify-center font-bold text-sm border border-zinc-700">2</span>
                        <div>
                          <p className="font-semibold text-white mb-2">Obter o User ID</p>
                          <p className="mb-3 text-zinc-400">Procure e envie qualquer mensagem para <a href="https://t.me/userinfobot" target="_blank" rel="noreferrer" className="text-orange-500 hover:underline font-bold">@userinfobot</a></p>
                          <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800">
                            <p className="text-xs text-zinc-500 mb-1">Resposta do bot:</p>
                            <code className="text-emerald-400 font-mono">Id: 123456789</code>
                          </div>
                        </div>
                      </li>

                      <li className="flex items-start gap-4 p-4 bg-zinc-950/50 border border-zinc-800/50 rounded-xl">
                        <span className="flex-shrink-0 w-7 h-7 bg-zinc-800 text-white rounded-full flex items-center justify-center font-bold text-sm border border-zinc-700">3</span>
                        <div>
                          <p className="font-semibold text-white mb-1">Copiar o número</p>
                          <p className="text-zinc-400">Copie apenas o número (ex: <code className="bg-zinc-800 text-zinc-200 px-2 py-0.5 rounded font-mono border border-zinc-700">123456789</code>)</p>
                        </div>
                      </li>

                      <li className="flex items-start gap-4 p-4 bg-zinc-950/50 border border-zinc-800/50 rounded-xl">
                        <span className="flex-shrink-0 w-7 h-7 bg-zinc-800 text-white rounded-full flex items-center justify-center font-bold text-sm border border-zinc-700">4</span>
                        <div>
                          <p className="font-semibold text-white mb-2">Adicionar no Sistema</p>
                          <p className="mb-2 text-zinc-400">Clique no botão <strong>"Adicionar Usuário"</strong> no topo desta página</p>
                          <div className="space-y-1.5 text-xs text-zinc-500">
                            <p className="flex items-center gap-2"><ChevronRight className="w-3 h-3" /> Selecione o administrador</p>
                            <p className="flex items-center gap-2"><ChevronRight className="w-3 h-3" /> Cole o User ID</p>
                            <p className="flex items-center gap-2"><ChevronRight className="w-3 h-3" /> Clique em "Adicionar Usuário"</p>
                          </div>
                        </div>
                      </li>

                      <li className="flex items-start gap-4 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                        <CheckCircle2 className="w-7 h-7 text-emerald-500 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-emerald-400 mb-1">Pronto!</p>
                          <p className="text-emerald-200/70 text-sm">O administrador agora está autorizado a cadastrar produtos via Telegram.</p>
                        </div>
                      </li>
                    </ol>

                    <div className="mt-5 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50 flex items-start gap-3">
                      <Info className="w-5 h-5 text-zinc-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-zinc-200 font-medium mb-1">Observação</p>
                        <p className="text-sm text-zinc-400 leading-relaxed">
                          O <strong>Username</strong> aparecerá automaticamente na tabela quando o administrador enviar a primeira mensagem para o bot do sistema.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'register' && (
              <div className="animate-in fade-in duration-300">
                <div className="flex items-start gap-4">
                  <div className="mt-1 p-2 bg-zinc-800 rounded-lg text-zinc-400 shrink-0 border border-zinc-700">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-5">Como Cadastrar Produtos pelo Telegram</h3>
                    
                    <ol className="space-y-4 text-sm text-zinc-300">
                      <li className="flex items-start gap-4 p-4 bg-zinc-950/50 border border-zinc-800/50 rounded-xl">
                        <span className="flex-shrink-0 w-7 h-7 bg-zinc-800 text-white rounded-full flex items-center justify-center font-bold text-sm border border-zinc-700">1</span>
                        <div className="flex-1">
                          <p className="font-semibold text-white mb-2">Encontrar o Bot</p>
                          <p className="mb-3 text-zinc-400">No Telegram, procure pelo bot do sistema:</p>
                          <a href="https://t.me/CndckHubBot" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-500 transition font-medium shadow-md">
                            <Bot className="w-4 h-4" />
                            @CndckHubBot
                          </a>
                        </div>
                      </li>

                      <li className="flex items-start gap-4 p-4 bg-zinc-950/50 border border-zinc-800/50 rounded-xl">
                        <span className="flex-shrink-0 w-7 h-7 bg-zinc-800 text-white rounded-full flex items-center justify-center font-bold text-sm border border-zinc-700">2</span>
                        <div>
                          <p className="font-semibold text-white mb-1">Iniciar Conversa</p>
                          <p className="text-zinc-400">Clique em <strong>"Start"</strong> ou envie <code className="bg-zinc-800 text-zinc-200 px-2 py-0.5 rounded font-mono border border-zinc-700">/start</code></p>
                        </div>
                      </li>

                      <li className="flex items-start gap-4 p-4 bg-zinc-950/50 border border-zinc-800/50 rounded-xl">
                        <span className="flex-shrink-0 w-7 h-7 bg-zinc-800 text-white rounded-full flex items-center justify-center font-bold text-sm border border-zinc-700">3</span>
                        <div>
                          <p className="font-semibold text-white mb-1">Tirar/Selecionar Foto</p>
                          <p className="text-zinc-400">Tire uma foto do produto ou selecione uma da galeria do seu celular.</p>
                        </div>
                      </li>

                      <li className="flex items-start gap-4 p-4 bg-zinc-950/50 border border-zinc-800/50 rounded-xl">
                        <span className="flex-shrink-0 w-7 h-7 bg-zinc-800 text-white rounded-full flex items-center justify-center font-bold text-sm border border-zinc-700">4</span>
                        <div className="flex-1">
                          <p className="font-semibold text-white mb-4">Adicionar Legenda no Formato</p>
                          
                          <div className="mb-5 space-y-3">
                            <p className="text-xs text-zinc-400 font-medium">📝 Exemplos de legendas válidas:</p>
                            <div className="p-3 bg-zinc-900 rounded-lg overflow-x-auto border border-zinc-800">
                              <code className="text-emerald-400 font-mono text-sm block">$14.99 dis#%20 tam P,M,G n# Blusa Floral CAT# Feminino *3 @301</code>
                            </div>
                            <div className="p-3 bg-zinc-900 rounded-lg overflow-x-auto border border-zinc-800">
                              <code className="text-emerald-400 font-mono text-sm block">$25.00 n# Calça Jeans tam P#5, M#10, G#3 CAT# Feminino</code>
                            </div>
                            <div className="p-3 bg-zinc-900 rounded-lg overflow-x-auto border border-zinc-800">
                              <code className="text-emerald-400 font-mono text-sm block">n# Vestido Longo CAT# Festa $89.90 dis#$15 tam P,M,G</code>
                            </div>
                            <div className="p-3 bg-zinc-900 rounded-lg overflow-x-auto border border-zinc-800">
                              <code className="text-emerald-400 font-mono text-sm block">$12.50</code>
                              <p className="text-xs text-zinc-500 mt-2">↑ Apenas o preço (outros campos são opcionais)</p>
                            </div>
                          </div>

                          <div className="space-y-4 bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                            <div>
                              <p className="font-semibold text-sm text-white mb-3 flex items-center gap-2">
                                <span className="w-5 h-5 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center text-xs border border-red-500/30">!</span>
                                Campo Obrigatório:
                              </p>
                              <div className="ml-7 flex items-start gap-3">
                                <code className="bg-zinc-800 text-zinc-200 px-2 py-1 rounded font-mono text-xs border border-zinc-700 whitespace-nowrap">$14.99</code>
                                <span className="text-sm text-zinc-400 mt-0.5">Preço do produto (OBRIGATÓRIO)</span>
                              </div>
                            </div>

                            <div className="pt-4 border-t border-zinc-800">
                              <p className="font-semibold text-sm text-white mb-3">Campos Opcionais:</p>
                              <div className="ml-7 space-y-3">
                                <div>
                                  <div className="flex items-start gap-3">
                                    <code className="bg-zinc-800 text-zinc-200 px-2 py-1 rounded font-mono text-xs border border-zinc-700 whitespace-nowrap">dis#%20</code>
                                    <span className="text-sm text-zinc-400 mt-0.5">20% de desconto</span>
                                  </div>
                                  <div className="flex items-start gap-3 mt-2">
                                    <code className="bg-zinc-800 text-zinc-200 px-2 py-1 rounded font-mono text-xs border border-zinc-700 whitespace-nowrap">dis#$15</code>
                                    <span className="text-sm text-zinc-400 mt-0.5">Desconto em valor fixo</span>
                                  </div>
                                </div>
                                <div>
                                  <div className="flex items-start gap-3">
                                    <code className="bg-zinc-800 text-zinc-200 px-2 py-1 rounded font-mono text-xs border border-zinc-700 whitespace-nowrap">tam P,M,G</code>
                                    <span className="text-sm text-zinc-400 mt-0.5">Tamanhos sem controle rígido de estoque</span>
                                  </div>
                                  <div className="flex items-start gap-3 mt-2">
                                    <code className="bg-zinc-800 text-zinc-200 px-2 py-1 rounded font-mono text-xs border border-zinc-700 whitespace-nowrap">tam P#5, M#3</code>
                                    <span className="text-sm text-zinc-400 mt-0.5">Tamanhos com estoque (P=5, M=3)</span>
                                  </div>
                                </div>
                                <div className="flex items-start gap-3">
                                  <code className="bg-zinc-800 text-zinc-200 px-2 py-1 rounded font-mono text-xs border border-zinc-700 whitespace-nowrap">n#</code>
                                  <span className="text-sm text-zinc-400 mt-0.5">Nome do produto</span>
                                </div>
                                <div className="flex items-start gap-3">
                                  <code className="bg-zinc-800 text-zinc-200 px-2 py-1 rounded font-mono text-xs border border-zinc-700 whitespace-nowrap">CAT#</code>
                                  <span className="text-sm text-zinc-400 mt-0.5">Categoria (criada automaticamente se não existir)</span>
                                </div>
                                <div className="flex items-start gap-3">
                                  <code className="bg-zinc-800 text-zinc-200 px-2 py-1 rounded font-mono text-xs border border-zinc-700 whitespace-nowrap">desc#</code>
                                  <span className="text-sm text-zinc-400 mt-0.5">Descrição do produto (vai até o próximo campo ou fim)</span>
                                </div>
                                <div className="flex items-start gap-3">
                                  <code className="bg-zinc-800 text-zinc-200 px-2 py-1 rounded font-mono text-xs border border-zinc-700 whitespace-nowrap">@301</code>
                                  <span className="text-sm text-zinc-400 mt-0.5">Adicionar ao carrinho do dock (ex: @301 @405)</span>
                                </div>
                              </div>
                            </div>

                            <div className="pt-4 border-t border-zinc-800">
                              <p className="text-sm text-orange-400 flex items-start gap-2">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                <span><strong>Ordem flexível:</strong> Você pode colocar os campos em qualquer ordem! O bot reconhece automaticamente.</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </li>

                      <li className="flex items-start gap-4 p-4 bg-zinc-950/50 border border-zinc-800/50 rounded-xl">
                        <span className="flex-shrink-0 w-7 h-7 bg-zinc-800 text-white rounded-full flex items-center justify-center font-bold text-sm border border-zinc-700">5</span>
                        <div>
                          <p className="font-semibold text-white mb-2">Enviar</p>
                          <p className="mb-3 text-zinc-400">Envie a foto com a legenda preparada.</p>
                          <div className="p-3 bg-emerald-500/5 rounded-lg border border-emerald-500/20 text-sm">
                            <p className="text-emerald-400 flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4" />
                              O bot confirmará que o produto foi cadastrado com sucesso!
                            </p>
                          </div>
                        </div>
                      </li>
                    </ol>

                    <div className="mt-6 p-5 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
                      <p className="text-sm text-white font-semibold mb-3 flex items-center gap-2">
                        <Info className="w-4 h-4 text-zinc-400" />
                        Dicas Importantes
                      </p>
                      <ul className="text-sm text-zinc-300 space-y-2 list-disc pl-5">
                        <li>Se você configurou o Telegram Group ID no Grupo de Compras, não precisa usar *ID na legenda.</li>
                        <li>Se não usar *ID, o produto vai para o último grupo onde você cadastrou.</li>
                        <li>As categorias são criadas automaticamente se não existirem.</li>
                        <li>Você pode enviar várias fotos seguidas - cada uma vira um produto diferente no catálogo.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'faq' && (
              <div className="animate-in fade-in duration-300">
                <div className="flex items-start gap-4">
                  <div className="mt-1 p-2 bg-zinc-800 rounded-lg text-zinc-400 shrink-0 border border-zinc-700">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-5">Perguntas Frequentes — Integração Telegram</h3>

                    <div className="space-y-3">
                      {[
                        {
                          q: 'Quais são os dois bots e para que serve cada um?',
                          a: <><strong className="text-zinc-200">Bot Admin:</strong> recebe fotos de produtos dos administradores, divulga nos grupos e aceita comandos como <code>/setgrupo</code>, <code>/chatid</code>. Apenas usuários autorizados podem usar.<br/><br/><strong className="text-zinc-200">Bot de Vendas:</strong> atende os <em>clientes</em> — exibe catálogo, gerencia o carrinho e processa o pagamento no Telegram.</>
                        },
                        {
                          q: 'Como descubro o ID do meu grupo do Telegram?',
                          a: <><strong className="text-zinc-200">Automática (recomendada):</strong> Adicione o bot admin ao grupo e promova-o a administrador. O sistema detecta e envia o ID.<br/><br/><strong className="text-zinc-200">Manual:</strong> Com o bot no grupo, envie <code>/chatid</code>. O bot apaga a mensagem e te envia o ID via DM.</>
                        },
                        {
                          q: 'Qual a diferença entre o "Grupo Padrão" e o grupo por Grupo de Compras?',
                          a: <><strong className="text-zinc-200">Grupo Padrão</strong> (configurado aqui): fallback de divulgação para todos os grupos de compras sem grupo próprio.<br/><br/><strong className="text-zinc-200">Grupo específico</strong> (no grupo de compras): tem prioridade. Útil para nichos.</>
                        },
                        {
                          q: 'Por que o /chatid não aparece no grupo para os clientes verem?',
                          a: 'Segurança. O bot apaga a mensagem no mesmo instante em que a recebe e envia o ID por DM privada. Os clientes nunca veem mensagens de configuração.'
                        },
                        {
                          q: 'Quais permissões o bot precisa ter no grupo?',
                          a: <>Para funcionar corretamente, o bot precisa de: <strong className="text-zinc-200">Enviar mensagens</strong>, <strong className="text-zinc-200">Enviar mídias</strong> e <strong className="text-zinc-200">Apagar mensagens</strong>. As permissões padrão de admin cobrem isso.</>
                        },
                        {
                          q: 'O bot de vendas precisa estar no grupo também?',
                          a: <>Não. O bot de vendas funciona em conversa <em className="text-zinc-200">privada</em> com cada cliente. O cliente clica em <strong>Comprar</strong> e é direcionado para a DM do bot de vendas.</>
                        }
                      ].map((faq, index) => (
                        <details key={index} className="group rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                          <summary className="flex cursor-pointer items-center justify-between gap-3 p-4 hover:bg-zinc-800/50 transition">
                            <span className="font-semibold text-sm text-white flex items-center gap-3">
                              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-800 text-orange-500 flex items-center justify-center text-xs font-bold border border-zinc-700">?</span>
                              {faq.q}
                            </span>
                            <ChevronRight className="w-4 h-4 text-zinc-500 transition-transform group-open:rotate-90 shrink-0" />
                          </summary>
                          <div className="px-4 pb-4 pt-2 text-sm text-zinc-400 bg-zinc-900 border-t border-zinc-800">
                            {faq.a}
                          </div>
                        </details>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Users Table Empty State */}
        <div className="bg-zinc-900 rounded-2xl shadow-lg overflow-hidden border border-zinc-800">
          <div className="p-12 text-center">
            <UserMinus className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Nenhum usuário autorizado
            </h3>
            <p className="text-sm text-zinc-400 mb-6 max-w-sm mx-auto">
              Adicione administradores para permitir o cadastro de produtos e gestão via Telegram.
            </p>
            <button 
              type="button" 
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-500 transition inline-flex items-center gap-2 shadow-md"
            >
              <Plus className="w-4 h-4" />
              Adicionar Primeiro Usuário
            </button>
          </div>
        </div>

      </div>

      {/* Add User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
          <div className="bg-zinc-900 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden border border-zinc-800 flex flex-col animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="bg-zinc-950 px-6 py-4 border-b border-zinc-800 flex items-center justify-between shrink-0">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Bot className="w-5 h-5 text-orange-500" />
                Adicionar Usuário Autorizado
              </h2>
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* Admin Select */}
              <div>
                <label className="block text-sm font-semibold text-zinc-200 mb-2">
                  Administrador <span className="text-red-500">*</span>
                </label>
                <select required className="w-full rounded-xl border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-white focus:border-orange-500 focus:ring-orange-500 outline-none transition">
                  <option value="">Selecione um administrador</option>
                  <option value="83">Rodrigo de Souza (rodbruno@yahoo.com.br)</option>
                </select>
                <p className="mt-2 text-xs text-zinc-500">
                  Selecione qual administrador terá acesso ao bot.
                </p>
              </div>

              {/* Telegram User ID */}
              <div>
                <label className="block text-sm font-semibold text-zinc-200 mb-2">
                  Telegram User ID <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  required 
                  pattern="[0-9]+" 
                  placeholder="123456789" 
                  className="w-full rounded-xl border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-white focus:border-orange-500 focus:ring-orange-500 outline-none transition font-mono" 
                />
                <p className="mt-2 text-xs text-zinc-500">
                  Apenas números. Obtenha com o <a href="https://t.me/userinfobot" target="_blank" rel="noreferrer" className="text-orange-500 hover:underline">@userinfobot</a>.
                </p>
              </div>

              {/* Instructions */}
              <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-zinc-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-zinc-300">
                    <p className="font-semibold mb-3 text-white">Como obter o User ID:</p>
                    <ol className="space-y-2 text-xs text-zinc-400">
                      <li>1. Abra o Telegram no celular ou desktop</li>
                      <li>2. Procure por @userinfobot</li>
                      <li>3. Envie qualquer mensagem para ele</li>
                      <li>4. Ele responderá com seu User ID</li>
                      <li>5. Copie o número e cole acima</li>
                    </ol>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-zinc-950 border-t border-zinc-800 flex items-center justify-end gap-3 shrink-0">
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 text-sm font-semibold text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-xl transition"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="px-5 py-2.5 bg-orange-600 text-white text-sm rounded-xl font-semibold hover:bg-orange-500 transition shadow-md"
              >
                Adicionar Usuário
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
