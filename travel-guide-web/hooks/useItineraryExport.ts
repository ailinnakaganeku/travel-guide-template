import { useCallback } from 'react';

import { Location } from '@/types/locations';
import { generateItineraryPDF } from '@/utils/pdfGenerator';

export function useItineraryExport(cityName: string, locations: Location[]) {
  return useCallback(() => {
    if (!locations.length) {
      console.warn('Attempted to export an itinerary without locations.');
      return;
    }

    try {
      generateItineraryPDF(cityName, locations);
    } catch (error) {
      console.error('Failed to generate itinerary PDF', error);
    }
  }, [cityName, locations]);
}

