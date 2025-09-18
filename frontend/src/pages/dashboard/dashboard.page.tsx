import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Layout, PageHeader } from '../../components/layout/layout';
import { useAuthStore } from '../../stores/auth.store';
import { useDeliveryStore } from '../../stores/delivery.store';
import { useNotificationStore } from '../../stores/notification.store';

export const DashboardPage: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { deliveries, fetchDeliveries } = useDeliveryStore();
  const { notifications, fetchNotifications } = useNotificationStore();

  useEffect(() => {
    // Fetch user data on mount
    fetchDeliveries(1, 5);
    fetchNotifications(1, 10);
  }, [fetchDeliveries, fetchNotifications]);

  const handleLogout = () => {
    logout();
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <Layout>
      <PageHeader
        title={`${getGreeting()}, ${user?.name || 'User'}!`}
        description={`Welcome to your ${user?.role} dashboard`}
      >
        <Button onClick={handleLogout} variant="outline">
          Logout
        </Button>
      </PageHeader>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* User Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="font-medium">Name:</span> {user?.name}
            </div>
            <div>
              <span className="font-medium">Email:</span> {user?.email}
            </div>
            <div>
              <span className="font-medium">Phone:</span> {user?.phone}
            </div>
            <div>
              <span className="font-medium">Role:</span> {user?.role}
            </div>
            <div>
              <span className="font-medium">Status:</span> {user?.isVerified ? 'Verified' : 'Unverified'}
            </div>
          </CardContent>
        </Card>

        {/* Deliveries Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Deliveries</CardTitle>
            <CardDescription>Your delivery activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deliveries.length}</div>
            <p className="text-sm text-muted-foreground">
              deliveries loaded
            </p>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Recent updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notifications.length}</div>
            <p className="text-sm text-muted-foreground">
              unread notifications
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {user?.role === 'customer' && (
              <>
                <Button>Create New Delivery</Button>
                <Button variant="outline">View My Deliveries</Button>
              </>
            )}
            {user?.role === 'driver' && (
              <>
                <Button>View Available Deliveries</Button>
                <Button variant="outline">My Active Deliveries</Button>
              </>
            )}
            {user?.role === 'admin' && (
              <>
                <Button>Manage Users</Button>
                <Button variant="outline">View All Deliveries</Button>
                <Button variant="outline">System Settings</Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
};