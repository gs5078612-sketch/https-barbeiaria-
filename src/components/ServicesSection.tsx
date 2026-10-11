import { useState } from 'react';
import { Service, ServiceCategory } from '../types/barbershop';
import { Clock, Check, Scissors, Sparkles, ArrowRight } from 'lucide-react';

interface ServicesSectionProps {
  services: Service[];
  onSelectServiceToBook: (serviceId: string) => void;
}

export function ServicesSection({ services, onSelectServiceToBook }: ServicesSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'all'>('all');
  const [expandedServiceId, setExpandedServiceId] = useState<string | null>(null);

  const categories: { key: ServiceCategory | 'all'; label: string }[] = [
    { key: 'all', label: 'Todos os Serviços' },
    { key: 'hair', label: 'Cabelo' },
    { key: 'beard', label: 'Barba' },
    { key: 'combo', label: 'Combos Imperiais' },
    { key: 'treatment', label: 'Tratamentos' }
  ];

  const filteredServices = selectedCategory === 'all'
    ? services
    : services.filter(s => s.category === selectedCategory);

  return (
    <section id="servicos" className="py-20 bg-neutral-950 border-b border-neutral-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-amber-400 uppercase">
              <Scissors className="w-3.5 h-3.5 text-amber-400" />
              <span>Cardápio de Serviços & Valores</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-neutral-100">
              Excelência Técnica em <span className="gold-text">Cada Detalhe</span>
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 max-w-xl">
              Preços transparentes com produtos internacionais de alta linha. Escolha o serviço desejado e garanta sua poltrona.
            </p>
          </div>

          {/* Category Filter - Segmented functional buttons */}
          <div className="flex items-center gap-1.5 p-1.5 bg-neutral-900 border border-neutral-800 rounded-lg overflow-x-auto max-w-full">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3.5 py-2 text-xs font-medium rounded-md whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.key
                    ? 'bg-amber-400 text-neutral-950 font-semibold shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/60'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className={`relative flex flex-col justify-between p-6 rounded-xl bg-neutral-900/70 border transition-all duration-300 hover:translate-y-[-2px] ${
                service.popular
                  ? 'border-amber-500/50 bg-gradient-to-b from-neutral-900 to-neutral-900/90 shadow-lg shadow-amber-950/20'
                  : 'border-neutral-800/90 hover:border-neutral-700'
              }`}
            >
              {/* Highlight badge if popular */}
              {service.popular && (
                <div className="absolute -top-3 right-5 px-3 py-0.5 rounded-full bg-amber-400 text-neutral-950 text-[10px] font-bold uppercase tracking-wider shadow-md">
                  Mais Escolhido
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-neutral-100 group-hover:text-amber-400 font-display">
                      {service.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-neutral-400">
                      <Clock className="w-3.5 h-3.5 text-amber-400/80" />
                      <span className="tabular-nums">{service.durationMin} minutos</span>
                    </div>
                  </div>
                  
                  {/* Price presentation */}
                  <div className="text-right shrink-0">
                    <span className="text-xs text-neutral-400 block font-normal">A partir de</span>
                    <span className="text-2xl font-bold font-display text-amber-400 tabular-nums">
                      R$ {service.price.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed min-h-[48px]">
                  {service.description}
                </p>

                {/* Features included */}
                {service.features && service.features.length > 0 && (
                  <div className="pt-3 border-t border-neutral-800/80 space-y-2">
                    {service.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-neutral-300">
                        <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                )}
                {/* Processes Expandable preview */}
                {service.processes && service.processes.length > 0 && (
                  <div className="pt-3 border-t border-neutral-800/80">
                    <button
                      type="button"
                      onClick={() => setExpandedServiceId(expandedServiceId === service.id ? null : service.id)}
                      className="text-xs text-amber-400/90 hover:text-amber-300 font-medium flex items-center justify-between w-full py-1 cursor-pointer"
                    >
                      <span>Etapas do Ritual ({service.processes.length} processos)</span>
                      <span className="text-[11px] underline">
                        {expandedServiceId === service.id ? 'Ocultar' : 'Ver Etapas'}
                      </span>
                    </button>

                    {expandedServiceId === service.id && (
                      <div className="mt-2.5 p-3 rounded-lg bg-neutral-950 border border-neutral-850 space-y-2 text-[11px] animate-in fade-in duration-200">
                        {service.processes.map((p) => (
                          <div key={p.step} className="flex items-start gap-2">
                            <span className="w-4 h-4 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20 font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5">
                              {p.step}
                            </span>
                            <div>
                              <strong className="text-neutral-200">{p.title}:</strong>{' '}
                              <span className="text-neutral-400">{p.detail}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-5 mt-4">
                <button
                  onClick={() => onSelectServiceToBook(service.id)}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    service.popular
                      ? 'bg-amber-400 hover:bg-amber-300 text-neutral-950 shadow-md shadow-amber-950/40'
                      : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white border border-neutral-700/80'
                  }`}
                >
                  <span>Agendar Este Serviço</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Highlight Banner on the bottom of services */}
        <div className="mt-12 p-6 rounded-xl bg-gradient-to-r from-neutral-900 via-neutral-900/95 to-neutral-900 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-neutral-100 font-display">
                Precisa de um atendimento para o Dia do Noivo ou Evento?
              </h4>
              <p className="text-xs text-neutral-400 mt-0.5">
                Fechamos o lounge VIP com serviço exclusivo de bar, charutos e massagem para grupos sob consulta.
              </p>
            </div>
          </div>
          <button
            onClick={() => onSelectServiceToBook('srv-5')}
            className="px-5 py-2.5 rounded-md bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 text-neutral-200 text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors"
          >
            Consultar Pacote VIP
          </button>
        </div>
      </div>
    </section>
  );
}
