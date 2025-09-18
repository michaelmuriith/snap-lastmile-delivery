import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Layout, PageHeader } from '../../components/layout/layout';
import { MapContainer } from '../../components/map/map-container';
import { useAuthStore } from '../../stores/auth.store';
import { useDeliveryStore } from '../../stores/delivery.store';
import { useNotificationStore } from '../../stores/notification.store';
import type { Delivery, DeliveryStatus } from '../../types';

export const DriverDashboardPage: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { deliveries, isLoading, fetchDeliveries, assignDriver, updateDeliveryStatus } = useDeliveryStore();
  const { notifications, fetchNotifications } = useNotificationStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'available' | 'active' | 'history' | 'earnings' | 'profile'>('overview');

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

  // Filter deliveries for driver
  const availableDeliveries = deliveries.filter(d => d.status === 'pending');
  const myDeliveries = deliveries.filter(d => d.driverId === user?.id);
  const activeDeliveries = myDeliveries.filter(d => ['assigned', 'picked_up', 'in_transit'].includes(d.status));
  const completedDeliveries = myDeliveries.filter(d => d.status === 'delivered');

  const stats = {
    available: availableDeliveries.length,
    active: activeDeliveries.length,
    completed: completedDeliveries.length,
    totalEarnings: completedDeliveries.reduce((sum, d) => sum + (d.packageValue || 0), 0),
  };

  const handleAcceptDelivery = async (deliveryId: string) => {
    try {
      await assignDriver(deliveryId, user!.id);
      // Refresh deliveries after assignment
      fetchDeliveries(1, 10);
    } catch (error) {
      console.error('Failed to accept delivery:', error);
    }
  };

  const handleStatusUpdate = async (deliveryId: string, newStatus: DeliveryStatus) => {
    try {
      await updateDeliveryStatus(deliveryId, newStatus);
      // Refresh deliveries after status update
      fetchDeliveries(1, 10);
    } catch (error) {
      console.error('Failed to update delivery status:', error);
    }
  };

  return (
    <Layout>
      <PageHeader
        title={`Welcome back, ${user?.name || 'Driver'}!`}
        description="Manage your deliveries and track your earnings"
      >
        <Button onClick={logout} variant="outline">
          Logout
        </Button>
      </PageHeader>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 mb-6 bg-muted p-1 rounded-lg w-fit overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'available', label: 'Available Jobs' },
          { id: 'active', label: 'Active Deliveries' },
          { id: 'history', label: 'Delivery History' },
          { id: 'earnings', label: 'Earnings' },
          { id: 'profile', label: 'Profile' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
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
                <CardTitle className="text-sm font-medium">Available Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.available}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Deliveries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{stats.active}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Earnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">${stats.totalEarnings.toFixed(2)}</div>
              </CardContent>
            </Card>
          </div>

          {/* Active Deliveries */}
          <Card>
            <CardHeader>
              <CardTitle>Active Deliveries</CardTitle>
              <CardDescription>Your current delivery assignments</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : activeDeliveries.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No active deliveries. Check available jobs to get started!</p>
                  <Button
                    className="mt-4"
                    onClick={() => setActiveTab('available')}
                  >
                    View Available Jobs
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeDeliveries.map((delivery) => (
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
                              <span className="font-medium">Value:</span> ${delivery.packageValue || 'N/A'}
                            </div>
                            <div>
                              <span className="font-medium">Recipient:</span> {delivery.recipientName || 'N/A'}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          {delivery.status === 'assigned' && (
                            <Button
                              size="sm"
                              onClick={() => handleStatusUpdate(delivery.id, 'picked_up')}
                            >
                              Mark Picked Up
                            </Button>
                          )}
                          {delivery.status === 'picked_up' && (
                            <Button
                              size="sm"
                              onClick={() => handleStatusUpdate(delivery.id, 'in_transit')}
                            >
                              Start Delivery
                            </Button>
                          )}
                          {delivery.status === 'in_transit' && (
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleStatusUpdate(delivery.id, 'delivered')}
                            >
                              Mark Delivered
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            Track Route
                          </Button>
                        </div>
                      </div>
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
              <CardDescription>Common tasks to help you manage your work</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  className="h-20 flex-col"
                  onClick={() => setActiveTab('available')}
                >
                  <span className="text-2xl mb-2">📦</span>
                  Find New Jobs
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col"
                  onClick={() => setActiveTab('active')}
                >
                  <span className="text-2xl mb-2">🚚</span>
                  Manage Active Jobs
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col"
                  onClick={() => setActiveTab('earnings')}
                >
                  <span className="text-2xl mb-2">💰</span>
                  View Earnings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Available Jobs Tab */}
      {activeTab === 'available' && (
        <Card>
          <CardHeader>
            <CardTitle>Available Delivery Jobs</CardTitle>
            <CardDescription>Accept jobs to start earning</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : availableDeliveries.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No available jobs at the moment. Check back later!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {availableDeliveries.map((delivery) => (
                  <div key={delivery.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold">{delivery.packageDescription}</h3>
                          <Badge variant="pending">Available</Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Pickup:</span> {delivery.pickupAddress}
                          </div>
                          <div>
                            <span className="font-medium">Delivery:</span> {delivery.deliveryAddress}
                          </div>
                          <div>
                            <span className="font-medium">Distance:</span> ~2.5 miles
                          </div>
                          <div>
                            <span className="font-medium">Estimated Earnings:</span> ${((delivery.packageValue || 0) * 0.15).toFixed(2)}
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground">
                          Posted {new Date(delivery.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Button
                          onClick={() => handleAcceptDelivery(delivery.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Accept Job
                        </Button>
                        <Button variant="outline" size="sm">
                          View Details
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

      {/* Active Deliveries Tab */}
      {activeTab === 'active' && (
        <div className="space-y-6">
          {/* Map View */}
          {activeDeliveries.length > 0 && (
            <MapContainer
              height="400px"
              showControls={true}
              interactive={true}
              deliveryId={activeDeliveries[0]?.id}
            />
          )}

          <Card>
            <CardHeader>
              <CardTitle>Active Deliveries</CardTitle>
              <CardDescription>Manage your current delivery assignments</CardDescription>
            </CardHeader>
            <CardContent>
            {activeDeliveries.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No active deliveries. Accept a job to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeDeliveries.map((delivery) => (
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
                            <span className="font-medium">Value:</span> ${delivery.packageValue || 'N/A'}
                          </div>
                          <div>
                            <span className="font-medium">Recipient:</span> {delivery.recipientName || 'N/A'}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        {delivery.status === 'assigned' && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(delivery.id, 'picked_up')}
                          >
                            Mark Picked Up
                          </Button>
                        )}
                        {delivery.status === 'picked_up' && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(delivery.id, 'in_transit')}
                          >
                            Start Delivery
                          </Button>
                        )}
                        {delivery.status === 'in_transit' && (
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleStatusUpdate(delivery.id, 'delivered')}
                          >
                            Mark Delivered
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          Call Customer
                        </Button>
                        <Button variant="outline" size="sm">
                          Navigate
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        </div>
      )}

      {/* Delivery History Tab */}
      {activeTab === 'history' && (
        <Card>
          <CardHeader>
            <CardTitle>Delivery History</CardTitle>
            <CardDescription>Your completed deliveries</CardDescription>
          </CardHeader>
          <CardContent>
            {completedDeliveries.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No completed deliveries yet. Complete your first delivery to see it here!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {completedDeliveries.map((delivery) => (
                  <div key={delivery.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold">{delivery.packageDescription}</h3>
                          <Badge variant="success">Completed</Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Pickup:</span> {delivery.pickupAddress}
                          </div>
                          <div>
                            <span className="font-medium">Delivery:</span> {delivery.deliveryAddress}
                          </div>
                          <div>
                            <span className="font-medium">Completed:</span> {delivery.actualDeliveryTime ? new Date(delivery.actualDeliveryTime).toLocaleString() : 'N/A'}
                          </div>
                          <div>
                            <span className="font-medium">Earnings:</span> ${((delivery.packageValue || 0) * 0.15).toFixed(2)}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          Rate Customer
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

      {/* Earnings Tab */}
      {activeTab === 'earnings' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Earnings Overview</CardTitle>
              <CardDescription>Your earnings and payment history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">${stats.totalEarnings.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">Today's Earnings</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">${(stats.totalEarnings * 7).toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">This Week</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">${(stats.totalEarnings * 30).toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">This Month</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Payments</CardTitle>
              <CardDescription>Your payment history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>Payment history will be displayed here</p>
                <p className="text-sm mt-2">Payments are processed weekly</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <Card>
          <CardHeader>
            <CardTitle>My Profile</CardTitle>
            <CardDescription>Manage your driver profile and settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
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

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Driver Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Vehicle Type</label>
                    <div className="mt-1 p-2 bg-muted rounded">Sedan</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">License Plate</label>
                    <div className="mt-1 p-2 bg-muted rounded">ABC-123</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Availability</label>
                    <div className="mt-1 p-2 bg-muted rounded">Available</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Rating</label>
                    <div className="mt-1 p-2 bg-muted rounded">4.8 ⭐</div>
                  </div>
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