import { CityConfigMap, CityId } from '../types/locations';

export const CITY_IDS: CityId[] = ['madrid', 'segovia'];

export const cityConfigs: CityConfigMap = {
  madrid: {
    id: 'madrid',
    name: 'Madrid',
    center: [40.4168, -3.7038],
    zoom: 13,
    theme: {
      accent: '#f43f5e',
      gradientFrom: '#fb7185',
      gradientTo: '#f97316'
    }
  },
  segovia: {
    id: 'segovia',
    name: 'Segovia',
    center: [40.95, -4.1251],
    zoom: 14,
    theme: {
      accent: '#3b82f6',
      gradientFrom: '#38bdf8',
      gradientTo: '#6366f1'
    }
  }
};

