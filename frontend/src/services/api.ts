import axios from 'axios';
import { Servidor, Afastamento } from '../types';

// Configuração base do Axios para o seu Django
const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/', 
});

// Serviços específicos para cada entidade
export const servidorService = {
    getAll: () => api.get<Servidor[]>('servidores/'),
    getById: (id: number) => api.get<Servidor>(`servidores/${id}/`),
};

export const afastamentoService = {
    getAll: () => api.get<Afastamento[]>('afastamentos/'),
};

export default api;