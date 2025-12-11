import React, { useState, useEffect } from 'react';
import { Provider, ServiceCategory } from '../types';
import { api } from '../services/mockService';
import { ProviderCard } from '../components/ProviderCard';
import { Filter, Search as SearchIcon } from 'lucide-react';

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
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Find Service Providers</h1>
            
            {/* Search Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div className="flex-1 w-full md:w-auto">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Service Type</label>
                    <div className="relative">
                        <select 
                            value={selectedService}
                            onChange={(e) => setSelectedService(e.target.value as ServiceCategory | 'All')}
                            className="w-full appearance-none bg-white border border-gray-300 hover:border-indigo-400 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                        >
                            <option value="All">All Services</option>
                            {Object.values(ServiceCategory).map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-48">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Max Distance: {radius}km</label>
                    <input 
                        type="range" 
                        min="1" 
                        max="50" 
                        value={radius} 
                        onChange={(e) => setRadius(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        ) : providers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {providers.map(provider => (
                    <ProviderCard key={provider.id} provider={provider} onBook={onBook} />
                ))}
            </div>
        ) : (
            <div className="text-center py-20">
                <SearchIcon className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No providers found</h3>
                <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or search radius.</p>
            </div>
        )}
      </div>
    </div>
  );
};