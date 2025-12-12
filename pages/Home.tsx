
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
    <div className="flex flex-col min-h-[calc(100vh-64px)]">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/30 backdrop-blur-md border border-white/40 text-teal-900 text-sm font-semibold mb-6 shadow-sm">
             ✨ The #1 Home Services Platform
          </div>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight mb-8 drop-shadow-sm">
            Home services, <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">on demand.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-600 mb-12 leading-relaxed">
            Book trusted professionals for cleaning, plumbing, electrical, and design needs in minutes. Transparent pricing, guaranteed quality.
          </p>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={() => onNavigate(isLoggedIn ? '/search' : '/register')}
              className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-teal-900/20 hover:scale-105 transition-all duration-300 border border-white/20"
            >
              {isLoggedIn ? 'Find a Pro' : 'Get Started'}
            </button>
            {!isLoggedIn && (
                <button 
                onClick={() => onNavigate('/login')}
                className="bg-white/40 backdrop-blur-md text-teal-900 px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-white/60 transition-all duration-300 border border-white/50"
                >
                Log In
                </button>
            )}
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900">Our Services</h2>
                <p className="mt-4 text-lg text-gray-600">Everything you need to maintain your home</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {Object.values(ServiceCategory).map((service) => (
                    <div 
                        key={service}
                        onClick={() => onNavigate(isLoggedIn ? '/search' : '/login')}
                        className="group bg-white/40 backdrop-blur-lg rounded-3xl p-8 text-center cursor-pointer shadow-lg border border-white/50 hover:bg-white/60 hover:scale-[1.02] hover:shadow-xl transition-all duration-300"
                    >
                        <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300 drop-shadow-sm">
                            {SERVICE_ICONS[service]}
                        </div>
                        <h3 className="font-bold text-gray-800 text-lg">{service}</h3>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-lg border border-white/50">
                    <div className="w-14 h-14 bg-teal-100/50 rounded-2xl flex items-center justify-center text-teal-600 mb-6 shadow-inner">
                        <ShieldCheck size={28} />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900">Verified Professionals</h3>
                    <p className="text-gray-600 leading-relaxed">Every provider undergoes a strict background check and skills assessment.</p>
                </div>
                <div className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-lg border border-white/50">
                    <div className="w-14 h-14 bg-emerald-100/50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 shadow-inner">
                        <Zap size={28} />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900">Instant Booking</h3>
                    <p className="text-gray-600 leading-relaxed">See real-time availability and book within minutes. No more phone tag.</p>
                </div>
                <div className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-lg border border-white/50">
                    <div className="w-14 h-14 bg-blue-100/50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 shadow-inner">
                        <Clock size={28} />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900">Transparent Pricing</h3>
                    <p className="text-gray-600 leading-relaxed">Know exactly what you pay upfront. No hidden fees or surprise charges.</p>
                </div>
            </div>
          </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/80 backdrop-blur-xl text-white py-12 mt-auto border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h3 className="text-2xl font-bold mb-4">ServiceHub</h3>
            <p className="text-gray-400 mb-8">Making home maintenance effortless, one booking at a time.</p>
            <p className="text-gray-500 text-sm">© 2024 ServiceHub. All rights reserved.</p>
          </div>
      </footer>
    </div>
  );
};
