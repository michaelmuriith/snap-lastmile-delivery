import React from 'react';
import { GoogleMaps } from './google-maps.component';

interface RouteMapProps {
  pickupAddress: string;
  deliveryAddress: string;
  distance: string;
  duration: string;
  availableDrivers: number;
  onDistanceChange?: (distance: number, duration: string) => void;
}

export const RouteMap: React.FC<RouteMapProps> = React.memo(({
  pickupAddress,
  deliveryAddress,
  distance,
  duration,
  availableDrivers,
  onDistanceChange
}) => {
  return (
    <div className="bg-surface rounded-xl shadow-base overflow-hidden">
      {/* Map Header */}
      <div className="p-4 border-b border-border-light">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-text-primary">Route Preview</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-text-secondary">{distance}</span>
            <span className="text-sm text-success font-medium">{duration}</span>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative h-96">
        <GoogleMaps
          pickupAddress={pickupAddress}
          deliveryAddress={deliveryAddress}
          className="w-full h-full"
          onDistanceChange={onDistanceChange}
        />

        {/* Available Drivers Indicator - Overlay on map */}
        <div className="absolute top-4 right-4 map-overlay p-3 z-10">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-success rounded-full mr-2 animate-pulse" aria-hidden="true"></div>
            <span className="text-sm font-medium text-success">{availableDrivers} drivers nearby</span>
          </div>
        </div>
      </div>

      {/* Route Details */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <svg className="w-4 h-4 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
            </svg>
            <span className="text-sm text-text-secondary">Optimal route selected</span>
          </div>
          <span className="text-sm font-medium text-text-primary">Fastest option</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <svg className="w-4 h-4 text-success mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span className="text-sm text-text-secondary">Traffic conditions</span>
          </div>
          <span className="text-sm font-medium text-success">Light traffic</span>
        </div>
      </div>
    </div>
  );
});