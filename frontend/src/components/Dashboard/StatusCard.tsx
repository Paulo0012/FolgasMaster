import React from 'react';
import { Servidor } from '../../types';

interface Props {
    servidor: Servidor;
}

const StatusCard: React.FC<Props> = ({ servidor }) => (
    <div className="card mb-5 border-start border-info border-4 shadow-sm">
        <div className="card-body">
            <h5 className="card-title mb-4">
                <i className="fas fa-user-circle me-2"></i>
                Meu Status: <span className="text-info ms-2">{servidor.nome_completo}</span>
            </h5>
            <div className="row">
                <div className="col-md-4">
                    <p className="mb-1">Status: 
                        <span className={`badge ms-2 ${servidor.status_escala.includes('PLANTÃO') ? 'bg-primary' : 'bg-success'}`}>
                            {servidor.status_escala}
                        </span>
                    </p>
                </div>
                <div className="col-md-4">
                    <p className="mb-1">Próxima Folga: <span className="text-info ms-2">{servidor.proxima_folga || 'N/A'}</span></p>
                </div>
                <div className="col-md-4">
                    <p className="mb-1">Saldo Horas: 
                        <span className={`badge ms-2 ${servidor.horas_extras_acumuladas >= 8 ? 'bg-success' : 'bg-warning text-dark'}`}>
                            {servidor.horas_extras_acumuladas.toFixed(2)}h
                        </span>
                    </p>
                </div>
            </div>
        </div>
    </div>
);

export default StatusCard;