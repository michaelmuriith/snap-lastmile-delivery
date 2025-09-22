import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Layout, PageHeader } from '../../components/layout/layout';
import { MapContainer } from '../../components/map/map-container';
import { useAuthStore } from '../../stores/auth.store';
import { useDeliveryStore } from '../../stores/delivery.store';
import { useNotificationStore } from '../../stores/notification.store';
import type { DeliveryStatus, User } from '../../types';

export const AdminDashboardPage: React.FC = () => {
  const { logout } = useAuthStore();
  const { deliveries, isLoading, fetchDeliveries } = useDeliveryStore();
  const { fetchNotifications } = useNotificationStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'deliveries' | 'analytics' | 'settings'>('overview');

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

  // Calculate comprehensive statistics
  const stats = {
    totalUsers: 1250, // Mock data - would come from API
    totalDrivers: 320,
    totalCustomers: 930,
    totalDeliveries: deliveries.length,
    activeDeliveries: deliveries.filter(d => ['pending', 'assigned', 'picked_up', 'in_transit'].includes(d.status)).length,
    completedDeliveries: deliveries.filter(d => d.status === 'delivered').length,
    cancelledDeliveries: deliveries.filter(d => d.status === 'cancelled').length,
    totalRevenue: deliveries.filter(d => d.status === 'delivered').reduce((sum, d) => sum + (d.packageValue || 0), 0),
    averageDeliveryTime: '24 minutes', // Mock data
    customerSatisfaction: 4.7, // Mock data
  };

  // Mock user data - would come from API
  const mockUsers: User[] = [
    { id: '1', name: 'John Driver', email: 'john@example.com', phone: '+1234567890', role: 'driver', isVerified: true, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
    { id: '2', name: 'Jane Customer', email: 'jane@example.com', phone: '+1234567891', role: 'customer', isVerified: true, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
    { id: '3', name: 'Bob Admin', email: 'bob@example.com', phone: '+1234567892', role: 'admin', isVerified: true, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  ];

  return (
    <Layout>
      <PageHeader
        title={`Admin Dashboard`}
        description="System overview and management"
      >
        <Button onClick={logout} variant="outline">
          Logout
        </Button>
      </PageHeader>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 mb-6 bg-muted p-1 rounded-lg w-fit overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'users', label: 'User Management' },
          { id: 'deliveries', label: 'Delivery Monitoring' },
          { id: 'analytics', label: 'Analytics' },
          { id: 'settings', label: 'System Settings' },
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
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.totalDrivers} drivers, {stats.totalCustomers} customers
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Deliveries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{stats.activeDeliveries}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.completedDeliveries} completed today
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">${stats.totalRevenue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  Today's earnings
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Delivery Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.averageDeliveryTime}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.customerSatisfaction}⭐ satisfaction
                </p>
              </CardContent>
            </Card>
          </div>

          {/* System Health */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>Real-time system status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">API Status</span>
                    <Badge variant="success">Healthy</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Database</span>
                    <Badge variant="success">Connected</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">WebSocket</span>
                    <Badge variant="success">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Payment Gateway</span>
                    <Badge variant="success">Operational</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest system events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm">New driver registered</p>
                      <p className="text-xs text-muted-foreground">2 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm">Delivery completed</p>
                      <p className="text-xs text-muted-foreground">5 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm">Payment processed</p>
                      <p className="text-xs text-muted-foreground">8 minutes ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Live Map Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Live Delivery Map</CardTitle>
              <CardDescription>Real-time view of all active deliveries</CardDescription>
            </CardHeader>
            <CardContent>
              <MapContainer
                height="400px"
                showControls={true}
                interactive={true}
                showAllDeliveries={true}
              />
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Administrative Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Button className="h-20 flex-col">
                  <span className="text-2xl mb-2">👥</span>
                  Manage Users
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <span className="text-2xl mb-2">📦</span>
                  Monitor Deliveries
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <span className="text-2xl mb-2">📊</span>
                  View Analytics
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <span className="text-2xl mb-2">⚙️</span>
                  System Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage all users in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="font-semibold">{user.name}</h3>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      <Badge variant={user.role === 'admin' ? 'default' : user.role === 'driver' ? 'secondary' : 'outline'}>
                        {user.role}
                      </Badge>
                      {user.isVerified && (
                        <Badge variant="success">Verified</Badge>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm">View</Button>
                      <Button variant="destructive" size="sm">Suspend</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Deliveries Tab */}
      {activeTab === 'deliveries' && (
        <Card>
          <CardHeader>
            <CardTitle>Delivery Monitoring</CardTitle>
            <CardDescription>Monitor all deliveries in the system</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : deliveries.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No deliveries found</p>
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
                            <span className="font-medium">Customer:</span> {delivery.customerId}
                          </div>
                          <div>
                            <span className="font-medium">Driver:</span> {delivery.driverId || 'Unassigned'}
                          </div>
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
                            <span className="font-medium">Created:</span> {new Date(delivery.createdAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Button variant="outline" size="sm">View Details</Button>
                        <Button variant="outline" size="sm">Assign Driver</Button>
                        <Button variant="outline" size="sm">Track</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Analytics</CardTitle>
                <CardDescription>Financial performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Today's Revenue</span>
                    <span className="font-semibold">${stats.totalRevenue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">This Week</span>
                    <span className="font-semibold">${(stats.totalRevenue * 7).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">This Month</span>
                    <span className="font-semibold">${(stats.totalRevenue * 30).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Platform Fee (10%)</span>
                    <span className="font-semibold">${(stats.totalRevenue * 0.1).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Delivery Performance</CardTitle>
                <CardDescription>Operational efficiency metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Delivery Time</span>
                    <span className="font-semibold">{stats.averageDeliveryTime}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">On-Time Delivery Rate</span>
                    <span className="font-semibold">94.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Customer Satisfaction</span>
                    <span className="font-semibold">{stats.customerSatisfaction}⭐</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Driver Utilization</span>
                    <span className="font-semibold">78.5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>System Reports</CardTitle>
              <CardDescription>Generate and download system reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-20 flex-col">
                  <span className="text-2xl mb-2">📊</span>
                  Financial Report
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <span className="text-2xl mb-2">🚚</span>
                  Delivery Report
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <span className="text-2xl mb-2">👥</span>
                  User Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
              <CardDescription>Configure system-wide settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Platform Fee (%)</label>
                    <div className="p-2 bg-muted rounded">10%</div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Driver Commission (%)</label>
                    <div className="p-2 bg-muted rounded">15%</div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Max Delivery Distance (km)</label>
                    <div className="p-2 bg-muted rounded">50 km</div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Support Email</label>
                    <div className="p-2 bg-muted rounded">support@snap.com</div>
                  </div>
                </div>
                <div className="pt-4">
                  <Button>Save Configuration</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Maintenance</CardTitle>
              <CardDescription>Administrative maintenance tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-16 flex-col">
                  <span className="text-xl mb-1">🔄</span>
                  Clear Cache
                </Button>
                <Button variant="outline" className="h-16 flex-col">
                  <span className="text-xl mb-1">📧</span>
                  Send Notifications
                </Button>
                <Button variant="outline" className="h-16 flex-col">
                  <span className="text-xl mb-1">🗃️</span>
                  Database Backup
                </Button>
                <Button variant="destructive" className="h-16 flex-col">
                  <span className="text-xl mb-1">🚨</span>
                  Emergency Stop
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Layout>
  );
};