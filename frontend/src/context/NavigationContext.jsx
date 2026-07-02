import React, { createContext, useContext, useState } from 'react';

const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
  const [currentView, setCurrentView] = useState('home');
  const [isOwnerModalOpen, setIsOwnerModalOpen] = useState(false);

  return (
    <NavigationContext.Provider value={{ currentView, setCurrentView, isOwnerModalOpen, setIsOwnerModalOpen }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
