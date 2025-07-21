// utils/api.ts
import { ApiResponse, Item, User, ReportMessage, VerificationDetails } from '@/types';
import { AuthUtils } from './auth';

const API_BASE_URL = '/api';

export class ApiClient {
  private static async request<T>(
    endpoint: string,
    options: RequestInit = {},
    requiresAuth: boolean = true
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers = new Headers({
      'Content-Type': 'application/json',
      ...((options.headers as Headers) || {}),
    });

    // Add JWT token for authenticated requests
    if (requiresAuth) {
      const token = AuthUtils.getToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }
    
    const config: RequestInit = {
      headers,
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw new Error('Network request failed');
    }
  }

  static async post<T>(endpoint: string, data: any, requiresAuth: boolean = true): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }, requiresAuth);
  }

  static async get<T>(endpoint: string, params?: Record<string, string>, requiresAuth: boolean = true): Promise<T> {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }
    
    return this.request<T>(url, {
      method: 'GET',
    }, requiresAuth);
  }
}

// Specific API functions based on the documentation
export const AdminAPI = {
  // Authentication
  login: async (credentials: {
    email: string;
    chat_id: number;
    username: string;
    password: string;
    twofa: string;
  }) => {
    return ApiClient.post('/admin_login', credentials, false); // No auth required for login
  },

  // Admin Management
  getAdmins: async (chat_id: number) => {
    return ApiClient.post('/get_admins', { chat_id });
  },

  addAdmin: async (data: {
    new_admin_chat_id: string;
    admin_chat_id: number;
    role: string;
    password: string;
    email: string;
    username: string;
  }) => {
    return ApiClient.post('/add_admin', data);
  },

  // User Management
  getUsers: async (start: number = 0, limit: number = 20) => {
    return ApiClient.get('/get_igebeya_users', { 
      start: start.toString(), 
      limit: limit.toString() 
    });
  },

  // User Verification
  getUserVerificationDetails: async (data: {
    chat_id: string;
    admin_chat_id: number;
  }) => {
    return ApiClient.post('/get_user_verification_details', data);
  },

  adminActionVerification: async (data: {
    chat_id: string;
    admin_chat_id: number;
    status: string;
    identification_number: string;
  }) => {
    return ApiClient.post('/admin_action_verification', data);
  },

  // Item Management
  getSellerItems: async (chat_id: number, start: number = 0, limit: number = 20) => {
    return ApiClient.get('/get_seller_items_admin', { 
      chat_id: chat_id.toString(),
      start: start.toString(), 
      limit: limit.toString() 
    });
  },

  getItemDetails: async (item_id: number) => {
    return ApiClient.get('/get_item_details', { 
      item_id: item_id.toString() 
    });
  },

  adminUnlistItem: async (data: {
    itemId: string;
    chat_id: number;
    seller_chat_id: number;
    reports?: string;
  }) => {
    return ApiClient.post('/admin_unlist_item', data);
  },

  // Communication
  sendMessage: async (messageData: {
    message?: string;
    user_chatId: number;
    admin_chatId: number;
    sender_type: 'admin';
  }) => {
    return ApiClient.post('/webapp_data', messageData);
  },

  // Task Management (Airdrops)
  airdropBoost: async (data: {
    chat_id: number;
    type: 'adminairdrop';
    admin_chat_id: number;
  }) => {
    return ApiClient.post('/claim_tasks', data);
  },

  // Reporting
  getReportMessages: async (item_id: number, chat_id: number) => {
    return ApiClient.get('/get_report_messages', { 
      item_id: item_id.toString(),
      chat_id: chat_id.toString()
    });
  },
};

// Error handling utility
export const handleApiError = (error: any): string => {
  if (error?.message) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
};