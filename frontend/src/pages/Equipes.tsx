import React, { useEffect, useState } from 'react';
import { Servidor } from '../types';
import { servidorService } from '../services/api';
import EquipeCard from '../components/Equipes/EquipeCard';

const Equipes: React.FC = () => {
    const [servidores, setServidores] = useState<Servidor[]>([]);
    const [loading, setLoading] = useState(true);

    const equipesDefinicao = [
        { sigla: 'E1', nome: 'Equipe 1' },
        { sigla: 'E2', nome: 'Equipe 2' },
        { sigla: 'E3', nome: 'Equipe 3' },
        { sigla: 'E4', nome: 'Equipe 4' },
    ];

    useEffect(() => {
        servidorService.getAll()
            .then(res => setServidores(res.data))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="text-center mt-5">Carregando Equipes...</div>;

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2><i className="fas fa-users me-2"></i>Gestão de Equipes</h2>
                <button className="btn btn-primary">
                    <i className="fas fa-user-plus me-2"></i>Novo Servidor
                </button>
            </div>

            <div className="row">
                {equipesDefinicao.map(eq => (
                    <div className="col-lg-6" key={eq.sigla}>
                        <EquipeCard 
                            nomeEquipe={eq.nome} 
                            siglaEquipe={eq.sigla} 
                            servidores={servidores.filter(s => s.equipe === eq.sigla)} 
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Equipes;