"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  HeadphonesIcon, 
  Plus, 
  Clock, 
  CheckCircle2, 
  ListTodo,
  HelpCircle,
  Inbox,
  Filter
} from "lucide-react";

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState<'tickets' | 'faq'>('tickets');
  const [statusFilter, setStatusFilter] = useState('all');

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
            <HeadphonesIcon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 leading-tight">
              Central de Ajuda
            </h2>
            <p className="text-sm text-zinc-500 mt-1">Tire suas dúvidas ou abra um chamado</p>
          </div>
        </div>
        <Link 
          href="/app/support/new" 
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" />
          Novo Chamado
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 rounded-xl">
              <Clock className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-zinc-900 leading-none">0</p>
              <p className="text-sm font-medium text-zinc-500 mt-1">Em aberto</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 rounded-xl">
              <CheckCircle2 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-zinc-900 leading-none">0</p>
              <p className="text-sm font-medium text-zinc-500 mt-1">Resolvidos</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <ListTodo className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-zinc-900 leading-none">0</p>
              <p className="text-sm font-medium text-zinc-500 mt-1">Total de chamados</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-zinc-100/80 rounded-xl w-fit">
        <button 
          onClick={() => setActiveTab('tickets')} 
          className={`px-5 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2 ${
            activeTab === 'tickets' 
              ? 'bg-white shadow-sm text-blue-600' 
              : 'text-zinc-500 hover:text-zinc-700'
          }`}
        >
          <Inbox className="w-4 h-4" />
          Meus Chamados
        </button>
        <button 
          onClick={() => setActiveTab('faq')} 
          className={`px-5 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2 ${
            activeTab === 'faq' 
              ? 'bg-white shadow-sm text-blue-600' 
              : 'text-zinc-500 hover:text-zinc-700'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          Perguntas Frequentes
        </button>
      </div>

      {/* Tab Content: Tickets */}
      {activeTab === 'tickets' && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          
          <div className="mb-6 flex">
            <div className="relative">
              <Filter className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-9 pr-8 py-2 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm text-zinc-700 font-medium bg-white appearance-none min-w-[200px]"
                style={{
                  backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.75rem center',
                  backgroundSize: '1em'
                }}
              >
                <option value="all">Todos os status</option>
                <option value="open">Aberto</option>
                <option value="in_progress">Em Andamento</option>
                <option value="waiting_customer">Aguardando Cliente</option>
                <option value="waiting_admin">Aguardando Atendente</option>
                <option value="resolved">Resolvido</option>
                <option value="closed">Fechado</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-zinc-200 border-dashed flex flex-col items-center justify-center">
            <div className="w-16 h-16 mb-4 bg-zinc-50 rounded-full flex items-center justify-center border border-zinc-100">
              <Inbox className="w-8 h-8 text-zinc-300" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 mb-1">Nenhum chamado encontrado</h3>
            <p className="text-zinc-500 text-sm mb-6 max-w-sm mx-auto">Você ainda não abriu nenhum chamado de suporte ou não há chamados correspondentes ao filtro.</p>
            <Link 
              href="/app/support/new" 
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-white text-sm font-semibold rounded-xl hover:bg-zinc-800 transition-colors shadow-md"
            >
              <Plus className="w-4 h-4" />
              Abrir Chamado
            </Link>
          </div>

        </div>
      )}

      {/* Tab Content: FAQ */}
      {activeTab === 'faq' && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-zinc-200 border-dashed flex flex-col items-center justify-center">
            <div className="w-16 h-16 mb-4 bg-zinc-50 rounded-full flex items-center justify-center border border-zinc-100">
              <HelpCircle className="w-8 h-8 text-zinc-300" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 mb-1">Nenhuma pergunta encontrada</h3>
            <p className="text-zinc-500 text-sm max-w-sm mx-auto">Ainda não há perguntas frequentes cadastradas nesta central.</p>
          </div>
        </div>
      )}

    </div>
  );
}
