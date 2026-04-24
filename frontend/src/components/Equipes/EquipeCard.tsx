import React from 'react';
import type { Servidor } from '../../types';

interface Props {
    nomeEquipe: string;
    siglaEquipe: string;
    servidores: Servidor[];
}

const EquipeCard: React.FC<Props> = ({ nomeEquipe, siglaEquipe, servidores }) => {
    return (
        <div className="card shadow-sm mb-4 border-0" id={`equipe-${siglaEquipe}`}>
            <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">{nomeEquipe}</h5>
                <span className="badge bg-light text-dark">{servidores.length} Integrantes</span>
            </div>
            <div className="list-group list-group-flush">
                {servidores.length > 0 ? (
                    servidores.map(s => (
                        <div key={s.id} className="list-group-item p-3 d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                                {s.foto ? (
                                    <img src={s.foto} className="rounded-circle me-3" style={{width: '40px', height: '40px', objectFit: 'cover'}} alt="" />
                                ) : (
                                    <div className="bg-secondary rounded-circle me-3 d-flex align-items-center justify-content-center text-white" style={{width: '40px', height: '40px'}}>
                                        {s.nome_completo.charAt(0)}
                                    </div>
                                )}
                                <div>
                                    <h6 className="mb-0">{s.nome_completo}</h6>
                                    <small className="text-muted">Matrícula: {s.matricula}</small>
                                </div>
                            </div>
                            <div className="text-end">
                                <span className={`badge ${s.status_escala.includes('PLANTÃO') ? 'bg-danger' : 'bg-success'} mb-1 d-block`}>
                                    {s.status_escala}
                                </span>
                                <small className="d-block text-muted">Folga: {s.proxima_folga || 'Afastado'}</small>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="list-group-item text-muted text-center py-4">Nenhum servidor nesta equipe.</div>
                )}
            </div>
        </div>
    );
};

export default EquipeCard;