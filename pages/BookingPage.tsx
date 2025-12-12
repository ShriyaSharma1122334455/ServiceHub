import React, { useState, useEffect } from 'react';
import { Provider, BookingStatus, ServiceCategory, ServiceOffering } from '../types';
import { api } from '../services/mockService';
import { ArrowLeft, Clock, Calendar, DollarSign, CheckCircle, Info, CreditCard, Lock, Zap, ChevronRight, ShieldCheck, Ruler, Home, PenTool, Wrench } from 'lucide-react';
import { COMMISSION_RATE } from '../constants';

interface BookingPageProps {
  provider: Provider;
  customerId: string;
  onCancel: () => void;
  onSuccess: () => void;
}

export const BookingPage: React.FC<BookingPageProps> = ({ provider, customerId, onCancel, onSuccess }) => {
  const [bookingStep, setBookingStep] = useState<'details' | 'payment'>('details');
  const [step, setStep] = useState<'form' | 'success'>('form');
  
  // Form State
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('09:00');
  const [duration, setDuration] = useState<number>(2);
  const [selectedServiceIndex, setSelectedServiceIndex] = useState<number>(0);
  
  // Dynamic Specifications State
  const [specifications, setSpecifications] = useState<Record<string, any>>({});

  // Pricing State
  const [multiplier, setMultiplier] = useState(1.0);
  const [checkingPrice, setCheckingPrice] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Payment State
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  const isInteriorDesign = provider.serviceCategory === ServiceCategory.INTERIOR_DESIGN;
  
  // Initialize Service Selection
  useEffect(() => {
      if (isInteriorDesign) {
          const consultationIndex = provider.services.findIndex(s => s.description.toLowerCase().includes('consultation'));
          if (consultationIndex !== -1) {
              setSelectedServiceIndex(consultationIndex);
          }
      }
  }, [isInteriorDesign, provider.services]);

  const activeService = provider.services.length > 0 
    ? provider.services[selectedServiceIndex] 
    : { category: provider.serviceCategory, price: provider.hourlyRate, description: 'Standard Service' };

  // Dynamic Pricing Check
  useEffect(() => {
      const checkPricing = async () => {
          setCheckingPrice(true);
          const m = await api.getDynamicPricingMultiplier(activeService.category, time);
          setMultiplier(m);
          setCheckingPrice(false);
      };
      if (time) checkPricing();
  }, [time, activeService.category]);

  const isConsultation = isInteriorDesign && activeService.description.toLowerCase().includes('consultation');

  const basePrice = activeService.price * duration * multiplier;
  const serviceFee = basePrice * COMMISSION_RATE;
  const total = basePrice + serviceFee;

  // Handlers
  const handleContinue = (e: React.FormEvent) => {
      e.preventDefault();
      if (date && time && duration > 0) {
          setBookingStep('payment');
      }
  };

  const handleBack = () => {
      if (bookingStep === 'payment') {
          setBookingStep('details');
      } else {
          onCancel();
      }
  };

  const handleSpecChange = (key: string, value: any) => {
      setSpecifications(prev => ({ ...prev, [key]: value }));
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
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
            totalPrice: total,
            specifications: specifications // Pass specifications to backend (mock)
        });
        setStep('success');
    } catch (error) {
        console.error("Booking failed", error);
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value.replace(/\D/g, '').substring(0, 16);
      setCardNumber(v.replace(/(\d{4})/g, '$1 ').trim());
  };

  // --- Dynamic Fields Renderer ---
  const renderServiceSpecifications = () => {
      const category = activeService.category;

      switch (category) {
          case ServiceCategory.CLEANING:
              return (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-3 ml-1">Cleaning Area Type</label>
                              <div className="relative">
                                  <select 
                                      className="glass-input w-full p-4 rounded-2xl font-bold text-slate-800 outline-none appearance-none"
                                      onChange={(e) => handleSpecChange('cleaningAreaType', e.target.value)}
                                  >
                                      <option value="">Select Area</option>
                                      <option value="Full House">Full House</option>
                                      <option value="Kitchen">Kitchen</option>
                                      <option value="Bedroom">Bedroom</option>
                                      <option value="Bathroom">Bathroom</option>
                                      <option value="Living Room">Living Room</option>
                                      <option value="Office">Office</option>
                                  </select>
                                  <Home className="absolute right-4 top-4 h-5 w-5 text-slate-400 pointer-events-none" />
                              </div>
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-3 ml-1">Size (sq. meters)</label>
                              <div className="relative">
                                  <input 
                                      type="number" 
                                      placeholder="e.g. 80"
                                      className="glass-input w-full p-4 rounded-2xl font-bold text-slate-800 outline-none"
                                      onChange={(e) => handleSpecChange('areaSize', e.target.value)}
                                  />
                                  <Ruler className="absolute right-4 top-4 h-5 w-5 text-slate-400 pointer-events-none" />
                              </div>
                          </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-3 ml-1">Number of Rooms</label>
                              <select 
                                  className="glass-input w-full p-4 rounded-2xl font-bold text-slate-800 outline-none appearance-none"
                                  onChange={(e) => handleSpecChange('numRooms', e.target.value)}
                              >
                                  {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                                      <option key={num} value={num}>{num} Room{num > 1 ? 's' : ''}</option>
                                  ))}
                              </select>
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-3 ml-1">Hours Required</label>
                              <select 
                                  className="glass-input w-full p-4 rounded-2xl font-bold text-slate-800 outline-none appearance-none"
                                  value={duration}
                                  onChange={(e) => {
                                      const val = Number(e.target.value);
                                      setDuration(val);
                                      handleSpecChange('cleaningHours', val);
                                  }}
                              >
                                  {Array.from({ length: 12 }, (_, i) => i + 1).map(num => (
                                      <option key={num} value={num}>{num} Hour{num > 1 ? 's' : ''}</option>
                                  ))}
                              </select>
                          </div>
                      </div>
                  </div>
              );

          case ServiceCategory.PLUMBING:
              return (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-3 ml-1">Issue Type</label>
                              <select 
                                  className="glass-input w-full p-4 rounded-2xl font-bold text-slate-800 outline-none appearance-none"
                                  onChange={(e) => handleSpecChange('issueType', e.target.value)}
                              >
                                  <option value="">Select Issue</option>
                                  <option value="Leakage">Leakage</option>
                                  <option value="Pipe Installation">Pipe Installation</option>
                                  <option value="Drain Clogging">Drain Clogging</option>
                                  <option value="Bathroom Fitting">Bathroom Fitting</option>
                                  <option value="Kitchen Sink Repair">Kitchen Sink Repair</option>
                              </select>
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-3 ml-1">Urgency Level</label>
                              <select 
                                  className="glass-input w-full p-4 rounded-2xl font-bold text-slate-800 outline-none appearance-none"
                                  onChange={(e) => handleSpecChange('urgency', e.target.value)}
                              >
                                  <option value="Normal">Normal</option>
                                  <option value="Urgent">Urgent</option>
                                  <option value="Emergency">Emergency</option>
                              </select>
                          </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-3 ml-1">Material Required</label>
                              <select 
                                  className="glass-input w-full p-4 rounded-2xl font-bold text-slate-800 outline-none appearance-none"
                                  onChange={(e) => handleSpecChange('material', e.target.value)}
                              >
                                  <option value="Don't Know">Don't Know</option>
                                  <option value="PVC">PVC</option>
                                  <option value="Copper">Copper</option>
                                  <option value="Steel">Steel</option>
                              </select>
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-3 ml-1">Area of Work</label>
                              <select 
                                  className="glass-input w-full p-4 rounded-2xl font-bold text-slate-800 outline-none appearance-none"
                                  onChange={(e) => handleSpecChange('areaOfWork', e.target.value)}
                              >
                                  <option value="Bathroom">Bathroom</option>
                                  <option value="Kitchen">Kitchen</option>
                                  <option value="Outdoor">Outdoor</option>
                                  <option value="Whole House">Whole House</option>
                              </select>
                          </div>
                      </div>
                  </div>
              );

          case ServiceCategory.ELECTRICAL:
              return (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-3 ml-1">Service Type</label>
                              <select 
                                  className="glass-input w-full p-4 rounded-2xl font-bold text-slate-800 outline-none appearance-none"
                                  onChange={(e) => handleSpecChange('serviceType', e.target.value)}
                              >
                                  <option value="">Select Service</option>
                                  <option value="Wiring">Wiring</option>
                                  <option value="Switch Repair">Switch Repair</option>
                                  <option value="Fan Installation">Fan Installation</option>
                                  <option value="Appliance Repair">Appliance Repair</option>
                                  <option value="Light Fixture">Light Fixture Installation</option>
                              </select>
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-3 ml-1">Power Load</label>
                              <select 
                                  className="glass-input w-full p-4 rounded-2xl font-bold text-slate-800 outline-none appearance-none"
                                  onChange={(e) => handleSpecChange('powerLoad', e.target.value)}
                              >
                                  <option value="Low">Low (Residential)</option>
                                  <option value="Medium">Medium</option>
                                  <option value="High">High (Industrial/Heavy)</option>
                              </select>
                          </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-3 ml-1">Visit Type</label>
                              <select 
                                  className="glass-input w-full p-4 rounded-2xl font-bold text-slate-800 outline-none appearance-none"
                                  onChange={(e) => handleSpecChange('visitType', e.target.value)}
                              >
                                  <option value="Repair">Repair</option>
                                  <option value="Installation">Installation</option>
                                  <option value="Inspection Only">Inspection Only</option>
                              </select>
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-3 ml-1">Environment</label>
                              <select 
                                  className="glass-input w-full p-4 rounded-2xl font-bold text-slate-800 outline-none appearance-none"
                                  onChange={(e) => handleSpecChange('environment', e.target.value)}
                              >
                                  <option value="Indoor">Indoor Work</option>
                                  <option value="Outdoor">Outdoor Work</option>
                              </select>
                          </div>
                      </div>
                  </div>
              );

          case ServiceCategory.INTERIOR_DESIGN:
              return (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-3 ml-1">Project Type</label>
                              <div className="relative">
                                  <select 
                                      className="glass-input w-full p-4 rounded-2xl font-bold text-slate-800 outline-none appearance-none"
                                      onChange={(e) => handleSpecChange('projectType', e.target.value)}
                                  >
                                      <option value="">Select Project</option>
                                      <option value="Full Home">Full Home</option>
                                      <option value="Room Renovation">Room Renovation</option>
                                      <option value="Office Design">Office Design</option>
                                      <option value="Kitchen Remodel">Kitchen Remodel</option>
                                      <option value="Bathroom Remodel">Bathroom Remodel</option>
                                  </select>
                                  <PenTool className="absolute right-4 top-4 h-5 w-5 text-slate-400 pointer-events-none" />
                              </div>
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-3 ml-1">Total Area (sq. ft)</label>
                              <input 
                                  type="number" 
                                  placeholder="e.g. 1200"
                                  className="glass-input w-full p-4 rounded-2xl font-bold text-slate-800 outline-none"
                                  onChange={(e) => handleSpecChange('areaSqFt', e.target.value)}
                              />
                          </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-3 ml-1">Design Style</label>
                              <select 
                                  className="glass-input w-full p-4 rounded-2xl font-bold text-slate-800 outline-none appearance-none"
                                  onChange={(e) => handleSpecChange('designStyle', e.target.value)}
                              >
                                  <option value="Modern">Modern</option>
                                  <option value="Minimal">Minimal</option>
                                  <option value="Luxury">Luxury</option>
                                  <option value="Traditional">Traditional</option>
                                  <option value="Scandinavian">Scandinavian</option>
                                  <option value="Industrial">Industrial</option>
                              </select>
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-3 ml-1">Budget Range</label>
                              <select 
                                  className="glass-input w-full p-4 rounded-2xl font-bold text-slate-800 outline-none appearance-none"
                                  onChange={(e) => handleSpecChange('budget', e.target.value)}
                              >
                                  <option value="< $5,000">&lt; $5,000</option>
                                  <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                                  <option value="$10,000 - $20,000">$10,000 - $20,000</option>
                                  <option value="$20,000+">$20,000+</option>
                              </select>
                          </div>
                      </div>
                  </div>
              );

          default:
              return null;
      }
  };

  if (step === 'success') {
      return (
          <div className="min-h-screen flex items-center justify-center px-4">
              <div className="glass-panel p-12 rounded-[3rem] max-w-md w-full text-center">
                  <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-100 shadow-sm">
                      <CheckCircle className="w-12 h-12 text-emerald-500" strokeWidth={1.5} />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">
                    Booking Confirmed
                  </h2>
                  <p className="text-slate-500 mb-10 text-lg font-medium leading-relaxed">
                      Your request has been sent to {provider.name}. The payment of <span className="text-slate-900 font-bold">${total.toFixed(2)}</span> has been securely processed.
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
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
            {/* Header / Nav */}
            <div className="flex items-center justify-between mb-8">
                <button onClick={handleBack} className="flex items-center text-slate-500 hover:text-slate-900 transition-colors font-bold text-sm bg-white/50 px-5 py-2.5 rounded-full shadow-sm border border-white/60">
                    <ArrowLeft className="w-4 h-4 mr-2" /> 
                    {bookingStep === 'payment' ? 'Edit Details' : 'Back'}
                </button>
                
                <div className="flex items-center gap-2">
                    <div className={`h-2.5 w-2.5 rounded-full transition-colors ${bookingStep === 'details' ? 'bg-slate-900 scale-125' : 'bg-emerald-500'}`}></div>
                    <div className="w-8 h-1 bg-slate-200 rounded-full"></div>
                    <div className={`h-2.5 w-2.5 rounded-full transition-colors ${bookingStep === 'payment' ? 'bg-slate-900 scale-125' : 'bg-slate-300'}`}></div>
                </div>
            </div>

            <div className="glass-panel rounded-[3rem] p-0 overflow-hidden flex flex-col lg:flex-row shadow-[0_20px_60px_rgba(0,0,0,0.05)]">
                
                {/* Left Panel: Invoice & Summary */}
                <div className="bg-slate-900 p-10 lg:w-1/3 text-white flex flex-col justify-between relative overflow-hidden">
                    {/* Background Art */}
                    <div className="absolute top-[-20%] left-[-20%] w-[150%] h-[150%] bg-gradient-to-br from-slate-800 to-slate-950 z-0"></div>
                    
                    <div className="relative z-10">
                        <div className="uppercase tracking-widest text-[10px] font-bold text-slate-400 mb-8 border border-white/10 w-fit px-3 py-1 rounded-full">
                            Receipt Summary
                        </div>
                        
                        <div className="flex items-center gap-5 mb-10">
                            <img src={provider.avatar} className="w-16 h-16 rounded-2xl border-2 border-white/10 shadow-lg object-cover" alt="" />
                            <div>
                                <div className="font-bold text-xl tracking-tight">{provider.name}</div>
                                <div className="text-slate-400 text-sm font-medium">{provider.serviceCategory}</div>
                            </div>
                        </div>

                        <div className="space-y-4 bg-white/5 p-6 rounded-3xl backdrop-blur-sm border border-white/10">
                            <div className="flex items-center justify-between text-slate-200 font-medium text-sm">
                                <span className="flex items-center gap-2 opacity-80"><DollarSign size={16}/> Rate</span>
                                <span>${activeService.price} / hr</span>
                            </div>
                            <div className="flex items-center justify-between text-slate-200 font-medium text-sm">
                                <span className="flex items-center gap-2 opacity-80"><Clock size={16}/> Duration</span>
                                <span>{duration} hours</span>
                            </div>
                            <div className="flex items-center justify-between text-slate-200 font-medium text-sm">
                                <span className="flex items-center gap-2 opacity-80"><Calendar size={16}/> Date</span>
                                <span>{date || 'Select Date'}</span>
                            </div>
                            
                            {/* Display a key spec in summary if available */}
                            {specifications.issueType && (
                                <div className="flex items-center justify-between text-slate-200 font-medium text-sm">
                                    <span className="flex items-center gap-2 opacity-80"><Wrench size={16}/> Issue</span>
                                    <span>{specifications.issueType}</span>
                                </div>
                            )}
                            
                            {multiplier > 1.0 && (
                                <div className="mt-2 pt-3 border-t border-white/10 flex items-center justify-between text-amber-300 font-bold text-xs animate-pulse">
                                    <span className="flex items-center gap-2"><Zap size={14} fill="currentColor" /> Peak Hours</span>
                                    <span>+{Math.round((multiplier - 1) * 100)}% Surge</span>
                                </div>
                            )}
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
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-medium self-end mb-1 opacity-60">Total</span>
                            <span className="text-4xl font-bold tracking-tighter">${total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Logic Flow */}
                <div className="p-8 lg:p-12 lg:w-2/3 bg-white/50 backdrop-blur-xl">
                    
                    {/* STEP 1: SERVICE DETAILS */}
                    {bookingStep === 'details' && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                            <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Configure Service</h2>
                            <p className="text-slate-500 mb-8 font-medium">Select your preferences to generate a quote.</p>

                            <form onSubmit={handleContinue} className="space-y-8">
                                
                                {/* Dynamic Specification Fields */}
                                {renderServiceSpecifications()}

                                {isInteriorDesign && !specifications.projectType && (
                                    /* Hide generic service tier if dynamic fields cover it, or keep it. 
                                       Here we keep it for ID to allow Consultation vs Full Project choice */
                                    <div>
                                         <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-3 ml-1">Service Tier</label>
                                         <div className="relative">
                                            <select 
                                                value={selectedServiceIndex}
                                                onChange={(e) => setSelectedServiceIndex(Number(e.target.value))}
                                                className="glass-input w-full p-4 rounded-2xl font-bold text-slate-800 outline-none appearance-none cursor-pointer hover:bg-white/80 transition-colors"
                                            >
                                                {provider.services.map((s, idx) => (
                                                    <option key={idx} value={idx}>
                                                        {s.description} — ${s.price}/hr
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="absolute right-4 top-4 pointer-events-none text-slate-400">
                                                <ChevronRight className="rotate-90" size={20} />
                                            </div>
                                         </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-3 ml-1">Date</label>
                                        <div className="relative group">
                                            <input 
                                                type="date" 
                                                required
                                                min={new Date().toISOString().split('T')[0]}
                                                value={date}
                                                onChange={(e) => setDate(e.target.value)}
                                                onClick={(e) => {
                                                    // Robust Fallback: Force show picker
                                                    if ('showPicker' in HTMLInputElement.prototype) {
                                                        try {
                                                            (e.target as HTMLInputElement).showPicker();
                                                        } catch (err) {
                                                            console.log('showPicker blocked');
                                                        }
                                                    }
                                                }}
                                                className="glass-input w-full p-4 pl-12 rounded-2xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-slate-900 transition-all cursor-pointer relative [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                                            />
                                            <Calendar className="absolute left-4 top-4 h-5 w-5 text-slate-400 group-hover:text-slate-600 transition-colors pointer-events-none" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-3 ml-1">Start Time</label>
                                        <div className="relative group">
                                            <select 
                                                value={time}
                                                onChange={(e) => setTime(e.target.value)}
                                                className="glass-input w-full p-4 pl-12 rounded-2xl font-bold text-slate-900 outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-slate-900 transition-all"
                                            >
                                                {Array.from({ length: 13 }).map((_, i) => {
                                                    const hour = i + 8; // 8 AM to 8 PM
                                                    const timeStr = `${hour < 10 ? '0' : ''}${hour}:00`;
                                                    return <option key={timeStr} value={timeStr}>{timeStr}</option>;
                                                })}
                                            </select>
                                            <Clock className="absolute left-4 top-4 h-5 w-5 text-slate-400 group-hover:text-slate-600 transition-colors pointer-events-none" />
                                        </div>
                                    </div>
                                </div>

                                {/* Generic Duration Slider (Only if NOT Cleaning, as cleaning uses a dropdown above) */}
                                {activeService.category !== ServiceCategory.CLEANING && (
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-3 ml-1">Duration (Hours)</label>
                                        <div className="flex items-center gap-4">
                                            <input 
                                                type="range" 
                                                min="1" 
                                                max="8" 
                                                step="1"
                                                value={duration}
                                                onChange={(e) => setDuration(Number(e.target.value))}
                                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                                            />
                                            <div className="w-24 text-center font-bold text-xl text-slate-900 glass-panel py-2 rounded-xl">
                                                {duration} hr{duration > 1 ? 's' : ''}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                {isConsultation && (
                                    <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 flex gap-4 text-blue-900 text-sm font-medium">
                                        <Info className="w-5 h-5 flex-shrink-0" />
                                        <p className="leading-relaxed">This is a risk-free initial consultation. The provider will assess your needs and provide a full project quote afterwards.</p>
                                    </div>
                                )}

                                <div className="pt-4">
                                    <button 
                                        type="submit" 
                                        className="w-full py-5 px-6 rounded-full shadow-lg bg-slate-900 text-white font-bold text-lg hover:bg-slate-800 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                                    >
                                        Continue to Payment <ChevronRight size={20} />
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* STEP 2: PAYMENT */}
                    {bookingStep === 'payment' && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                             <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Secure Checkout</h2>
                             <p className="text-slate-500 mb-8 font-medium flex items-center gap-2">
                                <Lock size={14} className="text-emerald-500" /> Encrypted Transaction
                             </p>

                             <form onSubmit={handlePaymentSubmit} className="space-y-6">
                                <div className="glass-panel p-1 rounded-2xl bg-slate-100/50 flex mb-8">
                                    <button type="button" className="flex-1 py-3 bg-white shadow-sm rounded-xl font-bold text-sm text-slate-900 border border-slate-200">
                                        Card Payment
                                    </button>
                                    <button type="button" className="flex-1 py-3 text-slate-500 font-bold text-sm hover:text-slate-700">
                                        Apple Pay
                                    </button>
                                    <button type="button" className="flex-1 py-3 text-slate-500 font-bold text-sm hover:text-slate-700">
                                        PayPal
                                    </button>
                                </div>

                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 ml-1">Card Number</label>
                                        <div className="relative group">
                                            <CreditCard className="absolute left-4 top-4 h-5 w-5 text-slate-400 group-focus-within:text-slate-900 transition-colors pointer-events-none" />
                                            <input 
                                                type="text" 
                                                placeholder="0000 0000 0000 0000"
                                                maxLength={19}
                                                value={cardNumber}
                                                onChange={handleCardChange}
                                                className="glass-input w-full p-4 pl-12 rounded-2xl font-mono text-lg text-slate-900 placeholder-slate-300 focus:ring-2 focus:ring-slate-900 transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 ml-1">Expiry</label>
                                            <input 
                                                type="text" 
                                                placeholder="MM/YY"
                                                maxLength={5}
                                                value={expiry}
                                                onChange={(e) => setExpiry(e.target.value)}
                                                className="glass-input w-full p-4 rounded-2xl font-mono text-lg text-slate-900 placeholder-slate-300 focus:ring-2 focus:ring-slate-900 transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 ml-1">CVC</label>
                                            <input 
                                                type="text" 
                                                placeholder="123"
                                                maxLength={3}
                                                value={cvc}
                                                onChange={(e) => setCvc(e.target.value)}
                                                className="glass-input w-full p-4 rounded-2xl font-mono text-lg text-slate-900 placeholder-slate-300 focus:ring-2 focus:ring-slate-900 transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 mt-4 bg-slate-50 p-4 rounded-xl">
                                        <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                            Your payment information is processed securely. We do not store your card details on our servers.
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button 
                                        type="submit" 
                                        disabled={isSubmitting || checkingPrice}
                                        className={`w-full py-5 px-6 rounded-full shadow-xl text-white font-bold text-lg transition-all flex items-center justify-center gap-3
                                            ${isSubmitting || checkingPrice ? 'bg-slate-300 cursor-not-allowed' : 'bg-slate-900 hover:bg-slate-800 hover:scale-[1.01]'}
                                        `}
                                    >
                                        {isSubmitting ? (
                                            <>Processing...</>
                                        ) : (
                                            <>Pay ${total.toFixed(2)}</>
                                        )}
                                    </button>
                                </div>
                             </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};