import { Service, Barber, Appointment, Testimonial, ClientMemory } from '../types/barbershop';

export const INITIAL_SERVICES: Service[] = [
  {
    id: 'srv-1',
    name: 'Corte Imperial Fade & Styling',
    category: 'hair',
    description: 'Corte degradê personalizado (Low, Mid ou High Fade), lavagem especial refrescante, finalização com pomada matte premium e alinhamento do pezinho com navalhete.',
    durationMin: 45,
    price: 75,
    popular: true,
    features: ['Lavagem com shampoo mentolado', 'Pezinho na navalha', 'Finalização com pomada importada'],
    processes: [
      { step: 1, title: 'Consulta de Visagismo & Estilo', detail: 'Análise do formato do rosto, densidade capilar e escolha do tipo de degradê (Low, Mid, High ou Taper Fade).', estimatedMinutes: 5 },
      { step: 2, title: 'Lavagem com Shampoo Refrescante', detail: 'Higienização completa no lavatório com massagem suave no couro cabeludo e shampoo mentolado.', estimatedMinutes: 5 },
      { step: 3, title: 'Execução do Corte & Fade Técnico', detail: 'Graduação milimétrica com máquinas profissionais e tesoura japonesa para textura e caimento.', estimatedMinutes: 20 },
      { step: 4, title: 'Acabamento do Pezinho na Navalha', detail: 'Contorno cirúrgico na lâmina descartável com gel de precisão para contorno perfeito.', estimatedMinutes: 10 },
      { step: 5, title: 'Secagem & Pomada Matte Premium', detail: 'Finalização térmica e aplicação de pomada com efeito natural e fixação flexível para o dia todo.', estimatedMinutes: 5 }
    ]
  },
  {
    id: 'srv-2',
    name: 'Corte Social Clássico Executivo',
    category: 'hair',
    description: 'Corte feito na tesoura e máquina para o homem que preza por elegância e alinhamento clássico impecável para reuniões e eventos.',
    durationMin: 40,
    price: 65,
    features: ['Lavagem refrescante', 'Acabamento minucioso na tesoura', 'Secagem e alinhamento'],
    processes: [
      { step: 1, title: 'Alinhamento de Proporção Clássica', detail: 'Definição da linha de divisão (side part, pompadour ou militar elegante) conforme o perfil do cliente.', estimatedMinutes: 5 },
      { step: 2, title: 'Corte Técnico na Tesoura', detail: 'Lapidação ponto a ponto respeitando a direção natural de crescimento dos fios.', estimatedMinutes: 20 },
      { step: 3, title: 'Contornos & Costeletas na Navalha', detail: 'Limpeza e simetria de nuca e costeletas com navalhete de aço e lâmina descartável.', estimatedMinutes: 10 },
      { step: 4, title: 'Lavagem & Tônico Capilar Fortalecedor', detail: 'Higienização final com loção tônica e escovação modelada.', estimatedMinutes: 5 }
    ]
  },
  {
    id: 'srv-3',
    name: 'Barboterapia Completa com Toalha Quente',
    category: 'beard',
    description: 'O ritual clássico masculino: aplicação de óleos essenciais pré-barba, toalha quente vaporizada, lâmina descartável de alta precisão, massagem facial e pós-barba balsâmico.',
    durationMin: 40,
    price: 60,
    popular: true,
    features: ['Toalha quente aromática', 'Óleos e bálsamos nobres', 'Massagem facial relaxante'],
    processes: [
      { step: 1, title: 'Aplicação de Óleo Essencial Pré-Barba', detail: 'Nutrição dos fios e camada protetora na pele com óleo de copaíba e alecrim.', estimatedMinutes: 5 },
      { step: 2, title: 'Toalha Quente Vaporizada com Aromaterapia', detail: 'Vapor quente para abertura dos poros, amolecimento do pelo e relaxamento sensorial profundo.', estimatedMinutes: 10 },
      { step: 3, title: 'Espuma Térmica & Barbear Rente na Navalha', detail: 'Lâmina descartável de alta precisão deslizada sem irritações na direção correta do folículo.', estimatedMinutes: 15 },
      { step: 4, title: 'Toalha Fria de Fechamento de Poros', detail: 'Choque térmico suavizante que acalma a derme e previne foliculite.', estimatedMinutes: 5 },
      { step: 5, title: 'Massagem Facial com Bálsamo Pós-Barba', detail: 'Absorção de hidratante matte com propriedades cicatrizantes e fragrância amadeirada sutil.', estimatedMinutes: 5 }
    ]
  },
  {
    id: 'srv-4',
    name: 'Alinhamento & Desenho de Barba',
    category: 'beard',
    description: 'Ajuste de volume, limpeza de contornos no maxilar e bochechas com máquina e navalha, finalizado com hidratação rápida de barba.',
    durationMin: 25,
    price: 45,
    features: ['Contorno simétrico a laser visual', 'Penteado e alinhamento dos fios', 'Óleo hidratante'],
    processes: [
      { step: 1, title: 'Mapeamento Visual das Linhas', detail: 'Alinhamento do desenho do maxilar, bochechas e bigode valorizando a mandíbula.', estimatedMinutes: 5 },
      { step: 2, title: 'Aparação de Volume & Pentes Especiais', detail: 'Remoção de pontas ressecadas e nivelamento da densidade dos fios.', estimatedMinutes: 10 },
      { step: 3, title: 'Contorno com Navalhete Descartável', detail: 'Limpeza precisa nas bordas e pescoço.', estimatedMinutes: 5 },
      { step: 4, title: 'Pente de Madeira & Óleo Nobre', detail: 'Escovação antiestática e hidratação com óleo de jojoba e cedro.', estimatedMinutes: 5 }
    ]
  },
  {
    id: 'srv-5',
    name: 'Combo O Imperador (Cabelo + Barba + Toalha)',
    category: 'combo',
    description: 'A experiência assinatura da Império Barber. Corte completo ao seu estilo + Barboterapia relaxante com toalha quente + sobrancelha de cortesia.',
    durationMin: 75,
    price: 120,
    popular: true,
    features: ['Economize R$ 15 no combo', 'Café especial ou cerveja artesanal', 'Sobrancelha inclusa'],
    processes: [
      { step: 1, title: 'Recepção VIP & Bebida Cortesia', detail: 'Acomodação na poltrona de couro com café espresso moído na hora ou cerveja artesanal gelada.', estimatedMinutes: 5 },
      { step: 2, title: 'Corte de Cabelo Completo & Fade Técnico', detail: 'Degradê impecável ou corte clássico na tesoura conforme seu desejo.', estimatedMinutes: 30 },
      { step: 3, title: 'Lavatório com Massagem & Shampoo Mentolado', detail: 'Remoção total dos resíduos e relaxamento muscular.', estimatedMinutes: 5 },
      { step: 4, title: 'Ritual Completo de Barboterapia', detail: 'Toalhas quentes aromáticas, óleo nobre, espuma morna e navalha descartável afiada.', estimatedMinutes: 25 },
      { step: 5, title: 'Design de Sobrancelha na Navalha', detail: 'Alinhamento discreto da sobrancelha masculina mantendo aspecto viril e natural.', estimatedMinutes: 5 },
      { step: 6, title: 'Finalização & Perfume de Barba', detail: 'Pomada matte de fixação média e balm hidratante finalizador.', estimatedMinutes: 5 }
    ]
  },
  {
    id: 'srv-6',
    name: 'Combo Executivo VIP (Corte + Barba + Spa)',
    category: 'combo',
    description: 'Para ocasiões especiais: Corte técnico, Barboterapia tradicional, higienização facial com argila negra e alinhamento capilar.',
    durationMin: 90,
    price: 160,
    features: ['Máscara facial detox', 'Lavagem aromaterapêutica', 'Atendimento privativo'],
    processes: [
      { step: 1, title: 'Recepção e Consulta de Visagismo Avançado', detail: 'Planejamento para reuniões, formaturas ou casamentos.', estimatedMinutes: 5 },
      { step: 2, title: 'Corte Capilar Técnico Personalizado', detail: 'Corte na tesoura e máquina com lavagem de luxo.', estimatedMinutes: 30 },
      { step: 3, title: 'Ritual de Barba com Dupla Toalha Quente', detail: 'Amolecimento máximo e barbear de mestre.', estimatedMinutes: 25 },
      { step: 4, title: 'Argila Negra & Máscara Facial Detox', detail: 'Desobstrução de poros, redução de oleosidade e renovação celular da pele masculina.', estimatedMinutes: 20 },
      { step: 5, title: 'Massagem Relaxante Cervical & Finalização', detail: 'Alívio de tensão nos ombros e pescoço com finalização completa de penteado.', estimatedMinutes: 10 }
    ]
  },
  {
    id: 'srv-7',
    name: 'Camuflagem de Grisalhos (Cabelo ou Barba)',
    category: 'treatment',
    description: 'Tonalização discreta e natural que atenua os fios brancos sem aspecto artificial de tintura. Rejuvenesce o visual mantendo a autenticidade.',
    durationMin: 30,
    price: 55,
    features: ['Tonalizante sem amônia', 'Efeito natural e gradual', 'Durabilidade de 20 a 30 dias'],
    processes: [
      { step: 1, title: 'Mapeamento de Tons & Densidade Branca', detail: 'Escolha do tom sem amônia para preservar a naturalidade.', estimatedMinutes: 5 },
      { step: 2, title: 'Aplicação Homogênea no Fio', detail: 'Aplicação com pincel técnico na raiz e pontas da barba ou cabelo.', estimatedMinutes: 10 },
      { step: 3, title: 'Tempo de Pausa & Neutralização', detail: 'Fixação de 10 minutos sem alterar a textura original do fio.', estimatedMinutes: 10 },
      { step: 4, title: 'Enxágue com Shampoo Reconstrutor', detail: 'Limpeza suave e aplicação de condicionador antioxidante.', estimatedMinutes: 5 }
    ]
  },
  {
    id: 'srv-8',
    name: 'Corte Infantil (Pequeno Lorde)',
    category: 'hair',
    description: 'Atendimento paciente e cuidadoso para crianças a partir de 2 anos, em cadeira adaptada com ambiente descontraído e brinde no final.',
    durationMin: 35,
    price: 55,
    features: ['Ambiente acolhedor', 'Paciência e técnica lúdica', 'Penteado estilizado'],
    processes: [
      { step: 1, title: 'Acolhimento Lúdico e Conexão', detail: 'Interação amistosa para deixar a criança confortável e confiante.', estimatedMinutes: 5 },
      { step: 2, title: 'Corte Suave e Ágil', detail: 'Uso de máquinas silenciosas e tesouras de ponta arredondada segura.', estimatedMinutes: 20 },
      { step: 3, title: 'Penteado Estiloso Infantil', detail: 'Secagem rápida e gel aromático infantil suave.', estimatedMinutes: 5 },
      { step: 4, title: 'Entrega do Brinde "Pequeno Lorde"', detail: 'Entrega de certificado simbólico e pirulito/doce especial com aprovação dos pais.', estimatedMinutes: 5 }
    ]
  }
];

export const INITIAL_BARBERS: Barber[] = [
  {
    id: 'barber-1',
    name: 'Elias "Mestre" Castro',
    title: 'Master Barber & Visagista',
    experienceYears: 12,
    specialty: 'Fade de Alta Precisão & Barba Terapêutica',
    rating: 4.98,
    reviewsCount: 384,
    bio: 'Mais de uma década aperfeiçoando a barbearia tradicional e cortes contemporâneos. Especialista em visagismo para valorizar o formato do rosto.',
    image: '/src/assets/images/barber_master_portrait_1791662205008.jpg'
  },
  {
    id: 'barber-2',
    name: 'Ricardo Silveira',
    title: 'Especialista em Cortes Clássicos & Tesoura',
    experienceYears: 9,
    specialty: 'Cortes Sociais, Pompadour & Penteados',
    rating: 4.95,
    reviewsCount: 290,
    bio: 'Formado em academias de ponta, focado na harmonia e caimento natural dos fios com tesoura de alta linha.',
    image: '/src/assets/images/barber_cutting_hair_1791662174914.jpg'
  },
  {
    id: 'barber-3',
    name: 'Matheus Fontes',
    title: 'Terapeuta de Barba & Cuidados Faciais',
    experienceYears: 7,
    specialty: 'Barboterapia com Toalha Quente & Pigmentação',
    rating: 4.97,
    reviewsCount: 245,
    bio: 'Dedicado ao bem-estar e saúde da pele masculina. Transforma a manutenção da barba em um momento relaxante único.',
    image: '/src/assets/images/barber_beard_treatment_1791662183239.jpg'
  },
  {
    id: 'barber-4',
    name: 'Gabriel "Biel" Mendes',
    title: 'Especialista em Freestyle & Tendências',
    experienceYears: 6,
    specialty: 'Skin Fade, Texturização & Desenhos',
    rating: 4.92,
    reviewsCount: 210,
    bio: 'Criatividade aliada à precisão milimétrica. Antenado nas principais referências mundiais de street style e degradês modernos.',
    image: '/src/assets/images/hero_barbershop_luxury_1791662165371.jpg'
  }
];

// Helper to get formatted date string for today and neighboring days
const today = new Date();
const formatDate = (daysOffset: number = 0) => {
  const d = new Date();
  d.setDate(today.getDate() + daysOffset);
  return d.toISOString().split('T')[0];
};

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-101',
    protocolNumber: 'IMP-8492',
    clientName: 'Dr. Fernando Vasconcelos',
    clientPhone: '(11) 98765-4321',
    clientNotes: 'Prefere café expresso sem açúcar na recepção',
    serviceId: 'srv-5',
    serviceName: 'Combo O Imperador (Cabelo + Barba + Toalha)',
    barberId: 'barber-1',
    barberName: 'Elias "Mestre" Castro',
    date: formatDate(0),
    time: '09:30',
    price: 120,
    durationMin: 75,
    paymentMethod: 'pix',
    paymentStatus: 'paid',
    status: 'completed',
    createdAt: '2026-10-09T18:20:00Z'
  },
  {
    id: 'apt-102',
    protocolNumber: 'IMP-8493',
    clientName: 'Guilherme Alencar',
    clientPhone: '(11) 97654-3210',
    clientNotes: 'Degradê na zero bem disfarçado',
    serviceId: 'srv-1',
    serviceName: 'Corte Imperial Fade & Styling',
    barberId: 'barber-2',
    barberName: 'Ricardo Silveira',
    date: formatDate(0),
    time: '10:30',
    price: 75,
    durationMin: 45,
    paymentMethod: 'credit_card',
    paymentStatus: 'pending_on_counter',
    status: 'in_progress',
    createdAt: '2026-10-10T08:15:00Z'
  },
  {
    id: 'apt-103',
    protocolNumber: 'IMP-8494',
    clientName: 'Marcio Henrique Pinheiro',
    clientPhone: '(11) 99123-5566',
    clientNotes: 'Pele sensível com lâmina na garganta',
    serviceId: 'srv-3',
    serviceName: 'Barboterapia Completa com Toalha Quente',
    barberId: 'barber-3',
    barberName: 'Matheus Fontes',
    date: formatDate(0),
    time: '11:15',
    price: 60,
    durationMin: 40,
    paymentMethod: 'pix',
    paymentStatus: 'paid',
    status: 'confirmed',
    createdAt: '2026-10-10T09:00:00Z'
  },
  {
    id: 'apt-104',
    protocolNumber: 'IMP-8495',
    clientName: 'Lucas Bernardes',
    clientPhone: '(11) 98455-7788',
    clientNotes: 'Corte clássico para casamento à noite',
    serviceId: 'srv-2',
    serviceName: 'Corte Social Clássico Executivo',
    barberId: 'barber-1',
    barberName: 'Elias "Mestre" Castro',
    date: formatDate(0),
    time: '14:00',
    price: 65,
    durationMin: 40,
    paymentMethod: 'debit_card',
    paymentStatus: 'pending_on_counter',
    status: 'confirmed',
    createdAt: '2026-10-08T14:40:00Z'
  },
  {
    id: 'apt-105',
    protocolNumber: 'IMP-8496',
    clientName: 'André Villas Boas',
    clientPhone: '(11) 97321-9900',
    serviceId: 'srv-6',
    serviceName: 'Combo Executivo VIP (Corte + Barba + Spa)',
    barberId: 'barber-4',
    barberName: 'Gabriel "Biel" Mendes',
    date: formatDate(0),
    time: '15:30',
    price: 160,
    durationMin: 90,
    paymentMethod: 'pix',
    paymentStatus: 'paid',
    status: 'confirmed',
    createdAt: '2026-10-09T11:10:00Z'
  },
  {
    id: 'apt-106',
    protocolNumber: 'IMP-8497',
    clientName: 'Rodrigo Sampaio',
    clientPhone: '(11) 98111-2233',
    serviceId: 'srv-4',
    serviceName: 'Alinhamento & Desenho de Barba',
    barberId: 'barber-3',
    barberName: 'Matheus Fontes',
    date: formatDate(0),
    time: '16:45',
    price: 45,
    durationMin: 25,
    paymentMethod: 'counter_cash',
    paymentStatus: 'pending_on_counter',
    status: 'confirmed',
    createdAt: '2026-10-10T07:30:00Z'
  },
  {
    id: 'apt-107',
    protocolNumber: 'IMP-8498',
    clientName: 'Thiago Nogueira',
    clientPhone: '(11) 99887-6655',
    serviceId: 'srv-5',
    serviceName: 'Combo O Imperador (Cabelo + Barba + Toalha)',
    barberId: 'barber-2',
    barberName: 'Ricardo Silveira',
    date: formatDate(1),
    time: '10:00',
    price: 120,
    durationMin: 75,
    paymentMethod: 'credit_card',
    paymentStatus: 'pending_on_counter',
    status: 'confirmed',
    createdAt: '2026-10-09T19:50:00Z'
  },
  {
    id: 'apt-108',
    protocolNumber: 'IMP-8499',
    clientName: 'Carlos Eduardo Ramos',
    clientPhone: '(11) 96543-2198',
    serviceId: 'srv-1',
    serviceName: 'Corte Imperial Fade & Styling',
    barberId: 'barber-1',
    barberName: 'Elias "Mestre" Castro',
    date: formatDate(1),
    time: '11:30',
    price: 75,
    durationMin: 45,
    paymentMethod: 'pix',
    paymentStatus: 'paid',
    status: 'confirmed',
    createdAt: '2026-10-10T10:15:00Z'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't-1',
    name: 'Alexandre Prado',
    role: 'Diretor Comercial',
    rating: 5,
    comment: 'Frequento barbearias há mais de 15 anos e o padrão da Império Barber é impecável. A barboterapia com toalha quente é uma experiência sem igual. Atendimento pontual e cerveja sempre gelada.',
    date: 'Há 3 dias',
    serviceUsed: 'Combo O Imperador'
  },
  {
    id: 't-2',
    name: 'Dr. Leonardo Mattos',
    role: 'Médico Cirurgião',
    rating: 5,
    comment: 'Minha rotina é corrida e poder agendar pelo celular em menos de 1 minuto sabendo que serei atendido no minuto exato faz toda diferença. O Elias é um verdadeiro mestre no degradê e visagismo.',
    date: 'Há 1 semana',
    serviceUsed: 'Corte Imperial Fade'
  },
  {
    id: 't-3',
    name: 'Vinicius Toledo',
    role: 'Empresário',
    rating: 5,
    comment: 'O lounge de espera parece um clube de cavalheiros de Londres. Sofá de couro legítimo, café expresso moído na hora e profissionais que realmente entendem do que fazem.',
    date: 'Há 2 semanas',
    serviceUsed: 'Combo Executivo VIP'
  }
];

export const BUSINESS_INFO = {
  name: 'Império Barber',
  subtitle: 'Barbearia Premium & Clube Masculino',
  tagline: 'A arte da barbearia clássica com a sofisticação moderna',
  address: 'Av. Paulista, 1500 - Bela Vista / Jardins',
  city: 'São Paulo - SP',
  cep: '01310-200',
  phone: '(11) 3288-9000',
  whatsapp: '(11) 99876-5432',
  whatsappRaw: '5511998765432',
  instagram: '@imperiobarber.oficial',
  hours: [
    { day: 'Segunda a Sexta', time: '09:00 às 20:00' },
    { day: 'Sábado', time: '08:30 às 19:30' },
    { day: 'Domingo e Feriados', time: 'Plantão VIP sob reserva' }
  ],
  amenities: [
    { label: 'Pontualidade Britânica', desc: 'Sem atrasos, sua cadeira reservada' },
    { label: 'Cerveja & Café Cortesia', desc: 'Chopp artesanal e expresso especial' },
    { label: 'Toalhas Quentes A vapor', desc: 'Relaxamento e abertura dos poros' },
    { label: 'Manobrista Gratuito', desc: 'Estacionamento coberto no local' },
    { label: 'Wi-Fi de Alta Velocidade', desc: 'Ambiente preparado para executivos' },
    { label: 'Produtos Importados', desc: 'Linhas nobres para barba e cabelo' }
  ]
};

export const INITIAL_CLIENT_MEMORIES: ClientMemory[] = [
  {
    id: 'cli-1',
    name: 'Dr. Fernando Vasconcelos',
    phone: '(11) 98765-4321',
    email: 'fernando.vasconcelos@hospital.com.br',
    firstVisitDate: '2025-08-14',
    lastVisitDate: '2026-09-22',
    totalVisits: 14,
    totalSpent: 1680,
    preferredBarberId: 'barber-1',
    preferredBarberName: 'Elias "Mestre" Castro',
    favoriteDrink: 'Café expresso sem açúcar com água com gás',
    hairProfile: 'Cabelo fino liso, prefere degradê clássico médio (Mid Fade) com tesoura no topo para caimento lateral natural.',
    skinProfile: 'Pele sensível na curvatura do pescoço, foliculite se usar lâmina a seco. Exige toalha quente e pós-barba sem álcool.',
    conversationNotes: 'Médico cardiologista, gosta de silêncio e música ambiente suave. Aprecia pontualidade impecável.',
    aiSummary: 'Cliente VIP assíduo. Intervalo médio de retorno de 19 dias. Muito fiel ao barbeiro Elias.',
    aiNextSuggestedVisitDays: 3,
    serviceHistory: [
      { date: '2026-09-22', serviceName: 'Combo O Imperador (Cabelo + Barba + Toalha)', barberName: 'Elias "Mestre" Castro', price: 120, notes: 'Ajuste de visagismo nas costeletas' },
      { date: '2026-09-02', serviceName: 'Corte Imperial Fade & Styling', barberName: 'Elias "Mestre" Castro', price: 75 },
      { date: '2026-08-12', serviceName: 'Combo O Imperador (Cabelo + Barba + Toalha)', barberName: 'Elias "Mestre" Castro', price: 120 }
    ]
  },
  {
    id: 'cli-2',
    name: 'Guilherme Alencar',
    phone: '(11) 97654-3210',
    email: 'guialencar@fintech.io',
    firstVisitDate: '2026-01-10',
    lastVisitDate: '2026-09-28',
    totalVisits: 9,
    totalSpent: 675,
    preferredBarberId: 'barber-2',
    preferredBarberName: 'Ricardo Silveira',
    favoriteDrink: 'Chopp artesanal IPA bem gelado',
    hairProfile: 'Cabelo denso ondulado, degradê na zero bem disfarçado (Skin Fade), finalizado com pomada matte de alta fixação.',
    skinProfile: 'Pele normal, sem sensibilidade, aceita toalha quente e navalha tradicional.',
    conversationNotes: 'Empreendedor do mercado de tecnologia, gosta de bater papo sobre negócios e inovação.',
    aiSummary: 'Cliente pontual focado em degradê moderno. Retorna a cada 14 dias rigorosamente.',
    aiNextSuggestedVisitDays: 5,
    serviceHistory: [
      { date: '2026-09-28', serviceName: 'Corte Imperial Fade & Styling', barberName: 'Ricardo Silveira', price: 75 },
      { date: '2026-09-14', serviceName: 'Corte Imperial Fade & Styling', barberName: 'Ricardo Silveira', price: 75 }
    ]
  },
  {
    id: 'cli-3',
    name: 'Marcio Henrique Pinheiro',
    phone: '(11) 99123-5566',
    email: 'marcio.pinheiro@advocacia.com.br',
    firstVisitDate: '2025-11-05',
    lastVisitDate: '2026-09-15',
    totalVisits: 11,
    totalSpent: 1100,
    preferredBarberId: 'barber-3',
    preferredBarberName: 'Matheus Fontes',
    favoriteDrink: 'Café cappuccino com canela',
    hairProfile: 'Corte social clássico na tesoura, repartido de lado estilo executivo.',
    skinProfile: 'Barba cheia lenhador. Tratamento focado em nutrição com óleo vegetal e balm de cedro.',
    conversationNotes: 'Advogado corporativo. Frequenta antes de audiências importantes.',
    aiSummary: 'Focado em barboterapia de relaxamento. Valoriza a toalha vaporizada e alinhamento do bigode.',
    aiNextSuggestedVisitDays: 1,
    serviceHistory: [
      { date: '2026-09-15', serviceName: 'Barboterapia Completa com Toalha Quente', barberName: 'Matheus Fontes', price: 60 },
      { date: '2026-08-25', serviceName: 'Combo O Imperador', barberName: 'Matheus Fontes', price: 120 }
    ]
  },
  {
    id: 'cli-4',
    name: 'André Villas Boas',
    phone: '(11) 97321-9900',
    email: 'andre.villas@investments.com',
    firstVisitDate: '2026-03-20',
    lastVisitDate: '2026-09-10',
    totalVisits: 6,
    totalSpent: 960,
    preferredBarberId: 'barber-4',
    preferredBarberName: 'Gabriel "Biel" Mendes',
    favoriteDrink: 'Dose de whisky single malt ou água mineral com gás',
    hairProfile: 'Texturização moderna no topo e taper fade nas laterais.',
    skinProfile: 'Pele mista. Faz máscara facial detox com argila a cada 30 dias.',
    conversationNotes: 'Gosta de ouvir música lofi e manter discrição.',
    aiSummary: 'Cliente do Combo Executivo VIP. Ticket médio alto.',
    aiNextSuggestedVisitDays: 0,
    serviceHistory: [
      { date: '2026-09-10', serviceName: 'Combo Executivo VIP (Corte + Barba + Spa)', barberName: 'Gabriel "Biel" Mendes', price: 160 }
    ]
  }
];

