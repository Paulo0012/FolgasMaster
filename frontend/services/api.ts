import axios from 'axios';
import { Servidor, Afastamento } from '../types';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/', // URL do seu Django
});

export const servidorService = {
    getAll: () => api.get<Servidor[]>('servidores/'),
    getById: (id: number) => api.get<Servidor>(`servidores/${id}/`),
};

export const afastamentoService = {
    getAll: () => api.get<Afastamento[]>('afastamentos/'),
};

export default api;