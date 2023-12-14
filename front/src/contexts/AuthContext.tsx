import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

interface AuthContextType {
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<void>;
  newUser: (shop: string, username: string, password: string) => Promise<void>;
  logout: () => void;
  message: string;
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
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoggedIn = () => {
      if (isLoggedIn) {
        const username = localStorage.getItem('username');
        navigate(`/shop/${username}`);
      }
    };

    checkLoggedIn();
  }, [isLoggedIn, navigate]);

  const login = async (username: string, password: string): Promise<void> => {
    try {
      const response = await api.post("/user/login", { username, password });
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('username', username);
        setIsLoggedIn(true);
        navigate(`/shop/${username}`);
      } else {
        setMessage("Usuário ou senha inválidos");
      }
    } catch (error) {
      setMessage("Ocorreu um erro interno, tente novamente mais tarde.");
    }
  };

  const newUser = async (shop: string, username: string, password: string): Promise<void> => {
    try {
      const response = await api.post("/user/register", { shop, username, password });
      console.log(response);
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('username', username);
        setIsLoggedIn(true);
        navigate(`/shop/${username}`);
      } else {
        setMessage("Usuário ou senha inválidos");
      }
    } catch (error) {
      setMessage("Ocorreu um erro interno, tente novamente mais tarde.");
    }
  };

  const logout = (): void => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setMessage("");
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, newUser, logout, message }}>
      {children}
    </AuthContext.Provider>
  );
};
