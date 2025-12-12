import React from 'react';
import { Provider } from '../types';
import { Star, MapPin, BadgeCheck, Users, ArrowRight } from 'lucide-react';

interface ProviderCardProps {
  provider: Provider;
  onBook: (provider: Provider) => void;
}

export const ProviderCard: React.FC<ProviderCardProps> = ({ provider, onBook }) => {
  const startingPrice = (provider.services && provider.services.length > 0)
    ? Math.min(...provider.services.map(s => s.price)) 
    : provider.hourlyRate;

  return (
    <div className={`glass-panel rounded-[2rem] p-6 transition-all duration-500 hover:scale-[1.01] hover:shadow-[0_25px_50px_rgba(0,0,0,0.08)] flex flex-col h-full ${provider.isBanned ? 'opacity-75 grayscale' : ''}`}>
      
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-4">
            <div className="relative">
                <img 
                src={provider.avatar} 
                alt={provider.name} 
                className="h-16 w-16 rounded-2xl object-cover shadow-sm border-2 border-white"
                />
                {provider.verified && (
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm border border-slate-100">
                        <BadgeCheck className="w-5 h-5 text-blue-500 fill-white" />
                    </div>
                )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 leading-tight">
                {provider.name}
              </h3>
              <p className="text-sm font-semibold text-slate-400 mt-0.5">{provider.serviceCategory}</p>
            </div>
          </div>
          <div className="text-right bg-white/40 px-3 py-2 rounded-2xl border border-white/60 backdrop-blur-sm">
            <div className="text-lg font-bold text-slate-900 leading-none">${startingPrice}</div>
            <div className="text-[10px] uppercase font-bold tracking-wide text-slate-400 mt-0.5">/ hr</div>
          </div>
      </div>

      {/* Info Pills */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
         <div className="flex items-center gap-1.5 bg-amber-50/80 px-2.5 py-1.5 rounded-lg border border-amber-100">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="text-xs font-bold text-amber-900">{provider.rating?.toFixed(1) || '0.0'}</span>
            <span className="text-[10px] font-medium text-amber-700/60">({provider.reviewCount})</span>
         </div>
         <div className="flex items-center gap-1.5 bg-slate-100/50 px-2.5 py-1.5 rounded-lg border border-slate-200/50">
            <MapPin className="w-3 h-3 text-slate-400" />
            <span className="text-xs font-bold text-slate-600">{provider.distanceKm} km</span>
         </div>
         {provider.teamMembers && provider.teamMembers.length > 0 && (
            <div className="flex items-center gap-1.5 bg-indigo-50/50 px-2.5 py-1.5 rounded-lg border border-indigo-100/50">
                <Users className="w-3 h-3 text-indigo-500" />
                <span className="text-xs font-bold text-indigo-700">Team</span>
            </div>
        )}
      </div>
      
      {/* Bio */}
      <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-8 font-medium">
        {provider.bio}
      </p>
      
      {/* Footer / Action */}
      <div className="mt-auto pt-6 border-t border-slate-100/50 flex items-center justify-between">
          <div className={`px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wide uppercase border ${
              provider.availabilityStatus === 'AVAILABLE' 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
              : 'bg-slate-50 text-slate-400 border-slate-100'
            }`}>
            {provider.availabilityStatus === 'AVAILABLE' ? 'Available' : 'Busy'}
        </div>

        {provider.isBanned ? (
            <button 
                disabled
                className="px-6 py-3 bg-slate-100 text-slate-400 rounded-full font-bold text-sm cursor-not-allowed"
            >
                Unavailable
            </button>
        ) : (
            <button 
                onClick={() => onBook(provider)}
                className="pl-6 pr-5 py-3 bg-slate-900 text-white rounded-full font-bold text-sm shadow-xl shadow-slate-900/10 hover:bg-slate-800 hover:scale-105 transition-all flex items-center gap-2 group"
            >
                Book Now <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
        )}
      </div>
    </div>
  );
};