
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
  
  // State for selected specific service (useful for Interior designers with multiple offerings)
  const [selectedServiceIndex, setSelectedServiceIndex] = useState<number>(0);

  // Determine booking type
  const isInteriorDesign = provider.serviceCategory === ServiceCategory.INTERIOR_DESIGN;
  
  // Get active service offering based on selection or default
  const activeService = provider.services.length > 0 
    ? provider.services[selectedServiceIndex] 
    : { category: provider.serviceCategory, price: provider.hourlyRate, description: 'Standard Service' };
  
  // If it's interior design, we might want to default to "Consultation" if available
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
          <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
              <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {isConsultation ? 'Consultation Requested!' : 'Booking Confirmed!'}
                  </h2>
                  <p className="text-gray-600 mb-6">
                      {isConsultation 
                        ? `Your consultation request has been sent to ${provider.name}. They will review your project needs.`
                        : `Your request has been sent to ${provider.name}. You can track the status in your bookings.`
                      }
                  </p>
                  <button 
                    onClick={onSuccess}
                    className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
                  >
                      Go to My Bookings
                  </button>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
            <button onClick={onCancel} className="flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Search
            </button>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
                {/* Left: Summary */}
                <div className="bg-indigo-600 p-8 md:w-1/3 text-white flex flex-col justify-between">
                    <div>
                        <h3 className="text-indigo-200 font-medium uppercase tracking-wider text-sm mb-4">
                            {isConsultation ? 'Consultation Details' : 'Service Details'}
                        </h3>
                        <div className="flex items-center gap-3 mb-6">
                            <img src={provider.avatar} className="w-12 h-12 rounded-full border-2 border-indigo-400" alt="" />
                            <div>
                                <div className="font-bold text-lg">{provider.name}</div>
                                <div className="text-indigo-200 text-sm">{provider.serviceCategory}</div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-indigo-100">
                                <DollarSign className="w-5 h-5" />
                                <span>${activeService.price}/hr</span>
                            </div>
                            <div className="flex items-center gap-3 text-indigo-100">
                                <Clock className="w-5 h-5" />
                                <span>Est. {duration} hours</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-indigo-500">
                        <div className="flex justify-between items-center mb-1 text-indigo-200 text-sm">
                            <span>Subtotal</span>
                            <span>${basePrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center mb-4 text-indigo-200 text-sm">
                            <span>Service Fee (15%)</span>
                            <span>${serviceFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center font-bold text-2xl">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Right: Form */}
                <div className="p-8 md:w-2/3">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        {isConsultation ? 'Book Initial Consultation' : 'Complete your booking'}
                    </h2>
                    
                    {isInteriorDesign && (
                        <div className="mb-6">
                             <label className="block text-sm font-medium text-gray-700 mb-2">Select Service Type</label>
                             <select 
                                value={selectedServiceIndex}
                                onChange={(e) => setSelectedServiceIndex(Number(e.target.value))}
                                className="block w-full py-3 px-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                             >
                                 {provider.services.map((s, idx) => (
                                     <option key={idx} value={idx}>
                                         {s.description} - ${s.price}/hr
                                     </option>
                                 ))}
                             </select>
                             {isConsultation && (
                                <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-3 text-blue-800 text-sm">
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                            <div className="relative">
                                <input 
                                    type="date" 
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                                <select 
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    className="block w-full py-3 px-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    {Array.from({ length: 13 }).map((_, i) => {
                                        const hour = i + 8; // 8 AM to 8 PM
                                        const timeStr = `${hour < 10 ? '0' : ''}${hour}:00`;
                                        return <option key={timeStr} value={timeStr}>{timeStr}</option>;
                                    })}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Duration (Hours)</label>
                                <input 
                                    type="number" 
                                    min="1" 
                                    max="8" 
                                    value={duration}
                                    onChange={(e) => setDuration(Number(e.target.value))}
                                    className="block w-full py-3 px-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button 
                                type="submit" 
                                disabled={isSubmitting || !date}
                                className={`w-full py-3.5 px-4 rounded-xl shadow-md text-white font-semibold text-lg transition-all
                                    ${isSubmitting || !date ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5'}
                                `}
                            >
                                {isSubmitting ? 'Processing...' : (isConsultation ? 'Request Consultation' : 'Confirm Booking')}
                            </button>
                        </div>
                        <p className="text-xs text-center text-gray-500 mt-4">
                            You won't be charged until the provider accepts the booking.
                        </p>
                    </form>
                </div>
            </div>
        </div>
    </div>
  );
};
