import axios, { AxiosError } from 'axios';
// Configuração do Axios. Coloquei um timeout de 10s pra não deixar o usuário esperando pra sempre se a API travar.
const api = axios.create({
  baseURL: 'https://pet-manager-api.geia.vip/q/',
  timeout: 10000, // 10 segundos de timeout
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if(token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    if (!error.response) {
      // Erro de rede ou servidor fora do ar
      console.error('Erro de conexão:', error.message);
      return Promise.reject({
        message: 'Não foi possível conectar ao servidor. Verifique sua internet.',
        isNetworkError: true
      });
    }

    const status = error.response.status;
    let message = 'Ocorreu um erro inesperado.';

    switch (status) {
      case 400:
        message = 'Dados inválidos. Verifique os campos preenchidos.';
        break;
      case 401:
        message = 'Sessão expirada. Por favor, faça login novamente.';
        break;
      case 403:
        message = 'Você não tem permissão para realizar esta ação.';
        break;
      case 404:
        message = 'Recurso não encontrado.';
        break;
      case 500:
        message = 'Erro interno no servidor. Tente novamente mais tarde.';
        break;
    }

    return Promise.reject({
      status,
      message,
      data: error.response.data
    });
  }
);

export default api;
