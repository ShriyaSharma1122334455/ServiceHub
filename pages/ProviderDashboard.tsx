import React, { useState, useEffect } from 'react';
import { Provider, Booking, ServiceCategory, ServiceOffering } from '../types';
import { api } from '../services/mockService';
import { 
    LayoutDashboard, Users, Settings, DollarSign, 
    AlertTriangle, Plus, Trash2, CheckCircle, Power, MessageCircle, FileText, Upload, Save
} from 'lucide-react';

interface ProviderDashboardProps {
  provider: Provider;
  onLogout: () => void;
  onOpenSupport: () => void;
}

export const ProviderDashboard: React.FC<ProviderDashboardProps> = ({ provider: initialProvider, onLogout, onOpenSupport }) => {
  const [provider, setProvider] = useState<Provider>(initialProvider);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'team' | 'settings'>('overview');
  
  // Form states
  const [newEmail, setNewEmail] = useState('');
  const [newServicePrice, setNewServicePrice] = useState<number>(50);
  const [newServiceDescription, setNewServiceDescription] = useState<string>('Standard Service');
  const [newServiceCategory, setNewServiceCategory] = useState<ServiceCategory>(ServiceCategory.CLEANING);

  // Settings State
  const [profileForm, setProfileForm] = useState({
      name: initialProvider.name,
      bio: initialProvider.bio,
      phone: initialProvider.phone || '',
      address: initialProvider.address || ''
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState<'ID' | 'LICENSE' | 'INSURANCE' | 'OTHER'>('ID');

  useEffect(() => {
    const refreshData = async () => {
        try {
            const updatedProvider = await api.getProviderById(provider.id);
            if (updatedProvider) {
                setProvider(updatedProvider);
            }
            const data = await api.getBookings(provider.id, provider.role);
            setBookings(data);
        } catch (e) {
            console.error("Failed to load dashboard data", e);
        }
    };
    refreshData();
  }, [provider.id, provider.role]);

  const handleStatusToggle = async () => {
      const newStatus = provider.availabilityStatus === 'AVAILABLE' ? 'OFF_DUTY' : 'AVAILABLE';
      const updated = await api.updateProviderProfile(provider.id, { availabilityStatus: newStatus });
      setProvider(updated);
  };

  const handleAddService = async () => {
      const newService: ServiceOffering = {
          category: newServiceCategory,
          price: newServicePrice,
          description: newServiceDescription
      };
      
      const updated = await api.updateProviderProfile(provider.id, {
          services: [...(provider.services || []), newService]
      });
      setProvider(updated);
      setNewServiceDescription('Standard Service');
  };

  const handleRemoveService = async (index: number) => {
      const newServices = [...provider.services];
      newServices.splice(index, 1);
      const updated = await api.updateProviderProfile(provider.id, {
          services: newServices
      });
      setProvider(updated);
  };

  const handleAddTeamMember = async (e: React.FormEvent) => {
      e.preventDefault();
      const exists = await api.checkUserExists(newEmail);
      if (exists) {
          const updated = await api.updateProviderProfile(provider.id, {
              teamMembers: [...(provider.teamMembers || []), {
                  id: `tm-${Date.now()}`,
                  name: newEmail.split('@')[0],
                  email: newEmail,
                  status: 'PENDING'
              }]
          });
          setProvider(updated);
          setNewEmail('');
      } else {
          alert('User not found. Team members must be registered users.');
      }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSavingProfile(true);
      try {
          const updated = await api.updateProviderProfile(provider.id, profileForm);
          setProvider(updated);
          alert('Profile updated successfully');
      } catch (e) {
          alert('Failed to update profile');
      } finally {
          setIsSavingProfile(false);
      }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploadingDoc(true);
      try {
          await api.uploadProviderDocument(provider.id, selectedDocType, file.name);
          const updated = await api.getProviderById(provider.id);
          if (updated) setProvider(updated);
      } catch (e) {
          alert('Failed to upload document');
      } finally {
          setUploadingDoc(false);
      }
  };

  const getStatusBadge = (status: string) => {
      const colors: Record<string, string> = {
          'AVAILABLE': 'bg-emerald-100/50 text-emerald-800 border-emerald-200/50',
          'BUSY': 'bg-amber-100/50 text-amber-800 border-amber-200/50',
          'OFF_DUTY': 'bg-slate-100/50 text-slate-600 border-slate-200/50'
      };
      return colors[status] || 'bg-slate-100';
  };

  const glassCard = "glass-panel rounded-[2.5rem] p-8 transition-all duration-300";

  // --- Render Widgets ---

  const renderOverview = () => (
    <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={glassCard}>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Earnings</p>
                        <p className="text-4xl font-bold text-slate-900 mt-3 tracking-tight">$1,240.50</p>
                    </div>
                    <div className="p-4 bg-teal-50 rounded-2xl text-teal-600 border border-teal-100">
                        <DollarSign size={28} strokeWidth={1.5} />
                    </div>
                </div>
            </div>
            <div className={glassCard}>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg. Rating</p>
                        <div className="flex items-baseline gap-2 mt-3">
                            <p className="text-4xl font-bold text-slate-900 tracking-tight">{provider.rating?.toFixed(1) || '0.0'}</p>
                            <span className="text-sm font-bold text-slate-400">/ 5.0</span>
                        </div>
                    </div>
                    <div className={`p-4 rounded-2xl border ${provider.rating < 3 ? 'bg-red-50 text-red-600 border-red-100' : 'bg-amber-50 text-amber-500 border-amber-100'}`}>
                        <AlertTriangle size={28} strokeWidth={1.5} />
                    </div>
                </div>
                {provider.rating > 0 && provider.rating < 3.5 && (
                    <p className="mt-4 text-xs text-red-600 font-bold bg-red-50/50 px-3 py-1.5 rounded-lg w-fit">Action Required: Low rating</p>
                )}
                {provider.isBanned && (
                    <div className="mt-3 p-2 bg-red-100 text-red-800 text-xs rounded-lg border border-red-200 text-center font-bold">
                        ACCOUNT SUSPENDED
                    </div>
                )}
            </div>
            <div className={glassCard}>
                 <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Status</p>
                        <div className="mt-3">
                             <span className={`inline-block px-4 py-1.5 text-xs font-bold rounded-full border ${getStatusBadge(provider.availabilityStatus || 'OFF_DUTY')}`}>
                                {(provider.availabilityStatus || 'OFF_DUTY').replace('_', ' ')}
                            </span>
                        </div>
                    </div>
                    <button 
                        onClick={handleStatusToggle}
                        disabled={provider.availabilityStatus === 'BUSY'}
                        className={`p-4 rounded-2xl transition-all shadow-sm border ${
                            provider.availabilityStatus === 'BUSY' 
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200'
                            : 'bg-white hover:scale-105 active:scale-95 border-slate-100'
                        }`}
                    >
                        <Power className={`w-7 h-7 ${provider.availabilityStatus === 'OFF_DUTY' ? 'text-slate-300' : 'text-emerald-500'}`} strokeWidth={2} />
                    </button>
                </div>
            </div>
        </div>

        {/* Recent Bookings List */}
        <div className="glass-panel rounded-[2.5rem] overflow-hidden p-0">
            <div className="px-8 py-6 border-b border-white/40 bg-white/30 backdrop-blur-md">
                <h3 className="font-bold text-slate-900 text-lg">Incoming Requests</h3>
            </div>
            <div className="divide-y divide-white/60">
                {bookings.length === 0 ? (
                    <div className="p-12 text-center text-slate-400 font-medium">No bookings yet.</div>
                ) : (
                    bookings.slice(0, 5).map(booking => (
                        <div key={booking.id} className="p-6 hover:bg-white/40 transition-colors">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h4 className="font-bold text-slate-800 text-lg">{booking.serviceCategory}</h4>
                                        {booking.bookingType === 'CONSULTATION' && (
                                            <span className="px-2.5 py-1 bg-purple-50 border border-purple-100 text-purple-700 text-[10px] rounded-lg font-bold uppercase tracking-wide">Consultation</span>
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-500 mt-1 font-medium">
                                        {new Date(booking.date).toLocaleDateString()} at {booking.time} • {booking.durationHours} hrs
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-slate-900 text-xl tracking-tight">${booking.totalPrice.toFixed(2)}</div>
                                    <span className={`inline-block mt-1 text-[10px] font-bold px-3 py-1 rounded-full border uppercase tracking-wider ${
                                        booking.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-sky-50 text-sky-700 border-sky-100'
                                    }`}>
                                        {booking.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    </div>
  );

  const renderServices = () => (
      <div className={glassCard}>
          <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Service Menu</h3>
          </div>
          
          <div className="grid gap-4 mb-10">
              {(provider.services || []).map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-6 bg-white/40 border border-white/60 rounded-3xl transition-all hover:bg-white/60">
                      <div className="flex items-center gap-5">
                          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-slate-100">
                                {service.category === 'Cleaning' ? '✨' : service.category === 'Plumbing' ? '🔧' : '🛠️'}
                          </div>
                          <div>
                              <h4 className="font-bold text-slate-900 text-lg">{service.category}</h4>
                              <p className="text-sm text-slate-500 font-medium">{service.description}</p>
                          </div>
                      </div>
                      <div className="flex items-center gap-4">
                          <span className="font-bold text-slate-900 bg-white/60 px-5 py-2.5 rounded-xl border border-white/60">${service.price}/hr</span>
                          <button 
                            onClick={() => handleRemoveService(index)}
                            className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          >
                              <Trash2 size={20} className="stroke-[2]" />
                          </button>
                      </div>
                  </div>
              ))}
              {(provider.services || []).length === 0 && (
                  <p className="text-slate-400 italic font-medium py-4 text-center">No services listed yet.</p>
              )}
          </div>

          <div className="bg-slate-50/50 p-8 rounded-3xl border border-dashed border-slate-300">
              <h4 className="font-bold text-slate-900 mb-6">Add New Service</h4>
              <div className="flex flex-col gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 ml-1">Service Type</label>
                        <div className="relative">
                            <select 
                                className="glass-input w-full p-3.5 rounded-xl font-medium outline-none appearance-none"
                                value={newServiceCategory}
                                onChange={(e) => setNewServiceCategory(e.target.value as ServiceCategory)}
                            >
                                {Object.values(ServiceCategory).map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 ml-1">Description</label>
                        <input 
                            type="text" 
                            placeholder="e.g. Initial Consultation"
                            value={newServiceDescription}
                            onChange={(e) => setNewServiceDescription(e.target.value)}
                            className="glass-input w-full p-3.5 rounded-xl font-medium outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 ml-1">Price / Hr</label>
                        <input 
                            type="number" 
                            value={newServicePrice}
                            onChange={(e) => setNewServicePrice(Number(e.target.value))}
                            className="glass-input w-full p-3.5 rounded-xl font-medium outline-none"
                        />
                    </div>
                  </div>
                  <button 
                    onClick={handleAddService}
                    className="self-end bg-slate-900 text-white px-8 py-3.5 rounded-full font-bold text-sm hover:bg-slate-800 flex items-center gap-2 shadow-lg transition-all"
                  >
                      <Plus size={18} strokeWidth={2.5} /> Add Service
                  </button>
              </div>
          </div>
      </div>
  );

  const renderTeam = () => (
      <div className={glassCard}>
           <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Team</h3>
              <span className="text-xs font-bold bg-slate-200/50 px-4 py-1.5 rounded-full text-slate-600 uppercase tracking-wide">{(provider.teamMembers || []).length} Members</span>
          </div>

          <div className="space-y-4 mb-8">
              {(provider.teamMembers || []).map(member => (
                  <div key={member.id} className="flex items-center justify-between p-5 bg-white/40 border border-white/60 rounded-3xl">
                      <div className="flex items-center gap-5">
                          <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold border-2 border-white shadow-sm text-lg">
                              {member.name[0]}
                          </div>
                          <div>
                              <p className="font-bold text-slate-900 text-lg">{member.name}</p>
                              <p className="text-sm text-slate-500 font-medium">{member.email}</p>
                          </div>
                      </div>
                      <span className={`px-4 py-1.5 text-xs font-bold rounded-full border uppercase tracking-wider ${member.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                          {member.status}
                      </span>
                  </div>
              ))}
              {(provider.teamMembers || []).length === 0 && (
                  <div className="text-center py-10 bg-slate-50/30 rounded-3xl border border-dashed border-slate-200">
                    <p className="text-slate-400 font-medium">No team members yet.</p>
                  </div>
              )}
          </div>

          <form onSubmit={handleAddTeamMember} className="border-t border-slate-200/60 pt-8">
              <div className="flex flex-col md:flex-row gap-4 items-end">
                  <div className="flex-1 w-full">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 ml-1">Invite via Email</label>
                    <input 
                        type="email" 
                        placeholder="colleague@example.com"
                        required
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        className="glass-input w-full px-5 py-3.5 rounded-xl font-medium outline-none"
                    />
                  </div>
                  <button type="submit" className="w-full md:w-auto bg-slate-900 text-white px-8 py-3.5 rounded-full font-bold text-sm hover:bg-slate-800 shadow-md transition-all">
                      Send Invite
                  </button>
              </div>
          </form>
      </div>
  );

  const renderSettings = () => (
      <div className="space-y-6">
          {/* Profile Details Form */}
          <div className={glassCard}>
              <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Profile Settings</h3>
              </div>
              <form onSubmit={handleSaveProfile} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 ml-1">Company / Name</label>
                          <input 
                              type="text" 
                              value={profileForm.name} 
                              onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                              className="glass-input w-full px-5 py-3.5 rounded-xl font-medium outline-none"
                          />
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 ml-1">Phone</label>
                          <input 
                              type="text" 
                              value={profileForm.phone} 
                              onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                              placeholder="+1 555-0000"
                              className="glass-input w-full px-5 py-3.5 rounded-xl font-medium outline-none"
                          />
                      </div>
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 ml-1">Bio</label>
                      <textarea 
                          rows={3}
                          value={profileForm.bio} 
                          onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                          className="glass-input w-full px-5 py-3.5 rounded-xl font-medium outline-none resize-none"
                      />
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 ml-1">Location</label>
                      <input 
                          type="text" 
                          value={profileForm.address} 
                          onChange={(e) => setProfileForm({...profileForm, address: e.target.value})}
                          className="glass-input w-full px-5 py-3.5 rounded-xl font-medium outline-none"
                      />
                  </div>
                  <div className="flex justify-end pt-4">
                      <button 
                        type="submit" 
                        disabled={isSavingProfile}
                        className="bg-slate-900 text-white px-8 py-3.5 rounded-full font-bold text-sm hover:bg-slate-800 flex items-center gap-2 shadow-lg transition-all"
                      >
                          <Save size={18} /> {isSavingProfile ? 'Saving...' : 'Save Changes'}
                      </button>
                  </div>
              </form>
          </div>

          {/* Verification Documents Section */}
          <div className={glassCard}>
              <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        Verification
                        {provider.verified && <CheckCircle size={20} className="text-blue-500 fill-blue-50" />}
                    </h3>
                    <p className="text-sm text-slate-500 font-medium mt-1">Required to appear in search results.</p>
                  </div>
              </div>

              {/* Upload Area */}
              <div className="bg-slate-50/50 border-2 border-dashed border-slate-300 rounded-[2rem] p-8 text-center mb-6 transition-colors hover:bg-slate-50">
                  <div className="flex flex-col items-center">
                        <Upload className="w-10 h-10 text-slate-300 mb-4" strokeWidth={1.5} />
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                             <div className="relative">
                                <select 
                                    value={selectedDocType} 
                                    onChange={(e) => setSelectedDocType(e.target.value as any)}
                                    className="p-3 border border-slate-200 rounded-xl bg-white text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-slate-900 appearance-none pr-8 cursor-pointer"
                                >
                                    <option value="ID">Government ID</option>
                                    <option value="LICENSE">License</option>
                                    <option value="INSURANCE">Insurance</option>
                                </select>
                             </div>
                             <label className="cursor-pointer bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-full hover:bg-slate-50 text-sm font-bold transition-all shadow-sm">
                                 Choose File
                                 <input 
                                    type="file" 
                                    className="hidden" 
                                    onChange={handleFileUpload}
                                    disabled={uploadingDoc}
                                 />
                             </label>
                        </div>
                        {uploadingDoc && <p className="text-sm text-teal-600 animate-pulse font-bold mt-2">Uploading...</p>}
                  </div>
              </div>

              {/* Documents List */}
              <div className="space-y-3">
                  {(provider.verificationDocuments || []).map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-4 bg-white/40 border border-white/60 rounded-2xl">
                          <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
                                  <FileText size={20} strokeWidth={1.5} />
                              </div>
                              <div>
                                  <p className="font-bold text-slate-900 text-sm">{doc.name}</p>
                                  <p className="text-xs text-slate-500 font-medium">{doc.type}</p>
                              </div>
                          </div>
                          <span className={`px-3 py-1 text-[10px] font-bold rounded-full border uppercase tracking-wider ${
                              doc.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                              doc.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-100' :
                              'bg-amber-50 text-amber-700 border-amber-100'
                          }`}>
                              {doc.status}
                          </span>
                      </div>
                  ))}
                  {(provider.verificationDocuments || []).length === 0 && (
                      <p className="text-slate-400 italic text-sm text-center font-medium">No documents uploaded.</p>
                  )}
              </div>
          </div>
      </div>
  );

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="glass-panel border-x-0 border-t-0 rounded-none mb-10 sticky top-[80px] z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <img src={provider.avatar} alt="" className="w-16 h-16 rounded-2xl border-2 border-white shadow-md object-cover" />
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Hello, {provider.name}</h1>
                        <p className="text-slate-500 font-medium flex items-center gap-2 mt-0.5 text-sm">
                            {provider.serviceCategory} Professional 
                            {provider.verified && <CheckCircle size={16} className="text-blue-500 fill-blue-50" />}
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={onOpenSupport}
                        className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-full hover:bg-slate-50 flex items-center gap-2 font-bold text-sm transition-all shadow-sm"
                    >
                        <MessageCircle size={18} /> Get Help
                    </button>
                    <button onClick={onLogout} className="px-5 py-2.5 bg-white border border-slate-200 text-red-600 rounded-full hover:bg-red-50 font-bold text-sm transition-all shadow-sm">
                        Log Out
                    </button>
                </div>
            </div>
            
            {/* Tabs */}
            <div className="flex gap-1 mt-8 overflow-x-auto pb-1">
                {[
                    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
                    { id: 'services', label: 'Services', icon: DollarSign },
                    { id: 'team', label: 'Team', icon: Users },
                    { id: 'settings', label: 'Settings', icon: Settings },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 py-2.5 px-5 rounded-full transition-all whitespace-nowrap font-bold text-sm ${
                            activeTab === tab.id 
                            ? 'bg-slate-900 text-white shadow-lg' 
                            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                    >
                        <tab.icon size={16} strokeWidth={2.5} />
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'services' && renderServices()}
          {activeTab === 'team' && renderTeam()}
          {activeTab === 'settings' && renderSettings()}
      </div>
    </div>
  );
};