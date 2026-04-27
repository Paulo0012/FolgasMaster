import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Importação do CSS (Importante para as animações e estilos que criamos)
import './App.css';

// Layouts e Páginas
import MainLayout from './components/Layout/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Equipes from './pages/Equipes';
import ServidorCadastro from './pages/ServidorCadastro';
import Usuarios from './pages/Usuarios';

/**
 * Componente para proteger rotas privadas
 * Atualizei a tipagem para React.ReactNode, que é o padrão mais seguro e moderno.
 */
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  // Se o contexto ainda estiver carregando o token do localStorage, exibe um loading
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rota Pública - Login */}
          <Route path="/login" element={<Login />} />

          {/* Rotas Protegidas - Dentro do MainLayout */}
          <Route path="/" element={<PrivateRoute><MainLayout /></PrivateRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="equipes" element={<Equipes />} />
            <Route path="servidor/novo" element={<ServidorCadastro />} />
            <Route path="usuarios" element={<Usuarios />} />
          </Route>

          {/* Rota 404 - Redireciona para o Dashboard se a página não existir */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;