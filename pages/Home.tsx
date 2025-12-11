import React from 'react';
import { ServiceCategory } from '../types';
import { SERVICE_ICONS } from '../constants';
import { Search, ShieldCheck, Zap, Clock } from 'lucide-react';

interface HomeProps {
  onNavigate: (path: string) => void;
  isLoggedIn: boolean;
}

export const Home: React.FC<HomeProps> = ({ onNavigate, isLoggedIn }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-indigo-700 py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581578731117-104f2a8d23e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6">
            Home services, <span className="text-indigo-200">on demand.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-indigo-100 mb-10">
            Book trusted professionals for cleaning, plumbing, electrical, and design needs in minutes. Transparent pricing, guaranteed quality.
          </p>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={() => onNavigate(isLoggedIn ? '/search' : '/register')}
              className="bg-white text-indigo-700 px-8 py-3.5 rounded-xl font-bold text-lg shadow-lg hover:bg-indigo-50 transition-all transform hover:-translate-y-1"
            >
              {isLoggedIn ? 'Find a Pro' : 'Get Started'}
            </button>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900">Our Services</h2>
                <p className="mt-4 text-lg text-gray-500">Everything you need to maintain your home</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {Object.values(ServiceCategory).map((service) => (
                    <div 
                        key={service}
                        onClick={() => onNavigate(isLoggedIn ? '/search' : '/login')}
                        className="group bg-slate-50 rounded-2xl p-6 text-center cursor-pointer hover:shadow-xl hover:bg-white transition-all border border-transparent hover:border-indigo-100"
                    >
                        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                            {SERVICE_ICONS[service]}
                        </div>
                        <h3 className="font-semibold text-gray-900">{service}</h3>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-xl shadow-sm">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                        <ShieldCheck />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Verified Professionals</h3>
                    <p className="text-gray-600">Every provider undergoes a strict background check and skills assessment.</p>
                </div>
                <div className="bg-white p-8 rounded-xl shadow-sm">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-4">
                        <Zap />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Instant Booking</h3>
                    <p className="text-gray-600">See real-time availability and book within minutes. No more phone tag.</p>
                </div>
                <div className="bg-white p-8 rounded-xl shadow-sm">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mb-4">
                        <Clock />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Transparent Pricing</h3>
                    <p className="text-gray-600">Know exactly what you pay upfront. No hidden fees or surprise charges.</p>
                </div>
            </div>
          </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-auto">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-gray-500">© 2024 ServiceHub. All rights reserved.</p>
          </div>
      </footer>
    </div>
  );
};