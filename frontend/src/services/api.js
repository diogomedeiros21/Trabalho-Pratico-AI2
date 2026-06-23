import axios from 'axios';

// Cria a ligação principal
const api = axios.create({
  baseURL: 'http://localhost:3000'
});

api.interceptors.request.use((config) => {
  // Vai procurar o token guardado no browser
  const token = localStorage.getItem('token');
  
  if (token) {
    // Assim o servidor sabe quem somos e deixa-nos aceder a rotas protegidas
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config; // Deixa o pedido seguir viagem
}, (error) => {
  return Promise.reject(error);
});

export default api;