import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext'; // Precisamos criar este arquivo
import MainLayout from './components/Layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Equipes from './pages/Equipes';
import ServidorCadastro from './pages/ServidorCadastro';
import Login from './pages/Login'; // Precisamos criar esta página

// Componente de Proteção de Rota
// Ele verifica se o usuário está logado. Se não, manda para o /login
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate transition-style="fade" to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rota de Login (Fora do MainLayout para não mostrar a navbar) */}
          <Route path="/login" element={<Login />} />

          {/* Rotas Protegidas (Dentro do MainLayout) */}
          <Route 
            path="/" 
            element={
              <PrivateRoute>
                <MainLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="equipes" element={<Equipes />} />
            <Route path="servidor/novo" element={<ServidorCadastro />} />
          </Route>

          {/* Redirecionar qualquer rota inexistente para o Dashboard */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;