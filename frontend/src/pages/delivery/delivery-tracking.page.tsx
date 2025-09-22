import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { MapContainer } from '../../components/map/map-container';
import { ArrowLeft, Phone, MessageCircle, Star, Package, MapPin, Clock, Truck } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '../../components/ui/avatar';
import { Separator } from '../../components/ui';

export const DeliveryTrackingPage: React.FC = () => {
  const { deliveryId } = useParams<{ deliveryId: string }>();
  const navigate = useNavigate();

  // Mock delivery data - in real app this would come from API
  const deliveryData = {
    id: deliveryId || 'DEL-001',
    status: 'in_transit',
    pickupAddress: '123 Main St, Nairobi',
    deliveryAddress: '456 Oak Ave, Nairobi',
    packageDescription: 'Electronics - Laptop Computer',
    recipientName: 'John Doe',
    recipientPhone: '+254 712 345 678',
    estimatedDeliveryTime: '2:30 PM - 3:00 PM',
    driver: {
      name: 'Michael Johnson',
      phone: '+254 723 456 789',
      rating: 4.8,
      vehicle: 'Toyota Hiace - ABC 123D',
      photo: '/api/placeholder/64/64'
    },
    currentLocation: {
      lat: -1.2864,
      lng: 36.8172
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'assigned': return 'warning';
      case 'picked_up': return 'info';
      case 'in_transit': return 'primary';
      case 'delivered': return 'success';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Order Placed';
      case 'assigned': return 'Driver Assigned';
      case 'picked_up': return 'Package Picked Up';
      case 'in_transit': return 'In Transit';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">Track Your Delivery</h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Map Section */}
        <Card className="overflow-hidden">
          <div className="h-64">
            <MapContainer
              height="256px"
              deliveryId={deliveryId}
              interactive={false}
              showControls={false}
            />
          </div>
        </Card>

        {/* Status Section */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Delivery Status</h2>
              <Badge variant={getStatusColor(deliveryData.status)}>
                {getStatusText(deliveryData.status)}
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Picked up from sender</p>
                  <p className="text-xs text-gray-500">{deliveryData.pickupAddress}</p>
                  <p className="text-xs text-gray-400">10:30 AM</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">In transit to destination</p>
                  <p className="text-xs text-gray-500">Currently on the way</p>
                  <p className="text-xs text-gray-400">Estimated: {deliveryData.estimatedDeliveryTime}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gray-300 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">Delivered to recipient</p>
                  <p className="text-xs text-gray-500">{deliveryData.deliveryAddress}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Driver Information */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Your Driver</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={deliveryData.driver.photo} alt={deliveryData.driver.name} />
                <AvatarFallback className="text-lg">
                  {deliveryData.driver.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{deliveryData.driver.name}</h3>
                <div className="flex items-center gap-1 mb-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-gray-600">{deliveryData.driver.rating}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Truck className="h-4 w-4" />
                  <span>{deliveryData.driver.vehicle}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="p-2">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="p-2">
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Details */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Delivery Details</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            <div className="flex items-start gap-3">
              <Package className="h-5 w-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Package</p>
                <p className="text-sm text-gray-600">{deliveryData.packageDescription}</p>
              </div>
            </div>

            <Separator />

            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Delivery Address</p>
                <p className="text-sm text-gray-600">{deliveryData.deliveryAddress}</p>
              </div>
            </div>

            <Separator />

            <div className="flex items-start gap-3">
              <div className="h-5 w-5 flex items-center justify-center mt-0.5">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Recipient</p>
                <p className="text-sm text-gray-600">{deliveryData.recipientName}</p>
                <p className="text-sm text-gray-600">{deliveryData.recipientPhone}</p>
              </div>
            </div>

            <Separator />

            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Estimated Delivery</p>
                <p className="text-sm text-gray-600">{deliveryData.estimatedDeliveryTime}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3 pb-4">
          <Button variant="outline" className="flex-1">
            <Phone className="h-4 w-4 mr-2" />
            Call Driver
          </Button>
          <Button variant="outline" className="flex-1">
            <MessageCircle className="h-4 w-4 mr-2" />
            Message Driver
          </Button>
        </div>
      </div>
    </div>
  );
};