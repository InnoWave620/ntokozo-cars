import { useEffect, useState } from 'react';

import { useVehicleRegistry } from './use-vehicle-registry';
import { SearchFilters, Vehicle } from '@/types/vehicle';

export function useVehicles(filters?: SearchFilters) {
  const { activeListings } = useVehicleRegistry();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    let results = [...activeListings];

    if (filters) {
      if (filters.query) {
        const q = filters.query.toLowerCase();
        results = results.filter(
          (v) =>
            v.brand.toLowerCase().includes(q) ||
            v.model.toLowerCase().includes(q) ||
            v.colour.toLowerCase().includes(q) ||
            v.description.toLowerCase().includes(q),
        );
      }
      if (filters.brand) {
        results = results.filter((v) => v.brand === filters.brand);
      }
      if (filters.listingType) {
        results = results.filter((v) => v.listingType === filters.listingType);
      }
      if (filters.transmission) {
        results = results.filter((v) => v.transmission === filters.transmission);
      }
      if (filters.fuelType) {
        results = results.filter((v) => v.fuelType === filters.fuelType);
      }
      if (filters.province) {
        results = results.filter((v) => v.province === filters.province);
      }
      if (filters.priceMin !== undefined) {
        results = results.filter((v) => v.price >= filters.priceMin!);
      }
      if (filters.priceMax !== undefined) {
        results = results.filter((v) => v.price <= filters.priceMax!);
      }
      if (filters.mileageMax !== undefined) {
        results = results.filter((v) => v.mileage <= filters.mileageMax!);
      }
      if (filters.monthlyInstallmentMax !== undefined) {
        results = results.filter(
          (v) =>
            v.installment &&
            v.installment.monthlyInstallment <= filters.monthlyInstallmentMax!,
        );
      }
      if (filters.yearMin !== undefined) {
        results = results.filter((v) => v.year >= filters.yearMin!);
      }
      if (filters.yearMax !== undefined) {
        results = results.filter((v) => v.year <= filters.yearMax!);
      }
    }

    setVehicles(results);
  }, [
    filters?.query,
    filters?.brand,
    filters?.listingType,
    filters?.transmission,
    filters?.fuelType,
    filters?.province,
    filters?.priceMin,
    filters?.priceMax,
    filters?.mileageMax,
    filters?.monthlyInstallmentMax,
    filters?.yearMin,
    filters?.yearMax,
    activeListings,
  ]);

  return vehicles;
}
