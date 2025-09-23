import React, { useEffect, useRef, useState } from 'react';

interface GoogleMapsProps {
  pickupAddress: string;
  deliveryAddress: string;
  className?: string;
  onDistanceChange?: (distance: number, duration: string) => void;
}

export const GoogleMaps: React.FC<GoogleMapsProps> = React.memo(({
  pickupAddress,
  deliveryAddress,
  className = '',
  onDistanceChange
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiLoaded, setApiLoaded] = useState(false);

  // Load Google Maps API
  useEffect(() => {
    const loadGoogleMapsAPI = () => {
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

      if (!apiKey) {
        setError('Google Maps API key not configured');
        setIsLoading(false);
        return;
      }

      // Check if already loaded
      if (window.google && window.google.maps && window.google.maps.places) {
        setApiLoaded(true);
        setIsLoading(false);
        return;
      }

      // Check if script is already loading
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        // Wait for existing script
        const checkLoaded = () => {
          if (window.google && window.google.maps && window.google.maps.places) {
            setApiLoaded(true);
            setIsLoading(false);
          } else {
            setTimeout(checkLoaded, 100);
          }
        };
        checkLoaded();
        return;
      }

      // Load the script
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry&v=weekly`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        setApiLoaded(true);
        setIsLoading(false);
      };

      script.onerror = () => {
        setError('Failed to load Google Maps API');
        setIsLoading(false);
      };

      document.head.appendChild(script);
    };

    loadGoogleMapsAPI();
  }, []);

  // Initialize map when API is loaded
  useEffect(() => {
    if (!apiLoaded || !mapRef.current) return;

    try {
      // Initialize map centered on Nairobi
      const map = new google.maps.Map(mapRef.current, {
        center: { lat: -1.2864, lng: 36.8172 }, // Nairobi CBD
        zoom: 13,
        mapId: 'courier-flow-map', // Required for Advanced Markers
        styles: [
          {
            featureType: 'poi',
            stylers: [{ visibility: 'simplified' }]
          }
        ],
        disableDefaultUI: true,
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false
      });

      googleMapRef.current = map;
      directionsServiceRef.current = new google.maps.DirectionsService();
      directionsRendererRef.current = new google.maps.DirectionsRenderer({
        map,
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: '#1E40AF',
          strokeWeight: 4,
          strokeOpacity: 0.8
        }
      });

    } catch (err) {
      console.error('Error initializing map:', err);
      setError('Failed to initialize map');
    }
  }, [apiLoaded]);

  // Update map when addresses change
  useEffect(() => {
    if (!apiLoaded || !googleMapRef.current || !directionsServiceRef.current || !directionsRendererRef.current) return;

    const updateMap = async () => {
      try {
        // Clear existing directions
        directionsRendererRef.current!.setMap(null);
        directionsRendererRef.current!.setMap(googleMapRef.current);

        if (!pickupAddress && !deliveryAddress) {
          // Reset to Nairobi CBD
          googleMapRef.current!.setCenter({ lat: -1.2864, lng: 36.8172 });
          googleMapRef.current!.setZoom(13);
          return;
        }

        const geocoder = new google.maps.Geocoder();
        const markers: google.maps.marker.AdvancedMarkerElement[] = [];

        // Add pickup marker
        if (pickupAddress) {
          try {
            const pickupResult = await geocoder.geocode({
              address: pickupAddress + ', Nairobi, Kenya',
              componentRestrictions: { country: 'ke' }
            });

            if (pickupResult.results[0]) {
              const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

              const pickupMarker = new AdvancedMarkerElement({
                map: googleMapRef.current!,
                position: pickupResult.results[0].geometry.location,
                content: new PinElement({
                  background: '#1E40AF',
                  borderColor: '#ffffff',
                  glyphColor: '#ffffff',
                  glyph: 'P'
                }).element,
                title: `Pickup: ${pickupAddress}`
              });
              markers.push(pickupMarker);
            }
          } catch (err) {
            console.warn('Could not geocode pickup address:', err);
          }
        }

        // Add delivery marker
        if (deliveryAddress) {
          try {
            const deliveryResult = await geocoder.geocode({
              address: deliveryAddress + ', Nairobi, Kenya',
              componentRestrictions: { country: 'ke' }
            });

            if (deliveryResult.results[0]) {
              const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

              const deliveryMarker = new AdvancedMarkerElement({
                map: googleMapRef.current!,
                position: deliveryResult.results[0].geometry.location,
                content: new PinElement({
                  background: '#059669',
                  borderColor: '#ffffff',
                  glyphColor: '#ffffff',
                  glyph: 'D'
                }).element,
                title: `Delivery: ${deliveryAddress}`
              });
              markers.push(deliveryMarker);
            }
          } catch (err) {
            console.warn('Could not geocode delivery address:', err);
          }
        }

        // Calculate route if both addresses are available
        if (pickupAddress && deliveryAddress && markers.length >= 2) {
          const request: google.maps.DirectionsRequest = {
            origin: pickupAddress + ', Nairobi, Kenya',
            destination: deliveryAddress + ', Nairobi, Kenya',
            travelMode: google.maps.TravelMode.DRIVING,
            optimizeWaypoints: true,
            unitSystem: google.maps.UnitSystem.METRIC
          };

          try {
            const response = await directionsServiceRef.current!.route(request);
            directionsRendererRef.current!.setDirections(response);

            // Extract distance and duration
            if (response.routes[0]?.legs[0]) {
              const leg = response.routes[0].legs[0];
              const distanceInKm = leg.distance?.value ? leg.distance.value / 1000 : 0;
              const durationText = leg.duration?.text || 'Unknown';

              onDistanceChange?.(distanceInKm, durationText);
            }

            // Fit map to route bounds
            if (response.routes[0]) {
              googleMapRef.current!.fitBounds(response.routes[0].bounds);
            }
          } catch (err) {
            console.warn('Could not calculate route:', err);
            // Fit map to markers if route calculation fails
            if (markers.length > 0) {
              const bounds = new google.maps.LatLngBounds();
              markers.forEach(marker => {
                bounds.extend(marker.position as google.maps.LatLng);
              });
              googleMapRef.current!.fitBounds(bounds);
            }
          }
        } else if (markers.length > 0) {
          // Fit map to show all markers
          const bounds = new google.maps.LatLngBounds();
          markers.forEach(marker => {
            bounds.extend(marker.position as google.maps.LatLng);
          });
          googleMapRef.current!.fitBounds(bounds);
        }

      } catch (error) {
        console.error('Error updating map:', error);
      }
    };

    updateMap();
  }, [pickupAddress, deliveryAddress, apiLoaded, onDistanceChange]);

  if (isLoading) {
    return (
      <div className={`${className} bg-gray-100 rounded-lg flex items-center justify-center`}>
        <div className="text-center p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className} bg-gray-100 rounded-lg flex items-center justify-center`}>
        <div className="text-center p-6">
          <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
          </svg>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      className={`${className} rounded-lg`}
      style={{ minHeight: '300px' }}
      role="img"
      aria-label="Interactive map showing delivery route"
    />
  );
});