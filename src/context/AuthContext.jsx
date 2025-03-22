import { createContext, useContext, useState, useEffect } from 'react';
import { mockApi } from '../config/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await mockApi.checkAuth();
        if (response.success) {
          setUser(response.data);
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await mockApi.login(email, password);
      if (response.success) {
        setUser(response.data);
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: 'An error occurred' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await mockApi.signout();
    } catch (error) {
      console.error('Signout error:', error);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser, // Must include setUser in the value prop
      loading, 
      login, 
      logout }}>
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