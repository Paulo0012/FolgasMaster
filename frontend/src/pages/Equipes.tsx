import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Servidor } from '../types';
import { servidorService } from '../services/api';
import EquipeCard from '../components/Equipes/EquipeCard';

const Equipes: React.FC = () => {
    const [servidores, setServidores] = useState<Servidor[]>([]);
    const [loading, setLoading] = useState(true);

    // Definição das equipes conforme sua estrutura de blocos
    const equipesDefinicao = [
        { sigla: 'E1', nome: 'Equipe 1' },
        { sigla: 'E2', nome: 'Equipe 2' },
        { sigla: 'E3', nome: 'Equipe 3' },
        { sigla: 'E4', nome: 'Equipe 4' },
    ];

    useEffect(() => {
        servidorService.getAll()
            .then(res => setServidores(res.data))
            .catch(err => console.error("Erro ao carregar servidores:", err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Carregando...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4 fade-in">
            {/* Cabeçalho da Página */}
            <div className="d-flex justify-content-between align-items-center mb-5">
                <div>
                    <h2 className="fw-bold text-h mb-1">
                        <i className="fas fa-users-viewfinder text-primary me-2"></i>
                        Gestão de Equipes
                    </h2>
                    <p className="text-muted mb-0">Visualize e gerencie os servidores por bloco operacional.</p>
                </div>
                
                <Link to="/servidor/novo" className="btn btn-primary btn-modern shadow-sm">
                    <i className="fas fa-plus me-2"></i>Novo Servidor
                </Link>
            </div>

            {/* Grid de Equipes */}
            <div className="row g-4">
                {equipesDefinicao.map((eq) => {
                    const servidoresDaEquipe = servidores.filter(s => s.equipe === eq.sigla);
                    
                    return (
                        <div className="col-lg-6 animate__animated animate__fadeInUp" key={eq.sigla}>
                            <div className="h-100">
                                <EquipeCard 
                                    nomeEquipe={eq.nome} 
                                    siglaEquipe={eq.sigla} 
                                    servidores={servidoresDaEquipe} 
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Rodapé Informativo (Usando seu estilo #spacer e .ticks) */}
            <div id="spacer" className="mt-5"></div>
            <div className="ticks text-center">
                <small className="text-muted">FolgasMaster v1.0 - Sistema de Gestão Operacional</small>
            </div>
        </div>
    );
};

export default Equipes;