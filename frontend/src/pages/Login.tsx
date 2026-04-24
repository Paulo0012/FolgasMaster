import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // No Django, você pode usar o endpoint de token do DRF
            const response = await api.post('token/', { username, password });
            login(response.data.access); 
            navigate('/');
        } catch (err) {
            setError('Usuário ou senha inválidos');
        }
    };

    return (
        <div className="container d-flex align-items-center justify-content-center vh-100">
            <div className="card shadow-lg p-4" style={{ maxWidth: '400px', width: '100%' }}>
                <div className="text-center mb-4">
                    <i className="fas fa-shield-halved fa-3x text-primary mb-3"></i>
                    <h3 className="fw-bold">FolgasMaster</h3>
                    <p className="text-muted">Entre com suas credenciais</p>
                </div>

                {error && <div className="alert alert-danger p-2 small">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label small fw-bold">Usuário</label>
                        <div className="input-group">
                            <span className="input-group-text bg-white"><i className="fas fa-user text-muted"></i></span>
                            <input 
                                type="text" 
                                className="form-control" 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)} 
                                required 
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="form-label small fw-bold">Senha</label>
                        <div className="input-group">
                            <span className="input-group-text bg-white"><i className="fas fa-lock text-muted"></i></span>
                            <input 
                                type="password" 
                                className="form-control" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-100 fw-bold py-2">
                        Acessar Sistema
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;