import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const MainLayout: React.FC = () => {
    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow mb-4">
                <div className="container">
                    <Link className="navbar-brand fw-bold" to="/">FolgasMaster</Link>
                    <div className="navbar-nav">
                        <Link className="nav-link" to="/">Dashboard</Link>
                        <Link className="nav-link" to="/equipes">Equipes</Link>
                    </div>
                    <div className="ms-auto">
                        <button className="btn btn-outline-light btn-sm">Sair</button>
                    </div>
                </div>
            </nav>

            <main>
                {/* O Outlet é onde as páginas (Dashboard, Equipes) serão renderizadas */}
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;