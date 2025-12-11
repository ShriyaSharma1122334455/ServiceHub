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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <button onClick={onLoginClick} className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign in
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          
          {/* Role Toggle */}
          <div className="mb-8 flex p-1 bg-gray-100 rounded-lg">
             <button
                type="button"
                onClick={() => setRole(UserRole.CUSTOMER)}
                className={`flex-1 flex items-center justify-center py-2 text-sm font-medium rounded-md transition-all ${
                    role === UserRole.CUSTOMER ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'
                }`}
             >
                <User className="w-4 h-4 mr-2" />
                Customer
             </button>
             <button
                type="button"
                onClick={() => setRole(UserRole.PROVIDER)}
                className={`flex-1 flex items-center justify-center py-2 text-sm font-medium rounded-md transition-all ${
                    role === UserRole.PROVIDER ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'
                }`}
             >
                <Briefcase className="w-4 h-4 mr-2" />
                Service Provider
             </button>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            
            {role === UserRole.PROVIDER && (
                <div className="bg-yellow-50 p-4 rounded-md text-xs text-yellow-800 border border-yellow-200">
                    Note: Provider accounts require admin verification before appearing in search results.
                </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
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