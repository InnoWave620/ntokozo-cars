export interface Worker {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar: string;
  activeListings: number;
  totalSales: number;
  salesVolume: number;
}

export interface SaleRecord {
  id: string;
  vehicleId: string;
  vehicleName: string;
  price: number;
  buyerName: string;
  date: string;
  paymentType: 'Cash' | 'Installment Takeover';
  status: 'Pending' | 'Completed' | 'Finance Approval';
  agentName: string;
}

export const INITIAL_WORKERS: Worker[] = [
  {
    id: 'w001',
    name: 'Ntokozo Khumalo',
    role: 'Dealership Owner & Director',
    email: 'ntokozo@ntokozocars.co.za',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
    activeListings: 12,
    totalSales: 48,
    salesVolume: 18450000,
  },
  {
    id: 'w002',
    name: 'Lerato Mokoena',
    role: 'Senior Sales Consultant',
    email: 'lerato@ntokozocars.co.za',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
    activeListings: 8,
    totalSales: 32,
    salesVolume: 9200000,
  },
  {
    id: 'w003',
    name: 'Sipho Zulu',
    role: 'Installment Finance Officer',
    email: 'sipho@ntokozocars.co.za',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80',
    activeListings: 4,
    totalSales: 19,
    salesVolume: 5100000,
  },
];

export const INITIAL_SALES: SaleRecord[] = [
  {
    id: 's001',
    vehicleId: 'v001',
    vehicleName: 'BMW 3 Series 320i M Sport',
    price: 345000,
    buyerName: 'Thabo Maseko',
    date: '2026-07-15',
    paymentType: 'Installment Takeover',
    status: 'Finance Approval',
    agentName: 'Sipho Zulu',
  },
  {
    id: 's002',
    vehicleId: 'v002',
    vehicleName: 'Mercedes-Benz C-Class C200',
    price: 420000,
    buyerName: 'Nomvula Dlamini',
    date: '2026-07-12',
    paymentType: 'Cash',
    status: 'Completed',
    agentName: 'Lerato Mokoena',
  },
  {
    id: 's003',
    vehicleId: 'v003',
    vehicleName: 'Volkswagen Golf 8 GTI',
    price: 580000,
    buyerName: 'Kabelo Modise',
    date: '2026-07-10',
    paymentType: 'Cash',
    status: 'Completed',
    agentName: 'Ntokozo Khumalo',
  },
  {
    id: 's004',
    vehicleId: 'v004',
    vehicleName: 'Audi A4 35 TFSI S Line',
    price: 389000,
    buyerName: 'Zama Buthelezi',
    date: '2026-07-05',
    paymentType: 'Installment Takeover',
    status: 'Pending',
    agentName: 'Sipho Zulu',
  },
  {
    id: 's005',
    vehicleId: 'v006',
    vehicleName: 'Ford Ranger 2.0 Bi-Turbo',
    price: 520000,
    buyerName: 'Pieter Cronje',
    date: '2026-06-28',
    paymentType: 'Cash',
    status: 'Completed',
    agentName: 'Lerato Mokoena',
  },
];
