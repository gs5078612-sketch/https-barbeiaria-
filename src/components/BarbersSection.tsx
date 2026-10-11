import { Barber } from '../types/barbershop';
import { Star, Award, Calendar, Scissors } from 'lucide-react';

interface BarbersSectionProps {
  barbers: Barber[];
  onSelectBarberToBook: (barberId: string) => void;
}

export function BarbersSection({ barbers, onSelectBarberToBook }: BarbersSectionProps) {
  return (
    <section id="barbeiros" className="py-20 bg-neutral-900/60 border-b border-neutral-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-amber-400 uppercase">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Mestres da Navalha</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-neutral-100">
            Nossa Equipe de <span className="gold-text">Especialistas</span>
          </h2>
          <p className="text-sm sm:text-base text-neutral-400 font-light">
            Profissionais certificados nas melhores academias do país e do exterior, comprometidos com a precisão, discrição e pontualidade.
          </p>
        </div>

        {/* Grid of Barbers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {barbers.map((barber) => (
            <div
              key={barber.id}
              className="flex flex-col rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden hover:border-amber-400/40 transition-all duration-300 group shadow-lg"
            >
              {/* Photo */}
              <div className="relative aspect-[4/4] overflow-hidden bg-neutral-950">
                <img
                  src={barber.image}
                  alt={barber.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80" />
                
                {/* Years badge inside image */}
                <div className="absolute top-3 right-3 px-2.5 py-1 bg-neutral-950/80 backdrop-blur-md rounded text-[11px] font-medium text-amber-400 border border-neutral-800">
                  {barber.experienceYears} anos de exp.
                </div>

                {/* Rating badge */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-neutral-950/85 backdrop-blur-md rounded text-xs text-neutral-200 border border-neutral-800">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="font-semibold text-white">{barber.rating}</span>
                  <span className="text-[10px] text-neutral-400">({barber.reviewsCount})</span>
                </div>
              </div>

              {/* Info */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-neutral-100 font-display group-hover:text-amber-400 transition-colors">
                    {barber.name}
                  </h3>
                  <p className="text-xs font-medium text-amber-400/90">
                    {barber.title}
                  </p>
                  <p className="text-xs text-neutral-400 line-clamp-2 pt-1">
                    {barber.bio}
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-800/80 space-y-3">
                  <div className="text-[11px] text-neutral-400">
                    <span className="text-neutral-500 block">Especialidade:</span>
                    <span className="text-neutral-300 font-medium">{barber.specialty}</span>
                  </div>

                  <button
                    onClick={() => onSelectBarberToBook(barber.id)}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs font-semibold bg-neutral-800 hover:bg-amber-400 hover:text-neutral-950 text-neutral-200 transition-all border border-neutral-700/80 cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Agendar com {barber.name.split(' ')[0]}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
