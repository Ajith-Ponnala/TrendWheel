import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  // TRANSIENT TOASTS
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // PERSISTENT NOTIFICATIONS
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('trendwheel_notifications');
    if (saved) {
      try {
        setNotifications(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse notifications', e);
      }
    }
  }, []);

  const saveNotifications = (newNotifs) => {
    setNotifications(newNotifs);
    localStorage.setItem('trendwheel_notifications', JSON.stringify(newNotifs));
  };

  const addPersistentNotification = useCallback(({ title, message, type = 'info', orderId = null, productId = null }) => {
    const newNotif = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      title,
      message,
      type,
      orderId,
      productId,
      timestamp: new Date().toISOString(),
      isRead: false
    };
    setNotifications((prev) => {
      const updated = [newNotif, ...prev];
      localStorage.setItem('trendwheel_notifications', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications((prev) => {
      const updated = prev.map(n => n.id === id ? { ...n, isRead: true } : n);
      localStorage.setItem('trendwheel_notifications', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => {
      const updated = prev.map(n => ({ ...n, isRead: true }));
      localStorage.setItem('trendwheel_notifications', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const deleteNotification = useCallback((id) => {
    setNotifications((prev) => {
      const updated = prev.filter(n => n.id !== id);
      localStorage.setItem('trendwheel_notifications', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    localStorage.removeItem('trendwheel_notifications');
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <NotificationContext.Provider value={{ 
      toasts, 
      addToast, 
      removeToast,
      notifications,
      unreadCount,
      addPersistentNotification,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      clearAllNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
