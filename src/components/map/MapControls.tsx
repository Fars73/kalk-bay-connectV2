import React from 'react';
import { Navigation2 } from 'lucide-react';
import { TravelModeSelector } from './TravelModeSelector';
import type { TravelMode } from './types';

interface MapControlsProps {
  onCalculateRoute: () => void;
  onClearRoute: () => void;
  selectedMode: TravelMode;
  setSelectedMode: (mode: TravelMode) => void;
  distance: string;
  duration: string;
}

export const MapControls: React.FC<MapControlsProps> = ({
  onCalculateRoute,
  onClearRoute,
  selectedMode,
  setSelectedMode,
  distance,
  duration
}) => {
  return (
    <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 max-w-sm">
      <div className="space-y-4">
        <TravelModeSelector
          selectedMode={selectedMode}
          onModeSelect={setSelectedMode}
        />

        <div className="flex space-x-2">
          <button
            onClick={onCalculateRoute}
            className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center"
          >
            <Navigation2 className="w-5 h-5 mr-2" />
            Get Directions
          </button>
          <button
            onClick={onClearRoute}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Clear
          </button>
        </div>

        {distance && duration && (
          <div className="text-sm space-y-1">
            <p>Distance: {distance}</p>
            <p>Duration: {duration}</p>
          </div>
        )}
      </div>
    </div>
  );
};