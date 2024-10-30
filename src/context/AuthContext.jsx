// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { USER_LOGIN } from '../graphql/Mutations/Users';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [loginMutation] = useMutation(USER_LOGIN);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const expiration = localStorage.getItem('tokenExpiration');

    console.log('Token almacenado:', token); // Verifica si el token existe
    console.log('Expiración del token:', expiration);

    if (token && new Date().getTime() < expiration) {
      setIsAuthenticated(true);
    } else {
      logout(); // Si el token ha expirado, cierra la sesión
    }
    setLoading(false);
  }, []);

  const login = async (loginData) => {
    console.log('Intentando iniciar sesión con:', loginData); // Verifica las variables enviadas

    try {
      const { data } = await loginMutation({
        variables: {
          login: loginData.login,
          password: loginData.password,
        },
      });

      console.log('Respuesta del servidor con Apollo:', data);

      const user = data?.userLogin?.user;

      if (user) {
        const expirationTime = new Date().getTime() + 60 * 60 * 1000; // 1 hora
        localStorage.setItem('authToken', user.tokenFirebase);
        localStorage.setItem('tokenExpiration', expirationTime);

        setIsAuthenticated(true);
        console.log('Redirigiendo a /campaigns...');
        navigate('/');
      } else {
        console.error('Error: Usuario no encontrado en la respuesta.');
        throw new Error('Usuario no encontrado.');
      }
    } catch (error) {
      console.error('Error durante el inicio de sesión:', error);
      console.log('Detalles del error:', error.networkError?.result || error);
      throw new Error('Falló la autenticación');
    }
  };

  const logout = () => {
    console.log('Cerrando sesión...'); // Confirmación de logout
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenExpiration');
    setIsAuthenticated(false);
    navigate('/login'); // Redirige a /login
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
  