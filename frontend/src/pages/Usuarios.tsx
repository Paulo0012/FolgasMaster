import React, { useEffect, useState } from 'react';
import api from '../services/api';
import SubmitButton from '../components/Common/SubmitButton';

const Usuarios: React.FC = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('usuarios/').then(res => {
            setUsuarios(res.data);
            setLoading(false);
        });
    }, []);

    return (
        <div className="container mt-4 animate__animated animate__fadeIn">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold"><i className="fas fa-users-cog text-primary me-2"></i>Gestão de Acesso</h2>
                <button className="btn btn-primary"><i className="fas fa-plus me-2"></i>Novo Usuário</button>
            </div>

            <div className="card border-0 shadow-sm">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th className="ps-4">Username</th>
                                <th>E-mail</th>
                                <th>Status</th>
                                <th className="text-end pe-4">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.map((user: any) => (
                                <tr key={user.id}>
                                    <td className="ps-4 fw-bold">{user.username}</td>
                                    <td>{user.email || '---'}</td>
                                    <td>
                                        {user.is_active ? 
                                            <span className="badge bg-success-subtle text-success">Ativo</span> : 
                                            <span className="badge bg-danger-subtle text-danger">Inativo</span>
                                        }
                                    </td>
                                    <td className="text-end pe-4">
                                        <button className="btn btn-sm btn-outline-secondary me-2">Editar</button>
                                        <button className="btn btn-sm btn-outline-danger">Desativar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Usuarios;