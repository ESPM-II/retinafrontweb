import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import locale from 'antd/locale/en_US.js';
import { ToastBar, Toaster, toast } from 'react-hot-toast'
import { IoCloseSharp } from 'react-icons/io5'
import { BiLoaderCircle } from 'react-icons/bi'
import { ConfigProvider, Button } from 'antd';
// import { localeEsDayjs } from './utils/localeFormat.jsx';
import 'dayjs/locale/en.js';
import './index.css';





// localeEsDayjs()
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 30000,
      onError: (error) => {
        if (error.response) {
          const status = error.response.status;
          if (status === 400) {
            toast.error('Los datos enviados son inválidos.');
          } else if (status === 401) {
            console.log('Error: No estás autorizado para realizar esta acción.');
          } else if (status === 404) {
            toast.error('Error: No se encontró el recurso solicitado.');
          } else {
            toast.error('Ocurrió un error inesperado. Por favor, contáctenos.');
          }
        } else {
          toast.error('No se pudo conectar al servidor. Por favor, verifica tu conexión.');
        }
      }
    },
    mutations: {
      retry: false,
      onError: (error) => {
        if (error.response) {
          const status = error.response.status;
          if (status === 400) {
            toast.error('Los datos enviados son inválidos.');
          } else if (status === 401) {
            console.log('Error: No estás autorizado para realizar esta acción.');
          } else if (status === 404) {
            toast.error('Error: No se encontró el recurso solicitado.');
          } else {
            toast.error('Ocurrió un error inesperado. Por favor, contáctenos.');
          }
        } else {
          toast.error('No se pudo conectar al servidor. Por favor, verifica tu conexión.');
        }
      }
    }
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ConfigProvider 
        locale={locale}
        theme={{
          token: {
            colorPrimary: "#66a3f7",
            colorBgContainer: "#eff6ff",
            colorInfo: "#66a3f7",
            colorSuccess: "#6e9859",
            colorError: "#c74a4c",
            colorLink: "#266172",
            colorTextBase: "#3c3939"
          },
          components: {
            Descriptions: {
              padding: 3,
              paddingXS: 1,
              paddingSM: 2,
              paddingLG: 3,
            },
            Table: {
              headerBg: "#199276",
              headerColor: "#FFFFFF",
              headerBorderRadius: 4,
              headerSortHoverBg: "#155e75",
              headerSortActiveBg: "#155e75",
              headerSplitColor: "#eff6ff",
              bodySortBg: "#155e75",
              rowHoverBg: "#dbeafe",
            },
            Modal: {
              // headerBg: "#266172",
              headerBg: "#eff6ff",
              contentBg: "#eff6ff",
              footerBg: "#eff6ff",
              titleLineHeight: "2"
            },
          }
          
        }}
      >
          <App />
        <Toaster
          position="top-right"
          reverseOrder={false}
          gutter={8}
          containerClassName=""
          containerStyle={{}}
          toastOptions={{
            // Define default options
            className: 'bg-white text-sm w-full p-2 text-white',
            duration: 3000,
            style: {
              background: 'white',
              fontSize: '16px',
              width: '100%',
              minWidth: '450px',
              /* border: '1px solid #713200', */
              padding: '8px',
              color: '#212529',
            },
            /* success: {
              icon: <div className='flex items-center justify-center w-8 h-full'>
                <BsCheck2Circle size="1.2em" enableBackground className='w-full h-full bg-green-400' color='green'/>
              </div>
            } */
          }}
        >
          {(t) => (
            <ToastBar
              toast={t}
              style={{
                ...t.style,
                animation: t.visible ? 'custom-enter 1s ease' : 'custom-exit 1s ease',
              }}
            >
              {({ icon, message }) => (
                <div className='flex flex-row items-center justify-around w-full h-full'>
                  {t.type !== 'loading' ? icon : <BiLoaderCircle size="1.5em" className='animate-spin' color="#66a3f7"/>}
                  {message}
                  {t.type !== 'loading' && (
                    <Button type="link" className="text-gray-900" onClick={() => toast.remove(t.id)}>
                      <IoCloseSharp size="1.2em" />
                    </Button>
                  )}
                </div>
              )}
            </ToastBar>
          )}
        </Toaster>
      </ConfigProvider>
    </BrowserRouter>
    <ReactQueryDevtools />
  </QueryClientProvider>
  </React.StrictMode>,
)
