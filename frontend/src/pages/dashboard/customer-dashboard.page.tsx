import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Layout, PageHeader } from '../../components/layout/layout';
import { DeliveryCreateForm } from '../../components/delivery/delivery-create-form';
import { MapContainer } from '../../components/map/map-container';
import { useAuthStore } from '../../stores/auth.store';
import { useDeliveryStore } from '../../stores/delivery.store';
import { useNotificationStore } from '../../stores/notification.store';
import type { Delivery, DeliveryStatus } from '../../types';

export const CustomerDashboardPage: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { deliveries, isLoading, fetchDeliveries } = useDeliveryStore();
  const { notifications, fetchNotifications } = useNotificationStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'deliveries' | 'create' | 'track' | 'profile'>('overview');

  useEffect(() => {
    fetchDeliveries(1, 10);
    fetchNotifications(1, 5);
  }, [fetchDeliveries, fetchNotifications]);

  const getStatusColor = (status: DeliveryStatus): "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "pending" => {
    switch (status) {
      case 'pending': return 'pending';
      case 'assigned': return 'warning';
      case 'picked_up': return 'warning';
      case 'in_transit': return 'warning';
      case 'delivered': return 'success';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusText = (status: DeliveryStatus): string => {
    return status.replace('_', ' ').toUpperCase();
  };

  const activeDeliveries = deliveries.filter(d => ['pending', 'assigned', 'picked_up', 'in_transit'].includes(d.status));
  const completedDeliveries = deliveries.filter(d => d.status === 'delivered');
  const cancelledDeliveries = deliveries.filter(d => d.status === 'cancelled');

  const stats = {
    total: deliveries.length,
    active: activeDeliveries.length,
    completed: completedDeliveries.length,
    cancelled: cancelledDeliveries.length,
  };

  return (
    <Layout>
      <PageHeader
        title={`Welcome back, ${user?.name || 'Customer'}!`}
        description="Manage your deliveries and track your packages"
      >
        <Button onClick={logout} variant="outline">
          Logout
        </Button>
      </PageHeader>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 mb-6 bg-muted p-1 rounded-lg w-fit">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'deliveries', label: 'My Deliveries' },
          { id: 'create', label: 'Create Delivery' },
          { id: 'track', label: 'Track Delivery' },
          { id: 'profile', label: 'Profile' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Deliveries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{stats.active}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Deliveries */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Deliveries</CardTitle>
              <CardDescription>Your latest delivery activity</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : deliveries.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No deliveries yet. Create your first delivery to get started!</p>
                  <Button
                    className="mt-4"
                    onClick={() => setActiveTab('create')}
                  >
                    Create Delivery
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {deliveries.slice(0, 5).map((delivery) => (
                    <div key={delivery.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium">{delivery.packageDescription}</span>
                          <Badge variant={getStatusColor(delivery.status)}>
                            {getStatusText(delivery.status)}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          From: {delivery.pickupAddress} → To: {delivery.deliveryAddress}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {new Date(delivery.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveTab('deliveries')}
                      >
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks to help you manage deliveries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  className="h-20 flex-col"
                  onClick={() => setActiveTab('create')}
                >
                  <span className="text-2xl mb-2">📦</span>
                  Create New Delivery
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col"
                  onClick={() => setActiveTab('deliveries')}
                >
                  <span className="text-2xl mb-2">📋</span>
                  View All Deliveries
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col"
                  onClick={() => setActiveTab('profile')}
                >
                  <span className="text-2xl mb-2">👤</span>
                  Update Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Deliveries Tab */}
      {activeTab === 'deliveries' && (
        <Card>
          <CardHeader>
            <CardTitle>My Deliveries</CardTitle>
            <CardDescription>Track and manage all your deliveries</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : deliveries.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No deliveries found. Create your first delivery!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {deliveries.map((delivery) => (
                  <div key={delivery.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold">{delivery.packageDescription}</h3>
                          <Badge variant={getStatusColor(delivery.status)}>
                            {getStatusText(delivery.status)}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Pickup:</span> {delivery.pickupAddress}
                          </div>
                          <div>
                            <span className="font-medium">Delivery:</span> {delivery.deliveryAddress}
                          </div>
                          <div>
                            <span className="font-medium">Created:</span> {new Date(delivery.createdAt).toLocaleString()}
                          </div>
                          <div>
                            <span className="font-medium">Value:</span> ${delivery.packageValue || 'N/A'}
                          </div>
                        </div>
                        {delivery.driverId && (
                          <div className="mt-2 text-sm">
                            <span className="font-medium">Driver Assigned</span>
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Track
                        </Button>
                        <Button variant="outline" size="sm">
                          Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Create Delivery Tab */}
      {activeTab === 'create' && (
        <DeliveryCreateForm
          onSuccess={() => {
            setActiveTab('overview');
            fetchDeliveries(1, 10); // Refresh deliveries list
          }}
          onCancel={() => setActiveTab('overview')}
        />
      )}

      {/* Track Delivery Tab */}
      {activeTab === 'track' && (
        <div className="space-y-6">
          <MapContainer
            height="500px"
            showControls={true}
            interactive={true}
            deliveryId={activeDeliveries[0]?.id}
          />

          {activeDeliveries.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Delivery Status</CardTitle>
                <CardDescription>Real-time tracking information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeDeliveries.map((delivery) => (
                    <div key={delivery.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold">{delivery.packageDescription}</h3>
                          <p className="text-sm text-muted-foreground">
                            Status: <Badge variant={getStatusColor(delivery.status)}>
                              {getStatusText(delivery.status)}
                            </Badge>
                          </p>
                        </div>
                        <Button
                          onClick={() => setActiveTab('deliveries')}
                          variant="outline"
                        >
                          View Details
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Driver:</span> {delivery.driverId ? 'Assigned' : 'Pending assignment'}
                        </div>
                        <div>
                          <span className="font-medium">Estimated delivery:</span> {delivery.estimatedDeliveryTime ?
                            new Date(delivery.estimatedDeliveryTime).toLocaleString() : 'TBD'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeDeliveries.length === 0 && (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">No active deliveries to track</p>
                  <Button onClick={() => setActiveTab('create')}>
                    Create New Delivery
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <Card>
          <CardHeader>
            <CardTitle>My Profile</CardTitle>
            <CardDescription>Manage your account information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <div className="mt-1 p-2 bg-muted rounded">{user?.name}</div>
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <div className="mt-1 p-2 bg-muted rounded">{user?.email}</div>
                </div>
                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <div className="mt-1 p-2 bg-muted rounded">{user?.phone}</div>
                </div>
                <div>
                  <label className="text-sm font-medium">Role</label>
                  <div className="mt-1 p-2 bg-muted rounded capitalize">{user?.role}</div>
                </div>
              </div>
              <div className="pt-4">
                <Button variant="outline">Edit Profile</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </Layout>
  );
};