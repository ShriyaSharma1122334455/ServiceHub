import React, { useState } from 'react';
import { User } from '../types';
import { api } from '../services/mockService';
import { User as UserIcon, Mail, Phone, MapPin, Save, Camera, CheckCircle } from 'lucide-react';

interface CustomerProfileProps {
  user: User;
}

export const CustomerProfile: React.FC<CustomerProfileProps> = ({ user: initialUser }) => {
  const [user, setUser] = useState<User>(initialUser);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: initialUser.name,
    phone: initialUser.phone || '',
    address: initialUser.address || ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  if (name === "phone" && !/^\d{0,10}$/.test(value)) return;
  setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
        const updatedUser = await api.updateUser(user.id, formData);
        setUser(updatedUser);
        setIsEditing(false);
    } catch (error) {
        alert('Failed to update profile');
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8 drop-shadow-sm">My Profile</h1>
        
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
            {/* Header / Banner */}
            <div className="h-40 bg-gradient-to-r from-teal-500 to-emerald-600 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-white/10 backdrop-blur-[2px]"></div>
            </div>
            
            <div className="px-10 pb-10">
                <div className="relative flex justify-between items-end -mt-16 mb-8">
                    <div className="relative group cursor-pointer">
                        <img 
                            src={user.avatar} 
                            alt={user.name} 
                            className="w-32 h-32 rounded-3xl border-4 border-white shadow-lg bg-white object-cover group-hover:opacity-90 transition-opacity"
                        />
                        <button className="absolute bottom-[-10px] right-[-10px] bg-white p-2.5 rounded-xl shadow-md border border-gray-100 text-gray-600 hover:text-teal-600 hover:scale-110 transition-all">
                            <Camera size={18} />
                        </button>
                    </div>
                    {!isEditing && (
                        <button 
                            onClick={() => setIsEditing(true)}
                            className="bg-white/80 backdrop-blur-md border border-teal-200 text-teal-800 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-teal-50 transition-all shadow-sm"
                        >
                            Edit Profile
                        </button>
                    )}
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Full Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <UserIcon className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="name"
                                    value={isEditing ? formData.name : user.name}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className={`pl-11 block w-full rounded-xl sm:text-sm transition-all ${
                                        isEditing 
                                        ? 'bg-white/80 border-gray-300 focus:ring-teal-500 focus:border-teal-500 border p-3 shadow-sm' 
                                        : 'bg-transparent border-transparent p-0 font-bold text-lg text-gray-900'
                                    }`}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    value={user.email}
                                    disabled
                                    className="pl-11 block w-full bg-transparent border-transparent p-0 text-gray-500 sm:text-sm font-medium"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Phone Number</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Phone className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={isEditing ? formData.phone : (user.phone || 'Not provided')}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    placeholder="+1 (555) 000-0000"
                                    className={`pl-11 block w-full rounded-xl sm:text-sm transition-all ${
                                        isEditing 
                                        ? 'bg-white/80 border-gray-300 focus:ring-teal-500 focus:border-teal-500 border p-3 shadow-sm' 
                                        : 'bg-transparent border-transparent p-0 text-gray-600 font-medium'
                                    }`}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <MapPin className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="address"
                                    value={isEditing ? formData.address : (user.address || 'Not provided')}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    placeholder="123 Street Name, City"
                                    className={`pl-11 block w-full rounded-xl sm:text-sm transition-all ${
                                        isEditing 
                                        ? 'bg-white/80 border-gray-300 focus:ring-teal-500 focus:border-teal-500 border p-3 shadow-sm' 
                                        : 'bg-transparent border-transparent p-0 text-gray-600 font-medium'
                                    }`}
                                />
                            </div>
                        </div>
                    </div>

                    {isEditing && (
                        <div className="mt-8 flex justify-end gap-3 border-t border-gray-200/50 pt-6">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditing(false);
                                    setFormData({ name: user.name, phone: user.phone || '', address: user.address || '' });
                                }}
                                className="px-5 py-2.5 border border-gray-300/60 bg-white/50 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 hover:shadow-sm"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="px-5 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl text-sm font-bold hover:shadow-lg hover:scale-[1.02] transition-all flex items-center gap-2"
                            >
                                <Save size={16} />
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/50">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Account Status</h3>
                <div className="flex items-center gap-2 bg-green-50/50 w-fit px-3 py-1 rounded-full border border-green-100">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-sm text-green-800 font-bold">Active</span>
                </div>
                <div className="mt-4 text-sm text-gray-500 font-medium">
                    Member since {new Date().getFullYear()}
                </div>
            </div>
            <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/50">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Trust & Safety</h3>
                <div className="flex items-center gap-3 text-sm font-medium">
                     <div className="flex-1 text-gray-600">Email Verified</div>
                     <div className="text-green-600 font-bold flex items-center gap-1">
                        <CheckCircle size={16} /> Yes
                     </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};