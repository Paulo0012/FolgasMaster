// frontend/src/services/api.ts
import axios from 'axios';
import type { Servidor, Afastamento } from '../types';

// 1. Configuração base da instância
const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
    headers: {
        'Content-Type': 'application/json',
    }
});

// 2. Interceptor para Injeção de Token (Padrão JWT)
// Esse código roda antes de cada requisição ao servidor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            // Adiciona o prefixo 'Bearer' exigido pelo simple-jwt do Django
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 3. Interceptor para Respostas (Tratamento de erro de autenticação)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Se o servidor retornar 401 (Não autorizado), limpa o token e manda pro login
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            // Só redireciona se não estivermos já na página de login
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// 4. Definição dos Serviços (Endpoints)
export const authService = {
    // Rota que criamos no Django: api/token/
    login: (credentials: any) => api.post('token/', credentials),
};

export const servidorService = {
    getAll: () => api.get<Servidor[]>('servidores/'),
    getById: (id: number) => api.get<Servidor>(`servidores/${id}/`),
    getMe: () => api.get<Servidor>('servidores/me/'),
    create: (data: FormData) => api.post('servidores/', data, {
        headers: { 'Content-Type': 'multipart/form-data' } // Importante para fotos
    }),
};

export const afastamentoService = {
    getAll: () => api.get<Afastamento[]>('afastamentos/'),
};

export default api;