import React, { useEffect, useState } from 'react';
import { Booking, BookingStatus, UserRole } from '../types';
import { api } from '../services/mockService';
import { Clock, Calendar } from 'lucide-react';

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
          case BookingStatus.COMPLETED: return 'bg-emerald-50 text-emerald-800 border-emerald-100';
          case BookingStatus.ACCEPTED: return 'bg-sky-50 text-sky-800 border-sky-100';
          case BookingStatus.IN_PROGRESS: return 'bg-indigo-50 text-indigo-800 border-indigo-100';
          case BookingStatus.CANCELLED: return 'bg-red-50 text-red-800 border-red-100';
          default: return 'bg-amber-50 text-amber-800 border-amber-100'; // Requested
      }
  };

  return (
    <div className="min-h-screen py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-8 tracking-tight">Your Bookings</h1>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2].map(i => (
                        <div key={i} className="h-40 bg-white/40 rounded-3xl animate-pulse"></div>
                    ))}
                </div>
            ) : bookings.length === 0 ? (
                <div className="glass-panel rounded-[2.5rem] p-16 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Calendar className="w-8 h-8 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">No bookings yet</h3>
                    <p className="text-slate-500 mt-2 font-medium">Ready to get your home sorted? Book your first service now.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.map(booking => (
                        <div key={booking.id} className="glass-panel rounded-[2rem] p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-white/80 transition-all duration-300 group">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                    <h3 className="text-lg font-bold text-slate-900">{booking.serviceCategory}</h3>
                                    <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wide border ${getStatusColor(booking.status)}`}>
                                        {booking.status}
                                    </span>
                                </div>
                                <p className="text-slate-500 mb-4 font-medium">Provider: <span className="font-bold text-slate-800">{booking.providerName}</span></p>
                                <div className="flex flex-wrap gap-4 text-sm text-slate-500 font-bold">
                                    <div className="flex items-center bg-slate-100/50 px-3 py-1.5 rounded-lg">
                                        <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                                        {new Date(booking.date).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center bg-slate-100/50 px-3 py-1.5 rounded-lg">
                                        <Clock className="w-4 h-4 mr-2 text-slate-400" />
                                        {booking.time} ({booking.durationHours}h)
                                    </div>
                                    <div className="font-bold text-slate-900 bg-white border border-slate-100 px-3 py-1.5 rounded-lg shadow-sm">
                                        ${booking.totalPrice.toFixed(2)}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 sm:mt-0 flex gap-3 self-end sm:self-center">
                                {booking.status === BookingStatus.REQUESTED && (
                                    <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
                                        Cancel Request
                                    </button>
                                )}
                                {booking.status === BookingStatus.COMPLETED && (
                                    <button className="px-5 py-2.5 bg-slate-900 text-white rounded-full text-xs font-bold hover:bg-slate-800 shadow-md transition-all">
                                        Leave Review
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