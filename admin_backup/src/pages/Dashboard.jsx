import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, Trophy, DollarSign } from 'lucide-react';

export default function Dashboard() {
  const [torneios, setTorneios] = useState([]);

  useEffect(() => {
    // Carrega torneios para o Dashboard
    api.get('/admin/torneios').then(response => {
      setTorneios(response.data);
    }).catch(console.error);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Painel Geral</h1>
      
      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <div className="bg-blue-100 p-4 rounded-lg mr-4">
            <Trophy className="text-blue-600" size={24} />
          </div>
          <div>
             <p className="text-sm text-gray-500 font-medium">Torneios Ativos</p>
             <h3 className="text-2xl font-bold text-gray-800">{torneios.length}</h3>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <div className="bg-green-100 p-4 rounded-lg mr-4">
            <DollarSign className="text-green-600" size={24} />
          </div>
          <div>
             <p className="text-sm text-gray-500 font-medium">Apoios Recebidos</p>
             <h3 className="text-2xl font-bold text-gray-800">R$ 0,00</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <div className="bg-purple-100 p-4 rounded-lg mr-4">
             <Users className="text-purple-600" size={24} />
          </div>
          <div>
             <p className="text-sm text-gray-500 font-medium">Acessos Liberados</p>
             <h3 className="text-2xl font-bold text-gray-800">0</h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
           <h2 className="text-lg font-bold text-gray-800">Seus Torneios</h2>
        </div>
        <ul>
          {torneios.map(t => (
            <li key={t.id} className="p-6 border-b border-gray-50 flex justify-between items-center hover:bg-gray-50 transition-colors">
              <div>
                 <h4 className="font-bold text-gray-800">{t.nome}</h4>
                 <p className="text-sm text-gray-500">{t.local}</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wide">
                {t.status}
              </span>
            </li>
          ))}
          {torneios.length === 0 && <li className="p-6 text-gray-500 text-center">Nenhum torneio cadastrado ainda.</li>}
        </ul>
      </div>
    </div>
  );
}
