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

  if (filters.afstandPerRit) {
    // We expect the battery to handle at least a round trip without getting fully empty (comfort factor)
    result = result.filter(b => b.rangePractical >= filters.afstandPerRit! * 2);
  } else if (filters.minRange > 0) {
    result = result.filter(b => b.rangePractical >= filters.minRange);
  }

  if (filters.omgeving) {
    if (filters.omgeving === 'heuvelachtig') {
      result = result.filter(b => b.torque >= 50);
    } else if (filters.omgeving === 'onverhard') {
      result = result.filter(b => b.suitableFor.includes('off-road') || b.suitableFor.includes('sportief'));
    }
  }

  if (filters.frameSizes.length > 0) {
    result = result.filter(b => 
      b.availableFrameSizes?.some(size => filters.frameSizes.includes(size))
    );
  }

  if (filters.lichaamslengte) {
    const h = filters.lichaamslengte;
    result = result.filter(b => {
      // If we have rider height range in DB, use it
      if (b.minRiderHeight && b.maxRiderHeight) {
        return h >= b.minRiderHeight && h <= b.maxRiderHeight;
      }
      // Fallback: If we only have specific frame sizes, we can't be sure, but let's keep it visible
      return true;
    });
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
