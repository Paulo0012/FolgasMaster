import React, { useEffect, useState } from 'react';
import { Servidor, Afastamento } from '../types';
import { servidorService, afastamentoService } from '../services/api';

const Dashboard: React.FC = () => {
    const [servidores, setServidores] = useState<Servidor[]>([]);
    const [afastados, setAfastados] = useState<Afastamento[]>([]);
    const [loading, setLoading] = useState(true);

    // Simulação de usuário logado (depois podemos buscar da API de Auth)
    const [meuServidor, setMeuServidor] = useState<Servidor | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resServidores, resAfastados] = await Promise.all([
                    servidorService.getAll(),
                    afastamentoService.getAll()
                ]);

                setServidores(resServidores.data);
                
                // Filtra apenas quem está afastado hoje (lógica simples no front)
                const hoje = new Date().toISOString().split('T')[0];
                const ativosHoje = resAfastados.data.filter(af => 
                    hoje >= af.data_inicio && hoje <= af.data_fim
                );
                setAfastados(ativosHoje);

                // Exemplo: define o primeiro da lista como "meu perfil" para teste
                if (resServidores.data.length > 0) setMeuServidor(resServidores.data[0]);
                
            } catch (error) {
                console.error("Erro ao carregar dados do dashboard", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="container mt-5 text-center"><h3>Carregando...</h3></div>;

    return (
        <div className="container mt-5 p-4">
            {/* TÍTULO */}
            <div className="row mb-5">
                <div className="col-md-12 text-center">
                    <h1 className="mb-3">
                        <i className="fas fa-tachometer-alt me-2"></i>
                        Dashboard de Escalas
                    </h1>
                    <p className="text-muted">Visão geral de plantões, folgas e horas extras</p>
                </div>
            </div>

            {/* STATUS DO USUÁRIO LOGADO */}
            {meuServidor ? (
                <div className="card mb-5 border-start border-info border-4 shadow-sm">
                    <div className="card-body">
                        <h5 className="card-title mb-4">
                            <i className="fas fa-user-circle me-2"></i>
                            Meu Status: 
                            <span className="text-info ms-2">{meuServidor.nome_completo}</span>
                            <small className="text-muted ms-1">({meuServidor.equipe_display})</small>
                        </h5>

                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <p className="mb-1">
                                    <i className="fas fa-calendar-alt me-1"></i> Status Hoje:
                                    <span className={`badge ms-2 ${
                                        meuServidor.status_escala.includes('PLANTÃO') ? 'bg-primary' : 'bg-success'
                                    }`}>
                                        {meuServidor.status_escala}
                                    </span>
                                </p>
                            </div>
                            <div className="col-md-4 mb-3">
                                <p className="mb-1">
                                    <i className="fas fa-undo-alt me-1"></i> Próxima Folga:
                                    <span className="text-info ms-2">{meuServidor.proxima_folga || 'N/A'}</span>
                                </p>
                            </div>
                            <div className="col-md-4 mb-3">
                                <p className="mb-1">
                                    <i className="fas fa-clock me-1"></i> Saldo Horas Extras:
                                    <span className={`badge ms-2 ${meuServidor.horas_extras_acumuladas >= 8 ? 'bg-success' : 'bg-warning text-dark'}`}>
                                        {meuServidor.horas_extras_acumuladas.toFixed(2)} h
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="alert alert-warning">Seu usuário não está vinculado a um Servidor.</div>
            )}

            <hr className="my-5" />

            {/* AFASTADOS HOJE */}
            <div className="row mb-5">
                <div className="col-md-12">
                    <h2 className="mb-4 text-secondary">
                        <i className="fas fa-bed me-2"></i>
                        Servidores Afastados Hoje
                    </h2>
                    {afastados.length > 0 ? (
                        <ul className="list-group shadow-sm">
                            {afastados.map(af => {
                                const s = servidores.find(serv => serv.id === af.servidor);
                                return (
                                    <li key={af.id} className="list-group-item d-flex justify-content-between align-items-center">
                                        <div>
                                            <strong>{s?.nome_completo}</strong>
                                            <span className="text-muted ms-2">({s?.equipe_display})</span>
                                        </div>
                                        <span className="badge bg-secondary rounded-pill p-2">
                                            {af.tipo_display} até {new Date(af.data_fim).toLocaleDateString('pt-BR')}
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <div className="alert alert-success border-0 shadow-sm">Nenhum servidor está afastado hoje.</div>
                    )}
                </div>
            </div>

            <hr className="my-5" />

            {/* TABELA GERAL */}
            <div className="row">
                <div className="col-md-12">
                    <h2 className="mb-2 text-secondary">
                        <i className="fas fa-chart-line me-2"></i>
                        Previsão de Plantões e Saldo de Horas
                    </h2>
                    <p className="text-muted mb-4">Cálculo baseado na regra de 1x3 (84 dias)</p>

                    <div className="card shadow-sm border-0">
                        <div className="table-responsive">
                            <table className="table table-hover table-borderless mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Servidor</th>
                                        <th>Equipe</th>
                                        <th>Plantões Trabalhados</th>
                                        <th>Plantões Restantes</th>
                                        <th>Previsão Folga (21)</th>
                                        <th>Férias Anuais</th>
                                        <th>Horas Extras (h)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {servidores.map(s => (
                                        <tr key={s.id} className="align-middle">
                                            <td><strong>{s.nome_completo}</strong></td>
                                            <td>{s.equipe_display}</td>
                                            <td>
                                                <span className={`badge ${s.plantoes_dados.trabalhados >= 21 ? 'bg-primary' : 'bg-secondary'}`}>
                                                    {s.plantoes_dados.trabalhados}
                                                </span> / 21
                                            </td>
                                            <td>
                                                <span className={`badge ${s.plantoes_dados.restantes <= 0 ? 'bg-success' : 'bg-warning text-dark'}`}>
                                                    {s.plantoes_dados.restantes <= 0 ? 'Pronto' : s.plantoes_dados.restantes}
                                                </span>
                                            </td>
                                            <td className="text-primary fw-bold">{s.plantoes_dados.previsao_21_plantoes || 'N/A'}</td>
                                            <td className="text-info fw-bold">{s.previsao_anual || 'N/A'}</td>
                                            <td>
                                                <span className={`badge ${s.horas_extras_acumuladas >= 8 ? 'bg-success' : 'bg-light text-dark'}`}>
                                                    {s.horas_extras_acumuladas.toFixed(2)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;