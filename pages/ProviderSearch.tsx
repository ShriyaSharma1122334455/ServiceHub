
import React, { useState, useEffect } from 'react';
import { Provider, ServiceCategory } from '../types';
import { api } from '../services/mockService';
import { ProviderCard } from '../components/ProviderCard';
import { Search as SearchIcon } from 'lucide-react';

interface ProviderSearchProps {
  onBook: (provider: Provider) => void;
}

export const ProviderSearch: React.FC<ProviderSearchProps> = ({ onBook }) => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [selectedService, setSelectedService] = useState<ServiceCategory | 'All'>('All');
  const [radius, setRadius] = useState<number>(10);

  useEffect(() => {
    const fetchProviders = async () => {
        setLoading(true);
        // Simulate API delay
        const results = await api.searchProviders(
            selectedService === 'All' ? undefined : selectedService,
            radius
        );
        setProviders(results);
        setLoading(false);
    };

    fetchProviders();
  }, [selectedService, radius]);

  return (
    <div className="min-h-screen pb-20">
      <div className="sticky top-16 z-40 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 drop-shadow-sm">Find Service Providers</h1>
            
            {/* Search Filters */}
            <div className="flex flex-col md:flex-row gap-6 items-center bg-white/50 p-5 rounded-2xl border border-white/60 shadow-lg">
                <div className="flex-1 w-full md:w-auto">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Service Type</label>
                    <div className="relative">
                        <select 
                            value={selectedService}
                            onChange={(e) => setSelectedService(e.target.value as ServiceCategory | 'All')}
                            className="w-full appearance-none bg-white/80 border border-gray-200/50 hover:border-teal-400 px-5 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all font-medium text-gray-800 shadow-sm"
                        >
                            <option value="All">All Services</option>
                            {Object.values(ServiceCategory).map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-64">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Max Distance: {radius}km</label>
                    <input 
                        type="range" 
                        min="1" 
                        max="50" 
                        value={radius} 
                        onChange={(e) => setRadius(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                    />
                    <div className="flex justify-between text-xs font-medium text-gray-400 mt-2 px-1">
                        <span>1km</span>
                        <span>50km</span>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            </div>
        ) : providers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {providers.map(provider => (
                    <ProviderCard key={provider.id} provider={provider} onBook={onBook} />
                ))}
            </div>
        ) : (
            <div className="text-center py-20 bg-white/30 backdrop-blur-md rounded-3xl border border-white/40">
                <SearchIcon className="mx-auto h-16 w-16 text-gray-300/80" />
                <h3 className="mt-4 text-lg font-bold text-gray-800">No providers found</h3>
                <p className="mt-2 text-gray-500">Try adjusting your filters or search radius.</p>
            </div>
        )}
      </div>
    </div>
  );
};
