import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { UserCredentials } from '../types';

interface AuthContextType {
  isLoggedIn: boolean;
  userCredentials: UserCredentials | null;
  login: (credentials: UserCredentials) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  userCredentials: null,
  login: () => {},
  logout: () => {}
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userCredentials, setUserCredentials] = useState<UserCredentials | null>(null);

  // Check local storage for existing user session
  useEffect(() => {
    const storedCredentials = localStorage.getItem('userCredentials');
    if (storedCredentials) {
      try {
        const parsedCredentials = JSON.parse(storedCredentials) as UserCredentials;
        setUserCredentials(parsedCredentials);
        setIsLoggedIn(true);
      } catch (error) {
        localStorage.removeItem('userCredentials');
      }
    }
  }, []);

  const login = (credentials: UserCredentials) => {
    // Save credentials to local storage
    localStorage.setItem('userCredentials', JSON.stringify(credentials));
    setUserCredentials(credentials);
    setIsLoggedIn(true);
  };

  const logout = () => {
    // Remove credentials from local storage
    localStorage.removeItem('userCredentials');
    setUserCredentials(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userCredentials, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
