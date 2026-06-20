import axios from 'axios';

// Cria a ligação base
const api = axios.create({
  baseURL: 'http://localhost:3000' // Confirma se esta é a porta do teu backend
});

// Este "interceptor" funciona como um segurança na fronteira.
// Antes de qualquer pedido sair do React para o Node, ele verifica se há um token
// e coloca-o no cabeçalho (Headers) da requisição.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    // Adiciona o token no formato padrão que o JWT espera
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;