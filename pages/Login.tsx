
import React, { useState } from 'react';
import { UserRole } from '../types';
import { Lock, Mail, ShieldAlert } from 'lucide-react';
import { ADMIN_CREDENTIALS } from '../constants';

interface LoginProps {
  onLogin: (email: string, role: UserRole, password?: string) => void;
  onRegisterClick: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin, onRegisterClick }) => {
  const [email, setEmail] = useState('demo@customer.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
        let role = UserRole.CUSTOMER;
        if (isAdminMode) role = UserRole.ADMIN;
        else if (email.includes('provider')) role = UserRole.PROVIDER;
        
        onLogin(email, role, password);
        setLoading(false);
    }, 800);
  };

  const fillCredential = (e: string, p: string, mode: 'USER' | 'ADMIN') => {
      setEmail(e);
      setPassword(p);
      setIsAdminMode(mode === 'ADMIN');
  };

  return (
    <div className="min-h-[calc(100vh-100px)] flex flex-col justify-center items-center py-12 px-4">
      <div className="w-full max-w-md">
        
        <div className="text-center mb-10">
            <div className="flex justify-center mb-8 transform hover:scale-105 transition-transform duration-500">
                <div className="h-16 w-16 bg-gradient-to-br from-slate-900 to-slate-700 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-3xl tracking-tighter">S</span>
                </div>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            Welcome back
            </h2>
            <p className="mt-2 text-slate-500 font-medium">
            Don't have an account?{' '}
            <button onClick={onRegisterClick} className="font-bold text-slate-900 hover:underline transition-all">
                Sign up
            </button>
            </p>
        </div>

        <div className="glass-panel py-8 px-6 sm:px-10 rounded-[2.5rem]">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-slate-500 uppercase tracking-wide ml-3 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-input block w-full pl-11 pr-4 py-4 rounded-2xl text-sm font-medium text-slate-900 placeholder-slate-400 focus:ring-0 focus:border-slate-300"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-slate-500 uppercase tracking-wide ml-3 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass-input block w-full pl-11 pr-4 py-4 rounded-2xl text-sm font-medium text-slate-900 placeholder-slate-400 focus:ring-0 focus:border-slate-300"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-4 px-4 rounded-full shadow-lg text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-all hover:scale-[1.02]"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>

          {/* Demo Controls */}
          <div className="mt-8 pt-6 border-t border-slate-200/60">
             <div className="flex justify-center mb-6">
                 <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-wider">Demo Access</span>
             </div>
             
             <div className="flex flex-col gap-3">
                <div className="flex gap-3">
                    <button 
                        type="button"
                        onClick={() => fillCredential('demo@customer.com', '123456', 'USER')}
                        className={`flex-1 py-3 rounded-xl border font-bold text-xs transition-all ${!isAdminMode ? 'bg-teal-50 border-teal-200 text-teal-800' : 'bg-white/40 border-slate-200 text-slate-500 hover:bg-white/60'}`}
                    >
                        Customer
                    </button>
                    <button 
                        type="button"
                        onClick={() => fillCredential('demo@provider.com', '123456', 'USER')}
                        className={`flex-1 py-3 rounded-xl border font-bold text-xs transition-all ${!isAdminMode ? 'bg-teal-50 border-teal-200 text-teal-800' : 'bg-white/40 border-slate-200 text-slate-500 hover:bg-white/60'}`}
                    >
                        Provider
                    </button>
                </div>

                <button 
                    type="button"
                    onClick={() => setIsAdminMode(!isAdminMode)}
                    className="flex items-center justify-center gap-2 text-xs text-slate-400 hover:text-slate-600 py-2 font-medium transition-colors"
                >
                    <ShieldAlert size={14} />
                    {isAdminMode ? 'Hide Admin Access' : 'Admin Access'}
                </button>

                {isAdminMode && (
                    <div className="grid grid-cols-2 gap-2 bg-slate-50/50 p-2 rounded-xl border border-slate-200/50">
                        {ADMIN_CREDENTIALS.map((cred, idx) => (
                            <button 
                                key={idx}
                                type="button"
                                onClick={() => fillCredential(cred.email, cred.password, 'ADMIN')}
                                className="text-left p-3 bg-white border border-slate-200/50 rounded-lg hover:border-slate-300 hover:shadow-sm transition-all"
                            >
                                <div className="font-bold text-slate-800 text-xs truncate">{cred.name}</div>
                                <div className="text-[10px] text-slate-400 truncate">{cred.email}</div>
                            </button>
                        ))}
                    </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
