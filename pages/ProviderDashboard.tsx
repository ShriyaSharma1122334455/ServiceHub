
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
          'AVAILABLE': 'bg-green-100/60 text-green-800 border-green-200',
          'BUSY': 'bg-yellow-100/60 text-yellow-800 border-yellow-200',
          'OFF_DUTY': 'bg-gray-100/60 text-gray-800 border-gray-200'
      };
      return colors[status] || 'bg-gray-100';
  };

  // Glass Card Base Class
  const glassCard = "bg-white/60 backdrop-blur-lg rounded-2xl shadow-lg border border-white/50 p-6 transition-all duration-300 hover:bg-white/70";

  // Render Functions
  const renderOverview = () => (
    <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={glassCard}>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Earnings</p>
                        <p className="text-3xl font-extrabold text-gray-900 mt-1">$1,240.50</p>
                    </div>
                    <div className="p-4 bg-teal-100/50 text-teal-700 rounded-xl shadow-inner">
                        <DollarSign size={24} />
                    </div>
                </div>
            </div>
            <div className={glassCard}>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Rating</p>
                        <p className="text-3xl font-extrabold text-gray-900 mt-1">{provider.rating?.toFixed(1) || '0.0'} <span className="text-sm text-gray-400 font-normal">/ 5.0</span></p>
                    </div>
                    <div className={`p-4 rounded-xl shadow-inner ${provider.rating < 3 ? 'bg-red-100/50 text-red-600' : 'bg-amber-100/50 text-amber-600'}`}>
                        <AlertTriangle size={24} />
                    </div>
                </div>
                {provider.rating > 0 && provider.rating < 3.5 && (
                    <p className="mt-3 text-xs text-red-600 font-bold bg-red-50 px-2 py-1 rounded-lg w-fit">Warning: Low rating</p>
                )}
                {provider.isBanned && (
                    <div className="mt-2 p-2 bg-red-100 text-red-800 text-sm rounded border border-red-200 text-center font-bold">
                        ACCOUNT BANNED
                    </div>
                )}
            </div>
            <div className={glassCard}>
                 <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Status</p>
                        <span className={`inline-block px-3 py-1 text-sm font-bold rounded-full mt-2 border ${getStatusBadge(provider.availabilityStatus || 'OFF_DUTY')}`}>
                            {(provider.availabilityStatus || 'OFF_DUTY').replace('_', ' ')}
                        </span>
                    </div>
                    <button 
                        onClick={handleStatusToggle}
                        disabled={provider.availabilityStatus === 'BUSY'}
                        className={`p-4 rounded-xl transition-all shadow-sm ${
                            provider.availabilityStatus === 'BUSY' 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white hover:scale-105 active:scale-95'
                        }`}
                        title="Toggle Availability"
                    >
                        <Power className={`w-6 h-6 ${provider.availabilityStatus === 'OFF_DUTY' ? 'text-gray-400' : 'text-green-500'}`} />
                    </button>
                </div>
                {provider.availabilityStatus === 'BUSY' && <p className="text-xs text-gray-500 mt-2">Cannot change status while busy.</p>}
            </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-lg border border-white/50 overflow-hidden">
            <div className="px-6 py-5 border-b border-white/20 bg-white/20">
                <h3 className="font-bold text-gray-900 text-lg">Recent Requests</h3>
            </div>
            <div className="divide-y divide-white/40">
                {bookings.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No bookings yet.</div>
                ) : (
                    bookings.slice(0, 5).map(booking => (
                        <div key={booking.id} className="p-6 hover:bg-white/40 transition-colors">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h4 className="font-bold text-gray-800">{booking.serviceCategory}</h4>
                                        {booking.bookingType === 'CONSULTATION' && (
                                            <span className="px-2 py-0.5 bg-purple-100/60 border border-purple-200 text-purple-800 text-xs rounded-lg font-medium">Consultation</span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1 font-medium">
                                        {new Date(booking.date).toLocaleDateString()} at {booking.time} • {booking.durationHours} hrs
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-gray-900 text-lg">${booking.totalPrice.toFixed(2)}</div>
                                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                                        booking.status === 'COMPLETED' ? 'bg-green-100/60 text-green-800 border-green-200' : 'bg-teal-100/60 text-teal-800 border-teal-200'
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
          <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">My Services & Pricing</h3>
          </div>
          
          <div className="grid gap-4 mb-8">
              {(provider.services || []).map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white/40 border border-white/50 rounded-xl">
                      <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-teal-100/50 rounded-xl flex items-center justify-center text-2xl shadow-sm">
                                {service.category[0]}
                          </div>
                          <div>
                              <h4 className="font-bold text-gray-900">{service.category}</h4>
                              <p className="text-sm text-gray-500">{service.description}</p>
                          </div>
                      </div>
                      <div className="flex items-center gap-4">
                          <span className="font-bold text-gray-900 bg-white/50 px-3 py-1 rounded-lg border border-white/50">${service.price}/hr</span>
                          <button 
                            onClick={() => handleRemoveService(index)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                              <Trash2 size={18} />
                          </button>
                      </div>
                  </div>
              ))}
              {(provider.services || []).length === 0 && (
                  <p className="text-gray-500 italic">No services listed.</p>
              )}
          </div>

          <div className="bg-gray-50/50 p-6 rounded-xl border border-dashed border-gray-300">
              <h4 className="font-bold text-gray-900 mb-4">Add New Service</h4>
              <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Service Type</label>
                        <select 
                            className="w-full p-2.5 border border-gray-300/60 bg-white/70 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                            value={newServiceCategory}
                            onChange={(e) => setNewServiceCategory(e.target.value as ServiceCategory)}
                        >
                            {Object.values(ServiceCategory).map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                        <input 
                            type="text" 
                            placeholder="e.g. Initial Consultation"
                            value={newServiceDescription}
                            onChange={(e) => setNewServiceDescription(e.target.value)}
                            className="w-full p-2.5 border border-gray-300/60 bg-white/70 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Price / Hr</label>
                        <input 
                            type="number" 
                            value={newServicePrice}
                            onChange={(e) => setNewServicePrice(Number(e.target.value))}
                            className="w-full p-2.5 border border-gray-300/60 bg-white/70 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                        />
                    </div>
                  </div>
                  <button 
                    onClick={handleAddService}
                    className="self-end bg-teal-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-teal-700 flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
                  >
                      <Plus size={18} /> Add Service
                  </button>
              </div>
          </div>
      </div>
  );

  const renderTeam = () => (
      <div className={glassCard}>
           <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">Team Management</h3>
              <span className="text-sm font-medium bg-gray-100 px-2 py-1 rounded-lg">{(provider.teamMembers || []).length} Members</span>
          </div>

          <div className="space-y-4 mb-8">
              {(provider.teamMembers || []).map(member => (
                  <div key={member.id} className="flex items-center justify-between p-4 bg-white/40 border border-white/50 rounded-xl">
                      <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold border-2 border-white shadow-sm">
                              {member.name[0]}
                          </div>
                          <div>
                              <p className="font-bold text-gray-900">{member.name}</p>
                              <p className="text-sm text-gray-500">{member.email}</p>
                          </div>
                      </div>
                      <span className={`px-3 py-1 text-xs font-bold rounded-full border ${member.status === 'ACTIVE' ? 'bg-green-100/60 text-green-800 border-green-200' : 'bg-yellow-100/60 text-yellow-800 border-yellow-200'}`}>
                          {member.status}
                      </span>
                  </div>
              ))}
              {(provider.teamMembers || []).length === 0 && (
                  <p className="text-gray-500 italic text-center py-4">Working solo? Add team members to handle more jobs.</p>
              )}
          </div>

          <form onSubmit={handleAddTeamMember} className="border-t border-gray-200/50 pt-6">
              <h4 className="font-bold text-gray-900 mb-2">Invite Team Member</h4>
              <p className="text-sm text-gray-500 mb-4">They must have a registered account on ServiceHub.</p>
              <div className="flex gap-3">
                  <input 
                    type="email" 
                    placeholder="Enter email address"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="flex-1 p-2.5 border border-gray-300/60 bg-white/70 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                  <button type="submit" className="bg-teal-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-teal-700 shadow-md">
                      Invite
                  </button>
              </div>
          </form>
      </div>
  );

  const renderSettings = () => (
      <div className="space-y-6">
          {/* Profile Details Form */}
          <div className={glassCard}>
              <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Edit Profile</h3>
              </div>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Company / Name</label>
                          <input 
                              type="text" 
                              value={profileForm.name} 
                              onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                              className="w-full p-2.5 border border-gray-300/60 bg-white/70 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Phone</label>
                          <input 
                              type="text" 
                              value={profileForm.phone} 
                              onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                              placeholder="+1 555-0000"
                              className="w-full p-2.5 border border-gray-300/60 bg-white/70 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                          />
                      </div>
                  </div>
                  <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Bio / Description</label>
                      <textarea 
                          rows={3}
                          value={profileForm.bio} 
                          onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                          className="w-full p-2.5 border border-gray-300/60 bg-white/70 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                      />
                  </div>
                  <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Address</label>
                      <input 
                          type="text" 
                          value={profileForm.address} 
                          onChange={(e) => setProfileForm({...profileForm, address: e.target.value})}
                          className="w-full p-2.5 border border-gray-300/60 bg-white/70 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                      />
                  </div>
                  <div className="flex justify-end">
                      <button 
                        type="submit" 
                        disabled={isSavingProfile}
                        className="bg-teal-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-teal-700 flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
                      >
                          <Save size={18} /> {isSavingProfile ? 'Saving...' : 'Save Profile'}
                      </button>
                  </div>
              </form>
          </div>

          {/* Verification Documents Section */}
          <div className={glassCard}>
              <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        Verification Documents
                        {provider.verified && <CheckCircle size={20} className="text-green-500" />}
                    </h3>
                    <p className="text-sm text-gray-500">Upload ID, Licenses, or Insurance proofs to get verified.</p>
                  </div>
              </div>

              {/* Upload Area */}
              <div className="bg-gray-50/50 border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center mb-6">
                  <div className="flex flex-col items-center">
                        <Upload className="w-12 h-12 text-gray-400 mb-4" />
                        <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                             <select 
                                value={selectedDocType} 
                                onChange={(e) => setSelectedDocType(e.target.value as any)}
                                className="p-2.5 border border-gray-300 rounded-xl bg-white text-sm outline-none focus:ring-2 focus:ring-teal-500"
                             >
                                 <option value="ID">Government ID</option>
                                 <option value="LICENSE">Professional License</option>
                                 <option value="INSURANCE">Insurance Certificate</option>
                                 <option value="OTHER">Other</option>
                             </select>
                             <label className="cursor-pointer bg-teal-600 text-white px-5 py-2.5 rounded-xl hover:bg-teal-700 text-sm font-medium transition-colors shadow-md">
                                 Choose File
                                 <input 
                                    type="file" 
                                    className="hidden" 
                                    onChange={handleFileUpload}
                                    disabled={uploadingDoc}
                                 />
                             </label>
                        </div>
                        {uploadingDoc && <p className="text-sm text-teal-600 animate-pulse font-medium">Uploading...</p>}
                  </div>
              </div>

              {/* Documents List */}
              <div className="space-y-3">
                  {(provider.verificationDocuments || []).map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-4 bg-white/40 border border-white/50 rounded-xl">
                          <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center text-teal-600">
                                  <FileText size={20} />
                              </div>
                              <div>
                                  <p className="font-bold text-gray-900 text-sm">{doc.name}</p>
                                  <p className="text-xs text-gray-500 font-medium">{doc.type} • {new Date(doc.uploadedAt).toLocaleDateString()}</p>
                              </div>
                          </div>
                          <span className={`px-3 py-1 text-xs font-bold rounded-full border ${
                              doc.status === 'APPROVED' ? 'bg-green-100/60 text-green-800 border-green-200' :
                              doc.status === 'REJECTED' ? 'bg-red-100/60 text-red-800 border-red-200' :
                              'bg-yellow-100/60 text-yellow-800 border-yellow-200'
                          }`}>
                              {doc.status}
                          </span>
                      </div>
                  ))}
                  {(provider.verificationDocuments || []).length === 0 && (
                      <p className="text-gray-500 italic text-sm text-center">No documents uploaded yet.</p>
                  )}
              </div>
          </div>
      </div>
  );

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <div className="bg-white/60 backdrop-blur-lg border-b border-white/20 mb-8 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-5">
                    <img src={provider.avatar} alt="" className="w-20 h-20 rounded-2xl border-4 border-white shadow-md object-cover" />
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900">Welcome, {provider.name}</h1>
                        <p className="text-gray-500 font-medium flex items-center gap-2 mt-1">
                            {provider.serviceCategory} Professional 
                            {provider.verified && <CheckCircle size={18} className="text-blue-500 fill-white" />}
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={onOpenSupport}
                        className="px-5 py-2.5 bg-white/50 border border-teal-200 text-teal-800 rounded-xl hover:bg-teal-50/50 flex items-center gap-2 font-medium transition-all"
                    >
                        <MessageCircle size={18} /> Raise Request
                    </button>
                    <button onClick={onLogout} className="px-5 py-2.5 bg-white/50 border border-red-200 text-red-700 rounded-xl hover:bg-red-50/50 font-medium transition-all">
                        Logout
                    </button>
                </div>
            </div>
            
            {/* Tabs */}
            <div className="flex gap-8 mt-10 overflow-x-auto border-b border-gray-200/50">
                {[
                    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
                    { id: 'services', label: 'Services & Pricing', icon: DollarSign },
                    { id: 'team', label: 'My Team', icon: Users },
                    { id: 'settings', label: 'Settings & Verification', icon: Settings },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 pb-4 px-2 border-b-[3px] transition-all whitespace-nowrap font-medium text-sm ${
                            activeTab === tab.id 
                            ? 'border-teal-600 text-teal-700' 
                            : 'border-transparent text-gray-500 hover:text-gray-800'
                        }`}
                    >
                        <tab.icon size={18} className={activeTab === tab.id ? 'stroke-[2.5px]' : ''} />
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
