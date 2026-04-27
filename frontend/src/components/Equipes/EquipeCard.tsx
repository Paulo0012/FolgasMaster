import React from 'react';
import type { Servidor } from '../../types';

interface EquipeCardProps {
    nomeEquipe: string;
    siglaEquipe: string;
    servidores: Servidor[];
}

const EquipeCard: React.FC<EquipeCardProps> = ({ nomeEquipe, siglaEquipe, servidores }) => {
    return (
        <div className="card stat-card glass-card h-100 border-0 shadow-sm fade-in">
            <div className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center pt-3 px-3">
                <h5 className="fw-bold mb-0 text-h">
                    <span className="badge bg-primary me-2">{siglaEquipe}</span>
                    {nomeEquipe}
                </h5>
                <span className="badge rounded-pill bg-primary-subtle text-primary border border-primary-subtle">
                    {servidores.length} Integrantes
                </span>
            </div>

            <div className="card-body">
                {servidores.length === 0 ? (
                    <div className="text-center py-4 text-muted opacity-50">
                        <i className="fas fa-user-slash d-block mb-2 fa-2x"></i>
                        <small>Nenhum servidor nesta equipe</small>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead>
                                <tr>
                                    <th className="border-0 small text-uppercase text-muted" style={{ fontSize: '10px' }}>Servidor</th>
                                    <th className="border-0 small text-uppercase text-muted" style={{ fontSize: '10px' }}>Matrícula</th>
                                    <th className="border-0 text-end small text-uppercase text-muted" style={{ fontSize: '10px' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {servidores.map((s) => (
                                    <tr key={s.id} className="border-transparent">
                                        <td className="ps-0">
                                            <div className="d-flex align-items-center">
                                                <div className="status-indicator status-online me-2"></div>
                                                <span className="fw-semibold text-h" style={{ fontSize: '14px' }}>{s.nome}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <code className="small">{s.matricula}</code>
                                        </td>
                                        <td className="text-end pe-0">
                                            <button className="btn btn-sm btn-link text-primary p-0">
                                                <i className="fas fa-chevron-right"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            
            <div className="card-footer bg-transparent border-top border-light-subtle py-2 text-center">
                <button className="btn btn-sm btn-link text-decoration-none text-muted small">
                    Ver escala completa
                </button>
            </div>
        </div>
    );
};

export default EquipeCard;