import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
});

const storedToken = localStorage.getItem('pachamama_admin_token');
if (storedToken) {
  api.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
}

export default api;
