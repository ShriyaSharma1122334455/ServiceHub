import React, { useState } from 'react';
import { User } from '../types';
import { api } from '../services/mockService';
import { User as UserIcon, Mail, Phone, MapPin, Save, Camera, CheckCircle, Edit2 } from 'lucide-react';

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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="glass-panel rounded-[3rem] overflow-hidden p-0 shadow-xl border-white/60">
            {/* Header / Banner */}
            <div className="h-56 bg-gradient-to-br from-slate-800 via-slate-900 to-black relative">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            </div>
            
            <div className="px-10 pb-12">
                <div className="relative flex flex-col md:flex-row justify-between items-end md:items-center -mt-20 mb-12 gap-6">
                    <div className="relative group">
                        <div className="p-1.5 bg-white/20 backdrop-blur-md rounded-[2.5rem]">
                            <img 
                                src={user.avatar} 
                                alt={user.name} 
                                className="w-36 h-36 rounded-[2rem] shadow-2xl bg-white object-cover"
                            />
                        </div>
                        {isEditing && (
                            <button className="absolute bottom-2 right-2 bg-slate-900 text-white p-3 rounded-full shadow-lg border border-slate-700 hover:scale-110 transition-all">
                                <Camera size={18} strokeWidth={2.5} />
                            </button>
                        )}
                    </div>
                    
                    <div className="flex-1 md:mb-6">
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{user.name}</h1>
                        <p className="text-slate-500 font-medium">{user.email}</p>
                    </div>

                    {!isEditing && (
                        <button 
                            onClick={() => setIsEditing(true)}
                            className="bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-full text-sm font-bold hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2 mb-6"
                        >
                            <Edit2 size={16} /> Edit Profile
                        </button>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="group">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-3 ml-1 group-focus-within:text-slate-900 transition-colors">Full Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                    <UserIcon className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    name="name"
                                    value={isEditing ? formData.name : user.name}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className={`pl-14 block w-full rounded-2xl transition-all outline-none ${
                                        isEditing 
                                        ? 'glass-input p-4 text-slate-900 font-bold focus:ring-2 focus:ring-slate-900' 
                                        : 'bg-slate-50/50 border border-transparent p-4 font-bold text-slate-700'
                                    }`}
                                />
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-3 ml-1 group-focus-within:text-slate-900 transition-colors">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="email"
                                    value={user.email}
                                    disabled
                                    className="pl-14 block w-full bg-slate-50/50 border border-transparent rounded-2xl p-4 text-slate-500 font-bold cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-3 ml-1 group-focus-within:text-slate-900 transition-colors">Phone Number</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                    <Phone className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={isEditing ? formData.phone : (user.phone || '')}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    placeholder="+1 (555) 000-0000"
                                    className={`pl-14 block w-full rounded-2xl transition-all outline-none ${
                                        isEditing 
                                        ? 'glass-input p-4 text-slate-900 font-bold focus:ring-2 focus:ring-slate-900' 
                                        : 'bg-slate-50/50 border border-transparent p-4 font-bold text-slate-700 placeholder-slate-400'
                                    }`}
                                />
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-3 ml-1 group-focus-within:text-slate-900 transition-colors">Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                    <MapPin className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    name="address"
                                    value={isEditing ? formData.address : (user.address || '')}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    placeholder="Add your address"
                                    className={`pl-14 block w-full rounded-2xl transition-all outline-none ${
                                        isEditing 
                                        ? 'glass-input p-4 text-slate-900 font-bold focus:ring-2 focus:ring-slate-900' 
                                        : 'bg-slate-50/50 border border-transparent p-4 font-bold text-slate-700 placeholder-slate-400'
                                    }`}
                                />
                            </div>
                        </div>
                    </div>

                    {isEditing && (
                        <div className="flex justify-end gap-4 pt-8 border-t border-slate-200/60">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditing(false);
                                    setFormData({ name: user.name, phone: user.phone || '', address: user.address || '' });
                                }}
                                className="px-8 py-4 border border-slate-200 bg-white rounded-full text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="px-8 py-4 bg-slate-900 text-white rounded-full text-sm font-bold hover:bg-slate-800 shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                            >
                                <Save size={18} />
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel rounded-[2.5rem] p-8 hover:bg-white/80 transition-colors">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-4">Account Status</h3>
                <div className="flex items-center gap-3 bg-emerald-50 w-fit px-5 py-2.5 rounded-full border border-emerald-100">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-sm text-emerald-900 font-bold">Active Member</span>
                </div>
            </div>
            <div className="glass-panel rounded-[2.5rem] p-8 hover:bg-white/80 transition-colors">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-4">Identity Verification</h3>
                <div className="flex items-center gap-3">
                     <div className="flex-1 text-slate-900 font-bold">Email Verified</div>
                     <div className="text-emerald-600 flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
                        <CheckCircle size={16} strokeWidth={3} /> <span className="text-xs font-bold uppercase tracking-wide">Verified</span>
                     </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};