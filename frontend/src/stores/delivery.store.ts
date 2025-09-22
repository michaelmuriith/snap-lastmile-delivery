import { create } from 'zustand';
import type { DeliveryState, Delivery, CreateDeliveryForm } from '../types';
import { apiService } from '../services/api';
import { websocketService } from '../services/websocket';

interface DeliveryStore extends DeliveryState {
  // Actions
  fetchDeliveries: (page?: number, limit?: number, status?: string) => Promise<void>;
  fetchDelivery: (id: string) => Promise<void>;
  createDelivery: (deliveryData: CreateDeliveryForm) => Promise<Delivery>;
  assignDriver: (deliveryId: string, driverId: string) => Promise<void>;
  updateDeliveryStatus: (deliveryId: string, status: string) => Promise<void>;
  subscribeToDelivery: (deliveryId: string) => void;
  unsubscribeFromDelivery: (deliveryId: string) => void;
  clearError: () => void;
  setCurrentDelivery: (delivery: Delivery | null) => void;
}

export const useDeliveryStore = create<DeliveryStore>((set) => ({
  // Initial state
  deliveries: [],
  currentDelivery: null,
  isLoading: false,
  error: null,

  // Actions
  fetchDeliveries: async (page = 1, limit = 10, status) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.getDeliveries(page, limit, status);
      set({
        deliveries: response.data,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch deliveries',
        isLoading: false,
      });
    }
  },

  fetchDelivery: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const delivery = await apiService.getDelivery(id);
      set({
        currentDelivery: delivery,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch delivery',
        isLoading: false,
      });
    }
  },

  createDelivery: async (deliveryData: CreateDeliveryForm) => {
    set({ isLoading: true, error: null });
    try {
      const delivery = await apiService.createDelivery(deliveryData);
      set((state) => ({
        deliveries: [delivery, ...state.deliveries],
        currentDelivery: delivery,
        isLoading: false,
      }));
      return delivery;
    } catch (error: any) {
      set({
        error: error.message || 'Failed to create delivery',
        isLoading: false,
      });
      throw error;
    }
  },

  assignDriver: async (deliveryId: string, driverId: string) => {
    set({ isLoading: true, error: null });
    try {
      const updatedDelivery = await apiService.assignDriver(deliveryId, driverId);
      set((state) => ({
        deliveries: state.deliveries.map(d =>
          d.id === deliveryId ? updatedDelivery : d
        ),
        currentDelivery: state.currentDelivery?.id === deliveryId ? updatedDelivery : state.currentDelivery,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Failed to assign driver',
        isLoading: false,
      });
      throw error;
    }
  },

  updateDeliveryStatus: async (deliveryId: string, status: string) => {
    set({ isLoading: true, error: null });
    try {
      const updatedDelivery = await apiService.updateDeliveryStatus(deliveryId, status);
      set((state) => ({
        deliveries: state.deliveries.map(d =>
          d.id === deliveryId ? updatedDelivery : d
        ),
        currentDelivery: state.currentDelivery?.id === deliveryId ? updatedDelivery : state.currentDelivery,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Failed to update delivery status',
        isLoading: false,
      });
      throw error;
    }
  },

  subscribeToDelivery: (deliveryId: string) => {
    websocketService.subscribeToDelivery(deliveryId);
  },

  unsubscribeFromDelivery: (deliveryId: string) => {
    websocketService.unsubscribeFromDelivery(deliveryId);
  },

  clearError: () => {
    set({ error: null });
  },

  setCurrentDelivery: (delivery: Delivery | null) => {
    set({ currentDelivery: delivery });
  },
}));