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
  
  const [selectedServiceIndex, setSelectedServiceIndex] = useState<number>(0);

  const isInteriorDesign = provider.serviceCategory === ServiceCategory.INTERIOR_DESIGN;
  
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
              <div className="glass-panel p-12 rounded-[3rem] max-w-md w-full text-center">
                  <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-100">
                      <CheckCircle className="w-12 h-12 text-emerald-500" strokeWidth={1.5} />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">
                    Booking Confirmed
                  </h2>
                  <p className="text-slate-500 mb-10 text-lg font-medium leading-relaxed">
                      Your request has been sent to {provider.name}. You'll be notified once they accept.
                  </p>
                  <button 
                    onClick={onSuccess}
                    className="w-full bg-slate-900 text-white py-4 rounded-full font-bold text-lg hover:bg-slate-800 hover:scale-105 transition-all shadow-xl shadow-slate-900/10"
                  >
                      Go to My Bookings
                  </button>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
            <button onClick={onCancel} className="flex items-center text-slate-500 hover:text-slate-900 mb-8 transition-colors font-bold text-sm bg-white/50 px-4 py-2 rounded-full w-fit">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </button>

            <div className="glass-panel rounded-[3rem] p-0 overflow-hidden flex flex-col md:flex-row shadow-2xl">
                {/* Left: Summary */}
                <div className="bg-slate-900 p-10 md:w-2/5 text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-[-20%] left-[-20%] w-[150%] h-[150%] bg-gradient-to-br from-slate-800 to-slate-950 z-0"></div>
                    
                    <div className="relative z-10">
                        <div className="uppercase tracking-widest text-xs font-bold text-slate-400 mb-8">Booking Summary</div>
                        
                        <div className="flex items-center gap-4 mb-8">
                            <img src={provider.avatar} className="w-16 h-16 rounded-2xl border-2 border-white/10 shadow-lg object-cover" alt="" />
                            <div>
                                <div className="font-bold text-xl">{provider.name}</div>
                                <div className="text-slate-400 text-sm font-medium">{provider.serviceCategory}</div>
                            </div>
                        </div>

                        <div className="space-y-4 bg-white/5 p-6 rounded-3xl backdrop-blur-sm border border-white/10">
                            <div className="flex items-center gap-3 text-slate-200 font-medium">
                                <DollarSign className="w-5 h-5 opacity-60" />
                                <span>${activeService.price} / hour</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-200 font-medium">
                                <Clock className="w-5 h-5 opacity-60" />
                                <span>Est. {duration} hours</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-white/10 relative z-10">
                        <div className="flex justify-between items-center mb-3 text-slate-400 text-sm font-medium">
                            <span>Subtotal</span>
                            <span>${basePrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center mb-6 text-slate-400 text-sm font-medium">
                            <span>Service Fee (15%)</span>
                            <span>${serviceFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-3xl font-bold tracking-tight">
                            <span className="text-lg font-medium self-end mb-1 opacity-60">Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Right: Form */}
                <div className="p-10 md:w-3/5 bg-white/50 backdrop-blur-xl">
                    <h2 className="text-3xl font-bold text-slate-900 mb-8 tracking-tight">
                        {isConsultation ? 'Book Consultation' : 'Finalize Details'}
                    </h2>
                    
                    {isInteriorDesign && (
                        <div className="mb-8">
                             <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 ml-1">Service Type</label>
                             <div className="relative">
                                <select 
                                    value={selectedServiceIndex}
                                    onChange={(e) => setSelectedServiceIndex(Number(e.target.value))}
                                    className="glass-input w-full p-4 rounded-2xl font-medium outline-none appearance-none"
                                >
                                    {provider.services.map((s, idx) => (
                                        <option key={idx} value={idx}>
                                            {s.description} - ${s.price}/hr
                                        </option>
                                    ))}
                                </select>
                             </div>
                             {isConsultation && (
                                <div className="mt-4 bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex gap-3 text-blue-900 text-sm font-medium">
                                    <Info className="w-5 h-5 flex-shrink-0" />
                                    <p>Initial consultations are risk-free assessments of your project needs.</p>
                                </div>
                             )}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 ml-1">Date</label>
                            <div className="relative">
                                <input 
                                    type="date" 
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="glass-input w-full p-4 pl-12 rounded-2xl font-medium outline-none text-slate-900"
                                />
                                <Calendar className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 ml-1">Start Time</label>
                                <div className="relative">
                                    <select 
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                        className="glass-input w-full p-4 rounded-2xl font-medium outline-none appearance-none"
                                    >
                                        {Array.from({ length: 13 }).map((_, i) => {
                                            const hour = i + 8; // 8 AM to 8 PM
                                            const timeStr = `${hour < 10 ? '0' : ''}${hour}:00`;
                                            return <option key={timeStr} value={timeStr}>{timeStr}</option>;
                                        })}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 ml-1">Duration (Hrs)</label>
                                <input 
                                    type="number" 
                                    min="1" 
                                    max="8" 
                                    value={duration}
                                    onChange={(e) => setDuration(Number(e.target.value))}
                                    className="glass-input w-full p-4 rounded-2xl font-medium outline-none"
                                />
                            </div>
                        </div>

                        <div className="pt-8">
                            <button 
                                type="submit" 
                                disabled={isSubmitting || !date}
                                className={`w-full py-4 px-6 rounded-full shadow-lg text-white font-bold text-lg transition-all
                                    ${isSubmitting || !date ? 'bg-slate-300 cursor-not-allowed' : 'bg-slate-900 hover:bg-slate-800 hover:scale-[1.02]'}
                                `}
                            >
                                {isSubmitting ? 'Processing...' : (isConsultation ? 'Request Consultation' : 'Confirm & Pay')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
  );
};