import { Scissors, ShieldCheck, Heart } from 'lucide-react';
import { BUSINESS_INFO } from '../data/mockData';

interface FooterProps {
  onNavigate: (view: 'client' | 'admin', sectionId?: string) => void;
  onOpenBooking: () => void;
}

export function Footer({ onNavigate, onOpenBooking }: FooterProps) {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-neutral-950 border-t border-neutral-900 text-neutral-400 text-xs">
      {/* Top Banner Notice for Owner Presentation */}
      <div className="bg-neutral-900/60 border-b border-neutral-850 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2 text-neutral-300 text-xs">
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
            <span>
              <strong>Demonstração Comercial Interativa</strong> — Desenvolvido com exclusividade para a <strong>Império Barber</strong>.
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('admin')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-amber-400 font-semibold border border-neutral-700 text-xs transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Acessar Painel do Dono (Demonstração)</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Scissors className="w-4 h-4 transform -rotate-45" />
              </div>
              <span className="font-display text-lg font-bold tracking-wider text-neutral-100">
                IMPÉRIO <span className="text-amber-400">BARBER</span>
              </span>
            </div>

            <p className="text-neutral-400 text-xs sm:text-sm max-w-sm leading-relaxed">
              {BUSINESS_INFO.tagline}. Tradição, precisão e uma experiência premium do início ao fim do seu atendimento.
            </p>

            <div className="text-[11px] text-neutral-500 space-y-1">
              <p>{BUSINESS_INFO.address} — {BUSINESS_INFO.city}</p>
              <p>Contato: {BUSINESS_INFO.phone} · WhatsApp: {BUSINESS_INFO.whatsapp}</p>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-200 font-display">
              Navegação
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => scrollTo('inicio')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Página Inicial
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('servicos')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Serviços e Preços
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('barbeiros')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Mestres Barbeiros
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('espaco')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  O Espaço & Lounge
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('contato')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Horários e Localização
                </button>
              </li>
            </ul>
          </div>

          {/* Hours & Action */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-200 font-display">
              Atendimento
            </h4>
            <div className="space-y-1.5 text-[11px] text-neutral-400">
              <p><span className="text-neutral-200">Seg - Sex:</span> 09:00 às 20:00</p>
              <p><span className="text-neutral-200">Sábado:</span> 08:30 às 19:30</p>
              <p><span className="text-neutral-200">Domingo:</span> Plantão VIP sob reserva</p>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenBooking}
                className="w-full py-2 px-3 rounded-md bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold text-xs transition-colors cursor-pointer"
              >
                Agendar Horário Online
              </button>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <p>© {new Date().getFullYear()} Império Barber. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1">
            <span>Protótipo Comercial de Demonstração</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
