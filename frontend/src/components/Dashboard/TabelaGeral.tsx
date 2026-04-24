import React from 'react';
import { Servidor } from '../../types';

interface Props {
    servidores: Servidor[];
}

const TabelaGeral: React.FC<Props> = ({ servidores }) => (
    <div className="card shadow-sm border-0">
        <div className="table-responsive">
            <table className="table table-hover mb-0">
                <thead className="table-light">
                    <tr>
                        <th>Servidor</th>
                        <th>Equipe</th>
                        <th>Plantões (21)</th>
                        <th>Previsão Folga</th>
                        <th>Férias Anuais</th>
                        <th>Horas Extras</th>
                    </tr>
                </thead>
                <tbody>
                    {servidores.map(s => (
                        <tr key={s.id}>
                            <td><strong>{s.nome_completo}</strong></td>
                            <td>{s.equipe_display}</td>
                            <td>{s.plantoes_dados.trabalhados}/21</td>
                            <td className="text-primary">{s.plantoes_dados.previsao_21_plantoes}</td>
                            <td className="text-info">{s.previsao_anual}</td>
                            <td>{s.horas_extras_acumuladas.toFixed(2)}h</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

export default TabelaGeral;