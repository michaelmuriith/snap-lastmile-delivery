import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import type {
  User,
  AuthUser,
  Delivery,
  Payment,
  Notification,
  LoginForm,
  RegisterForm,
  CreateDeliveryForm,
  ApiResponse,
  PaginatedResponse,
  AuthResponse
} from '../types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config: any) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: any) => Promise.reject(error)
    );

    // Response interceptor to handle token refresh
    this.api.interceptors.response.use(
      (response: any) => response,
      async (error: any) => {
        if (error.response?.status === 401) {
          // Token expired, try to refresh
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            try {
              const refreshResponse = await axios.post(`${this.api.defaults.baseURL}/auth/refresh`, {
                refreshToken,
              });
              const { accessToken } = refreshResponse.data;
              localStorage.setItem('accessToken', accessToken);
              // Retry the original request
              error.config.headers.Authorization = `Bearer ${accessToken}`;
              return this.api.request(error.config);
            } catch (refreshError) {
              // Refresh failed, logout user
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              window.location.href = '/login';
            }
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(credentials: LoginForm): Promise<AuthUser> {
    const response: AxiosResponse<AuthResponse<AuthUser>> = await this.api.post('/auth/login', credentials);
    console.log('Login response:', response.data);
    const { access_token, refresh_token, user} = response.data;
    localStorage.setItem('accessToken', access_token);
    localStorage.setItem('refreshToken', refresh_token);


    console.log(access_token)

    console.log('res:', user);
    return user;
  }

  async register(userData: RegisterForm): Promise<User> {
    console.log('Registering user with data:', userData);
    const response: AxiosResponse<ApiResponse<User>> = await this.api.post('/auth/register', userData);
    console.log('Registration response:', response.data);
    return response.data.data;
  }

  async logout(): Promise<void> {
    await this.api.post('/auth/logout');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  async getProfile(): Promise<User> {
    const response: AxiosResponse<User> = await this.api.get('/auth/profile');
    return response.data;
  }

  async refreshToken(): Promise<{ accessToken: string }> {
    const refreshToken = localStorage.getItem('refreshToken');
    const response: AxiosResponse<ApiResponse<{ accessToken: string }>> = await this.api.post('/auth/refresh', {
      refreshToken,
    });
    const { accessToken } = response.data.data;
    localStorage.setItem('accessToken', accessToken);
    return response.data.data;
  }

  // User endpoints
  async getUsers(page = 1, limit = 10, role?: string): Promise<PaginatedResponse<User>> {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (role) params.append('role', role);

    const response: AxiosResponse<ApiResponse<PaginatedResponse<User>>> = await this.api.get(`/users?${params}`);
    return response.data.data;
  }

  async getUser(id: string): Promise<User> {
    const response: AxiosResponse<ApiResponse<User>> = await this.api.get(`/users/${id}`);
    return response.data.data;
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    const response: AxiosResponse<ApiResponse<User>> = await this.api.patch(`/users/${id}`, userData);
    return response.data.data;
  }

  async deleteUser(id: string): Promise<void> {
    await this.api.delete(`/users/${id}`);
  }

  async verifyUser(id: string): Promise<User> {
    const response: AxiosResponse<ApiResponse<User>> = await this.api.patch(`/users/${id}/verify`, {});
    return response.data.data;
  }

  async getDrivers(): Promise<User[]> {
    const response: AxiosResponse<ApiResponse<User[]>> = await this.api.get('/users/drivers');
    return response.data.data;
  }

  async getCustomers(): Promise<User[]> {
    const response: AxiosResponse<ApiResponse<User[]>> = await this.api.get('/users/customers');
    return response.data.data;
  }

  // Delivery endpoints
  async createDelivery(deliveryData: CreateDeliveryForm): Promise<Delivery> {
    const response: AxiosResponse<ApiResponse<Delivery>> = await this.api.post('/deliveries', deliveryData);
    return response.data.data;
  }

  async getDeliveries(page = 1, limit = 10, status?: string): Promise<PaginatedResponse<Delivery>> {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (status) params.append('status', status);

    const response: AxiosResponse<ApiResponse<PaginatedResponse<Delivery>>> = await this.api.get(`/deliveries?${params}`);
    return response.data.data;
  }

  async getDelivery(id: string): Promise<Delivery> {
    const response: AxiosResponse<ApiResponse<Delivery>> = await this.api.get(`/deliveries/${id}`);
    return response.data.data;
  }

  async assignDriver(deliveryId: string, driverId: string): Promise<Delivery> {
    const response: AxiosResponse<ApiResponse<Delivery>> = await this.api.put(`/deliveries/${deliveryId}/assign-driver`, {
      driverId,
    });
    return response.data.data;
  }

  async updateDeliveryStatus(deliveryId: string, status: string, metadata?: any): Promise<Delivery> {
    const response: AxiosResponse<ApiResponse<Delivery>> = await this.api.patch(`/deliveries/${deliveryId}/status`, {
      status,
      metadata,
    });
    return response.data.data;
  }

  // Payment endpoints
  async createPayment(paymentData: { deliveryId: string; amount: number; currency?: string }): Promise<Payment> {
    const response: AxiosResponse<ApiResponse<Payment>> = await this.api.post('/payments', paymentData);
    return response.data.data;
  }

  async getPayments(page = 1, limit = 10): Promise<PaginatedResponse<Payment>> {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    const response: AxiosResponse<ApiResponse<PaginatedResponse<Payment>>> = await this.api.get(`/payments?${params}`);
    return response.data.data;
  }

  async getPayment(id: string): Promise<Payment> {
    const response: AxiosResponse<ApiResponse<Payment>> = await this.api.get(`/payments/${id}`);
    return response.data.data;
  }

  async updatePaymentStatus(id: string, status: string): Promise<Payment> {
    const response: AxiosResponse<ApiResponse<Payment>> = await this.api.patch(`/payments/${id}/status`, { status });
    return response.data.data;
  }

  // Notification endpoints
  async createNotification(notificationData: {
    userId: string;
    title: string;
    message: string;
    type: string;
    metadata?: any;
  }): Promise<Notification> {
    const response: AxiosResponse<ApiResponse<Notification>> = await this.api.post('/notifications', notificationData);
    return response.data.data;
  }

  async getNotifications(page = 1, limit = 10): Promise<PaginatedResponse<Notification>> {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    const response: AxiosResponse<ApiResponse<PaginatedResponse<Notification>>> = await this.api.get(`/notifications?${params}`);
    return response.data.data;
  }

  async getNotification(id: string): Promise<Notification> {
    const response: AxiosResponse<ApiResponse<Notification>> = await this.api.get(`/notifications/${id}`);
    return response.data.data;
  }

  async markNotificationAsRead(id: string): Promise<Notification> {
    const response: AxiosResponse<ApiResponse<Notification>> = await this.api.patch(`/notifications/${id}/read`, {});
    return response.data.data;
  }
}

export const apiService = new ApiService();