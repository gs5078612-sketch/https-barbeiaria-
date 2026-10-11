import { Clock, MapPin, Phone, MessageSquare, Instagram, Navigation, ExternalLink } from 'lucide-react';
import { BUSINESS_INFO } from '../data/mockData';

export function ScheduleLocation() {
  const openWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?phone=${BUSINESS_INFO.whatsappRaw}&text=Olá,%20gostaria%20de%20tirar%20uma%20dúvida%20sobre%20a%20Império%20Barber.`, '_blank');
  };

  const openMaps = () => {
    window.open(`https://maps.google.com/?q=${encodeURIComponent(BUSINESS_INFO.address + ', ' + BUSINESS_INFO.city)}`, '_blank');
  };

  return (
    <section id="contato" className="py-20 bg-neutral-900/40 border-b border-neutral-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Left Column: Hours & Quick Contact Cards (col-span-6) */}
          <div className="lg:col-span-6 space-y-8 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-amber-400 uppercase">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Horários & Localização</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold font-display text-neutral-100">
                Venha nos <span className="gold-text">Visitar</span>
              </h2>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Estamos estrategicamente localizados no coração financeiro de São Paulo, com acesso fácil, valet gratuito e total comodidade.
              </p>
            </div>

            {/* Operating Hours Box */}
            <div className="p-6 rounded-xl bg-neutral-900 border border-neutral-800 space-y-4 shadow-lg">
              <div className="flex items-center gap-2 pb-3 border-b border-neutral-800">
                <Clock className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-200 font-display">
                  Horário de Atendimento
                </h3>
              </div>

              <div className="space-y-3">
                {BUSINESS_INFO.hours.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-neutral-400 font-medium">{item.day}</span>
                    <span className="text-neutral-200 font-semibold tabular-nums">{item.time}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-[11px] text-neutral-500 border-t border-neutral-850">
                * Atendimento exclusivo mediante agendamento prévio para garantir pontualidade britânica.
              </div>
            </div>

            {/* Contact Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={openWhatsApp}
                className="flex items-center justify-center gap-2.5 p-4 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-600/40 text-emerald-300 text-xs sm:text-sm font-semibold transition-all cursor-pointer group shadow-sm"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span>Falar no WhatsApp</span>
              </button>

              <button
                onClick={openMaps}
                className="flex items-center justify-center gap-2.5 p-4 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-neutral-200 text-xs sm:text-sm font-semibold transition-all cursor-pointer group shadow-sm"
              >
                <Navigation className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                <span>Traçar Rota no GPS</span>
              </button>
            </div>
          </div>

          {/* Right Column: Location Card & Simulated Interactive Map View (col-span-6) */}
          <div className="lg:col-span-6 flex flex-col justify-between rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden shadow-xl">
            {/* Map styling banner */}
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-neutral-950 overflow-hidden flex items-center justify-center border-b border-neutral-800">
              {/* Graphic styled map backdrop with streets */}
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px]" />
              
              {/* Stylized street lines */}
              <div className="absolute inset-0 flex flex-col justify-around opacity-20 pointer-events-none">
                <div className="h-1 bg-amber-400 w-full transform -rotate-3" />
                <div className="h-2 bg-neutral-600 w-full transform rotate-6" />
                <div className="h-1 bg-neutral-500 w-full transform -rotate-1" />
              </div>

              {/* Pin Centerpiece */}
              <div className="relative z-10 flex flex-col items-center text-center p-4">
                <div className="w-14 h-14 rounded-full bg-neutral-900/90 border-2 border-amber-400 flex items-center justify-center text-amber-400 shadow-2xl animate-bounce">
                  <MapPin className="w-7 h-7 text-amber-400" />
                </div>
                <div className="mt-3 px-4 py-2 bg-neutral-950/90 backdrop-blur-md rounded-lg border border-neutral-800 text-xs font-semibold text-neutral-100 shadow-lg">
                  <span className="font-display">IMPÉRIO BARBER</span> — Jardins
                </div>
              </div>

              {/* Action over map */}
              <button
                onClick={openMaps}
                className="absolute bottom-3 right-3 px-3 py-1.5 bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700 rounded text-[11px] font-medium text-neutral-300 flex items-center gap-1.5 backdrop-blur-sm cursor-pointer"
              >
                <span>Abrir Google Maps</span>
                <ExternalLink className="w-3 h-3 text-amber-400" />
              </button>
            </div>

            {/* Address Information details */}
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-neutral-200">
                    {BUSINESS_INFO.address}
                  </h4>
                  <p className="text-xs text-neutral-400">
                    {BUSINESS_INFO.city} — CEP: {BUSINESS_INFO.cep} (Em frente ao MASP)
                  </p>
                  <p className="text-[11px] text-amber-400/90 mt-1">
                    * Manobrista e vagas exclusivas no subsolo da barbearia
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-4 text-xs text-neutral-400">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-neutral-500" />
                  <span>{BUSINESS_INFO.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Instagram className="w-4 h-4 text-neutral-500" />
                  <span className="text-neutral-300">{BUSINESS_INFO.instagram}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
