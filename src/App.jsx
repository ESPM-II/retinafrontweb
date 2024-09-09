import './App.css';
import "antd/dist/reset.css";
import { Route, Routes, Navigate } from 'react-router-dom';
import Layer from './common/Layout';
import routes from './routes';
import { ApolloProvider } from '@apollo/client';
import client from './graphql/client.js';
import LoginForm from './components/Login/LoginForm.jsx';
import { AuthProvider } from './context/AuthContext';
import AuthContext from './context/AuthContext';
import { useContext } from 'react';

const ProtectedRoute = ({ element }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    // Puedes mostrar un spinner o mensaje de carga
    return <div>Loading...</div>;
  }

  return isAuthenticated ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          {routes.map((route, index) => (
            <Route 
              key={index} 
              path={route.path} 
              element={<ProtectedRoute element={<Layer><route.component /></Layer>} />} 
              exact 
            />
          ))}
        </Routes>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
