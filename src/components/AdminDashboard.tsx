import { useState } from 'react';
import { Appointment, Service, Barber, AppointmentStatus, PaymentMethod, ClientMemory } from '../types/barbershop';
import { 
  Users, DollarSign, Calendar, TrendingUp, Scissors, Search, 
  Filter, Plus, CheckCircle, Clock, XCircle, AlertCircle, 
  ChevronRight, ArrowLeft, RefreshCw, Smartphone, Award, ShieldAlert,
  Brain, Sparkles, MessageSquare, Bot, BookOpen, Send, Check, Copy, CheckCheck
} from 'lucide-react';

interface AdminDashboardProps {
  appointments: Appointment[];
  services: Service[];
  barbers: Barber[];
  clientMemories: ClientMemory[];
  onUpdateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  onAddManualAppointment: (newApt: Appointment) => void;
  onSaveClientMemory: (memory: ClientMemory) => void;
  onBackToClientSite: () => void;
  onResetDemoData: () => void;
}

export function AdminDashboard({
  appointments,
  services,
  barbers,
  clientMemories,
  onUpdateAppointmentStatus,
  onAddManualAppointment,
  onSaveClientMemory,
  onBackToClientSite,
  onResetDemoData
}: AdminDashboardProps) {
  // Navigation tabs within Admin
  const [activeTab, setActiveTab] = useState<'appointments' | 'services' | 'barbers' | 'clients' | 'metrics'>('appointments');
  
  // AI Client Memory states
  const [selectedClient, setSelectedClient] = useState<ClientMemory | null>(null);
  const [clientSearchQuery, setClientSearchQuery] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [loadingAiAnalysis, setLoadingAiAnalysis] = useState(false);
  const [reengagementMsg, setReengagementMsg] = useState<string | null>(null);
  const [loadingReengagement, setLoadingReengagement] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState(false);
  
  // Filter for appointments
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Quick manual booking modal inside admin
  const [isManualBookingOpen, setIsManualBookingOpen] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newServiceId, setNewServiceId] = useState(services[0]?.id || '');
  const [newBarberId, setNewBarberId] = useState(barbers[0]?.id || '');
  const [newTime, setNewTime] = useState('16:00');
  const [newPaymentMethod, setNewPaymentMethod] = useState<PaymentMethod>('credit_card');

  // Calculate metrics
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(a => a.date === todayStr);
  const totalTodayRevenue = todayAppointments
    .filter(a => a.status !== 'cancelled')
    .reduce((acc, curr) => acc + curr.price, 0);

  const pixRevenue = todayAppointments
    .filter(a => a.status !== 'cancelled' && a.paymentMethod === 'pix')
    .reduce((acc, curr) => acc + curr.price, 0);

  const counterRevenue = totalTodayRevenue - pixRevenue;

  const completedCount = appointments.filter(a => a.status === 'completed').length;
  const inProgressCount = appointments.filter(a => a.status === 'in_progress').length;
  const confirmedCount = appointments.filter(a => a.status === 'confirmed').length;

  // Filtered appointments list
  const filteredAppointments = appointments.filter(apt => {
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    const matchesSearch = apt.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          apt.barberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          apt.protocolNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleCreateManualApt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim()) return;

    const chosenService = services.find(s => s.id === newServiceId) || services[0];
    const chosenBarber = barbers.find(b => b.id === newBarberId) || barbers[0];
    const randomNum = Math.floor(1000 + Math.random() * 9000);

    const manualApt: Appointment = {
      id: `apt-manual-${Date.now()}`,
      protocolNumber: `IMP-${randomNum}`,
      clientName: newClientName.trim(),
      clientPhone: newClientPhone.trim() || '(11) 99999-0000',
      clientNotes: 'Agendamento rápido balcão / telefone',
      serviceId: chosenService.id,
      serviceName: chosenService.name,
      barberId: chosenBarber.id,
      barberName: chosenBarber.name,
      date: todayStr,
      time: newTime,
      price: chosenService.price,
      durationMin: chosenService.durationMin,
      paymentMethod: newPaymentMethod,
      paymentStatus: newPaymentMethod === 'pix' ? 'paid' : 'pending_on_counter',
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    onAddManualAppointment(manualApt);
    setIsManualBookingOpen(false);
    setNewClientName('');
    setNewClientPhone('');
  };

  const handleRunAiAnalysis = async (client: ClientMemory) => {
    setLoadingAiAnalysis(true);
    setAiAnalysis(
      `Perfil: ${client.totalVisits} visitas registradas (LTV R$ ${client.totalSpent.toFixed(2)}).\n` +
      `Barbeiro habitual: ${client.preferredBarberName}.\n` +
      `Diretriz de Bancada: ${client.hairProfile}\n` +
      `Sensibilidade & Cuidados: ${client.skinProfile || 'Aplicar óleo pré-barba e toalha vaporizada.'}\n` +
      `Bebida na recepção: ${client.favoriteDrink}`
    );
  };

  const handleGenerateReengagement = (client: ClientMemory) => {
    const msg = `Olá, ${client.name}! Tudo bem?\n\nPassando para lembrar que já fazem alguns dias desde o seu último atendimento na Império Barber.\nO barbeiro ${client.preferredBarberName} está com horários disponíveis para esta semana e o seu ${client.favoriteDrink} favorito estará te esperando na recepção.\n\nGostaria de reservar seu horário? Estamos à disposição!`;
    setReengagementMsg(msg);
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Clock className="w-3 h-3" />
            <span>Confirmado</span>
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse">
            <Scissors className="w-3 h-3" />
            <span>Na Cadeira</span>
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle className="w-3 h-3" />
            <span>Concluído</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="w-3 h-3" />
            <span>Cancelado</span>
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 pb-20">
      {/* Top Demo Explanatory Banner */}
      <div className="bg-gradient-to-r from-neutral-900 via-amber-950/40 to-neutral-900 border-b border-amber-500/30 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-amber-300">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-semibold">Área Administrativa Demonstrativa (Visão do Proprietário):</span>
            <span className="text-neutral-300 hidden md:inline">
              Ambiente de teste para apresentação comercial com dados em tempo real.
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onResetDemoData}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[11px] font-medium border border-neutral-700 cursor-pointer"
              title="Reinicia os dados de teste para o estado original"
            >
              <RefreshCw className="w-3 h-3 text-amber-400" />
              <span>Restaurar Padrões</span>
            </button>

            <button
              onClick={onBackToClientSite}
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold text-xs cursor-pointer shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar ao Site</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Dashboard Title & Quick Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-widest">
              <span>Painel de Gestão</span>
              <span aria-hidden="true">·</span>
              <span>Império Barber — Unidade Jardins</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-white mt-1">
              Controle Operacional da Barbearia
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsManualBookingOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-semibold shadow-md shadow-amber-950/40 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Agendamento Balcão</span>
            </button>
          </div>
        </div>

        {/* 4 KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Revenue */}
          <div className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 shadow-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-400">Faturamento Previsto Hoje</span>
              <div className="p-2 rounded-lg bg-amber-400/10 text-amber-400">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold font-display text-amber-400 tabular-nums">
              R$ {totalTodayRevenue.toFixed(2).replace('.', ',')}
            </p>
            <div className="text-[11px] text-neutral-400 flex items-center gap-1.5 flex-wrap">
              <span className="text-emerald-400 font-semibold">Pix: R$ {pixRevenue.toFixed(0)}</span>
              <span>·</span>
              <span className="text-neutral-300">Balcão: R$ {counterRevenue.toFixed(0)}</span>
            </div>
          </div>

          {/* Appointments Count */}
          <div className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 shadow-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-400">Total Agendados Hoje</span>
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold font-display text-white tabular-nums">
              {todayAppointments.length}
            </p>
            <div className="text-[11px] text-neutral-400 flex items-center gap-2">
              <span>{completedCount} concluídos</span>
              <span>·</span>
              <span className="text-amber-400">{inProgressCount} na cadeira</span>
            </div>
          </div>

          {/* Active Barbers */}
          <div className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 shadow-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-400">Bancadas Ativas</span>
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Scissors className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold font-display text-white tabular-nums">
              4 / 4
            </p>
            <div className="text-[11px] text-emerald-400 font-medium">
              100% da equipe escalada
            </div>
          </div>

          {/* Average Ticket */}
          <div className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 shadow-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-400">Ticket Médio por Cliente</span>
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold font-display text-white tabular-nums">
              R$ 88,50
            </p>
            <div className="text-[11px] text-neutral-400">
              Combos representam 42% dos pedidos
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-neutral-800 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'appointments'
                ? 'bg-amber-400 text-neutral-950 shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            Grade de Agendamentos ({appointments.length})
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'services'
                ? 'bg-amber-400 text-neutral-950 shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            Serviços & Preços ({services.length})
          </button>

          <button
            onClick={() => setActiveTab('barbers')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'barbers'
                ? 'bg-amber-400 text-neutral-950 shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            Equipe & Comissões ({barbers.length})
          </button>

          <button
            onClick={() => setActiveTab('clients')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'clients'
                ? 'bg-amber-400 text-neutral-950 shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Users className="w-4 h-4 text-amber-400" />
            <span>Clientes VIP & CRM ({clientMemories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('metrics')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'metrics'
                ? 'bg-amber-400 text-neutral-950 shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            Relatório Semanal
          </button>
        </div>

        {/* TAB 1: Appointments Management */}
        {activeTab === 'appointments' && (
          <div className="space-y-4">
            {/* Search and filters bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-xl bg-neutral-900 border border-neutral-800">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por cliente, barbeiro ou protocolo..."
                  className="w-full pl-9 pr-4 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs sm:text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Status filter buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer whitespace-nowrap ${
                    statusFilter === 'all' ? 'bg-neutral-800 text-white font-semibold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setStatusFilter('confirmed')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer whitespace-nowrap ${
                    statusFilter === 'confirmed' ? 'bg-blue-500/20 text-blue-300 font-semibold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Confirmados
                </button>
                <button
                  onClick={() => setStatusFilter('in_progress')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer whitespace-nowrap ${
                    statusFilter === 'in_progress' ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Na Cadeira
                </button>
                <button
                  onClick={() => setStatusFilter('completed')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer whitespace-nowrap ${
                    statusFilter === 'completed' ? 'bg-emerald-500/20 text-emerald-300 font-semibold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Concluídos
                </button>
              </div>
            </div>

            {/* Appointments Table */}
            <div className="rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-950 text-neutral-400 uppercase tracking-wider text-[11px] border-b border-neutral-800">
                    <tr>
                      <th className="py-3.5 px-4 font-semibold">Horário / Data</th>
                      <th className="py-3.5 px-4 font-semibold">Cliente & Contato</th>
                      <th className="py-3.5 px-4 font-semibold">Serviço</th>
                      <th className="py-3.5 px-4 font-semibold">Barbeiro</th>
                      <th className="py-3.5 px-4 font-semibold">Valor</th>
                      <th className="py-3.5 px-4 font-semibold">Pagamento</th>
                      <th className="py-3.5 px-4 font-semibold">Status</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Ações Rápidas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/80">
                    {filteredAppointments.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-neutral-500">
                          Nenhum agendamento encontrado com os filtros selecionados.
                        </td>
                      </tr>
                    ) : (
                      filteredAppointments.map((apt) => (
                        <tr key={apt.id} className="hover:bg-neutral-850/60 transition-colors">
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-neutral-100 block text-sm tabular-nums">
                              {apt.time}
                            </span>
                            <span className="text-[11px] text-neutral-500 tabular-nums">
                              {apt.date} · {apt.protocolNumber}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="font-semibold text-neutral-200 block text-sm">
                              {apt.clientName}
                            </span>
                            <span className="text-[11px] text-neutral-400 block tabular-nums">
                              {apt.clientPhone}
                            </span>
                            {apt.clientNotes && (
                              <span className="text-[10px] text-amber-400/90 italic block max-w-xs truncate mt-0.5">
                                Obs: {apt.clientNotes}
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="text-neutral-200 font-medium">
                              {apt.serviceName}
                            </span>
                            <span className="text-[11px] text-neutral-500 block tabular-nums">
                              {apt.durationMin} minutos
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="text-neutral-300 font-medium">
                              {apt.barberName}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="font-bold text-amber-400 font-display text-sm tabular-nums">
                              R$ {apt.price.toFixed(2).replace('.', ',')}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            {apt.paymentMethod === 'pix' ? (
                              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                Pix (Pago)
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] text-neutral-300 font-medium bg-neutral-800 px-2 py-0.5 rounded border border-neutral-700">
                                {apt.paymentMethod === 'credit_card' ? 'Cartão Crédito (Balcão)' : apt.paymentMethod === 'debit_card' ? 'Cartão Débito (Balcão)' : 'Dinheiro (Balcão)'}
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-4">
                            {getStatusBadge(apt.status)}
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {apt.status === 'confirmed' && (
                                <button
                                  onClick={() => onUpdateAppointmentStatus(apt.id, 'in_progress')}
                                  className="px-2.5 py-1 rounded bg-amber-400/10 hover:bg-amber-400 hover:text-neutral-950 text-amber-400 border border-amber-400/30 text-[11px] font-semibold transition-all cursor-pointer"
                                  title="Iniciar atendimento"
                                >
                                  Iniciar
                                </button>
                              )}

                              {apt.status === 'in_progress' && (
                                <button
                                  onClick={() => onUpdateAppointmentStatus(apt.id, 'completed')}
                                  className="px-2.5 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500 hover:text-neutral-950 text-emerald-300 border border-emerald-500/40 text-[11px] font-semibold transition-all cursor-pointer"
                                  title="Marcar como concluído"
                                >
                                  Concluir
                                </button>
                              )}

                              {apt.status !== 'cancelled' && apt.status !== 'completed' && (
                                <button
                                  onClick={() => onUpdateAppointmentStatus(apt.id, 'cancelled')}
                                  className="px-2 py-1 rounded hover:bg-rose-500/20 text-neutral-400 hover:text-rose-400 text-[11px] transition-colors cursor-pointer"
                                  title="Cancelar"
                                >
                                  Cancelar
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Services & Pricing Management */}
        {activeTab === 'services' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white font-display">
                  Tabela Oficial de Preços da Barbearia
                </h3>
                <p className="text-xs text-neutral-400">
                  Os valores e tempos médios configurados aqui são exibidos diretamente no agendamento do cliente.
                </p>
              </div>
              <button
                onClick={() => alert('Simulação da Demo: Na versão final conectada ao banco, esta função permite cadastrar novos serviços customizados.')}
                className="px-3.5 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 text-xs font-semibold cursor-pointer"
              >
                + Adicionar Novo Serviço
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((srv) => (
                <div key={srv.id} className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-neutral-100 font-display">{srv.name}</h4>
                      <span className="text-[11px] text-neutral-500 uppercase tracking-wider">{srv.category}</span>
                    </div>
                    <span className="text-base font-bold text-amber-400 font-display tabular-nums">
                      R$ {srv.price.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400">{srv.description}</p>
                  <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
                    <span className="tabular-nums">Tempo médio: {srv.durationMin} min</span>
                    <span className="text-emerald-400 font-medium">Status: Ativo no site</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Barbers and Commission */}
        {activeTab === 'barbers' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
              <h3 className="text-base font-bold text-white font-display">
                Equipe de Barbeiros & Produção Diária
              </h3>
              <p className="text-xs text-neutral-400">
                Acompanhamento em tempo real da produtividade de cada profissional no chão de fábrica.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {barbers.map((barber) => {
                const barberApts = appointments.filter(a => a.barberId === barber.id && a.status !== 'cancelled');
                const barberTotal = barberApts.reduce((acc, a) => acc + a.price, 0);
                const barberCommission = barberTotal * 0.5; // 50% commission simulation

                return (
                  <div key={barber.id} className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-neutral-950 border border-neutral-700 shrink-0">
                        <img src={barber.image} alt={barber.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-neutral-100 font-display">{barber.name}</h4>
                        <span className="text-xs text-amber-400">{barber.rating}★ · {barber.experienceYears}a exp</span>
                      </div>
                    </div>

                    <div className="space-y-2 p-3 bg-neutral-950 rounded-lg text-xs">
                      <div className="flex justify-between text-neutral-400">
                        <span>Clientes Hoje:</span>
                        <span className="text-white font-bold tabular-nums">{barberApts.length}</span>
                      </div>
                      <div className="flex justify-between text-neutral-400">
                        <span>Faturamento Gerado:</span>
                        <span className="text-white font-bold tabular-nums">R$ {barberTotal.toFixed(2).replace('.', ',')}</span>
                      </div>
                      <div className="flex justify-between pt-1 border-t border-neutral-800 text-amber-400 font-semibold">
                        <span>Comissão (50%):</span>
                        <span className="tabular-nums">R$ {barberCommission.toFixed(2).replace('.', ',')}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-emerald-400 font-medium">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>Pronto para Atender</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: Weekly Report / Metrics simulation */}
        {activeTab === 'metrics' && (
          <div className="p-6 rounded-xl bg-neutral-900 border border-neutral-800 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white font-display">
                Desempenho Comercial Semanal (Demonstração)
              </h3>
              <p className="text-xs text-neutral-400">
                Visualização gráfica de faturamento e fluxo de clientes por dia da semana.
              </p>
            </div>

            {/* Simulated bar chart */}
            <div className="pt-4 space-y-3">
              {[
                { day: 'Segunda-feira', value: 1120, percent: 55, clients: 14 },
                { day: 'Terça-feira', value: 1450, percent: 70, clients: 19 },
                { day: 'Quarta-feira', value: 1380, percent: 68, clients: 17 },
                { day: 'Quinta-feira', value: 1890, percent: 85, clients: 24 },
                { day: 'Sexta-feira (Pico)', value: 2450, percent: 100, clients: 32 },
                { day: 'Sábado (Pico)', value: 2380, percent: 96, clients: 31 },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-neutral-300">{item.day}</span>
                    <span className="text-amber-400 font-bold tabular-nums">
                      R$ {item.value.toFixed(2).replace('.', ',')} ({item.clients} clientes)
                    </span>
                  </div>
                  <div className="w-full bg-neutral-950 h-3 rounded-full overflow-hidden border border-neutral-800">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full transition-all duration-700"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-400">
              💡 <strong>Dica comercial para o dono:</strong> Sextas e Sábados operam com 96% a 100% de ocupação. Sugerimos ativar promoções nos horários de terça-feira à tarde para equilibrar a receita da semana.
            </div>
          </div>
        )}

        {/* TAB 5: AI CLIENT MEMORY & CRM */}
        {activeTab === 'clients' && (
          <div className="space-y-6">
            {/* Header with CRM Explanation */}
            <div className="p-6 rounded-xl bg-gradient-to-r from-neutral-900 via-amber-950/20 to-neutral-900 border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                  <Users className="w-4 h-4" />
                  <span>GESTÃO DE CLIENTES VIP & HISTÓRICO DE ATENDIMENTOS</span>
                </div>
                <h3 className="text-xl font-bold text-white font-display">
                  Prontuário de Clientes & Fidelização
                </h3>
                <p className="text-xs text-neutral-300 max-w-2xl leading-relaxed">
                  Consulte os perfis de cada cliente: formato do corte de preferência, barbeiro habitual, sensibilidade de pele à navalha, bebida preferida e histórico completo de atendimentos.
                </p>
              </div>

              <div className="text-right shrink-0 bg-neutral-950/80 p-3 rounded-lg border border-neutral-800">
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Total de Clientes Cadastrados</span>
                <span className="text-2xl font-bold font-display text-amber-400 tabular-nums">
                  {clientMemories.length} clientes
                </span>
              </div>
            </div>

            {/* Search client input */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-neutral-900 border border-neutral-800">
              <Search className="w-4 h-4 text-neutral-500 shrink-0" />
              <input
                type="text"
                value={clientSearchQuery}
                onChange={(e) => setClientSearchQuery(e.target.value)}
                placeholder="Buscar cliente por nome, telefone ou barbeiro..."
                className="w-full bg-transparent text-xs sm:text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none"
              />
              {clientSearchQuery && (
                <button
                  onClick={() => setClientSearchQuery('')}
                  className="text-xs text-neutral-500 hover:text-white"
                >
                  Limpar
                </button>
              )}
            </div>

            {/* Clients Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {clientMemories
                .filter(c => 
                  c.name.toLowerCase().includes(clientSearchQuery.toLowerCase()) ||
                  c.phone.includes(clientSearchQuery) ||
                  c.preferredBarberName.toLowerCase().includes(clientSearchQuery.toLowerCase())
                )
                .map((client) => (
                  <div
                    key={client.id}
                    className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-amber-400/40 transition-all flex flex-col justify-between space-y-4 shadow-lg group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-bold text-neutral-100 font-display group-hover:text-amber-400 transition-colors">
                              {client.name}
                            </h4>
                            <span className="text-[10px] bg-amber-400/10 text-amber-400 px-2 py-0.5 rounded font-mono font-semibold border border-amber-400/20">
                              {client.totalVisits} visitas
                            </span>
                          </div>
                          <span className="text-xs text-neutral-400 block tabular-nums mt-0.5">
                            {client.phone}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-neutral-500 block uppercase">LTV Total</span>
                          <span className="text-sm font-bold text-amber-400 font-display tabular-nums">
                            R$ {client.totalSpent.toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                      </div>

                      {/* Memory details tags */}
                      <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-850 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-neutral-500">Barbeiro habitual:</span>
                          <span className="text-neutral-200 font-medium">{client.preferredBarberName}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-neutral-500">Bebida favorita:</span>
                          <span className="text-amber-300 font-medium">{client.favoriteDrink}</span>
                        </div>
                        <div className="text-[11px] text-neutral-400 pt-1 border-t border-neutral-900 line-clamp-2">
                          <strong className="text-neutral-300">Corte & Estilo:</strong> {client.hairProfile}
                        </div>
                        {client.skinProfile && (
                          <div className="text-[11px] text-neutral-400 line-clamp-1">
                            <strong className="text-neutral-300">Sensibilidade:</strong> {client.skinProfile}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-neutral-850 flex items-center justify-between gap-3">
                      <span className="text-[11px] text-neutral-500">
                        Última visita: <strong className="text-neutral-300 tabular-nums">{client.lastVisitDate}</strong>
                      </span>
                      <button
                        onClick={() => {
                          setSelectedClient(client);
                          setAiAnalysis(null);
                          setReengagementMsg(null);
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-amber-400 hover:text-neutral-950 text-neutral-200 border border-neutral-700 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>Ver Ficha Completa</span>
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* CLIENT MEMORY PROFILE MODAL (When selectedClient is set) */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-6 shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Modal header */}
            <div className="flex items-start justify-between border-b border-neutral-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-neutral-950 flex items-center justify-center font-bold text-lg font-display shrink-0">
                  {selectedClient.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-display">
                    {selectedClient.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-neutral-400 mt-0.5">
                    <span>{selectedClient.phone}</span>
                    <span>·</span>
                    <span className="text-amber-400 font-semibold">{selectedClient.totalVisits} atendimentos</span>
                    <span>·</span>
                    <span className="tabular-nums">Total: R$ {selectedClient.totalSpent.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedClient(null)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 cursor-pointer"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {/* Client preferences & details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-lg bg-neutral-950 border border-neutral-850 space-y-1">
                <span className="text-neutral-500 block text-[11px] uppercase font-semibold">Barbeiro Preferido</span>
                <span className="text-neutral-100 font-semibold text-sm">{selectedClient.preferredBarberName}</span>
              </div>

              <div className="p-3.5 rounded-lg bg-neutral-950 border border-neutral-850 space-y-1">
                <span className="text-neutral-500 block text-[11px] uppercase font-semibold">Bebida de Cortesia</span>
                <span className="text-amber-300 font-semibold text-sm">{selectedClient.favoriteDrink}</span>
              </div>

              <div className="p-3.5 rounded-lg bg-neutral-950 border border-neutral-850 space-y-1 sm:col-span-2">
                <span className="text-neutral-500 block text-[11px] uppercase font-semibold">Perfil Capilar & Estilo de Corte</span>
                <p className="text-neutral-200 leading-relaxed">{selectedClient.hairProfile}</p>
              </div>

              <div className="p-3.5 rounded-lg bg-neutral-950 border border-neutral-850 space-y-1 sm:col-span-2">
                <span className="text-neutral-500 block text-[11px] uppercase font-semibold">Sensibilidade Dermatológica & Navalha</span>
                <p className="text-neutral-200 leading-relaxed">{selectedClient.skinProfile}</p>
              </div>

              <div className="p-3.5 rounded-lg bg-neutral-950 border border-neutral-850 space-y-1 sm:col-span-2">
                <span className="text-neutral-500 block text-[11px] uppercase font-semibold">Notas do Atendimento & Conversa</span>
                <p className="text-neutral-300 italic">{selectedClient.conversationNotes}</p>
              </div>
            </div>

            {/* Action 1: Diretrizes Técnicas de Bancada */}
            <div className="p-4 rounded-xl bg-neutral-950 border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                  <Scissors className="w-4 h-4" />
                  <span>Diretrizes de Atendimento do Barbeiro</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRunAiAnalysis(selectedClient)}
                  className="px-3 py-1.5 rounded-md bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Resumo do Perfil</span>
                </button>
              </div>

              {aiAnalysis && (
                <div className="p-3.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 whitespace-pre-line leading-relaxed animate-in fade-in duration-200">
                  {aiAnalysis}
                </div>
              )}
            </div>

            {/* Action 2: WhatsApp Reengagement Message */}
            <div className="p-4 rounded-xl bg-neutral-950 border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <MessageSquare className="w-4 h-4" />
                  <span>Mensagem de Lembrete para WhatsApp</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleGenerateReengagement(selectedClient)}
                  className="px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Gerar Mensagem</span>
                </button>
              </div>

              {reengagementMsg && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="p-3.5 rounded-lg bg-neutral-900 border border-emerald-600/30 text-xs text-neutral-200 whitespace-pre-line leading-relaxed">
                    {reengagementMsg}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(reengagementMsg);
                        setCopiedMsg(true);
                        setTimeout(() => setCopiedMsg(false), 2500);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium flex items-center gap-1.5 border border-neutral-700 cursor-pointer"
                    >
                      {copiedMsg ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedMsg ? 'Copiada!' : 'Copiar Texto'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const cleanPhone = selectedClient.phone.replace(/\D/g, '');
                        window.open(`https://api.whatsapp.com/send?phone=55${cleanPhone}&text=${encodeURIComponent(reengagementMsg)}`, '_blank');
                      }}
                      className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Abrir Diretamente no WhatsApp</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Service History Table */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
                Histórico Completo de Cortes & Atendimentos
              </span>
              <div className="rounded-lg bg-neutral-950 border border-neutral-800 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-900 text-neutral-400 text-[11px] uppercase border-b border-neutral-800">
                    <tr>
                      <th className="py-2.5 px-3">Data</th>
                      <th className="py-2.5 px-3">Serviço</th>
                      <th className="py-2.5 px-3">Barbeiro</th>
                      <th className="py-2.5 px-3">Valor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-850">
                    {selectedClient.serviceHistory.map((item, idx) => (
                      <tr key={idx} className="hover:bg-neutral-900/40">
                        <td className="py-2.5 px-3 tabular-nums text-neutral-300">{item.date}</td>
                        <td className="py-2.5 px-3 font-medium text-neutral-200">{item.serviceName}</td>
                        <td className="py-2.5 px-3 text-neutral-400">{item.barberName}</td>
                        <td className="py-2.5 px-3 font-semibold text-amber-400 font-display tabular-nums">
                          R$ {item.price.toFixed(2).replace('.', ',')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal footer */}
            <div className="pt-3 border-t border-neutral-800 flex justify-end">
              <button
                onClick={() => setSelectedClient(null)}
                className="px-5 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold cursor-pointer"
              >
                Fechar Prontuário
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Quick Appointment Modal inside Admin */}
      {isManualBookingOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-base font-bold text-white font-display">
                Novo Agendamento Rápido (Balcão / Telefone)
              </h3>
              <button
                onClick={() => setIsManualBookingOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateManualApt} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Nome do Cliente *</label>
                <input
                  type="text"
                  required
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  placeholder="Nome e Sobrenome"
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-750 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">WhatsApp</label>
                <input
                  type="text"
                  value={newClientPhone}
                  onChange={(e) => setNewClientPhone(e.target.value)}
                  placeholder="(11) 98765-4321"
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-750 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Serviço</label>
                  <select
                    value={newServiceId}
                    onChange={(e) => setNewServiceId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-750 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    {services.map(s => (
                      <option key={s.id} value={s.id}>{s.name} - R$ {s.price}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Barbeiro</label>
                  <select
                    value={newBarberId}
                    onChange={(e) => setNewBarberId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-750 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    {barbers.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Horário Hoje</label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="Ex: 16:30"
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-750 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Forma de Pagamento</label>
                  <select
                    value={newPaymentMethod}
                    onChange={(e) => setNewPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-750 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="pix">Pix (Aprovado)</option>
                    <option value="credit_card">Cartão de Crédito</option>
                    <option value="debit_card">Cartão de Débito</option>
                    <option value="counter_cash">Dinheiro em Espécie</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsManualBookingOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-neutral-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-neutral-950 shadow-md"
                >
                  Confirmar e Inserir na Grade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
