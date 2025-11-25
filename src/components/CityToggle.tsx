import { MapPin } from 'lucide-react';

import { CityDefinition, CityId } from '../types/locations';

interface CityToggleProps {
  cities: CityDefinition[];
  selectedCity: CityId;
  onCityChange: (city: CityId) => void;
}

export default function CityToggle({ cities, selectedCity, onCityChange }: CityToggleProps) {
  if (!cities.length) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-2 flex gap-2" role="tablist" aria-label="Select city">
      {cities.map((city) => {
        const isActive = city.id === selectedCity;
        const buttonClasses =
          'flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-lg transition-all border focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-200';
        const commonStyles = isActive
          ? {
              color: '#fff',
              backgroundImage: `linear-gradient(135deg, ${city.theme.gradientFrom}, ${city.theme.gradientTo})`,
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.15)',
              borderColor: city.theme.accent
            }
          : {
              color: '#4b5563',
              backgroundColor: '#f3f4f6',
            };

        return (
          <button
            key={city.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onCityChange(city.id)}
            className={buttonClasses}
            style={commonStyles}
          >
            <MapPin className="w-5 h-5" aria-hidden="true" />
            {city.name}
          </button>
        );
      })}
    </div>
  );
}
