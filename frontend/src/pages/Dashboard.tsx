import React, { useEffect, useState } from 'react';
import type { Servidor, Afastamento } from '../types';
import { servidorService, afastamentoService } from '../services/api';
import { useAuth } from '../context/AuthContext'; // Importamos o contexto de Auth

// Importação dos sub-componentes fatiados
import StatusCard from '../components/Dashboard/StatusCard';
import AfastadosList from '../components/Dashboard/AfastadosList';
import TabelaGeral from '../components/Dashboard/TabelaGeral';

const Dashboard: React.FC = () => {
    const { logout } = useAuth(); // Para o botão de sair se necessário
    const [servidores, setServidores] = useState<Servidor[]>([]);
    const [afastados, setAfastados] = useState<Afastamento[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [meuPerfil, setMeuPerfil] = useState<Servidor | null>(null);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                setLoading(true);
                
                // 1. Busca os dados em paralelo
                const [resServidores, resAfastados] = await Promise.all([
                    servidorService.getAll(),
                    afastamentoService.getAll()
                ]);

                const listaServidores = resServidores.data;
                setServidores(listaServidores);

                // 2. Lógica para encontrar o "Meu Perfil"
                // Agora tentamos buscar o servidor que está vinculado ao usuário logado
                // O Django via DRF geralmente envia um campo 'is_me' ou similar se configurado,
                // mas por enquanto, vamos manter a lógica de encontrar o perfil vinculado.
                const perfilEncontrado = listaServidores.find(s => s.status_escala !== 'Desconhecido'); 
                setMeuPerfil(perfilEncontrado || null);

                // 3. Filtro de Afastados Hoje
                const hojeStr = new Date().toISOString().split('T')[0];
                const ativosHoje = resAfastados.data.filter(af => 
                    hojeStr >= af.data_inicio && hojeStr <= af.data_fim
                );
                setAfastados(ativosHoje);

                setError(null);
            } catch (err: any) {
                console.error("Erro ao carregar dashboard:", err);
                // Se o erro for 401, o interceptor da api.ts já vai nos deslogar
                if (err.response?.status !== 401) {
                    setError("Erro ao carregar dados. Verifique sua conexão com o servidor.");
                }
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}></div>
                    <p className="text-muted fw-bold">Sincronizando escalas...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4 animate__animated animate__fadeIn">
            {/* CABEÇALHO COM AÇÕES */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold text-dark mb-0">
                        <i className="fas fa-chart-pie text-primary me-2"></i>
                        Painel de Escalas
                    </h2>
                    <p className="text-muted mb-0">Gestão de plantões e monitoramento de folgas.</p>
                </div>
                <button onClick={logout} className="btn btn-outline-danger btn-sm shadow-sm">
                    <i className="fas fa-sign-out-alt me-2"></i>Sair
                </button>
            </div>

            {/* SEÇÃO: MEU STATUS */}
            <div className="mb-5">
                {meuPerfil ? (
                    <StatusCard servidor={meuPerfil} />
                ) : (
                    <div className="alert alert-light border-0 shadow-sm d-flex align-items-center">
                        <i className="fas fa-user-clock fa-2x text-info me-3"></i>
                        <div>
                            <h6 className="mb-0 fw-bold">Perfil não vinculado</h6>
                            <small className="text-muted">Seu usuário ainda não possui um registro de servidor ativo.</small>
                        </div>
                    </div>
                )}
            </div>

            <div className="row">
                {/* COLUNA ESQUERDA: AFASTADOS */}
                <div className="col-lg-4 mb-4">
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-white border-0 py-3">
                            <h5 className="mb-0 fw-bold"><i className="fas fa-user-slash text-danger me-2"></i>Afastados Hoje</h5>
                        </div>
                        <div className="card-body pt-0">
                            <AfastadosList afastados={afastados} servidores={servidores} />
                        </div>
                    </div>
                </div>

                {/* COLUNA DIREITA: TABELA GERAL */}
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                            <h5 className="mb-0 fw-bold"><i className="fas fa-list text-primary me-2"></i>Previsão Geral</h5>
                            <span className="badge rounded-pill bg-primary-subtle text-primary fw-bold">
                                {servidores.length} Integrantes
                            </span>
                        </div>
                        <div className="card-body pt-0">
                            <TabelaGeral servidores={servidores} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;