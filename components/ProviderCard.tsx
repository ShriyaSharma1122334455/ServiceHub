
import React from 'react';
import { Provider } from '../types';
import { Star, MapPin, BadgeCheck, Clock, Users } from 'lucide-react';

interface ProviderCardProps {
  provider: Provider;
  onBook: (provider: Provider) => void;
}

export const ProviderCard: React.FC<ProviderCardProps> = ({ provider, onBook }) => {
  // Calculate lowest price for "Starting at" from service list, defaulting to hourlyRate if empty
  const startingPrice = (provider.services && provider.services.length > 0)
    ? Math.min(...provider.services.map(s => s.price)) 
    : provider.hourlyRate;

  return (
    <div className={`group bg-white/60 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 overflow-hidden hover:shadow-2xl hover:scale-[1.01] hover:bg-white/80 transition-all duration-300 ${provider.isBanned ? 'opacity-75 grayscale' : ''}`}>
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
                <img 
                src={provider.avatar} 
                alt={provider.name} 
                className="h-16 w-16 rounded-2xl object-cover shadow-md border-2 border-white"
                />
                {provider.verified && (
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                        <BadgeCheck className="w-5 h-5 text-emerald-500 fill-white" />
                    </div>
                )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 leading-tight">
                {provider.name}
              </h3>
              <p className="text-sm font-medium text-teal-700">{provider.serviceCategory}</p>
              <div className="flex items-center mt-1 text-sm bg-white/50 rounded-lg px-2 py-0.5 w-fit border border-white/50 shadow-sm">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
                <span className="font-bold text-gray-800 ml-1">{provider.rating?.toFixed(1) || '0.0'}</span>
                <span className="mx-1 text-gray-400">|</span>
                <span className="text-gray-600 text-xs">{provider.reviewCount} reviews</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-extrabold text-gray-900">${startingPrice}</div>
            <div className="text-[10px] uppercase font-bold tracking-wide text-gray-500">starting at / hr</div>
          </div>
        </div>
        
        <p className="mt-5 text-sm text-gray-600 line-clamp-2 leading-relaxed">
          {provider.bio}
        </p>
        
        <div className="mt-5 flex items-center text-xs font-medium text-gray-500 space-x-4 border-t border-gray-200/50 pt-4">
            <div className="flex items-center bg-gray-50/50 px-2 py-1 rounded">
                <MapPin className="w-3 h-3 mr-1 text-gray-400" />
                {provider.distanceKm} km
            </div>
            {provider.teamMembers && provider.teamMembers.length > 0 && (
                <div className="flex items-center text-teal-700 bg-teal-50/50 px-2 py-1 rounded">
                    <Users className="w-3 h-3 mr-1" />
                    Team
                </div>
            )}
            <div className={`flex items-center px-2 py-1 rounded ${provider.availabilityStatus === 'AVAILABLE' ? 'text-green-700 bg-green-50/50' : 'text-gray-500 bg-gray-100/50'}`}>
                <Clock className="w-3 h-3 mr-1" />
                {provider.availabilityStatus === 'AVAILABLE' ? 'Available' : 'Busy'}
            </div>
        </div>

        {provider.isBanned ? (
            <button 
                disabled
                className="mt-5 w-full bg-red-100/50 border border-red-200 text-red-800 py-3 rounded-xl font-bold text-sm cursor-not-allowed"
            >
                Unavailable
            </button>
        ) : (
            <button 
                onClick={() => onBook(provider)}
                className="mt-5 w-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-teal-900/10 hover:shadow-teal-900/20 hover:-translate-y-0.5 transition-all"
            >
                Book Now
            </button>
        )}
      </div>
    </div>
  );
};
