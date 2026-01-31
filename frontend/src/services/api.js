import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL + '/api',
  withCredentials: true
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  r => r,
  async err => {
    if (err.response?.status === 401) {
      const res = await api.post('/auth/refresh');
      localStorage.setItem('token', res.data.token);
      err.config.headers.Authorization = `Bearer ${res.data.token}`;
      return api(err.config);
    }
    throw err;
  }
);

export default api;
