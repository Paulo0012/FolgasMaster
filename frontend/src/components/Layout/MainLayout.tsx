import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const MainLayout: React.FC = () => {
    return (
        <div className="min-vh-100 bg-light">
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm mb-4">
                <div className="container">
                    <Link className="navbar-brand fw-bold" to="/">
                        <i className="fas fa-shield-halved me-2"></i>FolgasMaster
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to="/">
                                    <i className="fas fa-chart-line me-1"></i> Dashboard
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/equipes">
                                    <i className="fas fa-users me-1"></i> Equipes
                                </Link>
                            </li>
                            <li className="nav-item ms-lg-3">
                                <Link className="btn btn-light btn-sm mt-1" to="/servidor/novo">
                                    <i className="fas fa-plus me-1"></i> Novo Servidor
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <div className="container pb-5">
                <Outlet />
            </div>
        </div>
    );
};

export default MainLayout;