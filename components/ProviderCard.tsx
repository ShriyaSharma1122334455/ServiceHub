
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
    <div className={`bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow duration-300 ${provider.isBanned ? 'border-red-200 opacity-75' : 'border-gray-200'}`}>
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src={provider.avatar} 
              alt={provider.name} 
              className="h-16 w-16 rounded-full object-cover border-2 border-teal-50"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                {provider.name}
                {provider.verified && <BadgeCheck className="w-4 h-4 text-emerald-500 ml-1" />}
              </h3>
              <p className="text-sm text-gray-500">{provider.serviceCategory}</p>
              <div className="flex items-center mt-1 text-sm text-gray-500">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="font-medium text-gray-900 ml-1">{provider.rating?.toFixed(1) || '0.0'}</span>
                <span className="mx-1">·</span>
                <span>{provider.reviewCount} reviews</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-gray-900">${startingPrice}</div>
            <div className="text-xs text-gray-500">starting at / hr</div>
          </div>
        </div>
        
        <p className="mt-4 text-sm text-gray-600 line-clamp-2">
          {provider.bio}
        </p>
        
        <div className="mt-4 flex items-center text-xs text-gray-500 space-x-4">
            <div className="flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                {provider.distanceKm} km away
            </div>
            {provider.teamMembers && provider.teamMembers.length > 0 && (
                <div className="flex items-center text-teal-600">
                    <Users className="w-3 h-3 mr-1" />
                    Team
                </div>
            )}
            <div className={`flex items-center font-medium ${provider.availabilityStatus === 'AVAILABLE' ? 'text-green-600' : 'text-gray-400'}`}>
                <Clock className="w-3 h-3 mr-1" />
                {provider.availabilityStatus === 'AVAILABLE' ? 'Avail. Today' : 'Busy / Off'}
            </div>
        </div>

        {provider.isBanned ? (
            <button 
                disabled
                className="mt-5 w-full bg-red-100 text-red-800 py-2.5 rounded-lg font-medium text-sm cursor-not-allowed"
            >
                Unavailable
            </button>
        ) : (
            <button 
                onClick={() => onBook(provider)}
                className="mt-5 w-full bg-teal-600 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-teal-700 transition-colors focus:ring-4 focus:ring-teal-100"
            >
                Book Now
            </button>
        )}
      </div>
    </div>
  );
};
