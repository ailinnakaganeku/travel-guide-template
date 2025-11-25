import { useCallback, useEffect, useMemo, useState } from 'react';

import { Location } from '../types/locations';

interface UseSelectedLocationReturn {
  selectedLocation: Location | null;
  selectLocation: (location: Location) => void;
  clearSelection: () => void;
}

export function useSelectedLocation(locations: Location[]): UseSelectedLocationReturn {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectLocation = useCallback((location: Location) => {
    setSelectedId(location.id);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedId(null);
  }, []);

  useEffect(() => {
    if (!selectedId) {
      return;
    }

    const stillExists = locations.some((location) => location.id === selectedId);
    if (!stillExists) {
      setSelectedId(null);
    }
  }, [locations, selectedId]);

  const selectedLocation = useMemo(
    () => locations.find((location) => location.id === selectedId) ?? null,
    [locations, selectedId]
  );

  return {
    selectedLocation,
    selectLocation,
    clearSelection
  };
}

