// utils/telegram.ts (Updated for local development)
import { TelegramWebApp } from '@/types';

declare global {
  interface Window {
    Telegram: {
      WebApp: TelegramWebApp;
    };
  }
}

const TELEGRAM_CHAT_ID = Number(process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID) || 123456789;

// Mock Telegram WebApp for local development
const createMockTelegramWebApp = (): TelegramWebApp => ({
  initDataUnsafe: {
    user: {
      id: TELEGRAM_CHAT_ID,
      first_name: 'Test',
      last_name: 'Admin',
      username: 'testadmin',
    },
    query_id: 'mock_query_id',
  },
  BackButton: {
    show: () => console.log('BackButton.show()'),
    hide: () => console.log('BackButton.hide()'),
    onClick: (callback: () => void) => console.log('BackButton.onClick()'),
    offClick: (callback: () => void) => console.log('BackButton.offClick()'),
  },
  MainButton: {
    text: 'Main Button',
    color: '#2481cc',
    textColor: '#ffffff',
    isVisible: false,
    isActive: true,
    show: () => console.log('MainButton.show()'),
    hide: () => console.log('MainButton.hide()'),
    enable: () => console.log('MainButton.enable()'),
    disable: () => console.log('MainButton.disable()'),
    onClick: (callback: () => void) => console.log('MainButton.onClick()'),
    offClick: (callback: () => void) => console.log('MainButton.offClick()'),
  },
  expand: () => console.log('WebApp.expand()'),
  close: () => console.log('WebApp.close()'),
  ready: () => console.log('WebApp.ready()'),
});

export const useTelegram = () => {
  // Check if we're in development mode
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  let tg: TelegramWebApp | null = null;
  
  if (typeof window !== 'undefined') {
    if (window.Telegram?.WebApp) {
      // Real Telegram WebApp is available
      tg = window.Telegram.WebApp;
    } else if (isDevelopment) {
      // Use mock for local development
      console.log('🔧 Development Mode: Using mock Telegram WebApp');
      tg = createMockTelegramWebApp();
    }
  }
  
  const onClose = () => {
    tg?.close();
  };

  const onToggleButton = () => {
    if (tg?.MainButton.isVisible) {
      tg.MainButton.hide();
    } else {
      tg?.MainButton.show();
    }
  };

  const expandApp = () => {
    tg?.expand();
  };

  const readyApp = () => {
    tg?.ready();
  };

  return {
    tg,
    user: tg?.initDataUnsafe?.user,
    queryId: tg?.initDataUnsafe?.query_id,
    onClose,
    onToggleButton,
    expandApp,
    readyApp,
    isDevelopment,
  };
};

export const TelegramUtils = {
  // Check if running in Telegram WebApp environment
  isInTelegram: (): boolean => {
    return typeof window !== 'undefined' && !!window.Telegram?.WebApp;
  },

  // Check if in development mode
  isDevelopment: (): boolean => {
    return process.env.NODE_ENV === 'development';
  },

  // Get user data from Telegram (with fallback for development)
  getUserData: () => {
    if (typeof window === 'undefined') return null;
    
    if (window.Telegram?.WebApp) {
      return window.Telegram.WebApp.initDataUnsafe?.user || null;
    } else if (TelegramUtils.isDevelopment()) {
      // Return mock user for development
      return {
        id: 5021900407,
        first_name: 'Test',
        last_name: 'Admin',
        username: 'testadmin',
      };
    }
    
    return null;
  },

  // Initialize Telegram WebApp (with development fallback)
  initializeApp: () => {
    if (typeof window !== 'undefined') {
      if (window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.ready();
        tg.expand();
        tg.BackButton.hide();
        return tg;
      } else if (TelegramUtils.isDevelopment()) {
        console.log('🔧 Development Mode: Mock Telegram WebApp initialized');
        return createMockTelegramWebApp();
      }
    }
    return null;
  },

  // Show back button with callback
  showBackButton: (callback: () => void) => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.BackButton.show();
      tg.BackButton.onClick(callback);
    } else if (TelegramUtils.isDevelopment()) {
      console.log('🔧 Development Mode: BackButton.show() called');
    }
  },

  // Hide back button
  hideBackButton: () => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      window.Telegram.WebApp.BackButton.hide();
    } else if (TelegramUtils.isDevelopment()) {
      console.log('🔧 Development Mode: BackButton.hide() called');
    }
  },

  // Show main button with text and callback
  showMainButton: (text: string, callback: () => void) => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.MainButton.text = text;
      tg.MainButton.show();
      tg.MainButton.onClick(callback);
    } else if (TelegramUtils.isDevelopment()) {
      console.log(`🔧 Development Mode: MainButton.show("${text}") called`);
    }
  },

  // Hide main button
  hideMainButton: () => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      window.Telegram.WebApp.MainButton.hide();
    } else if (TelegramUtils.isDevelopment()) {
      console.log('🔧 Development Mode: MainButton.hide() called');
    }
  },

  // Close the WebApp
  closeApp: () => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      window.Telegram.WebApp.close();
    } else if (TelegramUtils.isDevelopment()) {
      console.log('🔧 Development Mode: WebApp.close() called');
    }
  },
};