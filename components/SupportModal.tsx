
import React, { useState } from 'react';
import { UserRole } from '../types';
import { api } from '../services/mockService';
import { X, MessageSquare, AlertCircle } from 'lucide-react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userRole: UserRole;
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose, userId, userRole }) => {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'INCIDENT' | 'APPEAL' | 'REPORT'>(userRole === UserRole.PROVIDER ? 'APPEAL' : 'INCIDENT');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
        await api.createTicket({
            requesterId: userId,
            requesterRole: userRole,
            subject,
            description,
            type,
            priority
        });
        alert('Ticket submitted successfully! Support team will review it.');
        onClose();
        // Reset form
        setSubject('');
        setDescription('');
    } catch (e) {
        alert('Failed to submit ticket');
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen px-4 pb-20 text-center sm:p-0">
        
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" aria-hidden="true" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white/90 backdrop-blur-xl rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full border border-white/50">
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-teal-100/50 sm:mx-0 shadow-inner">
                        <MessageSquare className="h-6 w-6 text-teal-600" />
                    </div>
                    <div>
                        <h3 className="text-xl leading-6 font-bold text-gray-900" id="modal-title">
                            {userRole === UserRole.PROVIDER ? 'Provider Support' : 'Customer Support'}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">We are here to help.</p>
                    </div>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 bg-gray-100/50 p-1.5 rounded-full transition-colors">
                    <X size={20} />
                </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Issue Type</label>
                    <div className="relative">
                        <select 
                            value={type}
                            onChange={(e) => setType(e.target.value as any)}
                            className="block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 rounded-xl focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white/70"
                        >
                            {userRole === UserRole.CUSTOMER && (
                                <option value="INCIDENT">Report an Incident (Service Issue)</option>
                            )}
                            {userRole === UserRole.PROVIDER && (
                                <>
                                    <option value="APPEAL">Appeal (Category/Verification)</option>
                                    <option value="REPORT">Report Customer Behavior</option>
                                </>
                            )}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Subject</label>
                    <input 
                        type="text" 
                        required
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Brief summary of the issue"
                        className="block w-full border border-gray-300 rounded-xl shadow-sm py-2.5 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white/70"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Priority</label>
                    <div className="flex gap-2">
                        {['LOW', 'MEDIUM', 'HIGH'].map((p) => (
                            <button
                                key={p}
                                type="button"
                                onClick={() => setPriority(p as any)}
                                className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold border transition-all ${
                                    priority === p 
                                    ? 'bg-teal-50 border-teal-500 text-teal-800 shadow-sm' 
                                    : 'bg-white/60 border-gray-300 text-gray-600 hover:bg-white'
                                }`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                    <textarea 
                        required
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Please provide details..."
                        className="block w-full border border-gray-300 rounded-xl shadow-sm py-2.5 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white/70"
                    />
                </div>

                <div className="pt-4 flex flex-row-reverse gap-3">
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-lg px-4 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-base font-bold text-white hover:from-teal-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:w-auto sm:text-sm disabled:opacity-50"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
                    </button>
                    <button 
                        type="button" 
                        onClick={onClose}
                        className="mt-3 w-full inline-flex justify-center rounded-xl border border-gray-300 shadow-sm px-4 py-2.5 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:mt-0 sm:w-auto sm:text-sm"
                    >
                        Cancel
                    </button>
                </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
