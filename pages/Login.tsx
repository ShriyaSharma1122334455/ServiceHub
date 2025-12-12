
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
    <div className="min-h-[calc(100vh-64px)] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="h-14 w-14 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl rotate-3 hover:rotate-0 transition-all duration-500">
            <span className="text-white font-bold text-3xl">S</span>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 drop-shadow-sm">
          Welcome Back
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <button onClick={onRegisterClick} className="font-bold text-teal-700 hover:text-teal-900 underline decoration-teal-500/30 hover:decoration-teal-500">
            create a new account
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/40 backdrop-blur-xl py-8 px-4 shadow-2xl rounded-3xl border border-white/50 sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-700 ml-1 mb-1">
                Email address
              </label>
              <div className="mt-1 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 sm:text-sm bg-white/60 border-gray-200/60 rounded-xl py-3 border focus:ring-2 focus:ring-teal-500 focus:border-transparent focus:bg-white/90 transition-all placeholder-gray-400"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-gray-700 ml-1 mb-1">
                Password
              </label>
              <div className="mt-1 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 sm:text-sm bg-white/60 border-gray-200/60 rounded-xl py-3 border focus:ring-2 focus:ring-teal-500 focus:border-transparent focus:bg-white/90 transition-all"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transform hover:-translate-y-0.5 transition-all"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-8">
             <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300/50" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-transparent text-gray-500 font-medium bg-white/50 backdrop-blur rounded-full">Demo Credentials</span>
                </div>
             </div>
             
             <div className="mt-6 flex flex-col gap-3">
                <div className="flex gap-2">
                    <button 
                        type="button"
                        onClick={() => fillCredential('demo@customer.com', '123456', 'USER')}
                        className={`flex-1 text-center text-xs p-2.5 rounded-xl border transition-all duration-300 font-bold ${!isAdminMode ? 'bg-teal-50/80 border-teal-200 text-teal-800 shadow-sm' : 'bg-white/40 border-gray-200 text-gray-600 hover:bg-white/60'}`}
                    >
                        Customer
                    </button>
                    <button 
                        type="button"
                        onClick={() => fillCredential('demo@provider.com', '123456', 'USER')}
                        className={`flex-1 text-center text-xs p-2.5 rounded-xl border transition-all duration-300 font-bold ${!isAdminMode ? 'bg-teal-50/80 border-teal-200 text-teal-800 shadow-sm' : 'bg-white/40 border-gray-200 text-gray-600 hover:bg-white/60'}`}
                    >
                        Provider
                    </button>
                </div>

                <div className="relative mt-2">
                    <button 
                        type="button"
                        onClick={() => setIsAdminMode(!isAdminMode)}
                        className="w-full flex items-center justify-center gap-2 text-xs text-gray-500 hover:text-gray-900 py-1 font-medium transition-colors"
                    >
                        <ShieldAlert size={14} />
                        {isAdminMode ? 'Hide Admin Credentials' : 'Show Admin Credentials'}
                    </button>
                </div>

                {isAdminMode && (
                    <div className="grid grid-cols-2 gap-2 bg-gray-50/50 p-3 rounded-xl border border-gray-200/50 backdrop-blur-sm">
                        {ADMIN_CREDENTIALS.map((cred, idx) => (
                            <button 
                                key={idx}
                                type="button"
                                onClick={() => fillCredential(cred.email, cred.password, 'ADMIN')}
                                className="text-left text-[10px] p-2.5 bg-white/80 border border-gray-200/50 rounded-lg hover:border-teal-400 hover:shadow-md transition-all shadow-sm"
                            >
                                <div className="font-bold text-gray-800 truncate">{cred.name}</div>
                                <div className="text-gray-500 truncate">{cred.email}</div>
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
