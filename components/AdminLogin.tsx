import React, { useState } from 'react';
import { ShieldAlert, Lock, User, ChevronRight } from 'lucide-react';
import Button from './Button';
import Input from './Input';

interface AdminLoginProps {
  onLogin: () => void;
  onBack: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onBack }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Specific credentials as requested
    const ADMIN_USER = "MOSTAFAMOHAMED111111111111111111111ADMIN";
    const ADMIN_PASS = "M18112007M3092008M";

    setTimeout(() => {
      if (username === ADMIN_USER && password === ADMIN_PASS) {
        onLogin();
      } else {
        setError("Access Denied: Invalid cryptographic credentials.");
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#050a14]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-500/30 shadow-[0_0_30px_rgba(220,38,38,0.2)]">
            <ShieldAlert size={40} className="text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wider">RESTRICTED AREA</h1>
          <p className="text-slate-500 text-xs uppercase tracking-[0.2em] mt-2">Authorized Personnel Only</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>
          
          <div className="space-y-6">
            <Input
              label="Secure Identifier"
              placeholder="Enter Admin ID"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="font-mono text-sm tracking-tighter"
              icon={<User size={16} />}
            />
            
            <Input
              type="password"
              label="Access Key"
              placeholder="••••••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="font-mono"
              icon={<Lock size={16} />}
            />

            {error && (
              <div className="p-3 bg-red-950/50 border border-red-900/50 rounded-lg flex items-center gap-2 text-red-400 text-xs">
                <ShieldAlert size={14} />
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-red-700 hover:bg-red-600 shadow-lg shadow-red-900/20 border-0"
              isLoading={loading}
            >
              Authenticate System
            </Button>
            
            <button 
              type="button" 
              onClick={onBack}
              className="w-full text-center text-slate-600 text-xs hover:text-slate-400 transition-colors mt-4"
            >
              Return to Public Site
            </button>
          </div>
        </form>
        
        <div className="text-center mt-8 text-[10px] text-slate-700 font-mono">
          SYSTEM ID: 0x8F2A9 • ENCRYPTION: AES-256 • IP LOGGED
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;