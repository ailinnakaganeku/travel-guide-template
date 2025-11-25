import { memo, useEffect, useMemo } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';

import { Location } from '../types/locations';
import { ensureLeafletIconsConfigured } from '../utils/leafletIcon';

import 'leaflet/dist/leaflet.css';

ensureLeafletIconsConfigured();

interface MapViewProps {
  locations: Location[];
  center: [number, number];
  zoom: number;
  selectedLocation: Location | null;
}

function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);

  return null;
}

function MapLifecycleManager() {
  const map = useMap();

  useEffect(() => {
    return () => {
      map.stop();
    };
  }, [map]);

  return null;
}

function MapViewComponent({ locations, center, zoom, selectedLocation }: MapViewProps) {
  const markers = useMemo(
    () =>
      locations.map((location) => ({
        id: location.id,
        position: [location.lat, location.lng] as [number, number],
        data: location
      })),
    [locations]
  );

  const highlightedPosition = useMemo(() => {
    if (!selectedLocation) {
      return null;
    }

    return [selectedLocation.lat, selectedLocation.lng] as [number, number];
  }, [selectedLocation]);

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className="h-full w-full rounded-xl shadow-lg"
      scrollWheelZoom={false}
      preferCanvas
    >
      <MapController center={center} zoom={zoom} />
      <MapLifecycleManager />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map((marker) => (
        <Marker key={marker.id} position={marker.position}>
          <Popup>
            <div className="p-2">
              <h3 className="font-bold text-base mb-2">{marker.data.name}</h3>
              <p className="text-sm text-gray-700 mb-2">{marker.data.description}</p>
              <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                {marker.data.category}
              </span>
            </div>
          </Popup>
        </Marker>
      ))}
      {highlightedPosition && (
        <Marker position={highlightedPosition} opacity={0.7} interactive={false} />
      )}
    </MapContainer>
  );
}

export default memo(MapViewComponent);
