import axios from 'axios';

// Cria a instância base do Axios a apontar para o teu Backend
const api = axios.create({
  baseURL: 'http://localhost:3000', 
});

// "O Segurança VIP" - Intercetor de Pedidos
// Antes de qualquer pedido sair do frontend, ele verifica se tens o bilhete (Token)
api.interceptors.request.use((config) => {
  // Lê o token que ficou guardado no navegador quando o utilizador fez login
  const token = localStorage.getItem('token'); 
  
  if (token) {
    // Se existir token, espeta-o no cabeçalho de segurança
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;