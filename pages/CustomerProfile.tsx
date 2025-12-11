
import React, { useState } from 'react';
import { User } from '../types';
import { api } from '../services/mockService';
import { User as UserIcon, Mail, Phone, MapPin, Save, Camera } from 'lucide-react';

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

    // Validate phone: allow only digits up to 10
    if (name === "phone") {
      if (!/^\d{0,10}$/.test(value)) return; 
    }

    // Validate name: don't allow less than 3 chars *after user starts typing*
    if (name === "name") {
      if (value.length > 0 && value.length < 3) {
        // Still allow typing but you can show an error later
      }
    }
    
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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">My Profile</h1>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header / Banner */}
            <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
            
            <div className="px-8 pb-8">
                <div className="relative flex justify-between items-end -mt-12 mb-6">
                    <div className="relative">
                        <img 
                            src={user.avatar} 
                            alt={user.name} 
                            className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-white"
                        />
                        <button className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow border border-gray-200 text-gray-600 hover:text-indigo-600">
                            <Camera size={14} />
                        </button>
                    </div>
                    {!isEditing && (
                        <button 
                            onClick={() => setIsEditing(true)}
                            className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors"
                        >
                            Edit Profile
                        </button>
                    )}
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <UserIcon className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="name"
                                    value={isEditing ? formData.name : user.name}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className={`pl-10 block w-full rounded-lg sm:text-sm ${
                                        isEditing 
                                        ? 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 border p-2.5' 
                                        : 'bg-transparent border-transparent p-0 font-medium text-gray-900'
                                    }`}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    value={user.email}
                                    disabled
                                    className="pl-10 block w-full bg-transparent border-transparent p-0 text-gray-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Phone className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={isEditing ? formData.phone : (user.phone || 'Not provided')}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    placeholder="+1 (555) 000-0000"
                                    className={`pl-10 block w-full rounded-lg sm:text-sm ${
                                        isEditing 
                                        ? 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 border p-2.5' 
                                        : 'bg-transparent border-transparent p-0 text-gray-600'
                                    }`}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MapPin className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="address"
                                    value={isEditing ? formData.address : (user.address || 'Not provided')}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    placeholder="123 Street Name, City"
                                    className={`pl-10 block w-full rounded-lg sm:text-sm ${
                                        isEditing 
                                        ? 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 border p-2.5' 
                                        : 'bg-transparent border-transparent p-0 text-gray-600'
                                    }`}
                                />
                            </div>
                        </div>
                    </div>

                    {isEditing && (
                        <div className="mt-8 flex justify-end gap-3 border-t border-gray-100 pt-6">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditing(false);
                                    setFormData({ name: user.name, phone: user.phone || '', address: user.address || '' });
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2"
                            >
                                <Save size={16} />
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>

        {/* Stats or other info could go here */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Account Status</h3>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span className="text-sm text-gray-600">Active</span>
                </div>
                <div className="mt-4 text-sm text-gray-500">
                    Member since {new Date().getFullYear()}
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Trust & Safety</h3>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                     <div className="flex-1">Email Verified</div>
                     <div className="text-green-600 font-medium">Yes</div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
