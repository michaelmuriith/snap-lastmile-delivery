import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useDeliveryStore } from '../../stores/delivery.store';
import { websocketService } from '../../services/websocket';
import type { Delivery, LocationUpdate } from '../../types';

interface MapContainerProps {
  height?: string;
  showControls?: boolean;
  interactive?: boolean;
  deliveryId?: string;
  showAllDeliveries?: boolean;
  center?: google.maps.LatLngLiteral;
  zoom?: number;
}

// Google Maps API Key - defined in vite.config.ts
const GOOGLE_MAPS_API_KEY = (__GOOGLE_MAPS_API_KEY__ as string) || 'YOUR_API_KEY_HERE';
const MapComponent: React.FC<{
  center: google.maps.LatLngLiteral;
  zoom: number;
  deliveries: Delivery[];
  driverLocations: Map<string, LocationUpdate>;
  interactive: boolean;
  onMapLoad?: (map: google.maps.Map) => void;
}> = ({ center, zoom, deliveries, driverLocations, interactive, onMapLoad }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Map<string, google.maps.Marker>>(new Map());
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = new google.maps.Map(mapRef.current, {
      center,
      zoom,
      zoomControl: interactive,
      scrollwheel: interactive,
      draggable: interactive,
      disableDoubleClickZoom: !interactive,
      gestureHandling: interactive ? 'auto' : 'none',
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });

    googleMapRef.current = map;
    onMapLoad?.(map);

    return () => {
      // Cleanup markers
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current.clear();

      // Cleanup directions
      if (directionsRendererRef.current) {
        directionsRendererRef.current.setMap(null);
        directionsRendererRef.current = null;
      }
    };
  }, [center, zoom, interactive, onMapLoad]);

  // Update markers when deliveries change
  useEffect(() => {
    if (!googleMapRef.current) return;

    const map = googleMapRef.current;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current.clear();

    // Clear existing directions
    if (directionsRendererRef.current) {
      directionsRendererRef.current.setMap(null);
      directionsRendererRef.current = null;
    }

    deliveries.forEach(delivery => {
      // Pickup location
      if (delivery.pickupLatitude && delivery.pickupLongitude) {
        const pickupMarker = new google.maps.Marker({
          position: { lat: delivery.pickupLatitude, lng: delivery.pickupLongitude },
          map,
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="#ef4444" stroke="white" stroke-width="2"/>
                <circle cx="12" cy="12" r="6" fill="#ef4444"/>
              </svg>
            `),
            scaledSize: new google.maps.Size(24, 24),
            anchor: new google.maps.Point(12, 12)
          },
          title: 'Pickup Location'
        });

        const pickupInfoWindow = new google.maps.InfoWindow({
          content: `
            <div style="max-width: 200px;">
              <h3 style="font-weight: bold; margin-bottom: 8px;">Pickup Location</h3>
              <p style="margin: 4px 0; font-size: 14px; color: #666;">${delivery.pickupAddress}</p>
              <p style="margin: 4px 0; font-size: 14px;">Package: ${delivery.packageDescription}</p>
            </div>
          `
        });

        pickupMarker.addListener('click', () => {
          pickupInfoWindow.open(map, pickupMarker);
        });

        markersRef.current.set(`pickup-${delivery.id}`, pickupMarker);
      }

      // Delivery location
      if (delivery.deliveryLatitude && delivery.deliveryLongitude) {
        const deliveryMarker = new google.maps.Marker({
          position: { lat: delivery.deliveryLatitude, lng: delivery.deliveryLongitude },
          map,
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="#10b981" stroke="white" stroke-width="2"/>
                <circle cx="12" cy="12" r="6" fill="#10b981"/>
              </svg>
            `),
            scaledSize: new google.maps.Size(24, 24),
            anchor: new google.maps.Point(12, 12)
          },
          title: 'Delivery Location'
        });

        const deliveryInfoWindow = new google.maps.InfoWindow({
          content: `
            <div style="max-width: 200px;">
              <h3 style="font-weight: bold; margin-bottom: 8px;">Delivery Location</h3>
              <p style="margin: 4px 0; font-size: 14px; color: #666;">${delivery.deliveryAddress}</p>
              <p style="margin: 4px 0; font-size: 14px;">Recipient: ${delivery.recipientName || 'N/A'}</p>
            </div>
          `
        });

        deliveryMarker.addListener('click', () => {
          deliveryInfoWindow.open(map, deliveryMarker);
        });

        markersRef.current.set(`delivery-${delivery.id}`, deliveryMarker);
      }

      // Driver location (real-time)
      if (delivery.driverId) {
        const driverLocation = driverLocations.get(delivery.driverId);
        if (driverLocation) {
          const driverMarker = new google.maps.Marker({
            position: { lat: driverLocation.latitude, lng: driverLocation.longitude },
            map,
            icon: {
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="8" fill="#3b82f6" stroke="white" stroke-width="2"/>
                  <circle cx="16" cy="16" r="12" fill="none" stroke="#3b82f6" stroke-width="2" opacity="0.3">
                    <animate attributeName="r" values="12;18;12" dur="2s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite"/>
                  </circle>
                </svg>
              `),
              scaledSize: new google.maps.Size(32, 32),
              anchor: new google.maps.Point(16, 16)
            },
            title: 'Driver Location'
          });

          const driverInfoWindow = new google.maps.InfoWindow({
            content: `
              <div style="max-width: 200px;">
                <h3 style="font-weight: bold; margin-bottom: 8px;">Driver Location</h3>
                <p style="margin: 4px 0; font-size: 14px; color: #666;">Live tracking active</p>
                <p style="margin: 4px 0; font-size: 14px;">Last updated: ${new Date(driverLocation.timestamp).toLocaleTimeString()}</p>
              </div>
            `
          });

          driverMarker.addListener('click', () => {
            driverInfoWindow.open(map, driverMarker);
          });

          markersRef.current.set(`driver-${delivery.driverId}`, driverMarker);
        }
      }

      // Draw route if both pickup and delivery locations exist
      if (delivery.pickupLatitude && delivery.pickupLongitude &&
          delivery.deliveryLatitude && delivery.deliveryLongitude) {
        const directionsService = new google.maps.DirectionsService();
        const directionsRenderer = new google.maps.DirectionsRenderer({
          map,
          suppressMarkers: true,
          polylineOptions: {
            strokeColor: '#3b82f6',
            strokeWeight: 4,
            strokeOpacity: 0.7
          }
        });

        directionsRendererRef.current = directionsRenderer;

        const request: google.maps.DirectionsRequest = {
          origin: { lat: delivery.pickupLatitude, lng: delivery.pickupLongitude },
          destination: { lat: delivery.deliveryLatitude, lng: delivery.deliveryLongitude },
          travelMode: google.maps.TravelMode.DRIVING
        };

        directionsService.route(request, (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(result);
          }
        });
      }
    });

    // Fit map to show all markers
    if (markersRef.current.size > 0) {
      const bounds = new google.maps.LatLngBounds();
      markersRef.current.forEach(marker => {
        bounds.extend(marker.getPosition()!);
      });
      map.fitBounds(bounds);

      // Don't zoom in too much for single points
      const listener = google.maps.event.addListener(map, 'idle', () => {
        if (map.getZoom() && map.getZoom()! > 16) {
          map.setZoom(16);
        }
        google.maps.event.removeListener(listener);
      });
    }
  }, [deliveries, driverLocations]);

  return <div ref={mapRef} style={{ height: '100%', width: '100%' }} />;
};

const LoadingComponent = () => (
  <div className="flex items-center justify-center h-full">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
      <p className="text-sm text-muted-foreground">Loading map...</p>
    </div>
  </div>
);

const ErrorComponent = ({ error }: { error: string }) => (
  <div className="flex items-center justify-center h-full">
    <div className="text-center">
      <p className="text-destructive mb-2">Map Error</p>
      <p className="text-sm text-muted-foreground">{error}</p>
    </div>
  </div>
);

export const MapContainer: React.FC<MapContainerProps> = ({
  height = '400px',
  showControls = true,
  interactive = true,
  deliveryId,
  showAllDeliveries = false,
  center = { lat: -1.2864, lng: 36.8172 }, // Nairobi coordinates as default
  zoom = 12,
}) => {
  const { deliveries, currentDelivery } = useDeliveryStore();
  const [driverLocations, setDriverLocations] = useState<Map<string, LocationUpdate>>(new Map());
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);

  // Subscribe to real-time location updates
  useEffect(() => {
    if (deliveryId) {
      websocketService.subscribeToDelivery(deliveryId);

      const handleLocationUpdate = (update: LocationUpdate) => {
        setDriverLocations(prev => {
          const newLocations = new Map(prev);
          newLocations.set(update.driverId, update);
          return newLocations;
        });
      };

      websocketService.onLocationUpdate(handleLocationUpdate);

      return () => {
        websocketService.unsubscribeFromDelivery(deliveryId);
      };
    }
  }, [deliveryId]);

  const getDeliveriesToShow = useCallback((): Delivery[] => {
    if (deliveryId) {
      // Show specific delivery
      const delivery = deliveries.find(d => d.id === deliveryId) || currentDelivery;
      return delivery ? [delivery] : [];
    } else if (showAllDeliveries) {
      // Show all active deliveries
      return deliveries.filter(d =>
        ['assigned', 'picked_up', 'in_transit'].includes(d.status)
      );
    } else if (currentDelivery) {
      // Show current delivery
      return [currentDelivery];
    }
    return [];
  }, [deliveries, currentDelivery, deliveryId, showAllDeliveries]);

  const handleCenterOnDelivery = () => {
    if (mapInstance && currentDelivery?.pickupLatitude && currentDelivery?.pickupLongitude) {
      mapInstance.setCenter({ lat: currentDelivery.pickupLatitude, lng: currentDelivery.pickupLongitude });
      mapInstance.setZoom(15);
    }
  };

  const handleCenterOnDriver = () => {
    if (mapInstance && currentDelivery?.driverId) {
      const driverLocation = driverLocations.get(currentDelivery.driverId);
      if (driverLocation) {
        mapInstance.setCenter({ lat: driverLocation.latitude, lng: driverLocation.longitude });
        mapInstance.setZoom(16);
      }
    }
  };

  const handleMapLoad = useCallback((map: google.maps.Map) => {
    setMapInstance(map);
  }, []);

  const deliveriesToShow = getDeliveriesToShow();

  const renderMap = (status: Status) => {
    switch (status) {
      case Status.LOADING:
        return <LoadingComponent />;
      case Status.FAILURE:
        return <ErrorComponent error="Failed to load Google Maps. Please check your API key." />;
      case Status.SUCCESS:
        return (
          <MapComponent
            center={center}
            zoom={zoom}
            deliveries={deliveriesToShow}
            driverLocations={driverLocations}
            interactive={interactive}
            onMapLoad={handleMapLoad}
          />
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Live Map</CardTitle>
            <CardDescription>
              {deliveryId ? 'Track your delivery in real-time' :
               showAllDeliveries ? 'All active deliveries' :
               'Delivery locations and routes'}
            </CardDescription>
          </div>
          {showControls && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCenterOnDelivery}
                disabled={!currentDelivery}
              >
                Center on Delivery
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCenterOnDriver}
                disabled={!currentDelivery?.driverId || !driverLocations.has(currentDelivery.driverId)}
              >
                Track Driver
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative" style={{ height }}>
          <Wrapper
            apiKey={GOOGLE_MAPS_API_KEY}
            libraries={['places', 'geometry', 'drawing']}
            render={renderMap}
          />
          {deliveryId && (
            <div className="absolute top-2 left-2 z-20">
              <Badge variant="secondary" className="bg-white/90 text-black">
                🔴 Pickup • 🟢 Delivery • 🔵 Driver
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};