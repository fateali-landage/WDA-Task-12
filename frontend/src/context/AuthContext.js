import { createContext, useContext, useEffect, useState } from 'react';
import axios from '../services/api';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get('/auth/me').then(res => setUser(res.data.user));
  }, []);

  const login = async (data) => {
    const res = await axios.post('/auth/login', data);
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
  };

  return (
    <AuthContext.Provider value={{ user, login }}>
      {children}
    </AuthContext.Provider>
  );
};
