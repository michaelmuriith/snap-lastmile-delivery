# SNAP Frontend Folder Structure

## Overview

The frontend follows a feature-based modular architecture with shared components, optimized for scalability and maintainability. Built with Vite + React, using Tailwind CSS and ShadCN UI for styling.

## Folder Structure

```
src/
├── assets/                    # Static assets (images, icons, fonts)
│   ├── icons/
│   ├── images/
│   └── fonts/
├── components/                # Shared UI components
│   ├── ui/                   # ShadCN UI components (buttons, modals, inputs)
│   ├── layout/               # Layout components (header, sidebar, footer)
│   ├── forms/                # Reusable form components
│   ├── maps/                 # Map-related components (MapLibre/Google Maps wrapper)
│   └── common/               # Common utilities (loading, error states)
├── features/                 # Feature-based modules
│   ├── auth/                 # Authentication feature
│   │   ├── components/       # Auth-specific components
│   │   ├── hooks/           # Auth hooks (useAuth, useLogin)
│   │   ├── services/        # Auth API calls
│   │   ├── types/           # Auth TypeScript types
│   │   └── index.ts         # Feature exports
│   ├── dashboard/            # Dashboard feature (shared across user types)
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── index.ts
│   ├── delivery/             # Delivery management
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── index.ts
│   ├── tracking/             # Real-time tracking
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── index.ts
│   ├── payment/              # Payment integration
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── index.ts
│   ├── notifications/        # Push notifications
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── index.ts
│   └── admin/                # Admin-specific features
│       ├── components/
│       ├── hooks/
│       ├── services/
│       ├── types/
│       └── index.ts
├── hooks/                    # Global custom hooks
│   ├── useWebSocket.ts      # WebSocket connection hook
│   ├── useLocalStorage.ts   # Local storage utilities
│   └── useOffline.ts        # Offline detection hook
├── services/                 # Global services
│   ├── api/                 # Axios instance and base API config
│   ├── websocket/           # WebSocket service
│   ├── storage/             # Local storage service
│   └── geolocation/         # Geolocation service
├── stores/                  # State management (Zustand)
│   ├── authStore.ts         # Authentication state
│   ├── deliveryStore.ts     # Delivery state
│   ├── trackingStore.ts     # Tracking state
│   └── uiStore.ts           # UI state (modals, loading)
├── types/                   # Global TypeScript types
│   ├── user.ts              # User-related types
│   ├── delivery.ts          # Delivery-related types
│   ├── api.ts               # API response types
│   └── index.ts             # Type exports
├── utils/                   # Utility functions
│   ├── constants.ts         # App constants
│   ├── helpers.ts           # Helper functions
│   ├── validation.ts        # Form validation utilities
│   └── date.ts              # Date formatting utilities
├── pages/                   # Page components (routes)
│   ├── auth/                # Auth pages (login, register)
│   ├── customer/            # Customer dashboard pages
│   ├── driver/              # Driver dashboard pages
│   ├── admin/               # Admin dashboard pages
│   └── public/              # Public pages (landing, about)
├── router/                  # Routing configuration
│   ├── routes.ts            # Route definitions
│   ├── guards.ts            # Route guards (auth, role-based)
│   └── index.ts
├── styles/                  # Global styles
│   ├── globals.css          # Tailwind imports and global styles
│   ├── theme.ts             # Theme configuration
│   └── variables.css        # CSS custom properties
├── App.tsx                  # Main App component
├── main.tsx                 # Entry point
└── vite-env.d.ts            # Vite type definitions
```

## Key Design Principles

### Feature-Based Organization
- Each feature is self-contained with its own components, hooks, services, and types
- Clear separation of concerns between features
- Easy to add/remove features without affecting others

### Shared Components
- Reusable UI components in `components/` for consistency
- ShadCN UI components for rapid development
- Layout components for responsive design

### State Management
- Zustand stores for global state
- Feature-specific stores for localized state
- Optimized for performance with selective re-renders

### Type Safety
- TypeScript throughout for type safety
- Shared types in `types/` directory
- API response types for better integration

### Mobile-First Design
- Responsive components using Tailwind CSS
- PWA capabilities with service worker
- Offline support with local storage

## Routing Structure

- `/auth/*` - Authentication routes
- `/customer/*` - Customer dashboard
- `/driver/*` - Driver dashboard
- `/admin/*` - Admin dashboard
- `/public/*` - Public pages

Each user type has protected routes with role-based access control implemented via route guards.

This structure ensures maintainability, scalability, and developer productivity while providing an excellent user experience across all device types.