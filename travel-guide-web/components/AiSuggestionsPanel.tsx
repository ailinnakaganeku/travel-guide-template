'use client';

import { FormEvent, useMemo, useState } from 'react';
import { Brain, Sparkles } from 'lucide-react';

import { useAiItinerarySuggestions } from '@/hooks/useAiItinerarySuggestions';
import { AiPreferences, TravelPace, TravelStyle } from '@/types/ai';
import { CityId, Location } from '@/types/locations';

interface AiSuggestionsPanelProps {
  cityId: CityId;
  cityName: string;
  locations: Location[];
  accentColor: string;
}

const INTERESTS = [
  'art & culture',
  'architecture',
  'foodie finds',
  'family fun',
  'nightlife',
  'outdoors'
] as const;

const paceOptions: { value: TravelPace; label: string }[] = [
  { value: 'relaxed', label: 'Relaxed' },
  { value: 'balanced', label: 'Balanced' },
  { value: 'fast', label: 'Fast' }
];

const styleOptions: { value: TravelStyle; label: string }[] = [
  { value: 'family', label: 'Family' },
  { value: 'culture', label: 'Culture Lovers' },
  { value: 'foodie', label: 'Foodies' },
  { value: 'nightlife', label: 'Nightlife' }
];

export default function AiSuggestionsPanel({
  cityId,
  cityName,
  locations,
  accentColor
}: AiSuggestionsPanelProps) {
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['art & culture']);
  const [pace, setPace] = useState<TravelPace>('balanced');
  const [style, setStyle] = useState<TravelStyle>('family');
  const [days, setDays] = useState(3);

  const { suggestions, status, error, lastUpdated, requestSuggestions } = useAiItinerarySuggestions({
    cityId,
    cityName,
    locations
  });

  const formDisabled = status === 'loading';

  const summaryText = useMemo(() => {
    if (!suggestions.length) {
      return 'Let AI scout complementary spots for this city.';
    }
    return `AI suggested ${suggestions.length} fresh places${lastUpdated ? ` · updated ${new Date(
      lastUpdated
    ).toLocaleTimeString()}` : ''}`;
  }, [suggestions.length, lastUpdated]);

  const handleToggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((item) => item !== interest) : [...prev, interest]
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const preferences: AiPreferences = {
      days,
      pace,
      style,
      interests: selectedInterests
    };
    requestSuggestions(preferences);
  };

  return (
    <section className="bg-white rounded-xl shadow-lg p-5 space-y-5">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-600">Interests</label>
          <div className="flex gap-2 overflow-x-auto pb-1 snap-x snap-mandatory" role="list">
            {INTERESTS.map((interest) => {
              const isSelected = selectedInterests.includes(interest);
              return (
                <button
                  key={interest}
                  type="button"
                  onClick={() => handleToggleInterest(interest)}
                  className={`px-3 py-1 rounded-full text-sm font-medium border transition whitespace-nowrap snap-start ${
                    isSelected
                      ? 'text-white shadow-md'
                      : 'text-gray-600 bg-white hover:border-gray-400'
                  }`}
                  style={
                    isSelected
                      ? { backgroundColor: accentColor, borderColor: accentColor }
                      : undefined
                  }
                  disabled={formDisabled}
                  role="listitem"
                >
                  {interest}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-12 lg:items-end">
          <label className="flex flex-col text-sm font-semibold text-gray-600 lg:col-span-3">
            Pace
            <select
              className="mt-1 rounded-lg border border-gray-200 px-3 py-2"
              value={pace}
              onChange={(event) => setPace(event.target.value as TravelPace)}
              disabled={formDisabled}
            >
              {paceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col text-sm font-semibold text-gray-600 lg:col-span-3">
            Style
            <select
              className="mt-1 rounded-lg border border-gray-200 px-3 py-2"
              value={style}
              onChange={(event) => setStyle(event.target.value as TravelStyle)}
              disabled={formDisabled}
            >
              {styleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col text-sm font-semibold text-gray-600 lg:col-span-2">
            Days
            <input
              type="number"
              min={1}
              max={7}
              value={days}
              onChange={(event) => setDays(Number(event.target.value) || 1)}
              className="mt-1 rounded-lg border border-gray-200 px-3 py-2"
              disabled={formDisabled}
            />
          </label>

          <div className="lg:col-span-4">
            <button
              type="submit"
              disabled={formDisabled}
              className="w-full bg-gray-900 text-white rounded-xl py-3 font-semibold flex items-center justify-center gap-2 hover:bg-gray-800 disabled:opacity-60"
            >
              <Sparkles className="w-4 h-4" />
              {status === 'loading' ? 'Asking Ollama...' : 'Generate with AI'}
            </button>
          </div>
        </div>
      </form>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">
          {error}
        </p>
      )}

      {suggestions.length > 0 && (
        <div className="space-y-3">
          {suggestions.map((suggestion) => (
            <article key={suggestion.id} className="border border-gray-100 rounded-xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-gray-800">{suggestion.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{suggestion.description}</p>
                </div>
                <span
                  className="text-xs font-semibold px-2 py-1 rounded-full"
                  style={{ backgroundColor: `${accentColor}22`, color: accentColor }}
                >
                  {suggestion.category}
                </span>
              </div>
              {suggestion.reason && (
                <p className="text-sm text-gray-500 mt-2">🤖 {suggestion.reason}</p>
              )}
              <div className="text-xs text-gray-400 mt-2">
                Confidence {(suggestion.confidence * 100).toFixed(0)}%
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

