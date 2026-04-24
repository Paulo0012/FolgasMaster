import React from 'react';
import { Afastamento, Servidor } from '../../types';

interface Props {
    afastados: Afastamento[];
    servidores: Servidor[];
}

const AfastadosList: React.FC<Props> = ({ afastados, servidores }) => (
    <div className="mb-5">
        <h2 className="mb-4 text-secondary"><i className="fas fa-bed me-2"></i>Afastados Hoje</h2>
        {afastados.length > 0 ? (
            <ul className="list-group shadow-sm">
                {afastados.map(af => {
                    const s = servidores.find(serv => serv.id === af.servidor);
                    return (
                        <li key={af.id} className="list-group-item d-flex justify-content-between align-items-center">
                            <span><strong>{s?.nome_completo}</strong> ({s?.equipe_display})</span>
                            <span className="badge bg-secondary">{af.tipo_display}</span>
                        </li>
                    );
                })}
            </ul>
        ) : (
            <div className="alert alert-success">Ninguém afastado hoje.</div>
        )}
    </div>
);

export default AfastadosList;