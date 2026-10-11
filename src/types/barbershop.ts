export type ServiceCategory = 'hair' | 'beard' | 'combo' | 'treatment';

export type PaymentMethod = 'pix' | 'credit_card' | 'debit_card' | 'counter_cash';
export type PaymentStatus = 'paid' | 'pending_on_counter';

export interface ServiceProcess {
  step: number;
  title: string;
  detail: string;
  estimatedMinutes?: number;
}

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  durationMin: number;
  price: number;
  popular?: boolean;
  features?: string[];
  processes: ServiceProcess[];
}

export interface Barber {
  id: string;
  name: string;
  title: string;
  experienceYears: number;
  specialty: string;
  rating: number;
  reviewsCount: number;
  image: string;
  bio: string;
}

export type AppointmentStatus = 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  protocolNumber: string;
  clientName: string;
  clientPhone: string;
  clientNotes?: string;
  serviceId: string;
  serviceName: string;
  barberId: string;
  barberName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  price: number;
  durationMin: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: AppointmentStatus;
  createdAt: string;
}

export interface LoyaltyReward {
  id: string;
  title: string;
  pointsRequired: number;
  description: string;
}

export interface ClientMemory {
  id: string;
  name: string;
  phone: string;
  email?: string;
  firstVisitDate: string;
  lastVisitDate: string;
  totalVisits: number;
  totalSpent: number;
  loyaltyPoints?: number;
  loyaltyTier?: 'Membro Prata' | 'Ouro Executivo' | 'Black VIP' | 'Império Imperial';
  preferredBarberId: string;
  preferredBarberName: string;
  favoriteDrink: string;
  hairProfile: string;
  skinProfile: string;
  conversationNotes: string;
  aiSummary?: string;
  aiNextSuggestedVisitDays?: number;
  serviceHistory: {
    date: string;
    serviceName: string;
    barberName: string;
    price: number;
    notes?: string;
  }[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  rating: number;
  comment: string;
  date: string;
  serviceUsed: string;
}

