import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import LoginInput from '../components/Common/LoginInput';
import SubmitButton from '../components/Common/SubmitButton';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await authService.login({ username, password });
            const token = response.data.access;
            
            if (token) {
                login(token);
                navigate('/');
            }
        } catch (err: any) {
            setError(err.response?.status === 401 
                ? "Usuário ou senha incorretos." 
                : "Erro na conexão com o servidor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid bg-light vh-100 d-flex align-items-center justify-content-center">
            <div className="card shadow-lg border-0" style={{ maxWidth: '420px', width: '100%', borderRadius: '15px' }}>
                <div className="card-body p-5">
                    
                    <div className="text-center mb-4">
                        <div className="bg-primary d-inline-block p-3 rounded-circle mb-3 shadow-sm">
                            <i className="fas fa-shield-halved fa-2x text-white"></i>
                        </div>
                        <h2 className="fw-bold text-dark mb-1">FolgasMaster</h2>
                        <p className="text-muted small">Gestão Inteligente de Escalas</p>
                    </div>

                    {error && (
                        <div className="alert alert-danger py-2 small" role="alert">
                            <i className="fas fa-exclamation-circle me-2"></i>{error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <LoginInput 
                            label="Usuário"
                            icon="fa-user"
                            type="text"
                            placeholder="Seu usuário"
                            value={username}
                            onChange={setUsername}
                        />

                        <LoginInput 
                            label="Senha"
                            icon="fa-lock"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={setPassword}
                        />

                        <SubmitButton 
                            loading={loading} 
                            text="Acessar Sistema" 
                            loadingText="Autenticando..."
                            icon="right-to-bracket"
                        />
                    </form>

                </div>
            </div>
        </div>
    );
};

export default Login;