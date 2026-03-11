import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ManageGames from './pages/ManageGames';
import PublicFeed from './pages/PublicFeed';
import { LayoutDashboard, Trophy, Users } from 'lucide-react';

function Sidebar() {
  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-6">
      <div className="flex items-center gap-3 mb-10">
        <Trophy className="text-blue-500" size={32} />
        <div>
           <h2 className="text-xl font-bold">Admin</h2>
           <p className="text-xs text-gray-400">Torneio José Augusto</p>
        </div>
      </div>
      
      <nav className="space-y-2">
        <Link to="/" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors">
          <LayoutDashboard size={20} className="text-gray-400" />
          <span className="font-medium">Dashboard</span>
        </Link>
        <Link to="/jogos" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors">
          <Trophy size={20} className="text-gray-400" />
          <span className="font-medium">Gerenciar Jogos</span>
        </Link>
        <Link to="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 opacity-50 cursor-not-allowed transition-colors">
           <Users size={20} className="text-gray-400" />
           <span className="font-medium">Times (Em breve)</span>
        </Link>
      </nav>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Rota Exclusiva do WebView do App Movél (Sem Sidebar) */}
        <Route path="/app" element={<PublicFeed />} />
        
        {/* Rotas Administrativas (Com Sidebar) */}
        <Route path="*" element={
          <div className="flex min-h-screen bg-gray-50 font-sans">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/jogos" element={<ManageGames />} />
              </Routes>
            </main>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
