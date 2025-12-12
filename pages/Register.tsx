
import React, { useState } from 'react';
import { UserRole } from '../types';
import { User, Briefcase } from 'lucide-react';

interface RegisterProps {
  onRegister: (email: string, role: UserRole) => void;
  onLoginClick: () => void;
}

export const Register: React.FC<RegisterProps> = ({ onRegister, onLoginClick }) => {
  const [role, setRole] = useState<UserRole>(UserRole.CUSTOMER);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
        onRegister(email, role);
        setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900 drop-shadow-sm">
          Join ServiceHub
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <button onClick={onLoginClick} className="font-bold text-teal-700 hover:text-teal-900 underline decoration-teal-500/30">
            Sign in
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/40 backdrop-blur-xl py-8 px-4 shadow-2xl rounded-3xl border border-white/50 sm:px-10">
          
          {/* Role Toggle */}
          <div className="mb-8 flex p-1.5 bg-gray-100/50 rounded-xl border border-gray-200/30">
             <button
                type="button"
                onClick={() => setRole(UserRole.CUSTOMER)}
                className={`flex-1 flex items-center justify-center py-2.5 text-sm font-bold rounded-lg transition-all duration-300 ${
                    role === UserRole.CUSTOMER ? 'bg-white shadow-md text-teal-700' : 'text-gray-500 hover:text-gray-700 hover:bg-white/40'
                }`}
             >
                <User className="w-4 h-4 mr-2" />
                Customer
             </button>
             <button
                type="button"
                onClick={() => setRole(UserRole.PROVIDER)}
                className={`flex-1 flex items-center justify-center py-2.5 text-sm font-bold rounded-lg transition-all duration-300 ${
                    role === UserRole.PROVIDER ? 'bg-white shadow-md text-teal-700' : 'text-gray-500 hover:text-gray-700 hover:bg-white/40'
                }`}
             >
                <Briefcase className="w-4 h-4 mr-2" />
                Provider
             </button>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-bold text-gray-700 ml-1 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full px-4 py-3 bg-white/60 border-gray-200/60 border rounded-xl shadow-sm focus:ring-2 focus:ring-teal-500 focus:bg-white/90 transition-all sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 ml-1 mb-1">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-4 py-3 bg-white/60 border-gray-200/60 border rounded-xl shadow-sm focus:ring-2 focus:ring-teal-500 focus:bg-white/90 transition-all sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 ml-1 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-3 bg-white/60 border-gray-200/60 border rounded-xl shadow-sm focus:ring-2 focus:ring-teal-500 focus:bg-white/90 transition-all sm:text-sm"
              />
            </div>
            
            {role === UserRole.PROVIDER && (
                <div className="bg-yellow-50/80 backdrop-blur-sm p-4 rounded-xl text-xs font-medium text-yellow-800 border border-yellow-200/50">
                    Note: Provider accounts require admin verification before appearing in search results.
                </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transform hover:-translate-y-0.5 transition-all"
              >
                {loading ? 'Creating account...' : `Sign up as ${role === UserRole.CUSTOMER ? 'Customer' : 'Provider'}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
