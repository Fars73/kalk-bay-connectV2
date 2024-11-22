import React from 'react';
import { Car, PersonStanding, Bike, Bus } from 'lucide-react';
import type { TravelMode } from './types';

interface TravelModeSelectorProps {
  selectedMode: TravelMode;
  onModeSelect: (mode: TravelMode) => void;
}

const TRAVEL_MODES: TravelMode[] = ['DRIVING', 'WALKING', 'BICYCLING', 'TRANSIT'];

const getTravelModeIcon = (mode: TravelMode) => {
  switch (mode) {
    case 'DRIVING':
      return <Car className="w-5 h-5" />;
    case 'WALKING':
      return <PersonStanding className="w-5 h-5" />;
    case 'BICYCLING':
      return <Bike className="w-5 h-5" />;
    case 'TRANSIT':
      return <Bus className="w-5 h-5" />;
  }
};

export const TravelModeSelector: React.FC<TravelModeSelectorProps> = ({
  selectedMode,
  onModeSelect,
}) => {
  return (
    <div className="flex space-x-2">
      {TRAVEL_MODES.map(mode => (
        <button
          key={mode}
          onClick={() => onModeSelect(mode)}
          className={`p-2 rounded-md flex items-center justify-center ${
            selectedMode === mode
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {getTravelModeIcon(mode)}
        </button>
      ))}
    </div>
  );
};