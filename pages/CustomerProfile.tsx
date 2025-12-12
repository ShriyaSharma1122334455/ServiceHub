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
        <h1 className="text-3xl font-bold text-slate-900 mb-8 tracking-tight">My Profile</h1>
        
        <div className="glass-panel rounded-[2.5rem] overflow-hidden p-0">
            {/* Header / Banner */}
            <div className="h-48 bg-gradient-to-r from-slate-800 to-slate-900 relative"></div>
            
            <div className="px-10 pb-12">
                <div className="relative flex justify-between items-end -mt-20 mb-10">
                    <div className="relative group">
                        <img 
                            src={user.avatar} 
                            alt={user.name} 
                            className="w-36 h-36 rounded-[2rem] border-4 border-white shadow-xl bg-white object-cover"
                        />
                        <button className="absolute bottom-[-10px] right-[-10px] bg-white p-3 rounded-2xl shadow-md border border-slate-100 text-slate-500 hover:text-slate-900 hover:scale-110 transition-all">
                            <Camera size={18} strokeWidth={2.5} />
                        </button>
                    </div>
                    {!isEditing && (
                        <button 
                            onClick={() => setIsEditing(true)}
                            className="bg-white border border-slate-200 text-slate-900 px-6 py-2.5 rounded-full text-sm font-bold hover:bg-slate-50 transition-all shadow-sm"
                        >
                            Edit Profile
                        </button>
                    )}
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 ml-1">Full Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <UserIcon className="h-4 w-4 text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    name="name"
                                    value={isEditing ? formData.name : user.name}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className={`pl-11 block w-full rounded-2xl transition-all ${
                                        isEditing 
                                        ? 'glass-input p-3.5 text-slate-900 font-medium' 
                                        : 'bg-transparent border-transparent p-0 font-bold text-xl text-slate-900'
                                    }`}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 ml-1">Email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-4 w-4 text-slate-400" />
                                </div>
                                <input
                                    type="email"
                                    value={user.email}
                                    disabled
                                    className="pl-11 block w-full bg-transparent border-transparent p-0 text-slate-500 font-medium text-base"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 ml-1">Phone</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Phone className="h-4 w-4 text-slate-400" />
                                </div>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={isEditing ? formData.phone : (user.phone || 'Not provided')}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    placeholder="+1 (555) 000-0000"
                                    className={`pl-11 block w-full rounded-2xl transition-all ${
                                        isEditing 
                                        ? 'glass-input p-3.5 text-slate-900 font-medium' 
                                        : 'bg-transparent border-transparent p-0 text-slate-600 font-medium'
                                    }`}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 ml-1">Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <MapPin className="h-4 w-4 text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    name="address"
                                    value={isEditing ? formData.address : (user.address || 'Not provided')}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    placeholder="Add your address"
                                    className={`pl-11 block w-full rounded-2xl transition-all ${
                                        isEditing 
                                        ? 'glass-input p-3.5 text-slate-900 font-medium' 
                                        : 'bg-transparent border-transparent p-0 text-slate-600 font-medium'
                                    }`}
                                />
                            </div>
                        </div>
                    </div>

                    {isEditing && (
                        <div className="mt-10 flex justify-end gap-3 pt-6 border-t border-slate-200/60">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditing(false);
                                    setFormData({ name: user.name, phone: user.phone || '', address: user.address || '' });
                                }}
                                className="px-6 py-3 border border-slate-200 bg-white rounded-full text-sm font-bold text-slate-600 hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="px-6 py-3 bg-slate-900 text-white rounded-full text-sm font-bold hover:bg-slate-800 shadow-lg flex items-center gap-2"
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
            <div className="glass-panel rounded-[2rem] p-6">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-4">Account Status</h3>
                <div className="flex items-center gap-2 bg-emerald-50 w-fit px-4 py-1.5 rounded-full border border-emerald-100">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-sm text-emerald-800 font-bold">Active Member</span>
                </div>
            </div>
            <div className="glass-panel rounded-[2rem] p-6">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-4">Verification</h3>
                <div className="flex items-center gap-3 text-sm font-bold">
                     <div className="flex-1 text-slate-700">Email Address</div>
                     <div className="text-emerald-600 flex items-center gap-1.5 bg-emerald-50 px-3 py-1 rounded-full">
                        <CheckCircle size={14} strokeWidth={2.5} /> Verified
                     </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};