import { useCallback, useMemo, useRef, useState } from 'react';

import {
  AiItineraryRequestPayload,
  AiItineraryResponse,
  AiLocationSuggestion,
  AiPreferences
} from '@/types/ai';
import { CityId, Location } from '@/types/locations';

type RequestStatus = 'idle' | 'loading' | 'success' | 'error';

const API_BASE_URL = (process.env.NEXT_PUBLIC_AI_API_URL ?? 'http://localhost:4000').replace(
  /\/$/,
  ''
);
const ITINERARY_ENDPOINT = `${API_BASE_URL}/api/ai/itinerary`;

interface UseAiItinerarySuggestionsOptions {
  cityId: CityId;
  cityName: string;
  locations: Location[];
}

interface UseAiItinerarySuggestionsReturn {
  suggestions: AiLocationSuggestion[];
  status: RequestStatus;
  error: string | null;
  lastUpdated: number | null;
  requestSuggestions: (preferences: AiPreferences) => Promise<void>;
}

export function useAiItinerarySuggestions({
  cityId,
  cityName,
  locations
}: UseAiItinerarySuggestionsOptions): UseAiItinerarySuggestionsReturn {
  const [suggestions, setSuggestions] = useState<AiLocationSuggestion[]>([]);
  const [status, setStatus] = useState<RequestStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const existingLocations = useMemo(
    () =>
      locations.map((location) => ({
        id: location.id,
        name: location.name,
        lat: location.lat,
        lng: location.lng,
        category: location.category
      })),
    [locations]
  );

  const requestSuggestions = useCallback(
    async (preferences: AiPreferences) => {
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setStatus('loading');
      setError(null);

      const payload: AiItineraryRequestPayload = {
        cityId,
        cityName,
        preferences,
        existingLocations
      };

      try {
        const response = await fetch(ITINERARY_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload),
          signal: controller.signal
        });

        if (!response.ok) {
          const errorPayload = await response.json().catch(() => null);
          throw new Error(errorPayload?.message || 'AI server responded with an error.');
        }

        const result = (await response.json()) as AiItineraryResponse;
        setSuggestions(result.locations ?? []);
        setStatus('success');
        setLastUpdated(Date.now());
      } catch (requestError) {
        if ((requestError as Error).name === 'AbortError') {
          return;
        }
        setStatus('error');
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Unexpected error requesting AI suggestions.'
        );
      }
    },
    [cityId, cityName, existingLocations]
  );

  return {
    suggestions,
    status,
    error,
    lastUpdated,
    requestSuggestions
  };
}

