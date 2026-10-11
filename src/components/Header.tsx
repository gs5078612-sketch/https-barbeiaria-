import { useState } from 'react';
import { Scissors, Menu, X, Calendar, ShieldCheck, Phone } from 'lucide-react';

interface HeaderProps {
  currentView: 'client' | 'admin';
  onNavigate: (view: 'client' | 'admin', sectionId?: string) => void;
  onOpenBooking: () => void;
}

export function Header({ currentView, onNavigate, onOpenBooking }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (currentView !== 'client') {
      onNavigate('client');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Bar 3-Zone Contract: Zone 1 (Wordmark) - Zone 2 (Nav links) - Zone 3 (Actions) */}
          <div className="flex items-center justify-between gap-8 h-20">
            {/* Zone 1: Single text element wordmark */}
            <div 
              onClick={() => onNavigate('client')}
              className="flex items-center gap-3 cursor-pointer group whitespace-nowrap shrink-0"
            >
              <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:border-amber-400/60 transition-colors shadow-inner">
                <Scissors className="w-5 h-5 text-amber-400 transform -rotate-45" />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-xl font-bold tracking-wider text-neutral-100 group-hover:text-amber-400 transition-colors">
                  IMPÉRIO <span className="text-amber-400">BARBER</span>
                </span>
                <span className="text-[10px] tracking-[0.25em] text-neutral-400 uppercase font-sans font-medium">
                  Barbearia Premium
                </span>
              </div>
            </div>

            {/* Zone 2: 4-5 single-line clean text links */}
            <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-neutral-300">
              <button
                onClick={() => handleNavClick('inicio')}
                className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 py-1"
              >
                Início
              </button>
              <button
                onClick={() => handleNavClick('servicos')}
                className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 py-1"
              >
                Serviços & Preços
              </button>
              <button
                onClick={() => handleNavClick('barbeiros')}
                className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 py-1"
              >
                Barbeiros
              </button>
              <button
                onClick={() => handleNavClick('espaco')}
                className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 py-1"
              >
                O Espaço
              </button>
              <button
                onClick={() => handleNavClick('contato')}
                className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 py-1"
              >
                Horários & Contato
              </button>
            </nav>

            {/* Zone 3: Primary Action + Admin Switch */}
            <div className="flex items-center gap-3 shrink-0">
              {currentView === 'client' ? (
                <>
                  <button
                    onClick={() => onNavigate('admin')}
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-300 bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700/80 rounded-md transition-colors whitespace-nowrap shrink-0"
                    title="Acessar demonstração do painel de controle do proprietário"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Painel do Dono (Demo)</span>
                  </button>
                  <button
                    onClick={onOpenBooking}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-neutral-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-md shadow-md shadow-amber-950/40 transition-all transform active:scale-95 whitespace-nowrap shrink-0"
                  >
                    <Calendar className="w-4 h-4 text-neutral-950" />
                    <span>Agendar Horário</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => onNavigate('client')}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-100 bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 rounded-md transition-colors whitespace-nowrap shrink-0"
                >
                  <span>Voltar ao Site do Cliente</span>
                </button>
              )}

              {/* Mobile menu trigger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-neutral-300 hover:text-white rounded-md bg-neutral-900 border border-neutral-800"
                aria-label="Abrir menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-neutral-800 bg-neutral-950/98 px-6 py-6 space-y-4 shadow-2xl animate-in slide-in-from-top duration-200">
            <div className="flex flex-col space-y-3 font-medium text-base text-neutral-300">
              <button
                onClick={() => handleNavClick('inicio')}
                className="text-left py-2 hover:text-amber-400 border-b border-neutral-900"
              >
                Início
              </button>
              <button
                onClick={() => handleNavClick('servicos')}
                className="text-left py-2 hover:text-amber-400 border-b border-neutral-900"
              >
                Serviços & Preços
              </button>
              <button
                onClick={() => handleNavClick('barbeiros')}
                className="text-left py-2 hover:text-amber-400 border-b border-neutral-900"
              >
                Barbeiros
              </button>
              <button
                onClick={() => handleNavClick('espaco')}
                className="text-left py-2 hover:text-amber-400 border-b border-neutral-900"
              >
                O Espaço & Ambiente
              </button>
              <button
                onClick={() => handleNavClick('contato')}
                className="text-left py-2 hover:text-amber-400 border-b border-neutral-900"
              >
                Horários & Contato
              </button>
            </div>

            <div className="pt-2 flex flex-col gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-md font-semibold text-neutral-950 bg-gradient-to-r from-amber-400 to-amber-500 shadow-lg text-sm"
              >
                <Calendar className="w-4 h-4" />
                Agendar Horário Agora
              </button>
              
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate(currentView === 'client' ? 'admin' : 'client');
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-md font-medium text-xs text-neutral-300 bg-neutral-900 border border-neutral-700"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                {currentView === 'client' ? 'Acessar Painel do Dono (Demonstração)' : 'Voltar ao Site da Barbearia'}
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
