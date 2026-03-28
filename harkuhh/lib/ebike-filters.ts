import { EBike, FilterState } from './types';

export function getAllBrands(bikesList: EBike[]): string[] {
  const brands = [...new Set(bikesList.map(b => b.brand))];
  return brands.sort();
}

export function filterBikes(bikesList: EBike[], filters: FilterState): EBike[] {
  let result = [...bikesList];

  result = result.filter(b => b.price >= filters.priceRange[0] && b.price <= filters.priceRange[1]);

  if (filters.brands.length > 0) {
    result = result.filter(b => filters.brands.includes(b.brand));
  }

  if (filters.motorTypes.length > 0) {
    result = result.filter(b => filters.motorTypes.includes(b.motorType));
  }

  if (filters.frameTypes.length > 0) {
    result = result.filter(b => filters.frameTypes.includes(b.frameType));
  }

  if (filters.suitableFor.length > 0) {
    result = result.filter(b => filters.suitableFor.some(s => b.suitableFor.includes(s as EBike['suitableFor'][number])));
  }

  if (filters.minRange > 0) {
    result = result.filter(b => b.rangePractical >= filters.minRange);
  }

  switch (filters.sortBy) {
    case 'price-asc':
      result.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      result.sort((a, b) => b.price - a.price);
      break;
    case 'score':
      result.sort((a, b) => b.scoreOverall - a.scoreOverall);
      break;
    case 'range':
      result.sort((a, b) => b.rangePractical - a.rangePractical);
      break;
    case 'newest':
      result.sort((a, b) => b.year - a.year);
      break;
  }

  return result;
}
