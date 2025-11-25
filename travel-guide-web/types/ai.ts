import { CityId, Location } from './locations';

export type TravelPace = 'relaxed' | 'balanced' | 'fast';
export type TravelStyle = 'family' | 'culture' | 'foodie' | 'nightlife';

export interface AiPreferences {
  days: number;
  pace: TravelPace;
  style: TravelStyle;
  interests: string[];
}

export interface SimplifiedLocationReference {
  id: string;
  name: string;
  lat: number;
  lng: number;
  category: Location['category'];
}

export interface AiLocationSuggestion extends Location {
  source: 'ai';
  reason: string;
  confidence: number;
}

export interface AiItineraryRequestPayload {
  cityId: CityId;
  cityName: string;
  preferences: AiPreferences;
  existingLocations: SimplifiedLocationReference[];
}

export interface AiItineraryResponse {
  locations: AiLocationSuggestion[];
  metadata?: {
    model?: string;
    total_duration?: number;
    prompt_eval_count?: number;
    eval_count?: number;
  };
}

