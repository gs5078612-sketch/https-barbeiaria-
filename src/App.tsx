import { useState, useEffect } from 'react';
import { INITIAL_SERVICES, INITIAL_BARBERS, INITIAL_APPOINTMENTS, INITIAL_CLIENT_MEMORIES } from './data/mockData';
import { Appointment, AppointmentStatus, ClientMemory } from './types/barbershop';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { BarbersSection } from './components/BarbersSection';
import { ExperienceGallery } from './components/ExperienceGallery';
import { ScheduleLocation } from './components/ScheduleLocation';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { AdminDashboard } from './components/AdminDashboard';
import { Calendar, ShieldCheck } from 'lucide-react';

const STORAGE_KEY = 'imperio_barber_demo_apts_v1';
const STORAGE_KEY_MEMORIES = 'imperio_barber_client_memories_v1';

export default function App() {
  const [currentView, setCurrentView] = useState<'client' | 'admin'>('client');
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    return INITIAL_APPOINTMENTS;
  });

  const [clientMemories, setClientMemories] = useState<ClientMemory[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MEMORIES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    return INITIAL_CLIENT_MEMORIES;
  });

  const [services] = useState(INITIAL_SERVICES);
  const [barbers] = useState(INITIAL_BARBERS);

  // Booking modal states
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedBarberId, setSelectedBarberId] = useState<string | null>(null);

  // Persist appointments to localStorage for seamless demo experience
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [appointments]);

  // Persist client memories to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MEMORIES, JSON.stringify(clientMemories));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [clientMemories]);

  const handleOpenBooking = (serviceId?: string, barberId?: string) => {
    setSelectedServiceId(serviceId || null);
    setSelectedBarberId(barberId || null);
    setIsBookingOpen(true);
  };

  const handleSaveAppointment = (newAppointment: Appointment) => {
    setAppointments(prev => [newAppointment, ...prev]);
  };

  const handleSaveClientMemory = (memory: ClientMemory) => {
    setClientMemories(prev => {
      const exists = prev.some(c => c.id === memory.id);
      if (exists) {
        return prev.map(c => c.id === memory.id ? memory : c);
      }
      return [memory, ...prev];
    });
  };

  const handleUpdateAppointmentStatus = (id: string, newStatus: AppointmentStatus) => {
    setAppointments(prev =>
      prev.map(apt => (apt.id === id ? { ...apt, status: newStatus } : apt))
    );
  };

  const handleAddManualAppointment = (newApt: Appointment) => {
    setAppointments(prev => [newApt, ...prev]);
  };

  const handleResetDemoData = () => {
    setAppointments(INITIAL_APPOINTMENTS);
    setClientMemories(INITIAL_CLIENT_MEMORIES);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_KEY_MEMORIES);
    } catch (e) {
      // ignore
    }
  };

  const handleNavigate = (view: 'client' | 'admin', sectionId?: string) => {
    setCurrentView(view);
    if (view === 'client' && sectionId) {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      {/* Top persistent notice bar */}
      <div className="bg-neutral-900 border-b border-neutral-800 text-[11px] px-3 py-1.5 flex items-center justify-between text-neutral-400">
        <div className="flex items-center gap-2 truncate">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
          <span className="truncate">
            <strong>Demonstração Império Barber</strong> — Protótipo interativo completo para apresentação.
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setCurrentView(currentView === 'client' ? 'admin' : 'client')}
            className="text-amber-400 hover:text-amber-300 font-semibold cursor-pointer underline flex items-center gap-1"
          >
            {currentView === 'client' ? 'Ver Painel do Dono' : 'Ver Site do Cliente'}
          </button>
        </div>
      </div>

      {/* Main Header */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenBooking={() => handleOpenBooking()}
      />

      {/* View routing: Client Experience vs. Admin Dashboard */}
      <main className="flex-1">
        {currentView === 'client' ? (
          <>
            <Hero
              onOpenBooking={() => handleOpenBooking()}
              onExploreServices={() => {
                const el = document.getElementById('servicos');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            <ServicesSection
              services={services}
              onSelectServiceToBook={(srvId) => handleOpenBooking(srvId)}
            />

            <BarbersSection
              barbers={barbers}
              onSelectBarberToBook={(barbId) => handleOpenBooking(undefined, barbId)}
            />

            <ExperienceGallery />

            <ScheduleLocation />
          </>
        ) : (
          <AdminDashboard
            appointments={appointments}
            services={services}
            barbers={barbers}
            clientMemories={clientMemories}
            onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
            onAddManualAppointment={handleAddManualAppointment}
            onSaveClientMemory={handleSaveClientMemory}
            onBackToClientSite={() => setCurrentView('client')}
            onResetDemoData={handleResetDemoData}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenBooking={() => handleOpenBooking()}
      />

      {/* Interactive Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        services={services}
        barbers={barbers}
        clientMemories={clientMemories}
        initialServiceId={selectedServiceId}
        initialBarberId={selectedBarberId}
        onSaveAppointment={handleSaveAppointment}
        onSaveClientMemory={handleSaveClientMemory}
        onViewAdmin={() => {
          setIsBookingOpen(false);
          setCurrentView('admin');
        }}
      />

      {/* Floating CTA for Mobile Users (Client View Only) */}
      {currentView === 'client' && (
        <div className="md:hidden fixed bottom-4 left-4 right-4 z-30 flex items-center gap-2">
          <button
            onClick={() => handleOpenBooking()}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-neutral-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 shadow-xl shadow-amber-950/60 text-sm cursor-pointer active:scale-95 transition-transform"
          >
            <Calendar className="w-4 h-4 text-neutral-950" />
            <span>Agendar Horário</span>
          </button>
          
          <button
            onClick={() => setCurrentView('admin')}
            className="p-3 rounded-xl bg-neutral-900 border border-neutral-700 text-neutral-300 hover:text-white shadow-xl cursor-pointer"
            title="Acessar Painel do Dono"
            aria-label="Acessar Painel do Dono"
          >
            <ShieldCheck className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
