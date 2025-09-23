export interface PackageSize {
  id: string;
  name: string;
  maxWeight: string;
  icon: string;
}

export interface DeliverySpeed {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  estimatedTime: string;
}

export interface Driver {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  distance: string;
  eta: string;
  status: 'available' | 'busy';
}

export interface AddressSuggestion {
  id: string;
  address: string;
  distance: string;
}

export const PACKAGE_SIZES: PackageSize[] = [
  {
    id: 'small',
    name: 'Small',
    maxWeight: 'Up to 5 Kg',
    icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
  },
  {
    id: 'medium',
    name: 'Medium',
    maxWeight: '5-20 Kg',
    icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
  },
  {
    id: 'large',
    name: 'Large',
    maxWeight: '20-50 Kg',
    icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
  },
  {
    id: 'xl',
    name: 'XL',
    maxWeight: '50+ Kg',
    icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
  }
];

export const DELIVERY_SPEEDS: DeliverySpeed[] = [
  {
    id: 'express',
    name: 'Express (1-2 hours)',
    description: 'Priority delivery with real-time tracking',
    basePrice: 240.99,
    estimatedTime: '1:30 PM - 2:30 PM'
  },
  {
    id: 'same-day',
    name: 'Same Day (3-6 hours)',
    description: 'Reliable delivery within business hours',
    basePrice: 160.99,
    estimatedTime: '3:00 PM - 6:00 PM'
  },
  {
    id: 'standard',
    name: 'Standard (Next Day)',
    description: 'Economical option for non-urgent deliveries',
    basePrice: 120.99,
    estimatedTime: 'Tomorrow 9:00 AM - 5:00 PM'
  }
];

export const SAMPLE_DRIVERS: Driver[] = [
  {
    id: '1',
    name: 'Michael R.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&h=150&auto=format&fit=crop&ixlib=rb-4.0.3',
    rating: 4.9,
    distance: '2.1 miles away',
    eta: '3 min ETA',
    status: 'available'
  },
  {
    id: '2',
    name: 'Sarah K.',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=150&h=150&auto=format&fit=crop&ixlib=rb-4.0.3',
    rating: 4.8,
    distance: '1.8 miles away',
    eta: '5 min ETA',
    status: 'available'
  }
];

export const ADDRESS_SUGGESTIONS: AddressSuggestion[] = [
  {
    id: '1',
    address: '456 Oak Street, Midtown',
    distance: '2.3 miles from pickup'
  },
  {
    id: '2',
    address: '789 Pine Avenue, Uptown',
    distance: '4.1 miles from pickup'
  }
];

export const CONNECT_CONTENT = {
  pageTitle: 'Book Your Delivery',
  pageSubtitle: 'Get instant quotes and book professional courier services in seconds',
  mapImage: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
  routeDistance: '3.2 miles',
  routeTime: '12 min drive',
  availableDrivers: 5
} as const;