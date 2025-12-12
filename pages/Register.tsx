import React, { useState } from 'react';
import { UserRole } from '../types';
import { User, Briefcase } from 'lucide-react';

interface RegisterProps {
  onRegister: (email: string, role: UserRole, password?: string) => void;
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
        onRegister(email, role, password);
        setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-[calc(100vh-100px)] flex flex-col justify-center items-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            Create account
            </h2>
            <p className="mt-2 text-slate-500 font-medium">
            Already have an account?{' '}
            <button onClick={onLoginClick} className="font-bold text-slate-900 hover:underline transition-all">
                Sign in
            </button>
            </p>
        </div>

        <div className="glass-panel py-8 px-6 sm:px-10 rounded-[2.5rem]">
          
          {/* Role Toggle */}
          <div className="mb-8 flex p-1.5 bg-slate-200/50 rounded-2xl border border-slate-200/50">
             <button
                type="button"
                onClick={() => setRole(UserRole.CUSTOMER)}
                className={`flex-1 flex items-center justify-center py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
                    role === UserRole.CUSTOMER ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'
                }`}
             >
                <User className="w-4 h-4 mr-2" />
                Customer
             </button>
             <button
                type="button"
                onClick={() => setRole(UserRole.PROVIDER)}
                className={`flex-1 flex items-center justify-center py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
                    role === UserRole.PROVIDER ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'
                }`}
             >
                <Briefcase className="w-4 h-4 mr-2" />
                Provider
             </button>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide ml-3 mb-2">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="glass-input block w-full px-4 py-3.5 rounded-2xl text-sm font-medium text-slate-900 focus:ring-0 focus:border-slate-300"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide ml-3 mb-2">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-input block w-full px-4 py-3.5 rounded-2xl text-sm font-medium text-slate-900 focus:ring-0 focus:border-slate-300"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide ml-3 mb-2">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input block w-full px-4 py-3.5 rounded-2xl text-sm font-medium text-slate-900 focus:ring-0 focus:border-slate-300"
                placeholder="Create a strong password"
              />
            </div>
            
            {role === UserRole.PROVIDER && (
                <div className="bg-amber-50/50 p-4 rounded-2xl text-xs font-medium text-amber-800 border border-amber-200/50">
                    Providers require verification before appearing in search results.
                </div>
            )}

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-4 px-4 rounded-full shadow-lg text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-all hover:scale-[1.02]"
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