// hooks/useNotification.ts
import { useState, useCallback } from 'react';
import { NotificationState } from '@/types';

export const useNotification = () => {
  const [notification, setNotification] = useState<NotificationState | null>(null);

  const showNotification = useCallback((
    message: string, 
    type: NotificationState['type'] = 'success',
    duration: number = 3000
  ) => {
    setNotification({ message, type });
    
    // Auto-hide notification after specified duration
    setTimeout(() => {
      setNotification(null);
    }, duration);
  }, []);

  const hideNotification = useCallback(() => {
    setNotification(null);
  }, []);

  // Show specific notification types
  const showSuccess = useCallback((message: string, duration?: number) => {
    showNotification(message, 'success', duration);
  }, [showNotification]);

  const showError = useCallback((message: string, duration?: number) => {
    showNotification(message, 'error', duration);
  }, [showNotification]);

  const showWarning = useCallback((message: string, duration?: number) => {
    showNotification(message, 'warning', duration);
  }, [showNotification]);

  const showInfo = useCallback((message: string, duration?: number) => {
    showNotification(message, 'info', duration);
  }, [showNotification]);

  return {
    notification,
    showNotification,
    hideNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};

// Alternative hook for multiple notifications (queue system)
export const useNotificationQueue = () => {
  const [notifications, setNotifications] = useState<(NotificationState & { id: string })[]>([]);

  const addNotification = useCallback((
    message: string,
    type: NotificationState['type'] = 'success',
    duration: number = 3000
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification = { id, message, type };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto-remove after duration
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, duration);

    return id;
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
  };
};