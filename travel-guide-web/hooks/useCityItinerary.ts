import { useCallback, useMemo, useState } from 'react';

import { CITY_IDS, cityConfigs } from '@/data/cities';
import { cityLocations } from '@/data/locations';
import { CityDefinition, CityId, Location } from '@/types/locations';

interface UseCityItineraryReturn {
  selectedCity: CityId;
  cityConfig: CityDefinition;
  locations: Location[];
  availableCities: CityDefinition[];
  changeCity: (city: CityId) => void;
}

export function useCityItinerary(initialCity: CityId = 'madrid'): UseCityItineraryReturn {
  const [selectedCity, setSelectedCity] = useState<CityId>(initialCity);

  const changeCity = useCallback((city: CityId) => {
    setSelectedCity(city);
  }, []);

  const cityConfig = useMemo(() => cityConfigs[selectedCity], [selectedCity]);
  const locations = useMemo(() => cityLocations[selectedCity], [selectedCity]);
  const availableCities = useMemo<CityDefinition[]>(
    () => CITY_IDS.map((cityId) => cityConfigs[cityId]),
    []
  );

  return {
    selectedCity,
    cityConfig,
    locations,
    availableCities,
    changeCity
  };
}

