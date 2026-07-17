export type ListingType = 'Standard Sale' | 'Installment Takeover';

export type TransmissionType = 'Automatic' | 'Manual' | 'Semi-Automatic';
export type FuelType = 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';

export interface InstallmentDetails {
  monthlyInstallment: number;
  remainingTerm: number; // in months
  deposit: number;
  financeInstitution: string;
  balloonPayment?: number;
  settlementAmount: number;
  financeApprovalRequired: boolean;
}

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  transmission: TransmissionType;
  fuelType: FuelType;
  engine: string;
  colour: string;
  vin?: string;
  description: string;
  features: string[];
  photos: string[];
  listingType: ListingType;
  installment?: InstallmentDetails;
  province: string;
  isFeatured?: boolean;
}

export interface SearchFilters {
  brand?: string;
  model?: string;
  yearMin?: number;
  yearMax?: number;
  priceMin?: number;
  priceMax?: number;
  monthlyInstallmentMax?: number;
  mileageMax?: number;
  transmission?: TransmissionType | '';
  fuelType?: FuelType | '';
  province?: string;
  listingType?: ListingType | '';
  query?: string;
}

export interface EnquiryForm {
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
  message: string;
  vehicleId: string;
}

export interface InstallmentApplication {
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
  monthlyIncome: number;
  employmentStatus: 'Employed' | 'Self-Employed' | 'Unemployed';
  vehicleId: string;
}
