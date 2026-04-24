import React, { useEffect, useState } from 'react';
import type { Servidor, Afastamento } from '../types';
import { servidorService, afastamentoService } from '../services/api';

// Importação dos sub-componentes fatiados
import StatusCard from '../components/Dashboard/StatusCard';
import AfastadosList from '../components/Dashboard/AfastadosList';
import TabelaGeral from '../components/Dashboard/TabelaGeral';

const Dashboard: React.FC = () => {
    const [servidores, setServidores] = useState<Servidor[]>([]);
    const [afastados, setAfastados] = useState<Afastamento[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // No futuro, buscaremos o usuário logado via API de Auth. 
    // Por enquanto, pegamos o primeiro servidor da lista como "perfil ativo".
    const [meuPerfil, setMeuPerfil] = useState<Servidor | null>(null);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                setLoading(true);
                // Busca servidores e afastamentos em paralelo
                const [resServidores, resAfastados] = await Promise.all([
                    servidorService.getAll(),
                    afastamentoService.getAll()
                ]);

                setServidores(resServidores.data);

                // Lógica para filtrar afastados HOJE
                const hojeStr = new Date().toISOString().split('T')[0];
                const ativosHoje = resAfastados.data.filter(af => 
                    hojeStr >= af.data_inicio && hojeStr <= af.data_fim
                );
                setAfastados(ativosHoje);

                // Define o primeiro servidor como perfil de teste
                if (resServidores.data.length > 0) {
                    setMeuPerfil(resServidores.data[0]);
                }

                setError(null);
            } catch (err) {
                console.error("Erro ao carregar dashboard:", err);
                setError("Não foi possível conectar ao servidor. Verifique se o Django está rodando.");
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Carregando...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger mt-5" role="alert">
                <i className="fas fa-exclamation-triangle me-2"></i> {error}
            </div>
        );
    }

    return (
        <div className="container mt-4 animate__animated animate__fadeIn">
            {/* CABEÇALHO */}
            <div className="row mb-4">
                <div className="col-12 text-center text-md-start">
                    <h2 className="fw-bold text-dark">
                        <i className="fas fa-chart-pie text-primary me-2"></i>
                        Painel de Escalas
                    </h2>
                    <p className="text-muted">Acompanhamento em tempo real de plantões e folgas.</p>
                </div>
            </div>

            {/* SEÇÃO: MEU STATUS (Componente Fatiado) */}
            {meuPerfil ? (
                <StatusCard servidor={meuPerfil} />
            ) : (
                <div className="alert alert-info shadow-sm border-0">
                    <i className="fas fa-info-circle me-2"></i>
                    Nenhum servidor vinculado ao seu usuário no momento.
                </div>
            )}

            <div className="row mt-5">
                {/* SEÇÃO: AFASTADOS (Componente Fatiado) */}
                <div className="col-lg-4 mb-4">
                    <AfastadosList afastados={afastados} servidores={servidores} />
                </div>

                {/* SEÇÃO: TABELA GERAL (Componente Fatiado) */}
                <div className="col-lg-8">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="fw-bold mb-0">Previsão Geral</h4>
                        <span className="badge bg-secondary">{servidores.length} Servidores</span>
                    </div>
                    <TabelaGeral servidores={servidores} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;