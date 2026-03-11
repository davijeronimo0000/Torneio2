import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function ManageGames() {
  const [jogos, setJogos] = useState([]);
  const [torneioId] = useState(1); // MOCK para o MVP

  useEffect(() => {
    fetchJogos();
  }, []);

  const fetchJogos = async () => {
    try {
      const response = await api.get(`/admin/jogos/${torneioId}`);
      setJogos(response.data);
    } catch (error) {
      console.error("Erro ao buscar jogos", error);
    }
  };

  const updatePlacar = async (jogoId, placarA, placarB, status) => {
    try {
        await api.put(`/admin/jogos/${jogoId}/placar`, {
            placar_a: placarA,
            placar_b: placarB,
            status: status
        });
        fetchJogos(); // Atualiza a lista
    } catch (error) {
        alert("Erro ao atualizar placar!");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Gerenciar Jogos (Ao Vivo)</h1>
      
      <div className="space-y-6">
        {jogos.length === 0 && (
            <div className="p-6 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-200">
                Nenhum jogo cadastrado neste torneio ainda.
            </div>
        )}
        
        {jogos.map(jogo => (
          <div key={jogo.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Status Header */}
            <div className={`p-3 text-center text-sm font-bold tracking-wider uppercase
                ${jogo.status === 'andamento' ? 'bg-red-500 text-white animate-pulse' : 
                  jogo.status === 'finalizado' ? 'bg-gray-200 text-gray-700' : 'bg-blue-500 text-white'}`}>
                {jogo.status === 'andamento' ? '🔴 Ao Vivo' : 
                 jogo.status === 'intervalo' ? '⏸ Intervalo' : 
                 jogo.status === 'finalizado' ? 'Fim de Jogo' : 'Agendado'} - {jogo.fase}
            </div>

            <div className="p-6 md:p-8 flex flex-col items-center">
              
              <div className="flex items-center justify-center w-full max-w-2xl">
                {/* Time A */}
                <div className="flex-1 flex flex-col items-center">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-100 mb-4 flex items-center justify-center border-4 border-gray-50 shadow-inner">
                        {/* Escudo Placeholder */}
                        <span className="text-gray-400 font-bold text-xl">{jogo.time_a ? jogo.time_a.substring(0,3).toUpperCase() : '?'}</span>
                    </div>
                    <h3 className="font-bold text-center text-gray-800 md:text-xl truncate w-full px-2">{jogo.time_a || 'A Definir'}</h3>
                </div>

                {/* Score Controls */}
                <div className="flex flex-col items-center mx-4 md:mx-8">
                    <div className="flex items-center justify-center mb-6">
                         <div className="flex flex-col items-center mx-2">
                             <button onClick={() => updatePlacar(jogo.id, jogo.placar_a + 1, jogo.placar_b, jogo.status)} className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold text-2xl hover:bg-green-200 transition-colors mb-2">+</button>
                             <div className="text-5xl md:text-6xl font-black text-gray-900 bg-gray-50 rounded-xl px-4 py-2 border-2 border-gray-100 min-w-[80px] text-center">
                                {jogo.placar_a}
                             </div>
                             <button onClick={() => updatePlacar(jogo.id, Math.max(0, jogo.placar_a - 1), jogo.placar_b, jogo.status)} className="w-12 h-12 bg-red-100 text-red-700 rounded-full flex items-center justify-center font-bold text-2xl hover:bg-red-200 transition-colors mt-2">-</button>
                         </div>
                         <span className="text-2xl md:text-4xl font-black text-gray-300 mx-4">X</span>
                         <div className="flex flex-col items-center mx-2">
                             <button onClick={() => updatePlacar(jogo.id, jogo.placar_a, jogo.placar_b + 1, jogo.status)} className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold text-2xl hover:bg-green-200 transition-colors mb-2">+</button>
                             <div className="text-5xl md:text-6xl font-black text-gray-900 bg-gray-50 rounded-xl px-4 py-2 border-2 border-gray-100 min-w-[80px] text-center">
                                 {jogo.placar_b}
                             </div>
                             <button onClick={() => updatePlacar(jogo.id, jogo.placar_a, Math.max(0, jogo.placar_b - 1), jogo.status)} className="w-12 h-12 bg-red-100 text-red-700 rounded-full flex items-center justify-center font-bold text-2xl hover:bg-red-200 transition-colors mt-2">-</button>
                         </div>
                    </div>
                </div>

                {/* Time B */}
                <div className="flex-1 flex flex-col items-center">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-100 mb-4 flex items-center justify-center border-4 border-gray-50 shadow-inner">
                        <span className="text-gray-400 font-bold text-xl">{jogo.time_b ? jogo.time_b.substring(0,3).toUpperCase() : '?'}</span>
                    </div>
                    <h3 className="font-bold text-center text-gray-800 md:text-xl truncate w-full px-2">{jogo.time_b || 'A Definir'}</h3>
                </div>
              </div>

            </div>

             {/* Footer Controls */}
            <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-center gap-4">
               {jogo.status !== 'andamento' && jogo.status !== 'finalizado' && (
                   <button onClick={() => updatePlacar(jogo.id, jogo.placar_a, jogo.placar_b, 'andamento')} className="px-6 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors flex-1 max-w-xs">
                       Iniciar Partida
                   </button>
               )}
               {jogo.status === 'andamento' && (
                   <>
                     <button onClick={() => updatePlacar(jogo.id, jogo.placar_a, jogo.placar_b, 'intervalo')} className="px-6 py-2 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600 transition-colors flex-1 max-w-xs">
                       Pausar / Intervalo
                     </button>
                     <button onClick={() => updatePlacar(jogo.id, jogo.placar_a, jogo.placar_b, 'finalizado')} className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors flex-1 max-w-xs">
                       Encerrar Jogo
                     </button>
                   </>
               )}
                {jogo.status === 'intervalo' && (
                     <button onClick={() => updatePlacar(jogo.id, jogo.placar_a, jogo.placar_b, 'andamento')} className="px-6 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors flex-1 max-w-xs">
                       Retomar Partida
                     </button>
               )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
