import { useState, useEffect } from 'react';
import { Service, Barber, Appointment, PaymentMethod, PaymentStatus, ServiceProcess, ClientMemory } from '../types/barbershop';
import { 
  X, Check, Calendar as CalendarIcon, Clock, User, Scissors, 
  ChevronRight, ChevronLeft, Sparkles, MessageSquare, ShieldCheck, 
  CreditCard, QrCode, Banknote, Copy, CheckCheck, ListChecks, Award,
  Info, Brain, HeartHandshake
} from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: Service[];
  barbers: Barber[];
  clientMemories: ClientMemory[];
  initialServiceId?: string | null;
  initialBarberId?: string | null;
  onSaveAppointment: (appointment: Appointment) => void;
  onSaveClientMemory: (memory: ClientMemory) => void;
  onViewAdmin: () => void;
}

export function BookingModal({
  isOpen,
  onClose,
  services,
  barbers,
  clientMemories,
  initialServiceId,
  initialBarberId,
  onSaveAppointment,
  onSaveClientMemory,
  onViewAdmin
}: BookingModalProps) {
  // Steps:
  // 1 = Serviço & Processos
  // 2 = Barbeiro
  // 3 = Data & Horário
  // 4 = Dados do Cliente
  // 5 = Pagamento
  // 6 = Confirmação (Voucher VIP)
  const [step, setStep] = useState<number>(1);

  // Form states
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [selectedBarberId, setSelectedBarberId] = useState<string>('any');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [clientNotes, setClientNotes] = useState<string>('');
  
  // Payment states
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [pixCopied, setPixCopied] = useState<boolean>(false);
  const [pixPaidSimulated, setPixPaidSimulated] = useState<boolean>(false);

  // Confirmed appointment result
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  // Initialize or reset when modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialServiceId) {
        setSelectedServiceId(initialServiceId);
      } else if (!selectedServiceId && services.length > 0) {
        setSelectedServiceId(services[0].id);
      }

      if (initialBarberId) {
        setSelectedBarberId(initialBarberId);
      }

      const todayStr = new Date().toISOString().split('T')[0];
      if (!selectedDate) {
        setSelectedDate(todayStr);
      }
    }
  }, [isOpen, initialServiceId, initialBarberId, services]);

  if (!isOpen) return null;

  // Selected entities helpers
  const selectedService = services.find(s => s.id === selectedServiceId) || services[0];
  const selectedBarber = barbers.find(b => b.id === selectedBarberId);
  const barberDisplayName = selectedBarber ? selectedBarber.name : 'Qualquer Barbeiro Disponível';

  // Generate upcoming 10 days
  const dateOptions = Array.from({ length: 10 }).map((_, index) => {
    const d = new Date();
    d.setDate(d.getDate() + index);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = index === 0 ? 'Hoje' : index === 1 ? 'Amanhã' : d.toLocaleDateString('pt-BR', { weekday: 'short' });
    const formattedDate = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    return { dateStr, dayName, formattedDate, isSunday: d.getDay() === 0 };
  });

  // Time slots
  const timeSlots = [
    '09:00', '09:45', '10:30', '11:15', '13:00', 
    '13:45', '14:30', '15:15', '16:00', '17:00', 
    '17:45', '18:30', '19:15'
  ];

  const handleCopyPix = () => {
    navigator.clipboard?.writeText('00020126580014br.gov.bcb.pix0136pix@imperiobarber.com.br520400005303986540' + selectedService.price.toFixed(2));
    setPixCopied(true);
    setTimeout(() => setPixCopied(false), 3000);
  };

  const handleConfirmBooking = () => {
    if (!clientName.trim() || !clientPhone.trim()) {
      return;
    }

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const paymentStatus: PaymentStatus = paymentMethod === 'pix' ? 'paid' : 'pending_on_counter';
    const chosenBarberName = selectedBarber ? selectedBarber.name : (barbers[0]?.name || 'Elias "Mestre" Castro');
    const chosenBarberId = selectedBarber ? selectedBarber.id : (barbers[0]?.id || 'barber-1');

    const newAppointment: Appointment = {
      id: `apt-demo-${Date.now()}`,
      protocolNumber: `IMP-${randomNum}`,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      clientNotes: clientNotes.trim() || undefined,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      barberId: chosenBarberId,
      barberName: chosenBarberName,
      date: selectedDate || dateOptions[0].dateStr,
      time: selectedTime || '14:30',
      price: selectedService.price,
      durationMin: selectedService.durationMin,
      paymentMethod,
      paymentStatus,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    // Client Memory AI persistence (Independent memory bank)
    const cleanPhone = clientPhone.replace(/\D/g, '');
    const existingClient = clientMemories.find(c => 
      (cleanPhone.length >= 6 && c.phone.replace(/\D/g, '').includes(cleanPhone)) ||
      (c.name.toLowerCase().trim() === clientName.toLowerCase().trim())
    );

    if (existingClient) {
      const updatedMemory: ClientMemory = {
        ...existingClient,
        totalVisits: existingClient.totalVisits + 1,
        totalSpent: existingClient.totalSpent + selectedService.price,
        lastVisitDate: selectedDate || dateOptions[0].dateStr,
        preferredBarberId: chosenBarberId,
        preferredBarberName: chosenBarberName,
        serviceHistory: [
          {
            date: selectedDate || dateOptions[0].dateStr,
            serviceName: selectedService.name,
            barberName: chosenBarberName,
            price: selectedService.price,
            notes: clientNotes.trim() || undefined
          },
          ...existingClient.serviceHistory
        ]
      };
      onSaveClientMemory(updatedMemory);
    } else {
      const newMemory: ClientMemory = {
        id: `cli-${Date.now()}`,
        name: clientName.trim(),
        phone: clientPhone.trim(),
        firstVisitDate: selectedDate || dateOptions[0].dateStr,
        lastVisitDate: selectedDate || dateOptions[0].dateStr,
        totalVisits: 1,
        totalSpent: selectedService.price,
        preferredBarberId: chosenBarberId,
        preferredBarberName: chosenBarberName,
        favoriteDrink: 'Café espresso especial',
        hairProfile: `Primeiro atendimento: ${selectedService.name}.`,
        skinProfile: clientNotes.trim() || 'Sem sensibilidades reportadas.',
        conversationNotes: 'Cliente cadastrado via agendamento online.',
        aiSummary: `Novo cliente registrado. Preferência inicial por ${selectedService.name} com ${chosenBarberName}.`,
        aiNextSuggestedVisitDays: 20,
        serviceHistory: [
          {
            date: selectedDate || dateOptions[0].dateStr,
            serviceName: selectedService.name,
            barberName: chosenBarberName,
            price: selectedService.price,
            notes: clientNotes.trim() || undefined
          }
        ]
      };
      onSaveClientMemory(newMemory);
    }

    setConfirmedAppointment(newAppointment);
    onSaveAppointment(newAppointment);
    setStep(6); // Step 6 = Confirmation
  };

  const handleClose = () => {
    setStep(1);
    setConfirmedAppointment(null);
    onClose();
  };

  const handleSimulateWhatsApp = () => {
    if (!confirmedAppointment) return;
    const paymentText = confirmedAppointment.paymentMethod === 'pix' ? 'Pago via Pix' : 'Pagamento no Balcão';
    const msg = `Olá! Meu agendamento na Império Barber foi confirmado:%0A%0AProtocolo: ${confirmedAppointment.protocolNumber}%0AServiço: ${confirmedAppointment.serviceName}%0AData: ${confirmedAppointment.date} às ${confirmedAppointment.time}%0ABarbeiro: ${confirmedAppointment.barberName}%0APagamento: ${paymentText}%0ACliente: ${confirmedAppointment.clientName}`;
    window.open(`https://api.whatsapp.com/send?text=${msg}`, '_blank');
  };

  // Step definition labels
  const stepsList = [
    { num: 1, label: 'Serviço & Processos' },
    { num: 2, label: 'Barbeiro' },
    { num: 3, label: 'Data & Horário' },
    { num: 4, label: 'Seus Dados' },
    { num: 5, label: 'Pagamento' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div 
        className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Scissors className="w-4 h-4 transform -rotate-45" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-100 font-display">
                {step === 6 ? 'Agendamento Confirmado' : 'Agendamento Online com Etapas'}
              </h3>
              <p className="text-[11px] text-neutral-400">
                {step === 6 ? 'Voucher VIP Gerado com Sucesso' : `Etapa ${step} de 5 — Império Barber`}
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visual Stepper / Progress Bar (Steps 1 to 5) */}
        {step <= 5 && (
          <div className="bg-neutral-950 px-4 py-3 border-b border-neutral-800/80">
            <div className="flex items-center justify-between max-w-xl mx-auto">
              {stepsList.map((s, index) => {
                const isActive = step === s.num;
                const isPassed = step > s.num;
                return (
                  <div key={s.num} className="flex items-center flex-1 last:flex-none">
                    <div 
                      onClick={() => isPassed && setStep(s.num)}
                      className={`flex flex-col items-center cursor-pointer group ${isPassed ? 'cursor-pointer' : 'cursor-default'}`}
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-amber-400 text-neutral-950 shadow-md ring-2 ring-amber-400/30'
                          : isPassed
                          ? 'bg-neutral-800 text-amber-400 border border-amber-400/40'
                          : 'bg-neutral-850 text-neutral-500 border border-neutral-800'
                      }`}>
                        {isPassed ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : s.num}
                      </div>
                      <span className={`text-[10px] mt-1 font-medium hidden sm:inline whitespace-nowrap ${
                        isActive ? 'text-amber-400 font-semibold' : isPassed ? 'text-neutral-300' : 'text-neutral-500'
                      }`}>
                        {s.label}
                      </span>
                    </div>

                    {index < stepsList.length - 1 && (
                      <div className={`flex-1 h-[2px] mx-1 sm:mx-2 rounded transition-colors ${
                        step > s.num ? 'bg-amber-400' : 'bg-neutral-800'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Modal Body (Scrollable) */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* ============================================================ */}
          {/* ETAPA 1: SERVIÇO & DETALHAMENTO DE PROCESSOS */}
          {/* ============================================================ */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h4 className="text-base font-bold text-neutral-100 font-display">
                  1. Escolha o Serviço e Conheça os Processos
                </h4>
                <p className="text-xs text-neutral-400">
                  Veja com transparência cada etapa do ritual que o barbeiro executará no seu atendimento.
                </p>
              </div>

              {/* Services Selector */}
              <div className="space-y-3">
                {services.map((service) => {
                  const isSelected = selectedServiceId === service.id;
                  return (
                    <div
                      key={service.id}
                      onClick={() => setSelectedServiceId(service.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-amber-400 bg-amber-400/5 shadow-md'
                          : 'border-neutral-800 bg-neutral-950/60 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected ? 'border-amber-400 bg-amber-400 text-neutral-950' : 'border-neutral-700'
                          }`}>
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className="text-sm font-semibold text-neutral-100">
                                {service.name}
                              </h5>
                              {service.popular && (
                                <span className="text-[10px] px-2 py-0.5 bg-amber-400/10 text-amber-400 border border-amber-400/30 rounded font-semibold">
                                  Destaque
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-neutral-400 line-clamp-1 mt-0.5">
                              {service.description}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-base font-bold text-amber-400 font-display tabular-nums">
                            R$ {service.price.toFixed(2).replace('.', ',')}
                          </span>
                          <span className="block text-[11px] text-neutral-500 tabular-nums">
                            {service.durationMin} min
                          </span>
                        </div>
                      </div>

                      {/* When selected, show the breakdown of processes! */}
                      {isSelected && service.processes && service.processes.length > 0 && (
                        <div className="mt-4 pt-3.5 border-t border-amber-500/20 bg-neutral-950/70 p-3.5 rounded-lg space-y-3">
                          <div className="flex items-center justify-between text-xs text-amber-400 font-semibold font-display">
                            <span className="flex items-center gap-1.5">
                              <ListChecks className="w-4 h-4 text-amber-400" />
                              <span>Processos inclusos neste atendimento ({service.processes.length} etapas):</span>
                            </span>
                            <span className="text-[11px] text-neutral-400 font-sans">
                              Duração estimada: ~{service.durationMin} min
                            </span>
                          </div>

                          <div className="space-y-2">
                            {service.processes.map((proc) => (
                              <div key={proc.step} className="flex items-start gap-2.5 text-xs">
                                <span className="w-5 h-5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                                  {proc.step}
                                </span>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <span className="font-semibold text-neutral-200">{proc.title}</span>
                                    {proc.estimatedMinutes && (
                                      <span className="text-[10px] text-neutral-500 tabular-nums">
                                        ~{proc.estimatedMinutes} min
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-neutral-400 leading-snug mt-0.5">
                                    {proc.detail}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* ETAPA 2: ESCOLHA DO BARBEIRO */}
          {/* ============================================================ */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-base font-bold text-neutral-100 font-display">
                  2. Selecione o Barbeiro
                </h4>
                <p className="text-xs text-neutral-400">
                  Nossos mestres barbeiros são especialistas em cortes clássicos e visagismo.
                </p>
              </div>

              {/* Option: Any barber */}
              <div
                onClick={() => setSelectedBarberId('any')}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  selectedBarberId === 'any'
                    ? 'border-amber-400 bg-amber-400/5'
                    : 'border-neutral-800 bg-neutral-950/60 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-amber-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-neutral-200">
                      Primeiro Barbeiro Disponível (Mais Rápido)
                    </h5>
                    <p className="text-xs text-neutral-400">
                      Ideal para quem tem pressa. Encaixamos na cadeira com menor tempo de espera.
                    </p>
                  </div>
                </div>

                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  selectedBarberId === 'any' ? 'border-amber-400 bg-amber-400 text-neutral-950' : 'border-neutral-700'
                }`}>
                  {selectedBarberId === 'any' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>

              {/* Individual Barbers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {barbers.map((barber) => {
                  const isSelected = selectedBarberId === barber.id;
                  return (
                    <div
                      key={barber.id}
                      onClick={() => setSelectedBarberId(barber.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                        isSelected
                          ? 'border-amber-400 bg-amber-400/5 shadow-md'
                          : 'border-neutral-800 bg-neutral-950/60 hover:border-neutral-700'
                      }`}
                    >
                      <div className="w-13 h-13 rounded-lg overflow-hidden bg-neutral-900 shrink-0 border border-neutral-800">
                        <img
                          src={barber.image}
                          alt={barber.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h5 className="text-sm font-semibold text-neutral-200 truncate">
                            {barber.name}
                          </h5>
                          {isSelected && (
                            <span className="w-4 h-4 rounded-full bg-amber-400 text-neutral-950 flex items-center justify-center shrink-0">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-amber-400/90 truncate">
                          {barber.title}
                        </p>
                        <p className="text-[10px] text-neutral-400 mt-0.5">
                          ⭐ {barber.rating} · {barber.experienceYears} anos de exp.
                        </p>
                        <p className="text-[10px] text-neutral-500 truncate mt-0.5">
                          {barber.specialty}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* ETAPA 3: DATA & HORÁRIO */}
          {/* ============================================================ */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h4 className="text-base font-bold text-neutral-100 font-display">
                  3. Escolha o Dia e Horário do Atendimento
                </h4>
                <p className="text-xs text-neutral-400">
                  Sem filas e com pontualidade britânica para seu conforto.
                </p>
              </div>

              {/* Day selection */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider block">
                  Escolha a Data
                </span>
                <div className="grid grid-cols-5 gap-2 sm:gap-2.5">
                  {dateOptions.slice(0, 5).map((d) => (
                    <button
                      key={d.dateStr}
                      type="button"
                      onClick={() => setSelectedDate(d.dateStr)}
                      className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                        selectedDate === d.dateStr
                          ? 'border-amber-400 bg-amber-400 text-neutral-950 font-bold shadow-md'
                          : 'border-neutral-800 bg-neutral-950/80 text-neutral-300 hover:border-neutral-700'
                      }`}
                    >
                      <span className="text-[10px] uppercase font-semibold">{d.dayName}</span>
                      <span className="text-sm font-bold tabular-nums mt-0.5">{d.formattedDate}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time slots */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider block">
                  Horários Livres na Agenda
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                  {timeSlots.map((time) => {
                    const isSelected = selectedTime === time;
                    return (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTime(time)}
                        className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer flex items-center justify-center gap-1.5 tabular-nums ${
                          isSelected
                            ? 'border-amber-400 bg-amber-400 text-neutral-950 shadow-sm'
                            : 'border-neutral-800 bg-neutral-950 text-neutral-300 hover:border-neutral-700 hover:bg-neutral-850'
                        }`}
                      >
                        <Clock className="w-3 h-3 opacity-60" />
                        <span>{time}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Recap */}
              <div className="p-3 bg-neutral-950/80 rounded-xl border border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
                <div>
                  <span className="text-neutral-200 font-medium">{selectedService.name}</span>
                  <span className="text-neutral-500"> · Barbeiro: {barberDisplayName}</span>
                </div>
                <span className="font-bold text-amber-400 font-display">
                  R$ {selectedService.price.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* ETAPA 4: DADOS DO CLIENTE */}
          {/* ============================================================ */}
          {step === 4 && (
            <div className="space-y-5">
              <div>
                <h4 className="text-base font-bold text-neutral-100 font-display">
                  4. Identificação do Cliente
                </h4>
                <p className="text-xs text-neutral-400">
                  Preencha seu nome e WhatsApp para receber o comprovante e os lembretes de horário.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Ex: Carlos Eduardo de Souza"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-950 border border-neutral-750 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    Celular / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="(11) 98765-4321"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-950 border border-neutral-750 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    Preferências ou Observações (Opcional)
                  </label>
                  <textarea
                    rows={2}
                    value={clientNotes}
                    onChange={(e) => setClientNotes(e.target.value)}
                    placeholder="Ex: Prefiro café expresso sem açúcar na recepção, pele sensível na navalha..."
                    className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-neutral-750 text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition-colors resize-none"
                  />
                </div>

                {/* AI Client Memory Recognition Banner */}
                {(() => {
                  const cleanPhone = clientPhone.replace(/\D/g, '');
                  const matchedClient = clientMemories.find(c => 
                    (cleanPhone.length >= 7 && c.phone.replace(/\D/g, '').includes(cleanPhone)) ||
                    (clientName.trim().length >= 4 && c.name.toLowerCase().includes(clientName.trim().toLowerCase()))
                  );

                  if (!matchedClient) return null;

                  return (
                    <div className="p-4 rounded-xl bg-gradient-to-r from-amber-400/15 via-neutral-900 to-amber-400/5 border border-amber-400/40 space-y-2.5 animate-in fade-in duration-300 shadow-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                          <ShieldCheck className="w-4 h-4 text-amber-400" />
                          <span>Cliente VIP Identificado no Sistema</span>
                        </div>
                        <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded font-mono font-semibold">
                          {matchedClient.totalVisits} visitas registradas
                        </span>
                      </div>
                      <p className="text-xs text-neutral-200">
                        Olá, <strong>{matchedClient.name}</strong>! Resgatamos seu histórico:
                      </p>
                      <div className="text-[11px] text-neutral-300 space-y-1 bg-neutral-950/80 p-3 rounded-lg border border-neutral-800">
                        <div>✂️ <strong>Barbeiro de costume:</strong> {matchedClient.preferredBarberName}</div>
                        <div>☕ <strong>Bebida registrada:</strong> <span className="text-amber-300">{matchedClient.favoriteDrink}</span></div>
                        <div>💡 <strong>Perfil Capilar:</strong> {matchedClient.hairProfile}</div>
                        {matchedClient.skinProfile && <div>🛡️ <strong>Sensibilidade:</strong> {matchedClient.skinProfile}</div>}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (matchedClient.preferredBarberId) setSelectedBarberId(matchedClient.preferredBarberId);
                          if (matchedClient.skinProfile) setClientNotes(prev => prev ? `${prev} · ${matchedClient.skinProfile}` : matchedClient.skinProfile);
                        }}
                        className="text-xs text-amber-400 hover:text-amber-300 underline font-semibold flex items-center gap-1.5 cursor-pointer pt-1"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Reaplicar barbeiro habitual ({matchedClient.preferredBarberName}) e preferências</span>
                      </button>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* ETAPA 5: FORMA DE PAGAMENTO */}
          {/* ============================================================ */}
          {step === 5 && (
            <div className="space-y-5">
              <div>
                <h4 className="text-base font-bold text-neutral-100 font-display">
                  5. Escolha a Forma de Pagamento
                </h4>
                <p className="text-xs text-neutral-400">
                  Pague com Pix agora ou selecione pagar no balcão da barbearia após o corte.
                </p>
              </div>

              {/* Order total header */}
              <div className="p-4 rounded-xl bg-neutral-950 border border-amber-500/30 flex items-center justify-between">
                <div>
                  <span className="text-xs text-neutral-400 block">Total do Agendamento:</span>
                  <span className="text-sm font-semibold text-neutral-200">{selectedService.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold font-display text-amber-400 tabular-nums">
                    R$ {selectedService.price.toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-[10px] text-emerald-400 block">Bebida cortesia inclusa</span>
                </div>
              </div>

              {/* Payment Options Grid */}
              <div className="space-y-3">
                {/* 1. PIX Option */}
                <div
                  onClick={() => setPaymentMethod('pix')}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    paymentMethod === 'pix'
                      ? 'border-amber-400 bg-amber-400/10 shadow-md'
                      : 'border-neutral-800 bg-neutral-950/60 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                        <QrCode className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="text-sm font-semibold text-neutral-100">
                            Pix Instantâneo (Demonstração)
                          </h5>
                          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-semibold border border-emerald-500/20">
                            Recomendado
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400">
                          Garante prioridade e confirmação imediata.
                        </p>
                      </div>
                    </div>

                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      paymentMethod === 'pix' ? 'border-amber-400 bg-amber-400 text-neutral-950' : 'border-neutral-700'
                    }`}>
                      {paymentMethod === 'pix' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>

                  {/* Pix Simulation Drawer */}
                  {paymentMethod === 'pix' && (
                    <div className="mt-4 pt-3.5 border-t border-neutral-800 bg-neutral-950 p-4 rounded-lg space-y-3 text-xs">
                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        {/* Stylized QR Code Graphic */}
                        <div className="w-28 h-28 bg-white p-2 rounded-lg flex items-center justify-center shrink-0 shadow">
                          <div className="w-full h-full border-2 border-neutral-950 p-1 flex flex-col justify-between">
                            <div className="flex justify-between">
                              <div className="w-5 h-5 bg-neutral-950" />
                              <div className="w-5 h-5 bg-neutral-950" />
                            </div>
                            <div className="text-[8px] text-center font-mono font-bold text-neutral-900">
                              IMPÉRIO PIX
                            </div>
                            <div className="flex justify-between">
                              <div className="w-5 h-5 bg-neutral-950" />
                              <div className="w-2 h-2 bg-neutral-950" />
                            </div>
                          </div>
                        </div>

                        {/* Copy button & text */}
                        <div className="space-y-2 flex-1 w-full">
                          <div>
                            <span className="text-neutral-400 block text-[11px]">Chave Pix (E-mail):</span>
                            <span className="font-mono text-amber-400 font-semibold select-all">
                              pix@imperiobarber.com.br
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={handleCopyPix}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-3.5 py-2 rounded bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 text-xs font-medium cursor-pointer transition-colors"
                          >
                            {pixCopied ? <CheckCheck className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-400" />}
                            <span>{pixCopied ? 'Chave Copiada!' : 'Copiar Código Pix'}</span>
                          </button>

                          <p className="text-[11px] text-neutral-500">
                            * Como esta é uma demonstração comercial, ao clicar em "Confirmar Agendamento" o pagamento será simulado como aprovado.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Cartão de Crédito no Balcão */}
                <div
                  onClick={() => setPaymentMethod('credit_card')}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    paymentMethod === 'credit_card'
                      ? 'border-amber-400 bg-amber-400/10 shadow-md'
                      : 'border-neutral-800 bg-neutral-950/60 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center text-amber-400">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-sm font-semibold text-neutral-100">
                        Cartão de Crédito (Pagar no Balcão)
                      </h5>
                      <p className="text-xs text-neutral-400">
                        Visa, Mastercard, Elo, Amex ou Apple Pay ao término do atendimento.
                      </p>
                    </div>
                  </div>

                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    paymentMethod === 'credit_card' ? 'border-amber-400 bg-amber-400 text-neutral-950' : 'border-neutral-700'
                  }`}>
                    {paymentMethod === 'credit_card' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>

                {/* 3. Cartão de Débito no Balcão */}
                <div
                  onClick={() => setPaymentMethod('debit_card')}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    paymentMethod === 'debit_card'
                      ? 'border-amber-400 bg-amber-400/10 shadow-md'
                      : 'border-neutral-800 bg-neutral-950/60 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center text-amber-400">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-sm font-semibold text-neutral-100">
                        Cartão de Débito (Pagar no Balcão)
                      </h5>
                      <p className="text-xs text-neutral-400">
                        Débito por aproximação ou chip na recepção.
                      </p>
                    </div>
                  </div>

                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    paymentMethod === 'debit_card' ? 'border-amber-400 bg-amber-400 text-neutral-950' : 'border-neutral-700'
                  }`}>
                    {paymentMethod === 'debit_card' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>

                {/* 4. Dinheiro em Espécie */}
                <div
                  onClick={() => setPaymentMethod('counter_cash')}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    paymentMethod === 'counter_cash'
                      ? 'border-amber-400 bg-amber-400/10 shadow-md'
                      : 'border-neutral-800 bg-neutral-950/60 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center text-amber-400">
                      <Banknote className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-sm font-semibold text-neutral-100">
                        Dinheiro em Espécie (No Local)
                      </h5>
                      <p className="text-xs text-neutral-400">
                        Pagamento direto ao recepcionista ou ao barbeiro no balcão.
                      </p>
                    </div>
                  </div>

                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    paymentMethod === 'counter_cash' ? 'border-amber-400 bg-amber-400 text-neutral-950' : 'border-neutral-700'
                  }`}>
                    {paymentMethod === 'counter_cash' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* ETAPA 6: CONFIRMAÇÃO VISUAL (VOUCHER VIP) */}
          {/* ============================================================ */}
          {step === 6 && confirmedAppointment && (
            <div className="space-y-6 text-center">
              {/* Gold seal */}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-neutral-950 mx-auto shadow-xl shadow-amber-950/40">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div className="space-y-1">
                <h4 className="text-2xl font-bold font-display text-neutral-100">
                  Agendamento Concluído com Sucesso!
                </h4>
                <p className="text-xs sm:text-sm text-neutral-400">
                  Todas as etapas foram salvas e seu horário está garantido.
                </p>
              </div>

              {/* VIP Ticket Voucher */}
              <div className="p-6 rounded-2xl bg-neutral-950 border border-amber-500/30 text-left space-y-4 relative overflow-hidden shadow-2xl">
                {/* Decorative gold foil edge */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500" />

                <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-amber-400 font-semibold font-display">
                      Voucher Oficial de Atendimento
                    </span>
                    <h5 className="text-sm font-bold text-neutral-200 font-display">
                      IMPÉRIO BARBER — JARDINS
                    </h5>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-neutral-500 uppercase block">Protocolo</span>
                    <span className="text-xs font-mono font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                      {confirmedAppointment.protocolNumber}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-neutral-500 block text-[11px]">Cliente</span>
                    <span className="text-neutral-200 font-semibold">{confirmedAppointment.clientName}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[11px]">Contato</span>
                    <span className="text-neutral-200 font-semibold">{confirmedAppointment.clientPhone}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[11px]">Serviço Escolhido</span>
                    <span className="text-neutral-200 font-semibold">{confirmedAppointment.serviceName}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[11px]">Mestre Barbeiro</span>
                    <span className="text-neutral-200 font-semibold">{confirmedAppointment.barberName}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[11px]">Data & Horário</span>
                    <span className="text-amber-400 font-bold tabular-nums">
                      {confirmedAppointment.date} às {confirmedAppointment.time}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[11px]">Forma de Pagamento</span>
                    <span className="text-emerald-400 font-semibold">
                      {confirmedAppointment.paymentMethod === 'pix' ? 'Pix (Aprovado na Demo)' : 'No Balcão da Barbearia'}
                    </span>
                  </div>
                </div>

                {/* Processes Included Recap in confirmation */}
                {selectedService.processes && selectedService.processes.length > 0 && (
                  <div className="pt-3 border-t border-neutral-850">
                    <span className="text-[11px] font-semibold text-neutral-400 block mb-1">
                      Processos programados para sua cadeira:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedService.processes.map((p) => (
                        <span key={p.step} className="text-[10px] px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">
                          {p.step}. {p.title}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-3 border-t border-neutral-850 flex items-center justify-between text-[11px] text-neutral-400">
                  <span>☕ Chopp gelado ou espresso moído na hora aguardando por você.</span>
                  <span className="text-amber-400 font-bold tabular-nums">
                    Total: R$ {confirmedAppointment.price.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              {/* Demo sync info */}
              <div className="p-3.5 rounded-xl bg-amber-400/10 border border-amber-400/25 text-left flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-semibold text-amber-300 block">
                    Sincronização com o Painel do Dono:
                  </span>
                  <span className="text-neutral-300">
                    Este agendamento (com os processos escolhidos e o status do pagamento) já foi inserido na área administrativa. Você pode conferir como o dono visualiza esse cliente no sistema.
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  onClick={handleSimulateWhatsApp}
                  className="w-full sm:w-1/2 flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-emerald-900/60 hover:bg-emerald-800/80 border border-emerald-600/50 text-emerald-200 text-xs font-semibold cursor-pointer transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>Simular Envio WhatsApp</span>
                </button>

                <button
                  onClick={() => {
                    handleClose();
                    onViewAdmin();
                  }}
                  className="w-full sm:w-1/2 flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 text-xs font-semibold cursor-pointer transition-colors"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Ver no Painel do Dono</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls (Steps 1 to 5) */}
        {step <= 5 && (
          <div className="px-6 py-4 border-t border-neutral-800 bg-neutral-950/80 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Voltar</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded-lg text-xs font-medium text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
            )}

            {step < 5 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                disabled={
                  (step === 3 && !selectedTime) ||
                  (step === 4 && (!clientName.trim() || !clientPhone.trim()))
                }
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-lg text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 transition-all cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Avançar para {stepsList[step]?.label || 'Próximo'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleConfirmBooking}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-semibold text-neutral-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 transition-all cursor-pointer shadow-md shadow-amber-950/40"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Finalizar Agendamento</span>
              </button>
            )}
          </div>
        )}

        {/* Modal Footer for Confirmation (Step 6) */}
        {step === 6 && (
          <div className="px-6 py-3 border-t border-neutral-800 bg-neutral-950 flex justify-center">
            <button
              onClick={handleClose}
              className="text-xs text-neutral-400 hover:text-white py-1 cursor-pointer"
            >
              Concluir e Voltar ao Site
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
