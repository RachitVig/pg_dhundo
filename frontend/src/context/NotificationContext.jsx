import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'new', title: 'Fresh Listing', message: 'Premium Girls PG in Sector 34 just added!', time: '2m ago', unread: true },
    { id: 2, type: 'freeing', title: 'Vacancy Alert', message: 'A bed is freeing up in "Skyline Boys" on 25th April.', time: '1h ago', unread: true },
    { id: 3, type: 'system', title: 'Welcome', message: 'Welcome to the premium PG Dhundo network.', time: '5h ago', unread: false }
  ]);

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  return (
    <NotificationContext.Provider value={{ notifications, setNotifications, markAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
