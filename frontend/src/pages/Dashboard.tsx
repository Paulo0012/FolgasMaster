import React, { useEffect, useState } from 'react';
import type { Servidor, Afastamento } from '../types';
import { servidorService, afastamentoService } from '../services/api';

// Importação dos sub-componentes
import StatusCard from '../components/Dashboard/StatusCard';
import AfastadosList from '../components/Dashboard/AfastadosList';
import TabelaGeral from '../components/Dashboard/TabelaGeral';

const Dashboard: React.FC = () => {
    const [servidores, setServidores] = useState<Servidor[]>([]);
    const [afastados, setAfastados] = useState<Afastamento[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [sRes, aRes] = await Promise.all([
                    servidorService.getAll(),
                    afastamentoService.getAll()
                ]);
                setServidores(sRes.data);
                
                const hoje = new Date().toISOString().split('T')[0];
                setAfastados(aRes.data.filter(af => hoje >= af.data_inicio && hoje <= af.data_fim));
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) return <div className="text-center mt-5">Carregando...</div>;

    return (
        <div className="container mt-5 p-4">
            <h1 className="text-center mb-5">Dashboard de Escalas</h1>
            
            {/* Chamando os componentes fatiados */}
            {servidores.length > 0 && <StatusCard servidor={servidores[0]} />}
            
            <AfastadosList afastados={afastados} servidores={servidores} />
            
            <hr className="my-5" />
            
            <h2 className="mb-4 text-secondary">Previsão Geral</h2>
            <TabelaGeral servidores={servidores} />
        </div>
    );
};

export default Dashboard;