import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Equipes from './pages/Equipes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota principal com o Layout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="equipes" element={<Equipes />} />
          
          {/* Futuras rotas entrarão aqui */}
          {/* <Route path="servidor/novo" element={<ServidorForm />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;