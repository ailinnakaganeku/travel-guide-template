import cors from 'cors';
import express, { Request, Response } from 'express';
import crypto from 'node:crypto';

type TravelPace = 'relaxed' | 'balanced' | 'fast';
type TravelStyle = 'family' | 'culture' | 'foodie' | 'nightlife';

type LocationCategory =
  | 'Museum'
  | 'Food & Drink'
  | 'Landmark'
  | 'Park'
  | 'Viewpoint'
  | 'Historic Site'
  | 'Shopping'
  | 'Religious Site'
  | 'Neighborhood';

interface AiPreferences {
  days: number;
  pace: TravelPace;
  style: TravelStyle;
  interests: string[];
}

interface SimplifiedLocationReference {
  id: string;
  name: string;
  lat: number;
  lng: number;
  category: LocationCategory | string;
}

interface AiLocationSuggestion extends SimplifiedLocationReference {
  description: string;
  reason: string;
  confidence: number;
  source: 'ai';
}

type AiItineraryRequest = Request<
  Record<string, string>,
  unknown,
  {
    cityId?: string;
    cityName?: string;
    preferences?: AiPreferences;
    existingLocations?: SimplifiedLocationReference[];
  }
>;

const paceDescriptions: Record<TravelPace, string> = {
  relaxed: '2 to 3 highlights per day with short walking distances and longer meal breaks',
  balanced: '3 to 4 highlights per day mixing indoor and outdoor activities',
  fast: '4+ highlights per day with efficient routing between districts'
};

const app = express();
const PORT = Number(process.env.SERVER_PORT ?? 4000);
const OLLAMA_URL = process.env.OLLAMA_URL ?? 'http://127.0.0.1:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? 'llama3.1';
const OLLAMA_TIMEOUT_MS = Number(process.env.OLLAMA_TIMEOUT_MS ?? 15000);

app.use(cors());
app.use(express.json({ limit: '1mb' }));

type ErrorCode =
  | 'INVALID_PAYLOAD'
  | 'UPSTREAM_UNAVAILABLE'
  | 'UPSTREAM_TIMEOUT'
  | 'UNEXPECTED_ERROR';

function respondWithError(
  res: Response,
  status: number,
  code: ErrorCode,
  message: string,
  details?: unknown
) {
  res.status(status).json({
    code,
    message,
    details
  });
}

function buildPrompt({
  cityName,
  preferences,
  existingLocations
}: {
  cityName: string;
  preferences: AiPreferences;
  existingLocations: SimplifiedLocationReference[];
}): string {
  const knownPlaces = existingLocations.length
    ? existingLocations
        .map((place) => `- ${place.name} (${place.category}) near ${place.lat},${place.lng}`)
        .join('\n')
    : 'None provided';

  return `You are an experienced Spanish travel planner creating family-friendly itineraries.
City: ${cityName}
Trip length: ${preferences.days} days
Travel pace: ${preferences.pace} -> ${paceDescriptions[preferences.pace]}
Traveler style: ${preferences.style}
Interests: ${preferences.interests.join(', ') || 'general sightseeing'}

Known locations already covered in the printed guide:
${knownPlaces}

Goal:
- Suggest up to 5 ADDITIONAL locations inside ${cityName} that complement the known list.
- Prioritize authentic, well-reviewed spots and include at least one food-related recommendation when interests include food.
- Favor places that match the interests and travel style.
- Provide concise reasons and approximate confidence (0.5 to 0.95).

Response format (valid JSON):
{
  "locations": [
    {
      "id": "string-slug",
      "name": "Place name",
      "description": "1-2 sentence description",
      "lat": number,
      "lng": number,
      "category": "Museum | Food & Drink | Landmark | Park | Viewpoint | Historic Site | Shopping | Religious Site | Neighborhood",
      "reason": "Why this fits the traveler",
      "confidence": 0.0-1.0
    }
  ]
}

Return ONLY the JSON object.`;
}

function extractJsonBlock(rawText?: string | null) {
  if (!rawText) return null;
  const start = rawText.indexOf('{');
  const end = rawText.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) return null;
  const candidate = rawText.slice(start, end + 1);
  try {
    return JSON.parse(candidate) as { locations?: Partial<AiLocationSuggestion>[] };
  } catch (error) {
    console.warn('Failed to parse Ollama response as JSON', error);
    return null;
  }
}

function normalizeLocations(locations?: Partial<AiLocationSuggestion>[]): AiLocationSuggestion[] {
  if (!Array.isArray(locations)) {
    return [];
  }

  return locations
    .map((location) => ({
      id: typeof location.id === 'string' ? location.id : `ai-${crypto.randomUUID()}`,
      name: location.name ?? 'Untitled location',
      description: location.description ?? '',
      lat: Number(location.lat),
      lng: Number(location.lng),
      category: location.category ?? 'Landmark',
      reason: location.reason ?? '',
      confidence: typeof location.confidence === 'number' ? location.confidence : 0.6,
      source: 'ai' as const
    }))
    .filter(
      (location) =>
        Number.isFinite(location.lat) &&
        Number.isFinite(location.lng) &&
        typeof location.name === 'string'
    );
}

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', model: OLLAMA_MODEL });
});

app.post('/api/ai/itinerary', async (req: AiItineraryRequest, res: Response) => {
  const { cityId, cityName, preferences, existingLocations } = req.body ?? {};

  if (!cityId || !cityName) {
    return respondWithError(res, 400, 'INVALID_PAYLOAD', 'cityId and cityName are required.');
  }

  if (!preferences?.pace || !preferences?.days) {
    return respondWithError(
      res,
      400,
      'INVALID_PAYLOAD',
      'preferences with pace and days are required.'
    );
  }

  const normalizedPreferences: AiPreferences = {
    days: Number(preferences.days) || 1,
    pace: preferences.pace,
    style: preferences.style,
    interests: Array.isArray(preferences.interests) ? preferences.interests : []
  };

  const prompt = buildPrompt({
    cityName,
    preferences: normalizedPreferences,
    existingLocations: Array.isArray(existingLocations) ? existingLocations : []
  });

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), OLLAMA_TIMEOUT_MS);

    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt,
        stream: false,
        options: {
          temperature: 0.3,
          top_p: 0.9
        }
      }),
      signal: controller.signal
    }).finally(() => clearTimeout(timeout));

    if (!response.ok) {
      const errorText = await response.text();
      return respondWithError(
        res,
        502,
        'UPSTREAM_UNAVAILABLE',
        'Failed to contact Ollama',
        errorText
      );
    }

    const payload = (await response.json()) as {
      response?: string;
      model?: string;
      total_duration?: number;
      prompt_eval_count?: number;
      eval_count?: number;
    };

    const parsed = extractJsonBlock(payload.response);
    const normalized = normalizeLocations(parsed?.locations);

    res.json({
      locations: normalized,
      metadata: {
        model: payload.model,
        total_duration: payload.total_duration,
        prompt_eval_count: payload.prompt_eval_count,
        eval_count: payload.eval_count
      }
    });
  } catch (error) {
    console.error('Unexpected error generating itinerary', error);
    if (error instanceof Error && error.name === 'AbortError') {
      return respondWithError(
        res,
        504,
        'UPSTREAM_TIMEOUT',
        `Ollama did not respond within ${OLLAMA_TIMEOUT_MS}ms`
      );
    }
    console.error('Unexpected error generating itinerary', error);
    respondWithError(
      res,
      500,
      'UNEXPECTED_ERROR',
      'Unexpected error generating itinerary',
      error instanceof Error ? error.message : String(error)
    );
  }
});

app.listen(PORT, () => {
  console.log(`AI itinerary service listening on http://localhost:${PORT}`);
});
