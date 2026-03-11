import React, { useState, useEffect } from 'react';
import api from '../api';
import { Plus, Trash2, Edit2, Users } from 'lucide-react';

export default function ManageTeams() {
  const [times, setTimes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ nome: '', sigla: '', responsavel: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchTimes = async () => {
    try {
      const resp = await api.get('/admin/times');
      setTimes(resp.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchTimes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/admin/times/${editingId}`, formData);
      } else {
        await api.post('/admin/times', formData);
      }
      setShowModal(false);
      setFormData({ nome: '', sigla: '', responsavel: '' });
      setEditingId(null);
      fetchTimes();
    } catch (error) {
      alert('Erro ao salvar o time.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Certeza que deseja excluir este time?')) {
      try {
        await api.delete(`/admin/times/${id}`);
        fetchTimes();
      } catch (error) {
         if(error.response && error.response.data && error.response.data.error) {
             alert(error.response.data.error);
         } else {
             alert('Erro ao deletar time');
         }
      }
    }
  };

  const openEdit = (time) => {
    setFormData({ nome: time.nome, sigla: time.sigla, responsavel: time.responsavel || '' });
    setEditingId(time.id);
    setShowModal(true);
  };

  return (
    <div className="p-8 animate-fade-in">
      <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-6">
        <div>
           <h1 className="text-3xl font-bold text-gray-900">Gerenciar Times</h1>
           <p className="text-gray-500 mt-2">Cadastre e edite as equipes do torneio.</p>
        </div>
        <button 
          onClick={() => {
            setFormData({ nome: '', sigla: '', responsavel: '' });
            setEditingId(null);
            setShowModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-lg shadow-blue-500/20"
        >
          <Plus size={20} /> Novo Time
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {times.map(time => (
          <div key={time.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col relative overflow-hidden group">
             <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
             <div className="flex justify-between items-start mb-4">
               <div>
                 <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded mb-2 inline-block">{time.sigla}</span>
                 <h2 className="text-xl font-bold text-gray-900">{time.nome}</h2>
               </div>
               <div className="flex gap-2">
                 <button onClick={() => openEdit(time)} className="text-gray-400 hover:text-blue-500 transition-colors p-2 bg-gray-50 rounded-lg hover:bg-blue-50">
                    <Edit2 size={16} />
                 </button>
                 <button onClick={() => handleDelete(time.id)} className="text-gray-400 hover:text-red-500 transition-colors p-2 bg-gray-50 rounded-lg hover:bg-red-50">
                    <Trash2 size={16} />
                 </button>
               </div>
             </div>
             
             {time.responsavel && (
                 <div className="flex items-center gap-2 text-gray-500 text-sm mt-auto pt-4 border-t border-gray-50">
                     <Users size={16} />
                     <span>Responsável: {time.responsavel}</span>
                 </div>
             )}
          </div>
        ))}

        {times.length === 0 && (
          <div className="col-span-full text-center p-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
             Nenhum time cadastrado no torneio.
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{editingId ? 'Editar Time' : 'Novo Time'}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Time</label>
                <input 
                  type="text" 
                  value={formData.nome}
                  onChange={e => setFormData({...formData, nome: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sigla (3-4 letras)</label>
                <input 
                  type="text" 
                  value={formData.sigla}
                  onChange={e => setFormData({...formData, sigla: e.target.value.toUpperCase()})}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none uppercase"
                  maxLength={4}
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Responsável (Opcional)</label>
                <input 
                  type="text" 
                  value={formData.responsavel}
                  onChange={e => setFormData({...formData, responsavel: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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
