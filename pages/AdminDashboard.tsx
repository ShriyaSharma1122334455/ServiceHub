
import React, { useEffect, useState } from 'react';
import { User, SupportTicket, Provider, UserRole, AdminRole, ServiceCategory } from '../types';
import { api } from '../services/mockService';
import { 
    LayoutDashboard, Users, ShieldCheck, Ticket, AlertTriangle, 
    CheckCircle, XCircle, LogOut, FileText, Ban, Layers
} from 'lucide-react';

interface AdminDashboardProps {
    admin: User;
    onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ admin, onLogout }) => {
    const [activeSection, setActiveSection] = useState<string>('overview');
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [providers, setProviders] = useState<Provider[]>([]);
    const [customers, setCustomers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const role = admin.adminRole || AdminRole.SUPER_ADMIN;

    // RBAC Helper
    const canAccess = (section: string) => {
        if (role === AdminRole.SUPER_ADMIN) return true;

        switch (section) {
            case 'tickets_customer': return role === AdminRole.CUSTOMER_SUPPORT;
            case 'tickets_provider': return role === AdminRole.PROVIDER_SUPPORT;
            case 'verification': return role === AdminRole.VERIFICATION;
            case 'ratings': return role === AdminRole.CUSTOMER_REVIEWER;
            case 'categories': return role === AdminRole.CATEGORY_MANAGER;
            default: return false;
        }
    };

    // Set default active tab based on role
    useEffect(() => {
        if (role === AdminRole.CUSTOMER_SUPPORT) setActiveSection('tickets_customer');
        else if (role === AdminRole.PROVIDER_SUPPORT) setActiveSection('tickets_provider');
        else if (role === AdminRole.VERIFICATION) setActiveSection('verification');
        else if (role === AdminRole.CUSTOMER_REVIEWER) setActiveSection('ratings');
        else if (role === AdminRole.CATEGORY_MANAGER) setActiveSection('categories');
        else setActiveSection('overview');
    }, [role]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const [allTickets, allProviders, allCustomers] = await Promise.all([
                api.getTickets(),
                api.getAllProviders(),
                api.getAllCustomers()
            ]);
            setTickets(allTickets);
            setProviders(allProviders);
            setCustomers(allCustomers);
            setLoading(false);
        };
        fetchData();
    }, []);

    const handleResolveTicket = async (id: string) => {
        await api.resolveTicket(id);
        setTickets(tickets.map(t => t.id === id ? { ...t, status: 'RESOLVED' } : t));
    };

    const handleToggleVerification = async (id: string) => {
        await api.toggleProviderVerification(id);
        setProviders(providers.map(p => p.id === id ? { ...p, verified: !p.verified } : p));
    };

    const handleToggleBan = async (id: string, userRole: UserRole) => {
        await api.toggleUserBan(id, userRole);
        if (userRole === UserRole.PROVIDER) {
            setProviders(providers.map(p => p.id === id ? { ...p, isBanned: !p.isBanned } : p));
        } else {
            setCustomers(customers.map(c => c.id === id ? { ...c, isBanned: !c.isBanned } : c));
        }
    };

    // --- Render Sections ---

    const renderTicketSection = (filterType: 'CUSTOMER' | 'PROVIDER') => {
        const filteredTickets = tickets.filter(t => 
            filterType === 'CUSTOMER' 
            ? t.requesterRole === UserRole.CUSTOMER 
            : t.requesterRole === UserRole.PROVIDER
        );

        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-bold text-gray-900">
                        {filterType === 'CUSTOMER' ? 'Customer Incidents' : 'Provider Appeals & Reports'}
                    </h2>
                </div>
                <div className="divide-y divide-gray-200">
                    {filteredTickets.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">No open tickets.</div>
                    ) : (
                        filteredTickets.map(ticket => (
                            <div key={ticket.id} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${ticket.type === 'INCIDENT' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                                                {ticket.type}
                                            </span>
                                            <span className={`px-2 py-0.5 text-xs rounded-full ${ticket.priority === 'HIGH' ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-600'}`}>
                                                {ticket.priority} Priority
                                            </span>
                                        </div>
                                        <h3 className="font-semibold text-gray-900">{ticket.subject}</h3>
                                        <p className="text-sm text-gray-600 mt-1">{ticket.description}</p>
                                        <div className="text-xs text-gray-400 mt-2">ID: {ticket.requesterId} • {new Date(ticket.createdAt).toLocaleDateString()}</div>
                                    </div>
                                    {ticket.status === 'OPEN' ? (
                                        <button 
                                            onClick={() => handleResolveTicket(ticket.id)}
                                            className="px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700"
                                        >
                                            Resolve
                                        </button>
                                    ) : (
                                        <span className="text-green-600 flex items-center gap-1 text-sm font-medium">
                                            <CheckCircle size={16} /> Resolved
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        );
    };

    const renderVerificationSection = () => (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">Provider Verification Center</h2>
                <p className="text-sm text-gray-500">Verify identity documents and credentials.</p>
            </div>
            <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-sm">
                    <tr>
                        <th className="px-6 py-3 font-medium">Provider</th>
                        <th className="px-6 py-3 font-medium">Category</th>
                        <th className="px-6 py-3 font-medium">Documents</th>
                        <th className="px-6 py-3 font-medium">Status</th>
                        <th className="px-6 py-3 font-medium text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {providers.filter(p => !p.verified).map(provider => (
                        <tr key={provider.id}>
                            <td className="px-6 py-4">
                                <div className="font-medium text-gray-900">{provider.name}</div>
                                <div className="text-xs text-gray-500">{provider.email}</div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">{provider.serviceCategory}</td>
                            <td className="px-6 py-4">
                                <button className="text-indigo-600 text-sm hover:underline flex items-center gap-1">
                                    <FileText size={14} /> View Docs
                                </button>
                            </td>
                            <td className="px-6 py-4">
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">Pending</span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button 
                                    onClick={() => handleToggleVerification(provider.id)}
                                    className="text-green-600 hover:text-green-800 font-medium text-sm mr-4"
                                >
                                    Approve
                                </button>
                                <button className="text-red-600 hover:text-red-800 font-medium text-sm">
                                    Reject
                                </button>
                            </td>
                        </tr>
                    ))}
                    {providers.filter(p => !p.verified).length === 0 && (
                        <tr><td colSpan={5} className="p-6 text-center text-gray-500">No pending verifications.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );

    const renderRatingsSection = () => (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <AlertTriangle className="text-red-500" size={20} />
                        Low Rated Entities (Risk Management)
                    </h2>
                    <p className="text-sm text-gray-500">Monitor customers and providers with rating &lt; 3.0</p>
                </div>
                <div className="p-6 grid gap-6">
                    {/* Providers */}
                    <div>
                        <h3 className="font-semibold text-gray-700 mb-3">Providers At Risk</h3>
                        {providers.filter(p => p.rating < 3.0).map(p => (
                            <div key={p.id} className="flex items-center justify-between p-4 bg-red-50 rounded-lg mb-2 border border-red-100">
                                <div>
                                    <div className="font-bold text-gray-900">{p.name} ({p.serviceCategory})</div>
                                    <div className="text-sm text-red-600">Rating: {p.rating.toFixed(1)} / 5.0</div>
                                </div>
                                <button 
                                    onClick={() => handleToggleBan(p.id, UserRole.PROVIDER)}
                                    className={`px-3 py-1.5 text-xs font-bold rounded text-white ${p.isBanned ? 'bg-gray-500' : 'bg-red-600 hover:bg-red-700'}`}
                                >
                                    {p.isBanned ? 'Unban Provider' : 'Ban Provider'}
                                </button>
                            </div>
                        ))}
                    </div>
                    {/* Customers */}
                    <div>
                        <h3 className="font-semibold text-gray-700 mb-3">Customers At Risk</h3>
                        {customers.filter(c => (c.rating || 5) < 3.0).map(c => (
                            <div key={c.id} className="flex items-center justify-between p-4 bg-orange-50 rounded-lg mb-2 border border-orange-100">
                                <div>
                                    <div className="font-bold text-gray-900">{c.name}</div>
                                    <div className="text-sm text-orange-600">Rating: {(c.rating || 5).toFixed(1)} / 5.0</div>
                                </div>
                                <button 
                                    onClick={() => handleToggleBan(c.id, UserRole.CUSTOMER)}
                                    className={`px-3 py-1.5 text-xs font-bold rounded text-white ${c.isBanned ? 'bg-gray-500' : 'bg-red-600 hover:bg-red-700'}`}
                                >
                                    {c.isBanned ? 'Unban Customer' : 'Ban Customer'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderCategoryManager = () => {
        // Calculate stats
        const stats = Object.values(ServiceCategory).map(cat => ({
            name: cat,
            count: providers.filter(p => p.serviceCategory === cat).length,
            avgPrice: providers
                .filter(p => p.serviceCategory === cat)
                .reduce((acc, curr) => acc + curr.hourlyRate, 0) / (providers.filter(p => p.serviceCategory === cat).length || 1)
        }));

        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Service Category Management</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map(stat => (
                        <div key={stat.name} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <h3 className="font-bold text-gray-700">{stat.name}</h3>
                            <div className="mt-4 flex justify-between items-end">
                                <div>
                                    <p className="text-xs text-gray-500">Providers</p>
                                    <p className="text-2xl font-bold text-indigo-600">{stat.count}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500">Avg Rate</p>
                                    <p className="text-lg font-semibold text-gray-900">${stat.avgPrice.toFixed(0)}</p>
                                </div>
                            </div>
                            <button className="mt-4 w-full py-2 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-100">
                                Manage Rules
                            </button>
                        </div>
                    ))}
                </div>
                <div className="mt-8">
                    <h3 className="font-bold text-gray-900 mb-4">Pending Re-categorization Appeals</h3>
                    {tickets.filter(t => t.type === 'APPEAL' && t.status === 'OPEN').length > 0 ? (
                         <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                             {tickets.filter(t => t.type === 'APPEAL' && t.status === 'OPEN').length} providers are requesting category changes.
                             Check Provider Support module.
                         </div>
                    ) : (
                        <p className="text-sm text-gray-500">No active category appeals.</p>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex-shrink-0 hidden md:flex flex-col">
                <div className="p-6">
                    <div className="flex items-center gap-2 font-bold text-xl">
                        <div className="w-8 h-8 bg-indigo-500 rounded flex items-center justify-center">A</div>
                        Admin Portal
                    </div>
                    <div className="mt-2 text-xs text-slate-400 uppercase tracking-wider font-semibold">
                        {role === AdminRole.SUPER_ADMIN ? 'Super Admin' : role.replace('_', ' ')}
                    </div>
                </div>
                
                <nav className="flex-1 px-4 space-y-2">
                    {canAccess('overview') && (
                        <button 
                            onClick={() => setActiveSection('overview')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeSection === 'overview' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
                        >
                            <LayoutDashboard size={20} /> Dashboard
                        </button>
                    )}
                    
                    {canAccess('tickets_customer') && (
                        <button 
                            onClick={() => setActiveSection('tickets_customer')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeSection === 'tickets_customer' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
                        >
                            <Ticket size={20} /> Cust. Support
                        </button>
                    )}

                    {canAccess('tickets_provider') && (
                        <button 
                            onClick={() => setActiveSection('tickets_provider')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeSection === 'tickets_provider' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
                        >
                            <Users size={20} /> Prov. Support
                        </button>
                    )}

                    {canAccess('verification') && (
                        <button 
                            onClick={() => setActiveSection('verification')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeSection === 'verification' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
                        >
                            <ShieldCheck size={20} /> Verification
                        </button>
                    )}
                     
                    {canAccess('categories') && (
                        <button 
                            onClick={() => setActiveSection('categories')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeSection === 'categories' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
                        >
                            <Layers size={20} /> Categories
                        </button>
                    )}

                    {canAccess('ratings') && (
                        <button 
                            onClick={() => setActiveSection('ratings')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeSection === 'ratings' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
                        >
                            <Ban size={20} /> Ratings & Bans
                        </button>
                    )}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button onClick={onLogout} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                        <LogOut size={18} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Mobile Sidebar overlay would go here for responsiveness, skipping for brevity */}

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8">
                    <header className="mb-8 flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-900">
                            {activeSection === 'overview' && 'System Overview'}
                            {activeSection === 'tickets_customer' && 'Customer Support'}
                            {activeSection === 'tickets_provider' && 'Provider Support'}
                            {activeSection === 'verification' && 'Verification Center'}
                            {activeSection === 'categories' && 'Category Management'}
                            {activeSection === 'ratings' && 'Quality & Ratings'}
                        </h1>
                        <div className="text-sm text-gray-500">{admin.email}</div>
                    </header>

                    {activeSection === 'overview' && (
                        <div className="grid gap-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                    <div className="text-sm text-gray-500">Total Users</div>
                                    <div className="text-2xl font-bold">{providers.length + customers.length}</div>
                                </div>
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                    <div className="text-sm text-gray-500">Open Tickets</div>
                                    <div className="text-2xl font-bold text-orange-600">{tickets.filter(t => t.status === 'OPEN').length}</div>
                                </div>
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                    <div className="text-sm text-gray-500">Pending Verification</div>
                                    <div className="text-2xl font-bold text-blue-600">{providers.filter(p => !p.verified).length}</div>
                                </div>
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                    <div className="text-sm text-gray-500">Banned Entities</div>
                                    <div className="text-2xl font-bold text-red-600">{providers.filter(p => p.isBanned).length + customers.filter(c => c.isBanned).length}</div>
                                </div>
                            </div>
                            {/* Super Admin sees everything below in summary */}
                            {role === AdminRole.SUPER_ADMIN && (
                                <div className="mt-8 p-8 bg-white rounded-xl text-center text-gray-500 border border-gray-200 border-dashed">
                                    Select a module from the sidebar to manage.
                                </div>
                            )}
                        </div>
                    )}

                    {activeSection === 'tickets_customer' && renderTicketSection('CUSTOMER')}
                    {activeSection === 'tickets_provider' && renderTicketSection('PROVIDER')}
                    {activeSection === 'verification' && renderVerificationSection()}
                    {activeSection === 'categories' && renderCategoryManager()}
                    {activeSection === 'ratings' && renderRatingsSection()}
                </div>
            </main>
        </div>
    );
};
