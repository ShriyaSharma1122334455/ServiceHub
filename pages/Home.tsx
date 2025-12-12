import React from 'react';
import { ServiceCategory } from '../types';
import { SERVICE_ICONS } from '../constants';
import { ShieldCheck, Zap, Clock, Star, ArrowRight } from 'lucide-react';

interface HomeProps {
  onNavigate: (path: string) => void;
  isLoggedIn: boolean;
}

export const Home: React.FC<HomeProps> = ({ onNavigate, isLoggedIn }) => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-100px)]">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-visible">
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 border border-white/60 shadow-sm backdrop-blur-md mb-8 animate-float">
             <Star size={14} className="text-amber-500 fill-amber-500" />
             <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Trusted by 10k+ Homeowners</span>
          </div>
          
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold text-slate-900 tracking-tighter mb-8 leading-[0.95]">
            Home services, <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500">perfected.</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-xl text-slate-500 mb-12 leading-relaxed font-medium">
            Connect with top-rated professionals for cleaning, repairs, and design. Instant booking, transparent pricing, guaranteed satisfaction.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => onNavigate(isLoggedIn ? '/search' : '/register')}
              className="bg-slate-900 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl shadow-slate-900/20 hover:bg-slate-800 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              {isLoggedIn ? 'Find a Professional' : 'Get Started Free'}
              <ArrowRight size={20} />
            </button>
            {!isLoggedIn && (
                <button 
                onClick={() => onNavigate('/login')}
                className="bg-white/50 backdrop-blur-md text-slate-800 px-8 py-4 rounded-full font-bold text-lg shadow-sm border border-white/60 hover:bg-white/80 transition-all duration-300"
                >
                Log In
                </button>
            )}
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-10 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-12 px-2">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Explore Categories</h2>
                    <p className="mt-2 text-lg text-slate-500 font-medium">Everything for your home.</p>
                </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {Object.values(ServiceCategory).map((service, idx) => (
                    <div 
                        key={service}
                        onClick={() => onNavigate(isLoggedIn ? '/search' : '/login')}
                        className="group glass-panel rounded-[2.5rem] p-8 text-center cursor-pointer hover:bg-white/80 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-500 flex flex-col items-center justify-center h-64 relative overflow-hidden"
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500
                            ${idx === 0 ? 'from-blue-400 to-indigo-400' : 
                              idx === 1 ? 'from-teal-400 to-emerald-400' :
                              idx === 2 ? 'from-amber-400 to-orange-400' : 'from-purple-400 to-pink-400'}
                        `}></div>
                        <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-500 drop-shadow-sm filter grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100">
                            {SERVICE_ICONS[service]}
                        </div>
                        <h3 className="font-bold text-slate-800 text-lg tracking-tight relative z-10">{service}</h3>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="glass-panel rounded-[3rem] p-12 md:p-16 border-white/60">
                <div className="grid md:grid-cols-3 gap-12">
                    <div className="text-center md:text-left">
                        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 mx-auto md:mx-0 border border-blue-100">
                            <ShieldCheck size={32} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-slate-900 tracking-tight">Verified & Insured</h3>
                        <p className="text-slate-500 leading-relaxed font-medium">Every provider undergoes a rigorous 5-step background check and skill assessment.</p>
                    </div>
                    <div className="text-center md:text-left">
                        <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-6 mx-auto md:mx-0 border border-purple-100">
                            <Zap size={32} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-slate-900 tracking-tight">Instant Availability</h3>
                        <p className="text-slate-500 leading-relaxed font-medium">Book pros who are ready to work now. Live calendar syncing prevents conflicts.</p>
                    </div>
                    <div className="text-center md:text-left">
                        <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 mx-auto md:mx-0 border border-emerald-100">
                            <Clock size={32} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-slate-900 tracking-tight">Transparent Pricing</h3>
                        <p className="text-slate-500 leading-relaxed font-medium">Know exactly what you'll pay. Hourly rates and fixed fees are clearly displayed.</p>
                    </div>
                </div>
            </div>
          </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-12 border-t border-slate-200/50">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="flex justify-center mb-6">
                 <div className="h-10 w-10 bg-slate-200 rounded-xl flex items-center justify-center text-slate-400">
                    <span className="font-bold text-xl">S</span>
                </div>
            </div>
            <p className="text-slate-400 text-sm font-medium">© 2024 ServiceHub Inc. All rights reserved.</p>
          </div>
      </footer>
    </div>
  );
};