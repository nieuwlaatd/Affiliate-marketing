import { EBike, FilterState } from './types';

export function getAllBrands(bikesList: EBike[]): string[] {
  const brands = [...new Set(bikesList.map((b) => b.brand))];
  return brands.sort();
}

export function filterBikes(bikesList: EBike[], filters: FilterState): EBike[] {
  let result = [...bikesList];

  result = result.filter(
    (b) => b.price >= filters.priceRange[0] && b.price <= filters.priceRange[1]
  );

  if (filters.brands.length > 0) {
    result = result.filter((b) => filters.brands.includes(b.brand));
  }

  if (filters.motorTypes.length > 0) {
    result = result.filter((b) => filters.motorTypes.includes(b.motorType));
  }

  if (filters.frameTypes.length > 0) {
    result = result.filter((b) => filters.frameTypes.includes(b.frameType));
  }

  if (filters.bikeClasses && filters.bikeClasses.length > 0) {
    result = result.filter((b) => b.bikeClass && filters.bikeClasses!.includes(b.bikeClass));
  }

  if (filters.hasThrottle) {
    result = result.filter((b) => b.hasThrottle === true);
  }

  if (filters.suitableFor.length > 0) {
    result = result.filter((b) =>
      filters.suitableFor.some((s) => b.suitableFor.includes(s as EBike['suitableFor'][number]))
    );
  }

  if (filters.distancePerRide) {
    // Battery should comfortably handle a round trip without fully draining
    result = result.filter((b) => b.rangePractical >= filters.distancePerRide! * 2);
  } else if (filters.minRange > 0) {
    result = result.filter((b) => b.rangePractical >= filters.minRange);
  }

  if (filters.terrain) {
    if (filters.terrain === 'hilly') {
      result = result.filter((b) => b.torque >= 50);
    } else if (filters.terrain === 'mixed') {
      result = result.filter((b) => b.torque >= 40);
    }
  }

  if (filters.heightRanges?.length > 0) {
    result = result.filter((b) => {
      // If we don't have height info for the bike, we can't filter positively
      if (!b.minRiderHeight && !b.maxRiderHeight) return true;

      return filters.heightRanges.some((range) => {
        let min = 0;
        let max = 999;

        if (range.startsWith('<')) {
          max = parseInt(range.substring(1));
        } else if (range.endsWith('+')) {
          min = parseInt(range.substring(0, range.length - 1));
        } else {
          const parts = range.split('-');
          min = parseInt(parts[0]);
          max = parseInt(parts[1]);
        }

        const bikeMin = b.minRiderHeight || 0;
        const bikeMax = b.maxRiderHeight || 999;

        return bikeMin <= max && bikeMax >= min;
      });
    });
  }

  if (filters.riderHeight) {
    const h = filters.riderHeight;
    result = result.filter((b) => {
      if (b.minRiderHeight && b.maxRiderHeight) {
        return h >= b.minRiderHeight && h <= b.maxRiderHeight;
      }
      return true;
    });
  }

  if (filters.foldable) {
    result = result.filter((b) => b.dimensions?.foldedSize && b.dimensions.foldedSize !== 'Yes');
  }

  if (filters.removableBattery) {
    result = result.filter((b) => b.batteryRemovable);
  }

  if (filters.maxBikeWeight && filters.maxBikeWeight > 0) {
    result = result.filter((b) => b.weight <= filters.maxBikeWeight!);
  }

  if (filters.suspensionTypes && filters.suspensionTypes.length > 0) {
    result = result.filter((b) => b.hasSuspension && filters.suspensionTypes!.includes(b.hasSuspension));
  }

  if (filters.minTopSpeed && filters.minTopSpeed > 0) {
    result = result.filter((b) => b.maxSpeedMph && b.maxSpeedMph >= filters.minTopSpeed!);
  }

  if (filters.wheelSizes && filters.wheelSizes.length > 0) {
    result = result.filter((b) => b.wheelSize && filters.wheelSizes!.includes(b.wheelSize));
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
