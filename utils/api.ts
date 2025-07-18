import { ApiResponse } from '@/types';

const API_BASE_URL = '/api';

export class ApiClient {
  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
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

  static async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async get<T>(endpoint: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }
    
    return this.request<T>(url, {
      method: 'GET',
    });
  }

  static async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  static async patch<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }
}

// Specific API functions for common operations
export const AdminAPI = {
  // Authentication
  login: async (credentials: {
    chat_id: number;
    email: string;
    username: string;
    password: string;
    twofa: string;
  }) => {
    return ApiClient.post('/admin_login', credentials);
  },

  // User management
  getUsers: async (start: number = 0, limit: number = 50) => {
    return fetch(`/api/get_igebeya_users?start=${start}&limit=${limit}`)
      .then(response => response.json());
  },

  // Send message to user
  sendMessage: async (messageData: {
    message: string;
    user_chatId: number;
    admin_chatId: number;
    sender_type: 'admin';
    token: string;
  }) => {
    return ApiClient.post('/webapp_data', messageData);
  },

  // Airdrop boost to user
  airdropBoost: async (data: {
    chat_id: number;
    type: 'adminairdrop';
    token: string;
    admin_chat_id: number;
  }) => {
    return ApiClient.post('/claim_tasks', data);
  },

  // Get user details
  getUserDetails: async (chatId: number) => {
    return ApiClient.get(`/user_details/${chatId}`);
  },

  // Ban/unban user
  toggleUserBan: async (data: {
    chat_id: number;
    action: 'ban' | 'unban';
    token: string;
    admin_chat_id: number;
  }) => {
    return ApiClient.post('/admin_actions', data);
  },

  // Update user verification status
  updateVerification: async (data: {
    chat_id: number;
    verification_status: 'blue' | 'pending' | 'grey';
    token: string;
    admin_chat_id: number;
  }) => {
    return ApiClient.post('/update_verification', data);
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