import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { MapContainer } from '../../components/map/map-container';

export const ConnectPage: React.FC = () => {
  const { type } = useParams<{ type: 'send' | 'receive' | 'schedule' }>();
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropAddress, setDropAddress] = useState('');
  const [pickupCoords, setPickupCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [dropCoords, setDropCoords] = useState<{ lat: number; lng: number } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Pickup:', pickupAddress, pickupCoords);
    console.log('Drop:', dropAddress, dropCoords);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/3 p-4 bg-gray-50 overflow-y-auto">
        <Card>
          <CardHeader>
            <CardTitle>
              {type ? type.charAt(0).toUpperCase() + type.slice(1) : 'Connect'} Package
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Pickup Address</label>
                <Input
                  type="text"
                  placeholder="Enter pickup address"
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                />
                {pickupCoords && (
                  <p className="text-xs text-gray-500 mt-1">
                    Selected: {pickupCoords.lat.toFixed(4)}, {pickupCoords.lng.toFixed(4)}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Drop Address</label>
                <Input
                  type="text"
                  placeholder="Enter drop address"
                  value={dropAddress}
                  onChange={(e) => setDropAddress(e.target.value)}
                />
                {dropCoords && (
                  <p className="text-xs text-gray-500 mt-1">
                    Selected: {dropCoords.lat.toFixed(4)}, {dropCoords.lng.toFixed(4)}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full">
                {type === 'send' ? 'Send Package' : type === 'receive' ? 'Receive Package' : 'Schedule Delivery'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Map */}
      <div className="w-2/3 p-4">
        <MapContainer
          height="100%"
          interactive={true}
          center={{ lat: -1.2864, lng: 36.8172 }}
          zoom={12}
        />
      </div>
    </div>
  );
};