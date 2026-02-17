import React from 'react';
import { Sparkles, Video, CreditCard, Home } from 'lucide-react';

interface HeaderProps {
  currentView: 'home' | 'pricing';
  onNavigate: (view: 'home' | 'pricing') => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onNavigate }) => {
  return (
    <header className="w-full py-6 px-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => onNavigate('home')}
        >
          <div className="p-2 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-lg group-hover:scale-105 transition-transform">
            <Video className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              ThumbGen AI
            </h1>
            <p className="text-xs text-slate-400">Viral Thumbnails in Seconds</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-6">
          <nav className="flex items-center bg-slate-800/50 p-1 rounded-xl border border-slate-700/50">
            <button
              onClick={() => onNavigate('home')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                currentView === 'home' 
                  ? 'bg-indigo-500/20 text-indigo-300 shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Home size={16} />
              <span className="hidden md:inline">Generator</span>
            </button>
            <button
              onClick={() => onNavigate('pricing')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                currentView === 'pricing' 
                  ? 'bg-indigo-500/20 text-indigo-300 shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <CreditCard size={16} />
              <span className="hidden md:inline">Pricing</span>
            </button>
          </nav>

          <span className="hidden md:flex items-center gap-1 text-sm text-indigo-400 font-medium px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
            <Sparkles size={14} />
            v2.5
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;