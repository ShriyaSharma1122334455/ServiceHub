import React, { useState, useEffect } from 'react';
import { Provider, ServiceCategory } from '../types';
import { api } from '../services/mockService';
import { ProviderCard } from '../components/ProviderCard';
import { Search as SearchIcon, MapPin, Filter, Sparkles } from 'lucide-react';

interface ProviderSearchProps {
  onBook: (provider: Provider) => void;
}

export const ProviderSearch: React.FC<ProviderSearchProps> = ({ onBook }) => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [selectedService, setSelectedService] = useState<ServiceCategory | 'All'>('All');
  const [radius, setRadius] = useState<number>(10);
  const [sortMethod, setSortMethod] = useState<'distance' | 'rating' | 'recommended'>('recommended');

  useEffect(() => {
    const fetchProviders = async () => {
        setLoading(true);
        // Simulate API delay
        const results = await api.searchProviders(
            selectedService === 'All' ? undefined : selectedService,
            radius
        );

        // Sorting Logic (Simulating ML Ranking)
        let sorted = [...results];
        if (sortMethod === 'recommended') {
            // Mock ML: Sort by rating weight + verified status
            sorted.sort((a, b) => (b.rating + (b.verified ? 1 : 0)) - (a.rating + (a.verified ? 1 : 0)));
        } else if (sortMethod === 'rating') {
            sorted.sort((a, b) => b.rating - a.rating);
        } else if (sortMethod === 'distance') {
            sorted.sort((a, b) => a.distanceKm - b.distanceKm);
        }

        setProviders(sorted);
        setLoading(false);
    };

    fetchProviders();
  }, [selectedService, radius, sortMethod]);

  return (
    <div className="min-h-screen pb-20">
      <div className="sticky top-20 z-40 px-4">
        <div className="max-w-7xl mx-auto">
            {/* Glass Search Bar */}
            <div className="glass-panel rounded-[2rem] p-4 flex flex-col md:flex-row gap-4 items-center shadow-lg border-white/60">
                <div className="flex-1 w-full md:w-auto relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                    </div>
                    <select 
                        value={selectedService}
                        onChange={(e) => setSelectedService(e.target.value as ServiceCategory | 'All')}
                        className="w-full appearance-none bg-slate-50/50 hover:bg-slate-100 border-none pl-12 pr-10 py-3.5 rounded-2xl focus:ring-0 text-slate-800 font-bold cursor-pointer transition-colors outline-none"
                    >
                        <option value="All">All Services</option>
                        {Object.values(ServiceCategory).map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>

                <div className="h-8 w-px bg-slate-200 hidden md:block"></div>

                <div className="w-full md:w-72 relative px-4">
                    <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                        <span className="flex items-center gap-1"><MapPin size={12}/> Max Distance</span>
                        <span>{radius} km</span>
                    </div>
                    <input 
                        type="range" 
                        min="1" 
                        max="50" 
                        value={radius} 
                        onChange={(e) => setRadius(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                    />
                </div>

                <div className="w-full md:w-auto">
                    <div className="relative">
                        <select
                            value={sortMethod}
                            onChange={(e) => setSortMethod(e.target.value as any)}
                            className="w-full appearance-none bg-slate-900 text-white border-none pl-6 pr-10 py-3.5 rounded-2xl focus:ring-0 font-bold cursor-pointer"
                        >
                            <option value="recommended">✨ AI Recommended</option>
                            <option value="rating">Top Rated</option>
                            <option value="distance">Nearest</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-4">
        {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1,2,3].map(i => (
                    <div key={i} className="h-96 rounded-[2rem] bg-white/20 animate-pulse"></div>
                ))}
            </div>
        ) : providers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {providers.map((provider, index) => (
                    <div key={provider.id} className="relative group">
                        {sortMethod === 'recommended' && index === 0 && (
                             <div className="absolute -top-3 left-6 z-10 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                                <Sparkles size={10} fill="currentColor" /> Top Match
                             </div>
                        )}
                        <ProviderCard provider={provider} onBook={onBook} />
                    </div>
                ))}
            </div>
        ) : (
            <div className="text-center py-20 bg-white/40 backdrop-blur-md rounded-[3rem] border border-white/50">
                <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Filter className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">No providers found</h3>
                <p className="mt-2 text-slate-500 font-medium">Try adjusting your filters to see more results.</p>
            </div>
        )}
      </div>
    </div>
  );
};