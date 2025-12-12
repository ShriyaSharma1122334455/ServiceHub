
import React, { useEffect, useState } from 'react';
import { Booking, BookingStatus, UserRole } from '../types';
import { api } from '../services/mockService';
import { Clock, Calendar, AlertCircle } from 'lucide-react';

interface MyBookingsProps {
  userId: string;
}

export const MyBookings: React.FC<MyBookingsProps> = ({ userId }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
        setLoading(true);
        const data = await api.getBookings(userId, UserRole.CUSTOMER);
        setBookings(data);
        setLoading(false);
    };
    fetchBookings();
  }, [userId]);

  const getStatusColor = (status: BookingStatus) => {
      switch (status) {
          case BookingStatus.COMPLETED: return 'bg-green-100/60 text-green-800 border-green-200';
          case BookingStatus.ACCEPTED: return 'bg-teal-100/60 text-teal-800 border-teal-200';
          case BookingStatus.IN_PROGRESS: return 'bg-purple-100/60 text-purple-800 border-purple-200';
          case BookingStatus.CANCELLED: return 'bg-red-100/60 text-red-800 border-red-200';
          default: return 'bg-yellow-100/60 text-yellow-800 border-yellow-200'; // Requested
      }
  };

  return (
    <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 drop-shadow-sm">My Bookings</h1>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2].map(i => (
                        <div key={i} className="h-32 bg-white/40 rounded-2xl animate-pulse"></div>
                    ))}
                </div>
            ) : bookings.length === 0 ? (
                <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 p-12 text-center">
                    <Calendar className="w-16 h-16 text-teal-600/50 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-800">No bookings yet</h3>
                    <p className="text-gray-500 mt-2 font-medium">Ready to get your home sorted? Book your first service now.</p>
                </div>
            ) : (
                <div className="space-y-5">
                    {bookings.map(booking => (
                        <div key={booking.id} className="bg-white/60 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 p-6 flex flex-col md:flex-row justify-between items-start md:items-center hover:bg-white/70 transition-all duration-300">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-lg font-bold text-gray-900">{booking.serviceCategory}</h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(booking.status)}`}>
                                        {booking.status}
                                    </span>
                                </div>
                                <p className="text-gray-600 mb-4 font-medium">Provider: <span className="font-bold text-gray-900">{booking.providerName}</span></p>
                                <div className="flex flex-wrap gap-4 text-sm text-gray-500 font-medium">
                                    <div className="flex items-center">
                                        <Calendar className="w-4 h-4 mr-1.5 text-teal-600" />
                                        {new Date(booking.date).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center">
                                        <Clock className="w-4 h-4 mr-1.5 text-teal-600" />
                                        {booking.time} ({booking.durationHours}h)
                                    </div>
                                    <div className="font-bold text-gray-900 bg-white/50 px-2 rounded">
                                        ${booking.totalPrice.toFixed(2)}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 md:mt-0 flex gap-3">
                                {booking.status === BookingStatus.REQUESTED && (
                                    <button className="px-5 py-2.5 border border-gray-300/60 bg-white/50 rounded-xl text-sm font-bold text-gray-700 hover:bg-white hover:shadow-md transition-all">
                                        Cancel
                                    </button>
                                )}
                                {booking.status === BookingStatus.COMPLETED && (
                                    <button className="px-5 py-2.5 bg-teal-50/50 border border-teal-200 text-teal-800 rounded-xl text-sm font-bold hover:bg-teal-100/50 hover:shadow-md transition-all">
                                        Write Review
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
  );
};
