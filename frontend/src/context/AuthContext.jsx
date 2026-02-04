import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';

axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const { data } = await axios.get('/api/users/me', {   
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(data);
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          setError(null);
        } catch (e) {
          setError('Invalid or expired token. Please log in again.');
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
          delete axios.defaults.headers.common['Authorization'];
        }
      } else {
        setUser(null);
      }
    };
    verifyToken();
  }, [token]);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post('/api/users/login', { email, password });  
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser({ id: data._id, name: data.name, email: data.email });
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      setError(null);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await axios.post('/api/users/register', { name, email, password }); 
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser({ id: data._id, name: data.name, email: data.email });
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      setError(null);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    setError(null);
    navigate('/signin');
  };

  const value = { user, token, error, login, register, logout };

  return (
    <AuthContext.Provider value={value}>
      {error && (
        <div className="alert alert-danger text-center" role="alert" style={{ margin: '10px 0' }}>
          {error}
        </div>
      )}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
