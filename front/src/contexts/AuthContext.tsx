import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

interface AuthContextType {
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: any) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const login = async (username: string, password: string): Promise<void> => {
    try {
      const response = await api.post("/user/login", { username, password });
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        setIsLoggedIn(true);
        navigate(`/shop/${username}`);
      } else {
        throw new Error('Token not found in response');
      }
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  const logout = (): void => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
