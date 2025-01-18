const authUtils = {
    getAuthToken: () => localStorage.getItem('token'),
    
    setAuthToken: (token) => {
      if (token) {
        localStorage.setItem('token', token);
      }
    },
  
    clearAuth: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user'); 
    },
  
    getCurrentUser: () => {
      try {
        return JSON.parse(localStorage.getItem('user'));
      } catch {
        return null;
      }
    },
  
    // Tạo instance axios với interceptor
    createAuthAxios: () => {
      const authAxios = axios.create();
      
      authAxios.interceptors.request.use(
        (config) => {
          const token = authUtils.getAuthToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
          return config;
        },
        (error) => Promise.reject(error)
      );
  
      authAxios.interceptors.response.use(
        (response) => response,
        async (error) => {
          if (error.response?.status === 401) {
            authUtils.clearAuth();
            window.location.href = '/login';
          }
          return Promise.reject(error);
        }
      );
  
      return authAxios;
    }
  };