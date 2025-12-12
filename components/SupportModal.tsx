
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
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-teal-100 sm:mx-0">
                        <MessageSquare className="h-5 w-5 text-teal-600" />
                    </div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                        {userRole === UserRole.PROVIDER ? 'Provider Support' : 'Customer Support'}
                    </h3>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                    <X size={24} />
                </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Issue Type</label>
                    <select 
                        value={type}
                        onChange={(e) => setType(e.target.value as any)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md border"
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

                <div>
                    <label className="block text-sm font-medium text-gray-700">Subject</label>
                    <input 
                        type="text" 
                        required
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Brief summary of the issue"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Priority</label>
                    <div className="mt-1 flex gap-2">
                        {['LOW', 'MEDIUM', 'HIGH'].map((p) => (
                            <button
                                key={p}
                                type="button"
                                onClick={() => setPriority(p as any)}
                                className={`flex-1 py-2 px-4 rounded text-xs font-medium border ${
                                    priority === p 
                                    ? 'bg-teal-50 border-teal-500 text-teal-700' 
                                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea 
                        required
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Please provide details..."
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                    />
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse -mx-6 -mb-6 mt-4">
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-teal-600 text-base font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-gray-400"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
                    </button>
                    <button 
                        type="button" 
                        onClick={onClose}
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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
