import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useDeliveryStore } from '../../stores/delivery.store';
import { useAuthStore } from '../../stores/auth.store';
import { websocketService } from '../../services/websocket';
import type { Delivery, LocationUpdate } from '../../types';

interface MapContainerProps {
  height?: string;
  showControls?: boolean;
  interactive?: boolean;
  deliveryId?: string;
  showAllDeliveries?: boolean;
  center?: [number, number];
  zoom?: number;
}

export const MapContainer: React.FC<MapContainerProps> = ({
  height = '400px',
  showControls = true,
  interactive = true,
  deliveryId,
  showAllDeliveries = false,
  center = [-1.2864, 36.8172], // Nairobi coordinates as default
  zoom = 12,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());
  const routeRef = useRef<any>(null);

  const { user } = useAuthStore();
  const { deliveries, currentDelivery } = useDeliveryStore();
  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);
  const [driverLocations, setDriverLocations] = useState<Map<string, LocationUpdate>>(new Map());

  // Initialize map
  useEffect(() => {
    const initializeMap = async () => {
      if (!mapRef.current) return;

      try {
        // Load Leaflet CSS and JS dynamically
        if (!document.querySelector('link[href*="leaflet"]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(link);
        }

        if (!(window as any).L) {
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          script.onload = () => initMap();
          document.head.appendChild(script);
        } else {
          initMap();
        }
      } catch (error) {
        setMapError('Failed to load map library');
        setIsLoading(false);
      }
    };

    const initMap = () => {
      if (!mapRef.current || !(window as any).L) return;

      const L = (window as any).L;

      // Create map instance
      const map = L.map(mapRef.current, {
        center,
        zoom,
        zoomControl: interactive,
        scrollWheelZoom: interactive,
        dragging: interactive,
        touchZoom: interactive,
        doubleClickZoom: interactive,
        boxZoom: interactive,
        keyboard: interactive,
      });

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
      setIsLoading(false);

      // Add markers based on props
      updateMarkers();
    };

    initializeMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [center, zoom]);

  // Update markers when deliveries change
  useEffect(() => {
    updateMarkers();
  }, [deliveries, currentDelivery, deliveryId, showAllDeliveries, driverLocations]);

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

  const updateMarkers = () => {
    if (!mapInstanceRef.current) return;

    const L = (window as any).L;
    const map = mapInstanceRef.current;

    // Clear existing markers
    markersRef.current.forEach(marker => map.removeLayer(marker));
    markersRef.current.clear();

    // Clear existing route
    if (routeRef.current) {
      map.removeLayer(routeRef.current);
      routeRef.current = null;
    }

    let deliveriesToShow: Delivery[] = [];

    if (deliveryId) {
      // Show specific delivery
      const delivery = deliveries.find(d => d.id === deliveryId) || currentDelivery;
      if (delivery) deliveriesToShow = [delivery];
    } else if (showAllDeliveries) {
      // Show all active deliveries
      deliveriesToShow = deliveries.filter(d =>
        ['assigned', 'picked_up', 'in_transit'].includes(d.status)
      );
    } else if (currentDelivery) {
      // Show current delivery
      deliveriesToShow = [currentDelivery];
    }

    // Add delivery markers
    deliveriesToShow.forEach(delivery => {
      // Pickup location
      if (delivery.pickupLatitude && delivery.pickupLongitude) {
        const pickupIcon = L.divIcon({
          html: '<div style="background-color: #ef4444; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>',
          className: 'custom-marker',
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });

        const pickupMarker = L.marker([delivery.pickupLatitude, delivery.pickupLongitude], { icon: pickupIcon })
          .addTo(map)
          .bindPopup(`
            <div class="p-2">
              <h3 class="font-semibold text-sm">Pickup Location</h3>
              <p class="text-xs text-gray-600">${delivery.pickupAddress}</p>
              <p class="text-xs">Package: ${delivery.packageDescription}</p>
            </div>
          `);

        markersRef.current.set(`pickup-${delivery.id}`, pickupMarker);
      }

      // Delivery location
      if (delivery.deliveryLatitude && delivery.deliveryLongitude) {
        const deliveryIcon = L.divIcon({
          html: '<div style="background-color: #10b981; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>',
          className: 'custom-marker',
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });

        const deliveryMarker = L.marker([delivery.deliveryLatitude, delivery.deliveryLongitude], { icon: deliveryIcon })
          .addTo(map)
          .bindPopup(`
            <div class="p-2">
              <h3 class="font-semibold text-sm">Delivery Location</h3>
              <p class="text-xs text-gray-600">${delivery.deliveryAddress}</p>
              <p class="text-xs">Recipient: ${delivery.recipientName || 'N/A'}</p>
            </div>
          `);

        markersRef.current.set(`delivery-${delivery.id}`, deliveryMarker);
      }

      // Driver location (real-time)
      if (delivery.driverId) {
        const driverLocation = driverLocations.get(delivery.driverId);
        if (driverLocation) {
          const driverIcon = L.divIcon({
            html: '<div style="background-color: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2); position: relative;"><div style="position: absolute; top: -8px; left: -8px; width: 32px; height: 32px; border: 2px solid #3b82f6; border-radius: 50%; animation: pulse 2s infinite;"></div></div>',
            className: 'custom-marker',
            iconSize: [16, 16],
            iconAnchor: [8, 8],
          });

          const driverMarker = L.marker([driverLocation.latitude, driverLocation.longitude], { icon: driverIcon })
            .addTo(map)
            .bindPopup(`
              <div class="p-2">
                <h3 class="font-semibold text-sm">Driver Location</h3>
                <p class="text-xs text-gray-600">Live tracking active</p>
                <p class="text-xs">Last updated: ${new Date(driverLocation.timestamp).toLocaleTimeString()}</p>
              </div>
            `);

          markersRef.current.set(`driver-${delivery.driverId}`, driverMarker);
        }
      }

      // Draw route if both pickup and delivery locations exist
      if (delivery.pickupLatitude && delivery.pickupLongitude &&
          delivery.deliveryLatitude && delivery.deliveryLongitude) {
        const routeCoordinates = [
          [delivery.pickupLatitude, delivery.pickupLongitude],
          [delivery.deliveryLatitude, delivery.deliveryLongitude]
        ];

        routeRef.current = L.polyline(routeCoordinates, {
          color: '#3b82f6',
          weight: 3,
          opacity: 0.7,
          dashArray: '10, 10',
        }).addTo(map);
      }
    });

    // Fit map to show all markers
    if (markersRef.current.size > 0) {
      const group = new L.featureGroup(Array.from(markersRef.current.values()));
      map.fitBounds(group.getBounds().pad(0.1));
    }
  };

  const handleCenterOnDelivery = () => {
    if (currentDelivery?.pickupLatitude && currentDelivery?.pickupLongitude) {
      mapInstanceRef.current?.setView([currentDelivery.pickupLatitude, currentDelivery.pickupLongitude], 15);
    }
  };

  const handleCenterOnDriver = () => {
    if (currentDelivery?.driverId) {
      const driverLocation = driverLocations.get(currentDelivery.driverId);
      if (driverLocation) {
        mapInstanceRef.current?.setView([driverLocation.latitude, driverLocation.longitude], 16);
      }
    }
  };

  if (mapError) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <p className="text-destructive mb-2">Map Error</p>
            <p className="text-sm text-muted-foreground">{mapError}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

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
        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/50 rounded-lg z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Loading map...</p>
              </div>
            </div>
          )}
          <div
            ref={mapRef}
            style={{ height, width: '100%' }}
            className="rounded-lg border"
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