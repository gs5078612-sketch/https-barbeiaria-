import { Calendar, ChevronRight, Clock, Coffee, Sparkles, Car } from 'lucide-react';

interface HeroProps {
  onOpenBooking: () => void;
  onExploreServices: () => void;
}

export function Hero({ onOpenBooking, onExploreServices }: HeroProps) {
  return (
    <section id="inicio" className="relative overflow-hidden bg-neutral-950 pt-6 pb-16 lg:pt-12 lg:pb-24 border-b border-neutral-800/80">
      {/* Background ambient gold & charcoal glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-amber-500/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Proposition and Call to Action */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Elegant metadata kicker */}
            <div className="inline-flex items-center gap-2 text-xs font-medium tracking-widest text-amber-400 uppercase">
              <span>Experiência Exclusiva</span>
              <span aria-hidden="true">·</span>
              <span>São Paulo - Jardins</span>
              <span aria-hidden="true">·</span>
              <span>Desde 2018</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-display text-neutral-100 tracking-tight leading-[1.15]" style={{ textWrap: 'balance' }}>
              A arte da barbearia clássica com a <span className="gold-text">sofisticação moderna</span>
            </h1>

            <p className="text-base sm:text-lg text-neutral-400 leading-relaxed max-w-2xl font-light">
              Mais do que um corte ou barba impecável: um ritual completo de cuidado masculino. 
              Poltronas de couro legítimo, toalha quente com aromaterapia, café especial moído na hora e cerveja artesanal gelada.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={onOpenBooking}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold text-neutral-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-md shadow-lg shadow-amber-950/50 transition-all transform hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap cursor-pointer"
              >
                <Calendar className="w-5 h-5 text-neutral-950" />
                <span>Agendar Meu Horário</span>
              </button>

              <button
                onClick={onExploreServices}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-medium text-neutral-200 bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700/80 hover:border-amber-400/50 rounded-md transition-all whitespace-nowrap cursor-pointer"
              >
                <span>Ver Serviços & Preços</span>
                <ChevronRight className="w-4 h-4 text-amber-400" />
              </button>
            </div>

            {/* Micro social proof / trust indicator */}
            <div className="pt-4 flex items-center gap-6 border-t border-neutral-900 text-xs text-neutral-400">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-amber-400 text-sm">4.9★</span>
                <span>no Google (+850 avaliações)</span>
              </div>
              <span aria-hidden="true" className="text-neutral-700">|</span>
              <div>
                <span className="text-neutral-200 font-medium">98.4%</span> de pontualidade comprovada
              </div>
            </div>
          </div>

          {/* Right Column: High impact luxury visual showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-xl overflow-hidden border border-neutral-800 shadow-2xl group">
              <div className="aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] relative w-full bg-neutral-900">
                <img
                  src="/src/assets/images/hero_barbershop_luxury_1791662165371.jpg"
                  alt="Interior requintado da barbearia Império Barber"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                  loading="eager"
                />
                {/* Subtle scrim overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-black/20 pointer-events-none" />
                
                {/* Visual badge inside image */}
                <div className="absolute bottom-4 left-4 right-4 p-3.5 bg-neutral-950/85 backdrop-blur-md rounded-lg border border-neutral-800 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-neutral-200 uppercase tracking-wider font-display">
                      Sede Império Jardins
                    </p>
                    <p className="text-[11px] text-neutral-400">
                      Ambiente exclusivo com 6 bancadas individuais
                    </p>
                  </div>
                  <span className="text-xs px-2.5 py-1 bg-amber-400/10 text-amber-400 font-semibold border border-amber-400/20 rounded">
                    Hoje Aberto
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column Trust Strip below hero */}
        <div className="mt-14 pt-10 border-t border-neutral-900 grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-amber-400 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-neutral-200">Hora Marcada</h4>
              <p className="text-xs text-neutral-400 mt-0.5">Sem filas, atendimento no horário exato</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-amber-400 shrink-0">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-neutral-200">Bebidas Cortesia</h4>
              <p className="text-xs text-neutral-400 mt-0.5">Chopp artesanal e café moído na hora</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-amber-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-neutral-200">Ritual Tradicional</h4>
              <p className="text-xs text-neutral-400 mt-0.5">Toalha vaporizada e óleos nobres</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-amber-400 shrink-0">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-neutral-200">Manobrista Grátis</h4>
              <p className="text-xs text-neutral-400 mt-0.5">Estacionamento privativo para clientes</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
