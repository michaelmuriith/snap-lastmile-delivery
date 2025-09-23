export interface NavigationItem {
  label: string;
  path: string;
}

export interface HeroStats {
  deliveriesToday: number;
  rating: number;
}

export interface HeroContent {
  title: string;
  subtitle: string;
  image: string;
  stats: HeroStats;
}

export interface NavigationContent {
  brand: string;
  items: readonly NavigationItem[];
}

export interface LandingContent {
  hero: HeroContent;
  navigation: NavigationContent;
}

export const LANDING_CONTENT: LandingContent = {
  hero: {
    title: 'Delivery as Reliable as Your Ride',
    subtitle: 'Professional courier services made as accessible as ordering a ride. See every step of your package journey with real-time tracking and trusted drivers.',
    image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
    stats: {
      deliveriesToday: 247,
      rating: 4.9
    }
  },
  navigation: {
    brand: 'Snap',
    items: [
      { label: 'Home', path: '/' },
      { label: 'Book Delivery', path: '/connect/send' },
      { label: 'Track Package', path: '/track' },
      { label: 'For Business', path: '/pricing' },
    ]
  }
} as const;