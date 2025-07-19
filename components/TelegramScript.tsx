'use client';

import { useEffect } from 'react';

export default function TelegramScript() {
  useEffect(() => {
    // Only load the script if we're not in development mode
    // or if Telegram WebApp is not already available
    if (process.env.NODE_ENV === 'production' && !window.Telegram?.WebApp) {
      const script = document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-web-app.js';
      script.async = true;
      document.head.appendChild(script);

      return () => {
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      };
    }
  }, []);

  return null;
}