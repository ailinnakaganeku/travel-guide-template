import { memo } from 'react';
import { MapPin, Navigation } from 'lucide-react';

import { Location } from '../types/locations';

interface LocationsListProps {
  locations: Location[];
  onLocationClick: (location: Location) => void;
  cityAccent: string;
}

function LocationsListComponent({ locations, onLocationClick, cityAccent }: LocationsListProps) {
  if (!locations.length) {
    return (
      <div className="text-center text-gray-500 py-8" role="status">
        No locations available for this itinerary yet.
      </div>
    );
  }

  return (
    <div className="space-y-3" aria-live="polite">
      {locations.map((location) => (
        <button
          key={location.id}
          type="button"
          onClick={() => onLocationClick(location)}
          className="w-full text-left bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-4 border-l-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          style={{ borderLeftColor: cityAccent }}
        >
          <div className="flex items-start gap-3">
            <div
              className="p-2 rounded-lg text-white flex-shrink-0"
              style={{ backgroundColor: cityAccent }}
            >
              <MapPin className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg text-gray-800 mb-1">{location.name}</h3>
              <p className="text-sm text-gray-600 mb-2 leading-relaxed">{location.description}</p>
              <div className="flex items-center gap-2 text-xs font-medium" style={{ color: cityAccent }}>
                <Navigation className="w-3 h-3" aria-hidden="true" />
                <span>{location.category}</span>
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

export default memo(LocationsListComponent);
