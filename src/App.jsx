import './App.css'
import "antd/dist/reset.css";
import { Route, Routes, useNavigate } from 'react-router-dom'
import Layer from './common/Layout'
import routes from './routes';
import { ApolloProvider } from '@apollo/client';
import client from './graphql/client.js'


function App() {


  return (
    <ApolloProvider client={client}>
    <Routes>
      {routes.map((route, index)=> { 
        return <Route key={index} path={route.path} element={<Layer><route.component/></Layer>} exact/>
      })}
    </Routes>
    </ApolloProvider>
  )
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

export default App
