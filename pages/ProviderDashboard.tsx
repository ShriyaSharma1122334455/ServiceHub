
import React, { useState, useEffect } from 'react';
import { Provider, Booking, BookingStatus, ServiceCategory, ServiceOffering } from '../types';
import { api } from '../services/mockService';
import { 
    LayoutDashboard, Users, Calendar, Settings, DollarSign, 
    Clock, AlertTriangle, Plus, Trash2, CheckCircle, Power, MessageCircle, FileText, Upload, Save
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
            // Re-fetch provider data to ensure we have the latest status/services
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
      // Allow multiple services of same category if descriptions differ (e.g. Consultation vs Full Project)
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
          'AVAILABLE': 'bg-green-100 text-green-800',
          'BUSY': 'bg-yellow-100 text-yellow-800',
          'OFF_DUTY': 'bg-gray-100 text-gray-800'
      };
      return colors[status] || 'bg-gray-100';
  };

  // Render Functions
  const renderOverview = () => (
    <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500">Total Earnings</p>
                        <p className="text-2xl font-bold text-gray-900">$1,240.50</p>
                    </div>
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                        <DollarSign />
                    </div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500">Rating</p>
                        <p className="text-2xl font-bold text-gray-900">{provider.rating?.toFixed(1) || '0.0'} <span className="text-sm text-gray-400 font-normal">/ 5.0</span></p>
                    </div>
                    <div className={`p-3 rounded-lg ${provider.rating < 3 ? 'bg-red-50 text-red-600' : 'bg-yellow-50 text-yellow-600'}`}>
                        <AlertTriangle />
                    </div>
                </div>
                {provider.rating > 0 && provider.rating < 3.5 && (
                    <p className="mt-2 text-xs text-red-600 font-medium">Warning: Low rating. Risk of account suspension.</p>
                )}
                {provider.isBanned && (
                    <div className="mt-2 p-2 bg-red-100 text-red-800 text-sm rounded border border-red-200 text-center font-bold">
                        ACCOUNT BANNED
                    </div>
                )}
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                 <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <span className={`inline-block px-2 py-1 text-sm font-medium rounded-full mt-1 ${getStatusBadge(provider.availabilityStatus || 'OFF_DUTY')}`}>
                            {(provider.availabilityStatus || 'OFF_DUTY').replace('_', ' ')}
                        </span>
                    </div>
                    <button 
                        onClick={handleStatusToggle}
                        disabled={provider.availabilityStatus === 'BUSY'}
                        className={`p-3 rounded-lg transition-colors ${
                            provider.availabilityStatus === 'BUSY' 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                        title="Toggle Availability"
                    >
                        <Power className={`w-5 h-5 ${provider.availabilityStatus === 'OFF_DUTY' ? 'text-gray-400' : 'text-green-600'}`} />
                    </button>
                </div>
                {provider.availabilityStatus === 'BUSY' && <p className="text-xs text-gray-500 mt-2">Cannot change status while busy.</p>}
            </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Recent Requests</h3>
            </div>
            <div className="divide-y divide-gray-200">
                {bookings.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">No bookings yet.</div>
                ) : (
                    bookings.slice(0, 5).map(booking => (
                        <div key={booking.id} className="p-6 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-medium text-gray-900">{booking.serviceCategory}</h4>
                                        {booking.bookingType === 'CONSULTATION' && (
                                            <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-xs rounded-full">Consultation</span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {new Date(booking.date).toLocaleDateString()} at {booking.time} • {booking.durationHours} hrs
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="font-medium text-gray-900">${booking.totalPrice.toFixed(2)}</div>
                                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                        booking.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">My Services & Pricing</h3>
          </div>
          
          <div className="grid gap-4 mb-8">
              {(provider.services || []).map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-xl">
                                {/* Simple icon mapping based on first letter or generic */}
                                {service.category[0]}
                          </div>
                          <div>
                              <h4 className="font-medium text-gray-900">{service.category}</h4>
                              <p className="text-sm text-gray-500">{service.description}</p>
                          </div>
                      </div>
                      <div className="flex items-center gap-4">
                          <span className="font-bold text-gray-900">${service.price}/hr</span>
                          <button 
                            onClick={() => handleRemoveService(index)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
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

          <div className="bg-gray-50 p-6 rounded-xl border border-dashed border-gray-300">
              <h4 className="font-medium text-gray-900 mb-4">Add New Service</h4>
              <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
                        <select 
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            value={newServiceCategory}
                            onChange={(e) => setNewServiceCategory(e.target.value as ServiceCategory)}
                        >
                            {Object.values(ServiceCategory).map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <input 
                            type="text" 
                            placeholder="e.g. Initial Consultation"
                            value={newServiceDescription}
                            onChange={(e) => setNewServiceDescription(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price / Hr</label>
                        <input 
                            type="number" 
                            value={newServicePrice}
                            onChange={(e) => setNewServicePrice(Number(e.target.value))}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                  </div>
                  <button 
                    onClick={handleAddService}
                    className="self-end bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                  >
                      <Plus size={18} /> Add Service
                  </button>
              </div>
          </div>
      </div>
  );

  const renderTeam = () => (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
           <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">Team Management</h3>
              <span className="text-sm text-gray-500">{(provider.teamMembers || []).length} Members</span>
          </div>

          <div className="space-y-4 mb-8">
              {(provider.teamMembers || []).map(member => (
                  <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold">
                              {member.name[0]}
                          </div>
                          <div>
                              <p className="font-medium text-gray-900">{member.name}</p>
                              <p className="text-sm text-gray-500">{member.email}</p>
                          </div>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${member.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {member.status}
                      </span>
                  </div>
              ))}
              {(provider.teamMembers || []).length === 0 && (
                  <p className="text-gray-500 italic text-center py-4">Working solo? Add team members to handle more jobs.</p>
              )}
          </div>

          <form onSubmit={handleAddTeamMember} className="border-t border-gray-200 pt-6">
              <h4 className="font-medium text-gray-900 mb-4">Invite Team Member</h4>
              <p className="text-sm text-gray-500 mb-4">They must have a registered account on ServiceHub.</p>
              <div className="flex gap-2">
                  <input 
                    type="email" 
                    placeholder="Enter email address"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-lg"
                  />
                  <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                      Invite
                  </button>
              </div>
          </form>
      </div>
  );

  const renderSettings = () => (
      <div className="space-y-6">
          {/* Profile Details Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Edit Profile</h3>
              </div>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Company / Name</label>
                          <input 
                              type="text" 
                              value={profileForm.name} 
                              onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                          <input 
                              type="text" 
                              value={profileForm.phone} 
                              onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                              placeholder="+1 555-0000"
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                          />
                      </div>
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bio / Description</label>
                      <textarea 
                          rows={3}
                          value={profileForm.bio} 
                          onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <input 
                          type="text" 
                          value={profileForm.address} 
                          onChange={(e) => setProfileForm({...profileForm, address: e.target.value})}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      />
                  </div>
                  <div className="flex justify-end">
                      <button 
                        type="submit" 
                        disabled={isSavingProfile}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                      >
                          <Save size={16} /> {isSavingProfile ? 'Saving...' : 'Save Profile'}
                      </button>
                  </div>
              </form>
          </div>

          {/* Verification Documents Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center mb-6">
                  <div className="flex flex-col items-center">
                        <Upload className="w-10 h-10 text-gray-400 mb-3" />
                        <div className="flex items-center gap-4 mb-4">
                             <select 
                                value={selectedDocType} 
                                onChange={(e) => setSelectedDocType(e.target.value as any)}
                                className="p-2 border border-gray-300 rounded-lg bg-white text-sm"
                             >
                                 <option value="ID">Government ID</option>
                                 <option value="LICENSE">Professional License</option>
                                 <option value="INSURANCE">Insurance Certificate</option>
                                 <option value="OTHER">Other</option>
                             </select>
                             <label className="cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors">
                                 Choose File
                                 <input 
                                    type="file" 
                                    className="hidden" 
                                    onChange={handleFileUpload}
                                    disabled={uploadingDoc}
                                 />
                             </label>
                        </div>
                        {uploadingDoc && <p className="text-sm text-indigo-600 animate-pulse">Uploading...</p>}
                  </div>
              </div>

              {/* Documents List */}
              <div className="space-y-3">
                  {(provider.verificationDocuments || []).map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                          <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-indigo-50 rounded flex items-center justify-center text-indigo-600">
                                  <FileText size={20} />
                              </div>
                              <div>
                                  <p className="font-medium text-gray-900 text-sm">{doc.name}</p>
                                  <p className="text-xs text-gray-500">{doc.type} • {new Date(doc.uploadedAt).toLocaleDateString()}</p>
                              </div>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              doc.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                              doc.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
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
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <img src={provider.avatar} alt="" className="w-16 h-16 rounded-full border-2 border-indigo-100" />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Welcome, {provider.name}</h1>
                        <p className="text-gray-500 flex items-center gap-2">
                            {provider.serviceCategory} Professional 
                            {provider.verified && <CheckCircle size={16} className="text-blue-500" />}
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={onOpenSupport}
                        className="px-4 py-2 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-lg hover:bg-indigo-100 flex items-center gap-2"
                    >
                        <MessageCircle size={18} /> Raise Request
                    </button>
                    <button onClick={onLogout} className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50">
                        Logout
                    </button>
                </div>
            </div>
            
            {/* Tabs */}
            <div className="flex gap-6 mt-8 overflow-x-auto">
                {[
                    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
                    { id: 'services', label: 'Services & Pricing', icon: DollarSign },
                    { id: 'team', label: 'My Team', icon: Users },
                    { id: 'settings', label: 'Settings & Verification', icon: Settings },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 pb-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
                            activeTab === tab.id 
                            ? 'border-indigo-600 text-indigo-600 font-medium' 
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <tab.icon size={18} />
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
