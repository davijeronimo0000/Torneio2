import React, { useState, useEffect } from 'react';
import api from '../api';
import { DollarSign, Users, Trophy, Activity } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    total_arrecadado: 0,
    acessos_liberados: 0,
    jogos_andamento: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const resp = await api.get('/admin/stats');
        setStats(resp.data);
      } catch (err) {
        console.error('Erro ao buscar stats', err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="p-8 animate-fade-in">
      <div className="mb-8 border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900">Visão Geral</h1>
        <p className="text-gray-500 mt-2">Acompanhe os números do torneio em tempo real.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
           <div className="flex items-center gap-4 mb-4 text-green-600">
               <div className="p-3 bg-green-50 rounded-lg">
                  <DollarSign size={24} />
               </div>
               <span className="font-semibold text-gray-600">Arrecadação (Pix)</span>
           </div>
           <span className="text-4xl font-black text-gray-900">R$ {stats.total_arrecadado.toLocaleString('pt-BR')}</span>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
           <div className="flex items-center gap-4 mb-4 text-blue-600">
               <div className="p-3 bg-blue-50 rounded-lg">
                  <Users size={24} />
               </div>
               <span className="font-semibold text-gray-600">Acessos Liberados</span>
           </div>
           <span className="text-4xl font-black text-gray-900">{stats.acessos_liberados}</span>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
           <div className="flex items-center gap-4 mb-4 text-orange-600">
               <div className="p-3 bg-orange-50 rounded-lg">
                  <Activity size={24} />
               </div>
               <span className="font-semibold text-gray-600">Jogos Ao Vivo</span>
           </div>
           <span className="text-4xl font-black text-gray-900">{stats.jogos_andamento}</span>
        </div>

      </div>
    </div>
  );
}
