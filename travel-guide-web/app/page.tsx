'use client';

import { useMemo } from 'react';
import { Download } from 'lucide-react';

import AiSuggestionsPanel from '@/components/AiSuggestionsPanel';
import CityToggle from '@/components/CityToggle';
import LocationsList from '@/components/LocationsList';
import MapView from '@/components/MapView';
import { useCityItinerary } from '@/hooks/useCityItinerary';
import { useItineraryExport } from '@/hooks/useItineraryExport';
import { useSelectedLocation } from '@/hooks/useSelectedLocation';

export default function HomePage() {
  const { selectedCity, cityConfig, locations, availableCities, changeCity } = useCityItinerary();
  const { selectedLocation, selectLocation } = useSelectedLocation(locations);
  const handleDownloadPDF = useItineraryExport(cityConfig.name, locations);

  const locationCount = useMemo(() => locations.length, [locations]);
  const spotLabel = locationCount === 1 ? 'spot' : 'spots';
  const isDownloadDisabled = locationCount === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 space-y-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">Spain Travel Guide</h1>
          </div>
        </div>

        <CityToggle cities={availableCities} selectedCity={selectedCity} onCityChange={changeCity} />

        <AiSuggestionsPanel
          cityId={selectedCity}
          cityName={cityConfig.name}
          locations={locations}
          accentColor={cityConfig.theme.accent}
        />

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="h-[320px] md:h-[420px] lg:h-full bg-white rounded-xl shadow-lg p-4">
              <MapView
                locations={locations}
                center={cityConfig.center}
                zoom={cityConfig.zoom}
                selectedLocation={selectedLocation}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Must-Visit Places</h2>
                <span className="bg-gradient-to-r from-orange-500 to-rose-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {locationCount} {spotLabel}
                </span>
              </div>
              <button
                onClick={handleDownloadPDF}
                disabled={isDownloadDisabled}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-lg"
              >
                <Download className="w-6 h-6" />
                Download Offline Itinerary
              </button>
              <p className="text-sm text-gray-500 mt-2 text-center">Save as PDF for offline access</p>
            </div>

            <div className="max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              <LocationsList
                locations={locations}
                onLocationClick={selectLocation}
                cityAccent={cityConfig.theme.accent}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
