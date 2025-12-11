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
          case BookingStatus.COMPLETED: return 'bg-green-100 text-green-800';
          case BookingStatus.ACCEPTED: return 'bg-blue-100 text-blue-800';
          case BookingStatus.IN_PROGRESS: return 'bg-purple-100 text-purple-800';
          case BookingStatus.CANCELLED: return 'bg-red-100 text-red-800';
          default: return 'bg-yellow-100 text-yellow-800'; // Requested
      }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">My Bookings</h1>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2].map(i => (
                        <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse"></div>
                    ))}
                </div>
            ) : bookings.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No bookings yet</h3>
                    <p className="text-gray-500 mt-1">Ready to get your home sorted? Book your first service now.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.map(booking => (
                        <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row justify-between items-start md:items-center">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-lg font-semibold text-gray-900">{booking.serviceCategory}</h3>
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                        {booking.status}
                                    </span>
                                </div>
                                <p className="text-gray-600 mb-4">Provider: <span className="font-medium text-gray-900">{booking.providerName}</span></p>
                                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                    <div className="flex items-center">
                                        <Calendar className="w-4 h-4 mr-1.5" />
                                        {new Date(booking.date).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center">
                                        <Clock className="w-4 h-4 mr-1.5" />
                                        {booking.time} ({booking.durationHours}h)
                                    </div>
                                    <div className="font-medium text-gray-900">
                                        ${booking.totalPrice.toFixed(2)}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 md:mt-0 flex gap-2">
                                {booking.status === BookingStatus.REQUESTED && (
                                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                        Cancel
                                    </button>
                                )}
                                {booking.status === BookingStatus.COMPLETED && (
                                    <button className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors">
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