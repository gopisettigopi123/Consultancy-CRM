import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { logoutUser } from '../services/api';


const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('crm_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          logout();
        } else {
          const stored = JSON.parse(localStorage.getItem('crm_user') || '{}');
          setUser(stored);
        }
      } catch {
        logout();
      }
    }
    setLoading(false);
  }, [token]);

  const login = (userData, authToken) => {
    localStorage.setItem('crm_token', authToken);
    localStorage.setItem('crm_user', JSON.stringify(userData));
    setToken(authToken);
    setUser(userData);
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      console.error('Logout API failed:', e);
    }
    localStorage.removeItem('crm_token');
    localStorage.removeItem('crm_user');
    setToken(null);
    setUser(null);
  };


  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
