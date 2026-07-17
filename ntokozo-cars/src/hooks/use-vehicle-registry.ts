import { useState, useEffect } from 'react';
import { Vehicle } from '@/types/vehicle';
import { MOCK_VEHICLES } from '@/data/vehicles';

// Singleton shared memory state outside the hook
let activeListings: Vehicle[] = [...MOCK_VEHICLES];
let pendingListings: Vehicle[] = [
  // Seed with one initial pending vehicle to test approval immediately
  {
    id: 'p001',
    brand: 'Mercedes-Benz',
    model: 'A-Class A200 AMG Line',
    year: 2022,
    price: 495000,
    listingType: 'Standard Sale',
    mileage: 28000,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    engine: '1.3L Turbo',
    colour: 'Polar White',
    province: 'Gauteng',
    photos: ['https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=600&q=80'],
    description: 'Beautiful white A200 with full AMG kit. Owner relocating. Full service history with Mercedes-Benz.',
    features: ['AMG Line Pack', 'Panoramic Sunroof', 'MBUX Infotainment', 'Reverse Camera'],
  },
];

const listeners = new Set<() => void>();

const notifyListeners = () => {
  listeners.forEach((listener) => listener());
};

export function useVehicleRegistry() {
  const [active, setActive] = useState<Vehicle[]>(activeListings);
  const [pending, setPending] = useState<Vehicle[]>(pendingListings);

  useEffect(() => {
    const updateState = () => {
      setActive([...activeListings]);
      setPending([...pendingListings]);
    };

    listeners.add(updateState);
    // Sync initial state
    updateState();

    return () => {
      listeners.delete(updateState);
    };
  }, []);

  const submitVehicle = (vehicle: Omit<Vehicle, 'id'>) => {
    const newPending: Vehicle = {
      ...vehicle,
      id: `p00${pendingListings.length + 1}`,
    };
    pendingListings.push(newPending);
    notifyListeners();
  };

  const approveVehicle = (id: string, verifiedPrice: number) => {
    const vehicleIndex = pendingListings.findIndex((v) => v.id === id);
    if (vehicleIndex === -1) return;

    const vehicle = pendingListings[vehicleIndex];
    const approvedVehicle: Vehicle = {
      ...vehicle,
      id: `v00${activeListings.length + 13}`, // Offset to avoid clash with mock vehicles
      price: verifiedPrice, // Apply verified evaluation price
    };

    // Remove from pending list
    pendingListings.splice(vehicleIndex, 1);
    // Add to public catalog
    activeListings.push(approvedVehicle);
    notifyListeners();
  };

  return {
    activeListings: active,
    pendingListings: pending,
    submitVehicle,
    approveVehicle,
  };
}
export function getActiveListings() {
  return activeListings;
}
export function getPendingListings() {
  return pendingListings;
}
