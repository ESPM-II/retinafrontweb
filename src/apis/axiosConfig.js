import axios from 'axios';


const baseURL = {
  production: import.meta.env.VITE_PROD_API,
  qa: import.meta.env.VITE_QA_API,
  development: import.meta.env.VITE_DEV_API,
};
const ENV = import.meta.env.VITE_ENV;


// const token = useAuthStore.getState().token;
  
  const axiosConfig = axios.create({
    baseURL: baseURL[ENV],
  });

  /* axiosConfig.interceptors.request.use((config) => {
    if (token) {
      config.headers = {
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  }); */

  /* axiosConfig.interceptors.response.use((config) => {
    console.log("ASASASASAS", config);
    return config;
  }); */

export default axiosConfig;
