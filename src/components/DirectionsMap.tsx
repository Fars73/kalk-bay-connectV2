import React, { useState, useRef, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsRenderer, InfoWindow, Autocomplete } from '@react-google-maps/api';
import { toast } from 'sonner';
import { CHURCH_LOCATION, DEFAULT_ZOOM, MAP_STYLES } from '../config/maps';
import { MapControls } from './map/MapControls';
import { ZoomControls } from './map/ZoomControls';
import type { TravelMode } from './map/types';

const DirectionsMap = () => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null);
  const [distance, setDistance] = useState<string>('');
  const [duration, setDuration] = useState<string>('');
  const [selectedMode, setSelectedMode] = useState<TravelMode>('DRIVING');
  const [showInfoWindow, setShowInfoWindow] = useState(true);
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  
  const originRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          toast.error('Unable to retrieve your location');
        }
      );
    }
  }, []);

  const calculateRoute = async () => {
    if (!originRef.current) {
      toast.error('Please enter your starting point');
      return;
    }

    const directionsService = new google.maps.DirectionsService();

    try {
      const results = await directionsService.route({
        origin: (originRef.current as any).getPlace().geometry.location,
        destination: CHURCH_LOCATION,
        travelMode: google.maps.TravelMode[selectedMode]
      });

      setDirectionsResponse(results);
      setDistance(results.routes[0].legs[0].distance?.text || '');
      setDuration(results.routes[0].legs[0].duration?.text || '');
    } catch (error) {
      toast.error('Error calculating route');
      console.error('Directions error:', error);
    }
  };

  const clearRoute = () => {
    setDirectionsResponse(null);
    setDistance('');
    setDuration('');
    if (originRef.current) {
      (originRef.current as any).value = '';
    }
  };

  return (
    <div className="relative h-[600px] w-full rounded-lg overflow-hidden shadow-lg">
      <LoadScript
        googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        libraries={['places']}
      >
        <GoogleMap
          center={CHURCH_LOCATION}
          zoom={DEFAULT_ZOOM}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          options={MAP_STYLES.default}
          onLoad={map => setMap(map)}
        >
          <Marker
            position={CHURCH_LOCATION}
            icon={{
              url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
            }}
          >
            {showInfoWindow && (
              <InfoWindow onCloseClick={() => setShowInfoWindow(false)}>
                <div>
                  <h3 className="font-semibold">Kalk Bay Community Church</h3>
                  <p className="text-sm">Join us for worship!</p>
                </div>
              </InfoWindow>
            )}
          </Marker>

          {userLocation && !directionsResponse && (
            <Marker
              position={userLocation}
              icon={{
                url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
              }}
            />
          )}

          {directionsResponse && (
            <DirectionsRenderer
              directions={directionsResponse}
              options={{
                suppressMarkers: true,
                polylineOptions: {
                  strokeColor: '#3B82F6',
                  strokeWeight: 6,
                }
              }}
            />
          )}

          <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 max-w-sm">
            <Autocomplete
              onLoad={autocomplete => {
                originRef.current = autocomplete;
              }}
            >
              <input
                type="text"
                placeholder="Enter your location"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </Autocomplete>
          </div>

          <MapControls
            onCalculateRoute={calculateRoute}
            onClearRoute={clearRoute}
            selectedMode={selectedMode}
            setSelectedMode={setSelectedMode}
            distance={distance}
            duration={duration}
          />

          <ZoomControls
            onZoomIn={() => map?.setZoom((map.getZoom() || 0) + 1)}
            onZoomOut={() => map?.setZoom((map.getZoom() || 0) - 1)}
          />
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default DirectionsMap;