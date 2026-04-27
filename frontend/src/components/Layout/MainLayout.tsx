import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const MainLayout: React.FC = () => {
    const { logout } = useAuth();
    const location = useLocation();

    // Função auxiliar para marcar o link ativo
    const isActive = (path: string) => location.pathname === path ? 'active' : '';

    return (
        <div className="min-vh-100 bg-light">
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm mb-4">
                <div className="container">
                    {/* Logo */}
                    <Link className="navbar-brand fw-bold" to="/">
                        <i className="fas fa-shield-halved me-2"></i>FolgasMaster
                    </Link>

                    {/* Botão Mobile */}
                    <button 
                        className="navbar-toggler" 
                        type="button" 
                        data-bs-toggle="collapse" 
                        data-bs-target="#navbarNav"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    {/* Itens da Navbar */}
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto align-items-center">
                            <li className="nav-item">
                                <Link className={`nav-link ${isActive('/')}`} to="/">
                                    <i className="fas fa-chart-line me-1"></i> Dashboard
                                </Link>
                            </li>
                            
                            <li className="nav-item">
                                <Link className={`nav-link ${isActive('/equipes')}`} to="/equipes">
                                    <i className="fas fa-users me-1"></i> Equipes
                                </Link>
                            </li>

                            {/* NOVA ABA: Gestão de Usuários (Admin) */}
                            <li className="nav-item">
                                <Link className={`nav-link ${isActive('/usuarios')}`} to="/usuarios">
                                    <i className="fas fa-user-shield me-1"></i> Usuários
                                </Link>
                            </li>

                            <li className="nav-item ms-lg-3">
                                <Link className="btn btn-light btn-sm fw-bold text-primary" to="/servidor/novo">
                                    <i className="fas fa-plus me-1"></i> Novo Servidor
                                </Link>
                            </li>

                            {/* Botão Sair */}
                            <li className="nav-item ms-lg-3">
                                <button 
                                    onClick={logout} 
                                    className="btn btn-link nav-link text-white opacity-75 hover-opacity-100"
                                    title="Sair do sistema"
                                >
                                    <i className="fas fa-power-off"></i>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Conteúdo das Páginas */}
            <div className="container pb-5 animate__animated animate__fadeIn">
                <Outlet />
            </div>
        </div>
    );
};

export default MainLayout;