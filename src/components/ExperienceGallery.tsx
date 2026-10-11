import { TESTIMONIALS, BUSINESS_INFO } from '../data/mockData';
import { Star, Shield, Wine, Sparkles, CheckCircle2 } from 'lucide-react';

export function ExperienceGallery() {
  return (
    <section id="espaco" className="py-20 bg-neutral-950 border-b border-neutral-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-amber-400 uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Ambiente & Confraria</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-neutral-100">
              Muito Mais que uma Barbearia, <span className="gold-text">Seu Refúgio</span>
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 max-w-xl">
              Projetado para ser um ponto de descompressão na sua rotina. Arquitetura sóbria, acústica pensada e privacidade total.
            </p>
          </div>
        </div>

        {/* Bento grid of atmosphere photos & features */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Main Lounge feature (col-span-7) */}
          <div className="md:col-span-7 rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 relative group flex flex-col justify-between">
            <div className="relative aspect-[16/10] overflow-hidden">
              <img
                src="/src/assets/images/barbershop_lounge_1791662194025.jpg"
                alt="VIP Lounge da Império Barber"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 space-y-2">
                <span className="text-xs uppercase font-semibold tracking-wider text-amber-400 font-display">
                  Lounge VIP dos Cavalheiros
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
                  Poltronas Chesterfield, Chopp e Café Espresso Cortesia
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 max-w-lg">
                  Chegue 15 minutos antes e aproveite para relaxar, ler as principais revistas de negócios ou simplesmente apreciar uma bebida artesanal.
                </p>
              </div>
            </div>
          </div>

          {/* Hot Towel & Ritual feature (col-span-5) */}
          <div className="md:col-span-5 rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 relative group flex flex-col justify-between">
            <div className="relative aspect-[16/10] sm:aspect-auto md:h-full overflow-hidden min-h-[300px]">
              <img
                src="/src/assets/images/barber_beard_treatment_1791662183239.jpg"
                alt="Barboterapia com toalha quente na Império Barber"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 space-y-2">
                <span className="text-xs uppercase font-semibold tracking-wider text-amber-400 font-display">
                  O Ritual da Barboterapia
                </span>
                <h3 className="text-xl font-bold text-white font-display">
                  Toalhas A vapor & Aromaterapia
                </h3>
                <p className="text-xs text-neutral-300">
                  Desinfecção e hidratação profunda que previnem foliculite e garantem um barbear relaxante.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Amenities List */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {BUSINESS_INFO.amenities.map((item, idx) => (
            <div key={idx} className="p-4 rounded-lg bg-neutral-900/80 border border-neutral-800 text-left space-y-1">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-semibold text-neutral-200">{item.label}</h4>
              <p className="text-[11px] text-neutral-400">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mt-16 pt-12 border-t border-neutral-900">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-neutral-100 font-display">
              O Que Nossos Clientes Falam
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              Avaliações reais de clientes frequentes da nossa unidade Jardins.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.id}
                className="p-6 rounded-xl bg-neutral-900/60 border border-neutral-800 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-300 italic leading-relaxed">
                    "{t.comment}"
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs">
                  <div>
                    <h5 className="font-semibold text-neutral-200">{t.name}</h5>
                    <span className="text-[11px] text-neutral-400">{t.role}</span>
                  </div>
                  <span className="text-[10px] text-amber-400/90 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                    {t.serviceUsed}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
