import { TelegramWebApp } from '@/types';

declare global {
  interface Window {
    Telegram: {
      WebApp: TelegramWebApp;
    };
  }
}

export const useTelegram = () => {
  const tg = typeof window !== 'undefined' ? window.Telegram?.WebApp : null;
  
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
  };
};

export const TelegramUtils = {
  // Check if running in Telegram WebApp environment
  isInTelegram: (): boolean => {
    return typeof window !== 'undefined' && !!window.Telegram?.WebApp;
  },

  // Get user data from Telegram
  getUserData: () => {
    if (typeof window === 'undefined' || !window.Telegram?.WebApp) {
      return null;
    }
    return window.Telegram.WebApp.initDataUnsafe?.user || null;
  },

  // Initialize Telegram WebApp
  initializeApp: () => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      tg.BackButton.hide();
      return tg;
    }
    return null;
  },

  // Show back button with callback
  showBackButton: (callback: () => void) => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.BackButton.show();
      tg.BackButton.onClick(callback);
    }
  },

  // Hide back button
  hideBackButton: () => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      window.Telegram.WebApp.BackButton.hide();
    }
  },

  // Show main button with text and callback
  showMainButton: (text: string, callback: () => void) => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.MainButton.text = text;
      tg.MainButton.show();
      tg.MainButton.onClick(callback);
    }
  },

  // Hide main button
  hideMainButton: () => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      window.Telegram.WebApp.MainButton.hide();
    }
  },

  // Close the WebApp
  closeApp: () => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      window.Telegram.WebApp.close();
    }
  },
};