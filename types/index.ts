// types/index.ts
export interface TelegramWebApp {
  initDataUnsafe: {
    user: {
      id: number;
      first_name?: string;
      last_name?: string;
      username?: string;
    };
    query_id?: string;
  };
  BackButton: {
    show(): void;
    hide(): void;
    onClick(callback: () => void): void;
    offClick(callback: () => void): void;
  };
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    show(): void;
    hide(): void;
    enable(): void;
    disable(): void;
    onClick(callback: () => void): void;
    offClick(callback: () => void): void;
  };
  expand(): void;
  close(): void;
  ready(): void;
}

export interface User {
  id: number;
  username: string;
  email: string;
  chat_id: number;
  status: string;
  date: string;
  verified: 'blue' | 'pending' | 'grey';
  boost: number;
  boosted_items: number;
  reported_items: number;
  unlisted_reported: number;
  total_items: number;
  total_views: number;
  last_checkin: string;
  expiry_date: string;
}

export interface Admin {
  id: number;
  username: string;
  email: string;
  chat_id: number;
  role: string;
  created_at: string;
}

export interface Item {
  id: number;
  title: string;
  description: string;
  price: number;
  seller_chat_id: number;
  seller_username: string;
  category: string;
  images: string[];
  status: 'active' | 'sold' | 'unlisted';
  created_at: string;
  updated_at: string;
  views: number;
  is_boosted: boolean;
}

export interface VerificationDetails {
  chat_id: string;
  identification_number: string;
  full_name: string;
  document_type: string;
  document_images: string[];
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
}

export interface ReportMessage {
  id: number;
  item_id: number;
  reporter_chat_id: number;
  reporter_username: string;
  reason: string;
  description: string;
  reported_at: string;
}

export interface LoginFormData {
  email: string;
  username: string;
  password: string;
  twofa: string;
}

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message: string;
  data?: T;
  token?: string;
}

export interface NotificationState {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export interface AdminActionRequest {
  chat_id: number;
  type: string;
  admin_chat_id: number;
}

export interface MessageData {
  message?: string;
  user_chatId: number;
  admin_chatId: number;
  sender_type: 'admin' | 'user';
}

export interface NavigationItem {
  id: string;
  name: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export interface VerificationBadge {
  text: string;
  color: string;
}

// New types based on API documentation
export interface AddAdminRequest {
  new_admin_chat_id: string;
  admin_chat_id: number;
  role: string;
  password: string;
  email: string;
  username: string;
}

export interface UserVerificationRequest {
  chat_id: string;
  admin_chat_id: number;
  status: string;
  identification_number: string;
}

export interface UnlistItemRequest {
  itemId: string;
  chat_id: number;
  seller_chat_id: number;
  reports?: string;
}

export interface AirdropRequest {
  chat_id: number;
  type: 'adminairdrop';
  admin_chat_id: number;
}