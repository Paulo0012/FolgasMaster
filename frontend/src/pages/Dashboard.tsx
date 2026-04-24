import React, { useEffect, useState } from 'react';
import { Users, Clock, Calendar } from 'lucide-react';

// Interface para o TypeScript entender o que vem do Django
interface Servidor {
  id: number;
  nome: string;
  equipe: string;
  saldo_horas: number;
  proxima_folga: string;
}

const Dashboard = () => {
  const [servidores, setServidores] = useState<Servidor[]>([]);

  // Aqui simularemos a busca no backend futuro
  const equipes = ['Equipe A', 'Equipe B', 'Equipe C', 'Equipe D'];

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Painel Tático GTE</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {equipes.map(equipe => (
          <div key={equipe} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-blue-600">{equipe}</h2>
              <Users size={20} className="text-slate-400" />
            </div>
            
            {/* Lista de servidores da equipe (Exemplo visual) */}
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="font-semibold text-slate-700">João Silva</p>
                <div className="flex justify-between text-xs mt-2 text-slate-500">
                  <span className="flex items-center"><Clock size={12} className="mr-1"/> 12h extras</span>
                  <span className="flex items-center"><Calendar size={12} className="mr-1"/> Folga: 12/05</span>
                </div>
              </div>
            </div>

            <button className="w-full mt-4 py-2 text-sm bg-blue-50 text-blue-600 font-semibold rounded-lg hover:bg-blue-100 transition-colors">
              Ver Detalhes
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;