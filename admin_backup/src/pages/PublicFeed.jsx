import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Trophy, Clock, CalendarDays } from 'lucide-react';

export default function PublicFeed() {
  const [jogos, setJogos] = useState([]);
  const [torneioId] = useState(1);

  const fetchJogos = async () => {
    try {
      const response = await api.get(`/public/torneio/${torneioId}/jogos`);
      setJogos(response.data);
    } catch (error) {
      console.error("Erro ao buscar jogos do feed público", error);
    }
  };

  useEffect(() => {
    fetchJogos();
    // Poll placar ao vivo (MVP)
    const interval = setInterval(fetchJogos, 5000);
    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'andamento': return <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold animate-pulse">AO VIVO</span>;
      case 'intervalo': return <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-bold">INTERVALO</span>;
      case 'finalizado': return <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs font-bold">ENCERRADO</span>;
      default: return <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">AGENDADO</span>;
    }
  };

  return (
    <div className="bg-slate-900 min-h-screen text-slate-100 pb-20">
      
      {/* Header Fixo */}
      <header className="bg-slate-800 p-4 border-b border-slate-700 sticky top-0 z-10 flex items-center justify-center shadow-lg">
        <Trophy className="text-yellow-400 mr-2" size={24} />
        <h1 className="text-xl font-black uppercase tracking-wider text-white">Torneio José Augusto</h1>
      </header>

      <main className="p-4 max-w-md mx-auto space-y-6">
        {/* Jogos Ao Vivo e Chaveamento */}
        {jogos.map(jogo => (
          <div key={jogo.id} className="bg-slate-800 rounded-2xl p-5 border border-slate-700 shadow-md">
            
            <div className="flex justify-between items-center mb-4">
              <span className="text-slate-400 text-sm font-semibold tracking-widest">{jogo.fase.toUpperCase()}</span>
              {getStatusBadge(jogo.status)}
            </div>

            <div className="flex items-center justify-between">
                
                {/* Time A */}
                <div className="flex flex-col items-center flex-1">
                    <div className="w-14 h-14 bg-slate-700 rounded-full flex items-center justify-center mb-2">
                        <span className="font-bold text-slate-300">{jogo.time_a ? jogo.time_a.nome.substring(0,3).toUpperCase() : '?'}</span>
                    </div>
                    <span className="text-sm font-bold text-center h-10 w-full truncate px-1">{jogo.time_a ? jogo.time_a.nome : 'A Definir'}</span>
                </div>

                {/* Placar */}
                <div className="flex-1 flex flex-col items-center justify-center mx-2">
                    <div className="flex items-center bg-slate-900 px-4 py-2 rounded-lg border border-slate-700 mb-2">
                        <span className={`text-3xl font-black ${jogo.status === 'andamento' ? 'text-white' : 'text-slate-300'}`}>{jogo.placar_a}</span>
                        <span className="text-slate-500 mx-2 font-bold text-xl">X</span>
                        <span className={`text-3xl font-black ${jogo.status === 'andamento' ? 'text-white' : 'text-slate-300'}`}>{jogo.placar_b}</span>
                    </div>
                    {jogo.data_hora && jogo.status === 'agendado' && (
                        <div className="flex items-center text-slate-400 text-xs mt-1">
                            <Clock size={12} className="mr-1"/>
                            <span>{new Date(jogo.data_hora).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                    )}
                </div>

                {/* Time B */}
                <div className="flex flex-col items-center flex-1">
                    <div className="w-14 h-14 bg-slate-700 rounded-full flex items-center justify-center mb-2">
                         <span className="font-bold text-slate-300">{jogo.time_b ? jogo.time_b.nome.substring(0,3).toUpperCase() : '?'}</span>
                    </div>
                    <span className="text-sm font-bold text-center h-10 w-full truncate px-1">{jogo.time_b ? jogo.time_b.nome : 'A Definir'}</span>
                </div>

            </div>

          </div>
        ))}

        {jogos.length === 0 && (
          <div className="text-center p-8 bg-slate-800 rounded-2xl border border-slate-700 mt-10">
            <CalendarDays className="mx-auto text-slate-500 mb-4" size={48} />
            <h3 className="text-lg font-bold text-slate-200 mb-2">As chaves estão sendo montadas!</h3>
            <p className="text-slate-400 text-sm">Fique de olho, os jogos do torneio aparecerão aqui em breve.</p>
          </div>
        )}
      </main>

    </div>
  );
}
