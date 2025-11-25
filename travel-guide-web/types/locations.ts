export type Coordinates = [number, number];

export type CityId = 'madrid' | 'segovia';

export interface Location {
  id: string;
  name: string;
  description: string;
  lat: number;
  lng: number;
  category: string;
}

export interface CityTheme {
  accent: string;
  gradientFrom: string;
  gradientTo: string;
}

export interface CityDefinition {
  id: CityId;
  name: string;
  center: Coordinates;
  zoom: number;
  theme: CityTheme;
}

export type CityConfigMap = Record<CityId, CityDefinition>;

export type CityLocationMap = Record<CityId, Location[]>;
