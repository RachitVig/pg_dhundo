import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);


  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('pg_user');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
    } catch {
      // Corrupt data — clear it
      localStorage.removeItem('pg_user');
      localStorage.removeItem('pg_token');
    }
  }, []);

  /**
   * Called after a successful login/register API response.
   * Stores both the user object and the JWT access_token.
   *
   * @param {object} user        - User object from API response
   * @param {string} accessToken - JWT token from API response
   */
  const login = (user, accessToken) => {
    setCurrentUser(user);
    localStorage.setItem('pg_user', JSON.stringify(user));
    if (accessToken) {
      localStorage.setItem('pg_token', accessToken);
    }
    setIsLoginModalOpen(false);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('pg_user');
    localStorage.removeItem('pg_token');
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      login,
      logout,
      isLoginModalOpen,
      setIsLoginModalOpen,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
