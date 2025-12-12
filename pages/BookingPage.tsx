
import React, { useState, useEffect } from 'react';
import { Provider, BookingStatus, ServiceCategory, ServiceOffering } from '../types';
import { api } from '../services/mockService';
import { ArrowLeft, Clock, Calendar, DollarSign, CheckCircle, Info } from 'lucide-react';
import { COMMISSION_RATE } from '../constants';

interface BookingPageProps {
  provider: Provider;
  customerId: string;
  onCancel: () => void;
  onSuccess: () => void;
}

export const BookingPage: React.FC<BookingPageProps> = ({ provider, customerId, onCancel, onSuccess }) => {
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('09:00');
  const [duration, setDuration] = useState<number>(2);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'form' | 'success'>('form');
  
  // State for selected specific service
  const [selectedServiceIndex, setSelectedServiceIndex] = useState<number>(0);

  // Determine booking type
  const isInteriorDesign = provider.serviceCategory === ServiceCategory.INTERIOR_DESIGN;
  
  // Get active service offering
  const activeService = provider.services.length > 0 
    ? provider.services[selectedServiceIndex] 
    : { category: provider.serviceCategory, price: provider.hourlyRate, description: 'Standard Service' };
  
  useEffect(() => {
      if (isInteriorDesign) {
          const consultationIndex = provider.services.findIndex(s => s.description.toLowerCase().includes('consultation'));
          if (consultationIndex !== -1) {
              setSelectedServiceIndex(consultationIndex);
          }
      }
  }, [isInteriorDesign, provider.services]);

  const isConsultation = isInteriorDesign && activeService.description.toLowerCase().includes('consultation');

  const basePrice = activeService.price * duration;
  const serviceFee = basePrice * COMMISSION_RATE;
  const total = basePrice + serviceFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
        await api.createBooking({
            customerId,
            providerId: provider.id,
            providerName: provider.name,
            serviceCategory: activeService.category,
            bookingType: isConsultation ? 'CONSULTATION' : 'STANDARD',
            date,
            time,
            durationHours: duration,
        });
        setStep('success');
    } catch (error) {
        console.error("Booking failed", error);
    } finally {
        setIsSubmitting(false);
    }
  };

  if (step === 'success') {
      return (
          <div className="min-h-screen flex items-center justify-center px-4">
              <div className="bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/50 max-w-md w-full text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                      <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
                    {isConsultation ? 'Consultation Requested!' : 'Booking Confirmed!'}
                  </h2>
                  <p className="text-gray-600 mb-8 text-lg">
                      {isConsultation 
                        ? `Your consultation request has been sent to ${provider.name}. They will review your project needs.`
                        : `Your request has been sent to ${provider.name}. You can track the status in your bookings.`
                      }
                  </p>
                  <button 
                    onClick={onSuccess}
                    className="w-full bg-teal-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-teal-700 hover:shadow-lg transition-all"
                  >
                      Go to My Bookings
                  </button>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
            <button onClick={onCancel} className="flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors bg-white/40 px-4 py-2 rounded-lg backdrop-blur-sm hover:bg-white/60 font-medium">
                <ArrowLeft className="w-5 h-5 mr-2" /> Back to Search
            </button>

            <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden flex flex-col md:flex-row">
                {/* Left: Summary */}
                <div className="bg-gradient-to-br from-teal-800 to-emerald-900 p-8 md:w-2/5 text-white flex flex-col justify-between relative overflow-hidden">
                    {/* Decorative subtle circles */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>

                    <div className="relative z-10">
                        <h3 className="text-teal-200 font-bold uppercase tracking-widest text-xs mb-6">
                            {isConsultation ? 'Consultation Details' : 'Service Details'}
                        </h3>
                        <div className="flex items-center gap-4 mb-8">
                            <img src={provider.avatar} className="w-16 h-16 rounded-2xl border-2 border-white/20 shadow-lg object-cover" alt="" />
                            <div>
                                <div className="font-bold text-xl">{provider.name}</div>
                                <div className="text-teal-200 text-sm font-medium">{provider.serviceCategory}</div>
                            </div>
                        </div>
                        <div className="space-y-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                            <div className="flex items-center gap-3 text-teal-50 font-medium">
                                <DollarSign className="w-5 h-5 opacity-80" />
                                <span>${activeService.price}/hr</span>
                            </div>
                            <div className="flex items-center gap-3 text-teal-50 font-medium">
                                <Clock className="w-5 h-5 opacity-80" />
                                <span>Est. {duration} hours</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-white/20 relative z-10">
                        <div className="flex justify-between items-center mb-2 text-teal-100 text-sm">
                            <span>Subtotal</span>
                            <span>${basePrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center mb-6 text-teal-100 text-sm">
                            <span>Service Fee (15%)</span>
                            <span>${serviceFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center font-bold text-3xl">
                            <span className="text-lg font-medium self-end mb-1 opacity-80">Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Right: Form */}
                <div className="p-8 md:w-3/5 bg-white/40">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">
                        {isConsultation ? 'Book Initial Consultation' : 'Complete your booking'}
                    </h2>
                    
                    {isInteriorDesign && (
                        <div className="mb-6">
                             <label className="block text-sm font-bold text-gray-700 mb-2">Select Service Type</label>
                             <select 
                                value={selectedServiceIndex}
                                onChange={(e) => setSelectedServiceIndex(Number(e.target.value))}
                                className="block w-full py-3.5 px-4 border border-gray-300/60 rounded-xl focus:ring-2 focus:ring-teal-500 bg-white/70 outline-none"
                             >
                                 {provider.services.map((s, idx) => (
                                     <option key={idx} value={idx}>
                                         {s.description} - ${s.price}/hr
                                     </option>
                                 ))}
                             </select>
                             {isConsultation && (
                                <div className="mt-4 bg-blue-50/70 border border-blue-200/50 rounded-xl p-4 flex gap-3 text-blue-900 text-sm font-medium">
                                    <Info className="w-5 h-5 flex-shrink-0" />
                                    <p>
                                        Book an appointment to discuss your project. If you're not satisfied, you can choose another architect with minimal charges.
                                    </p>
                                </div>
                             )}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Select Date</label>
                            <div className="relative">
                                <input 
                                    type="date" 
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="block w-full pl-10 pr-4 py-3.5 border border-gray-300/60 rounded-xl focus:ring-2 focus:ring-teal-500 bg-white/70 outline-none"
                                />
                                <Calendar className="absolute left-3.5 top-4 h-5 w-5 text-gray-500" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Start Time</label>
                                <select 
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    className="block w-full py-3.5 px-4 border border-gray-300/60 rounded-xl focus:ring-2 focus:ring-teal-500 bg-white/70 outline-none"
                                >
                                    {Array.from({ length: 13 }).map((_, i) => {
                                        const hour = i + 8; // 8 AM to 8 PM
                                        const timeStr = `${hour < 10 ? '0' : ''}${hour}:00`;
                                        return <option key={timeStr} value={timeStr}>{timeStr}</option>;
                                    })}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Duration (Hours)</label>
                                <input 
                                    type="number" 
                                    min="1" 
                                    max="8" 
                                    value={duration}
                                    onChange={(e) => setDuration(Number(e.target.value))}
                                    className="block w-full py-3.5 px-4 border border-gray-300/60 rounded-xl focus:ring-2 focus:ring-teal-500 bg-white/70 outline-none"
                                />
                            </div>
                        </div>

                        <div className="pt-6">
                            <button 
                                type="submit" 
                                disabled={isSubmitting || !date}
                                className={`w-full py-4 px-4 rounded-xl shadow-lg text-white font-bold text-lg transition-all
                                    ${isSubmitting || !date ? 'bg-gray-400 cursor-not-allowed opacity-50' : 'bg-gradient-to-r from-teal-600 to-emerald-600 hover:shadow-xl hover:scale-[1.02]'}
                                `}
                            >
                                {isSubmitting ? 'Processing...' : (isConsultation ? 'Request Consultation' : 'Confirm Booking')}
                            </button>
                        </div>
                        <p className="text-xs text-center text-gray-500 mt-4 font-medium">
                            You won't be charged until the provider accepts the booking.
                        </p>
                    </form>
                </div>
            </div>
        </div>
    </div>
  );
};
