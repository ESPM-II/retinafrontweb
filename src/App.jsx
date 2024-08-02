import './App.css';
import "antd/dist/reset.css";
import { Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import Layer from './common/Layout';
import routes from './routes';
import { ApolloProvider } from '@apollo/client';
import client from './graphql/client.js';
import LoginForm from './components/Login/LoginForm.jsx';
import { useState, useEffect } from 'react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Función para manejar la autenticación
  const handleLogin = (token) => {
    localStorage.setItem('authToken', token);
    setIsAuthenticated(true);
  };

  // Verificar si el usuario ya está autenticado al cargar la aplicación
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <ApolloProvider client={client}>
      <Routes>
        <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
        {isAuthenticated ? (
          routes.map((route, index) => (
            <Route key={index} path={route.path} element={<Layer><route.component /></Layer>} exact />
          ))
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </ApolloProvider>
  );
}

function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-2xl text-gray-500">Página no encontrada!!!</p>
      <button
        type='button'
        onClick={() => navigate(-1)}
        className="px-4 py-2 mt-8 text-white bg-blue-500 rounded hover:bg-blue-600"
      >
        Regresar a página anterior
      </button>
    </div>
  );
}

export default App;
