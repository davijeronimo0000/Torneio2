import React, { useState, useEffect } from 'react';
import api from '../api';
import { Play, Pause, Square, Plus, MapPin } from 'lucide-react';

const STATUS_COLORS = {
  agendado: 'bg-gray-100 text-gray-800',
  andamento: 'bg-green-100 text-green-800',
  intervalo: 'bg-yellow-100 text-yellow-800',
  finalizado: 'bg-blue-100 text-blue-800',
};

export default function ManageGames() {
  const [jogos, setJogos] = useState([]);
  const [times, setTimes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [gameData, setGameData] = useState({ fase: 'Fase de Grupos', time_a_id: '', time_b_id: '', data_hora: '', torneio_id: 1 });

  const fetchJogos = async () => {
    try {
      const resp = await api.get('/admin/jogos');
      setJogos(resp.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchTimes = async () => {
    try {
      const resp = await api.get('/admin/times');
      setTimes(resp.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchJogos();
    fetchTimes();
  }, []);

  const updatePlacar = async (jogoId, time, incremento) => {
    try {
      const jogo = jogos.find(j => j.id === jogoId);
      const novoPlacarA = time === 'a' ? Math.max(0, jogo.placar_a + incremento) : jogo.placar_a;
      const novoPlacarB = time === 'b' ? Math.max(0, jogo.placar_b + incremento) : jogo.placar_b;

      await api.put(`/admin/jogos/${jogoId}/placar`, {
        placar_a: novoPlacarA,
        placar_b: novoPlacarB
      });
      fetchJogos(); // Recarrega
    } catch (e) {
      alert('Erro ao atualizar placar');
    }
  };

  const updateStatus = async (jogoId, novoStatus) => {
    try {
      await api.put(`/admin/jogos/${jogoId}/placar`, { status: novoStatus });
      fetchJogos();
    } catch (e) {
      alert('Erro ao mudar status');
    }
  };

  return (
    <div className="p-8 animate-fade-in relative">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciar Jogos</h1>
          <p className="text-gray-500 mt-2">Atualize placares e status em tempo real.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-lg shadow-blue-500/20"
        >
          <Plus size={20} /> Novo Jogo
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {jogos.map(jogo => (
          <div key={jogo.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
             <div className="flex justify-between items-center mb-6">
               <span className="text-sm font-semibold text-gray-500 uppercase">{jogo.fase}</span>
               <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${STATUS_COLORS[jogo.status]}`}>
                 {jogo.status}
               </span>
             </div>

             <div className="flex justify-between items-center gap-8 mb-8">
                {/* Time A */}
                <div className="flex-1 flex flex-col items-center">
                    <span className="text-xl font-bold mb-4">{jogo.time_a_nome}</span>
                    <div className="flex items-center gap-3">
                        <button onClick={() => updatePlacar(jogo.id, 'a', -1)} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl hover:bg-gray-200">-</button>
                        <span className="text-5xl font-black w-16 text-center">{jogo.placar_a}</span>
                        <button onClick={() => updatePlacar(jogo.id, 'a', 1)} className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl hover:bg-blue-200"><Plus size={20}/></button>
                    </div>
                </div>

                <div className="text-gray-400 font-bold text-2xl">X</div>

                {/* Time B */}
                <div className="flex-1 flex flex-col items-center">
                    <span className="text-xl font-bold mb-4">{jogo.time_b_nome}</span>
                    <div className="flex items-center gap-3">
                        <button onClick={() => updatePlacar(jogo.id, 'b', -1)} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl hover:bg-gray-200">-</button>
                        <span className="text-5xl font-black w-16 text-center">{jogo.placar_b}</span>
                        <button onClick={() => updatePlacar(jogo.id, 'b', 1)} className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl hover:bg-blue-200"><Plus size={20}/></button>
                    </div>
                </div>
             </div>

             {/* Controles de Status */}
             <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-100 justify-center">
                <button 
                  onClick={() => updateStatus(jogo.id, 'andamento')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${jogo.status === 'andamento' ? 'bg-green-600 text-white' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}
                >
                  <Play size={18} /> Iniciar / Retomar
                </button>
                <button 
                  onClick={() => updateStatus(jogo.id, 'intervalo')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${jogo.status === 'intervalo' ? 'bg-yellow-500 text-white' : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'}`}
                >
                  <Pause size={18} /> Intervalo
                </button>
                <button 
                  onClick={() => updateStatus(jogo.id, 'finalizado')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${jogo.status === 'finalizado' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  <Square size={18} /> Encerrar Jogo
                </button>
             </div>
          </div>
        ))}

        {jogos.length === 0 && (
          <div className="text-center p-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
             Nenhum jogo cadastrado.
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Novo Jogo</h2>
            
            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                // Remove the "T" and add missing minutes if it's the datetime-local format
                const formattedDate = gameData.data_hora.replace('T', ' ');
                await api.post('/admin/jogos', { ...gameData, data_hora: formattedDate });
                setShowModal(false);
                fetchJogos();
              } catch (err) {
                alert('Erro ao criar jogo');
              }
            }} className="space-y-4">
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fase do Torneio</label>
                <select 
                  value={gameData.fase}
                  onChange={e => setGameData({...gameData, fase: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option>Fase de Grupos</option>
                  <option>Oitavas de Final</option>
                  <option>Quartas de Final</option>
                  <option>Semifinal</option>
                  <option>Final</option>
                </select>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time A</label>
                  <select 
                    value={gameData.time_a_id}
                    onChange={e => setGameData({...gameData, time_a_id: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  >
                    <option value="">Selecione...</option>
                    {times.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time B</label>
                  <select 
                    value={gameData.time_b_id}
                    onChange={e => setGameData({...gameData, time_b_id: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  >
                    <option value="">Selecione...</option>
                    {times.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data e Hora</label>
                <input 
                  type="datetime-local" 
                  value={gameData.data_hora}
                  onChange={e => setGameData({...gameData, data_hora: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  required 
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors">
                  Cancelar
                </button>
                <button type="submit" className="flex-1 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors">
                  Salvar
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
