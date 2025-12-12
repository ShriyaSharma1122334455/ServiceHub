
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
        // Simplified role detection for demo
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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="h-12 w-12 bg-teal-600 rounded-xl flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-2xl">S</span>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <button onClick={onRegisterClick} className="font-medium text-teal-600 hover:text-teal-500">
            create a new account
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="focus:ring-teal-500 focus:border-teal-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3 border"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="focus:ring-teal-500 focus:border-teal-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3 border"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-8">
             <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500 font-medium">Demo Credentials</span>
                </div>
             </div>
             
             <div className="mt-6 flex flex-col gap-3">
                <div className="flex gap-2">
                    <button 
                        type="button"
                        onClick={() => fillCredential('demo@customer.com', '123456', 'USER')}
                        className={`flex-1 text-center text-xs p-2 rounded border transition-colors ${!isAdminMode ? 'bg-teal-50 border-teal-200 text-teal-700 font-bold' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                    >
                        Customer
                    </button>
                    <button 
                        type="button"
                        onClick={() => fillCredential('demo@provider.com', '123456', 'USER')}
                        className={`flex-1 text-center text-xs p-2 rounded border transition-colors ${!isAdminMode ? 'bg-teal-50 border-teal-200 text-teal-700 font-bold' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                    >
                        Provider
                    </button>
                </div>

                <div className="relative mt-2">
                    <button 
                        type="button"
                        onClick={() => setIsAdminMode(!isAdminMode)}
                        className="w-full flex items-center justify-center gap-2 text-xs text-gray-500 hover:text-gray-800 py-1"
                    >
                        <ShieldAlert size={12} />
                        {isAdminMode ? 'Hide Admin Credentials' : 'Show Admin Credentials'}
                    </button>
                </div>

                {isAdminMode && (
                    <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                        {ADMIN_CREDENTIALS.map((cred, idx) => (
                            <button 
                                key={idx}
                                type="button"
                                onClick={() => fillCredential(cred.email, cred.password, 'ADMIN')}
                                className="text-left text-[10px] p-2 bg-white border border-gray-200 rounded hover:border-teal-300 hover:shadow-sm transition-all"
                            >
                                <div className="font-bold text-gray-700 truncate">{cred.name}</div>
                                <div className="text-gray-400 truncate">{cred.email}</div>
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
