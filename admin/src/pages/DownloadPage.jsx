import React from 'react';
import { Download, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center p-6 text-center font-sans animate-fade-in">
      <div className="mb-8">
        <div className="w-24 h-24 bg-blue-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner shadow-blue-500/20">
            <Smartphone size={48} className="text-blue-500" />
        </div>
        <h1 className="text-4xl font-black mb-4">Baixe o App Oficial</h1>
        <p className="text-slate-400 max-w-md mx-auto text-lg leading-relaxed">
          Acompanhe todos os jogos, o chaveamento do torneio e os placares ao vivo direto do seu celular, com notificações e acesso mais rápido.
        </p>
      </div>

      <div className="space-y-4 w-full max-w-sm">
         <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-colors shadow-lg shadow-blue-500/30">
            <Download size={20} />
            Baixar para Android (APK)
         </button>
         
         <p className="text-xs text-slate-500 mt-6">
            O aplicativo em breve estará disponível também na Google Play Store.
         </p>
      </div>

      <div className="mt-12">
        <Link to="/app" className="text-blue-400 hover:text-blue-300 font-medium text-sm flex items-center gap-2">
            Voltar para o Feed da Web
        </Link>
      </div>
    </div>
  );
}
