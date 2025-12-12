
import React, { useEffect, useState } from 'react';
import { User, SupportTicket, Provider, UserRole, AdminRole, ServiceCategory } from '../types';
import { api } from '../services/mockService';
import { 
    LayoutDashboard, Users, ShieldCheck, Ticket, AlertTriangle, 
    CheckCircle, LogOut, FileText, Ban, Layers
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

    const glassPanel = "bg-white/60 backdrop-blur-lg rounded-2xl shadow-lg border border-white/50 overflow-hidden";
    const darkGlassSidebar = "bg-black/80 backdrop-blur-xl border-r border-white/10 text-white";

    // --- Render Sections ---

    const renderTicketSection = (filterType: 'CUSTOMER' | 'PROVIDER') => {
        const filteredTickets = tickets.filter(t => 
            filterType === 'CUSTOMER' 
            ? t.requesterRole === UserRole.CUSTOMER 
            : t.requesterRole === UserRole.PROVIDER
        );

        return (
            <div className={glassPanel}>
                <div className="p-6 border-b border-gray-200/50 bg-white/20">
                    <h2 className="text-xl font-bold text-gray-900">
                        {filterType === 'CUSTOMER' ? 'Customer Incidents' : 'Provider Appeals & Reports'}
                    </h2>
                </div>
                <div className="divide-y divide-gray-200/50">
                    {filteredTickets.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 font-medium">No open tickets.</div>
                    ) : (
                        filteredTickets.map(ticket => (
                            <div key={ticket.id} className="p-6 hover:bg-white/40 transition-colors">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${ticket.type === 'INCIDENT' ? 'bg-red-100/70 text-red-900' : 'bg-blue-100/70 text-blue-900'}`}>
                                                {ticket.type}
                                            </span>
                                            <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${ticket.priority === 'HIGH' ? 'bg-orange-100/70 text-orange-900' : 'bg-gray-100/70 text-gray-700'}`}>
                                                {ticket.priority} Priority
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-gray-900 text-lg">{ticket.subject}</h3>
                                        <p className="text-sm text-gray-600 mt-1">{ticket.description}</p>
                                        <div className="text-xs text-gray-400 mt-3 font-mono">ID: {ticket.requesterId} • {new Date(ticket.createdAt).toLocaleDateString()}</div>
                                    </div>
                                    {ticket.status === 'OPEN' ? (
                                        <button 
                                            onClick={() => handleResolveTicket(ticket.id)}
                                            className="px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-xl hover:bg-green-700 shadow-md"
                                        >
                                            Resolve
                                        </button>
                                    ) : (
                                        <span className="text-green-600 flex items-center gap-1 text-sm font-bold">
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
        <div className={glassPanel}>
            <div className="p-6 border-b border-gray-200/50 bg-white/20">
                <h2 className="text-xl font-bold text-gray-900">Provider Verification Center</h2>
                <p className="text-sm text-gray-500 font-medium">Verify identity documents and credentials.</p>
            </div>
            <table className="w-full text-left">
                <thead className="bg-gray-100/50 text-gray-500 text-sm">
                    <tr>
                        <th className="px-6 py-4 font-bold">Provider</th>
                        <th className="px-6 py-4 font-bold">Category</th>
                        <th className="px-6 py-4 font-bold">Documents</th>
                        <th className="px-6 py-4 font-bold">Status</th>
                        <th className="px-6 py-4 font-bold text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/50">
                    {providers.filter(p => !p.verified).map(provider => (
                        <tr key={provider.id} className="hover:bg-white/30">
                            <td className="px-6 py-4">
                                <div className="font-bold text-gray-900">{provider.name}</div>
                                <div className="text-xs text-gray-500 font-mono">{provider.email}</div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700 font-medium">{provider.serviceCategory}</td>
                            <td className="px-6 py-4">
                                <button className="text-teal-700 font-bold text-sm hover:underline flex items-center gap-1">
                                    <FileText size={14} /> View Docs
                                </button>
                            </td>
                            <td className="px-6 py-4">
                                <span className="px-3 py-1 bg-yellow-100/70 text-yellow-800 text-xs rounded-full font-bold">Pending</span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button 
                                    onClick={() => handleToggleVerification(provider.id)}
                                    className="text-green-600 hover:text-green-800 font-bold text-sm mr-4"
                                >
                                    Approve
                                </button>
                                <button className="text-red-600 hover:text-red-800 font-bold text-sm">
                                    Reject
                                </button>
                            </td>
                        </tr>
                    ))}
                    {providers.filter(p => !p.verified).length === 0 && (
                        <tr><td colSpan={5} className="p-8 text-center text-gray-500 font-medium">No pending verifications.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );

    const renderRatingsSection = () => (
        <div className="space-y-6">
            <div className={glassPanel}>
                <div className="p-6 border-b border-gray-200/50 bg-white/20">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <AlertTriangle className="text-red-500" size={24} />
                        Low Rated Entities (Risk Management)
                    </h2>
                    <p className="text-sm text-gray-500 font-medium">Monitor customers and providers with rating &lt; 3.0</p>
                </div>
                <div className="p-6 grid gap-6">
                    {/* Providers */}
                    <div>
                        <h3 className="font-bold text-gray-700 mb-3 ml-1">Providers At Risk</h3>
                        {providers.filter(p => p.rating < 3.0).map(p => (
                            <div key={p.id} className="flex items-center justify-between p-4 bg-red-50/70 rounded-xl mb-2 border border-red-100">
                                <div>
                                    <div className="font-bold text-gray-900">{p.name} ({p.serviceCategory})</div>
                                    <div className="text-sm text-red-700 font-medium">Rating: {p.rating.toFixed(1)} / 5.0</div>
                                </div>
                                <button 
                                    onClick={() => handleToggleBan(p.id, UserRole.PROVIDER)}
                                    className={`px-4 py-2 text-xs font-bold rounded-lg text-white shadow-sm transition-all ${p.isBanned ? 'bg-gray-500 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'}`}
                                >
                                    {p.isBanned ? 'Unban Provider' : 'Ban Provider'}
                                </button>
                            </div>
                        ))}
                    </div>
                    {/* Customers */}
                    <div>
                        <h3 className="font-bold text-gray-700 mb-3 ml-1">Customers At Risk</h3>
                        {customers.filter(c => (c.rating || 5) < 3.0).map(c => (
                            <div key={c.id} className="flex items-center justify-between p-4 bg-orange-50/70 rounded-xl mb-2 border border-orange-100">
                                <div>
                                    <div className="font-bold text-gray-900">{c.name}</div>
                                    <div className="text-sm text-orange-700 font-medium">Rating: {(c.rating || 5).toFixed(1)} / 5.0</div>
                                </div>
                                <button 
                                    onClick={() => handleToggleBan(c.id, UserRole.CUSTOMER)}
                                    className={`px-4 py-2 text-xs font-bold rounded-lg text-white shadow-sm transition-all ${c.isBanned ? 'bg-gray-500 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'}`}
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
            <div className={glassPanel + " p-8"}>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Service Category Management</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map(stat => (
                        <div key={stat.name} className="bg-white/40 p-5 rounded-2xl border border-white/50 shadow-sm">
                            <h3 className="font-bold text-gray-800 text-lg">{stat.name}</h3>
                            <div className="mt-4 flex justify-between items-end">
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase">Providers</p>
                                    <p className="text-3xl font-extrabold text-teal-700">{stat.count}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-gray-500 uppercase">Avg Rate</p>
                                    <p className="text-xl font-bold text-gray-900">${stat.avgPrice.toFixed(0)}</p>
                                </div>
                            </div>
                            <button className="mt-4 w-full py-2.5 text-xs font-bold text-gray-600 bg-white/70 border border-gray-200 rounded-xl hover:bg-white hover:shadow-sm transition-all">
                                Manage Rules
                            </button>
                        </div>
                    ))}
                </div>
                <div className="mt-8">
                    <h3 className="font-bold text-gray-900 mb-4">Pending Re-categorization Appeals</h3>
                    {tickets.filter(t => t.type === 'APPEAL' && t.status === 'OPEN').length > 0 ? (
                         <div className="p-5 bg-yellow-50/70 border border-yellow-200/50 rounded-xl text-sm font-medium text-yellow-800">
                             {tickets.filter(t => t.type === 'APPEAL' && t.status === 'OPEN').length} providers are requesting category changes.
                             Check Provider Support module.
                         </div>
                    ) : (
                        <p className="text-sm text-gray-500 font-medium">No active category appeals.</p>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <aside className={`w-64 flex-shrink-0 hidden md:flex flex-col ${darkGlassSidebar}`}>
                <div className="p-6">
                    <div className="flex items-center gap-3 font-bold text-xl">
                        <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">A</div>
                        Admin Portal
                    </div>
                    <div className="mt-3 text-[10px] text-gray-400 uppercase tracking-widest font-bold bg-white/10 px-2 py-1 rounded w-fit">
                        {role === AdminRole.SUPER_ADMIN ? 'Super Admin' : role.replace('_', ' ')}
                    </div>
                </div>
                
                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {canAccess('overview') && (
                        <button 
                            onClick={() => setActiveSection('overview')}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-medium ${activeSection === 'overview' ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/50' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}
                        >
                            <LayoutDashboard size={20} /> Dashboard
                        </button>
                    )}
                    
                    {canAccess('tickets_customer') && (
                        <button 
                            onClick={() => setActiveSection('tickets_customer')}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-medium ${activeSection === 'tickets_customer' ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/50' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}
                        >
                            <Ticket size={20} /> Cust. Support
                        </button>
                    )}

                    {canAccess('tickets_provider') && (
                        <button 
                            onClick={() => setActiveSection('tickets_provider')}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-medium ${activeSection === 'tickets_provider' ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/50' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}
                        >
                            <Users size={20} /> Prov. Support
                        </button>
                    )}

                    {canAccess('verification') && (
                        <button 
                            onClick={() => setActiveSection('verification')}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-medium ${activeSection === 'verification' ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/50' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}
                        >
                            <ShieldCheck size={20} /> Verification
                        </button>
                    )}
                     
                    {canAccess('categories') && (
                        <button 
                            onClick={() => setActiveSection('categories')}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-medium ${activeSection === 'categories' ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/50' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}
                        >
                            <Layers size={20} /> Categories
                        </button>
                    )}

                    {canAccess('ratings') && (
                        <button 
                            onClick={() => setActiveSection('ratings')}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-medium ${activeSection === 'ratings' ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/50' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}
                        >
                            <Ban size={20} /> Ratings & Bans
                        </button>
                    )}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <button onClick={onLogout} className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors text-sm font-medium">
                        <LogOut size={18} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8">
                    <header className="mb-8 flex justify-between items-center bg-white/40 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-white/40">
                        <div>
                            <h1 className="text-2xl font-extrabold text-gray-900">
                                {activeSection === 'overview' && 'System Overview'}
                                {activeSection === 'tickets_customer' && 'Customer Support'}
                                {activeSection === 'tickets_provider' && 'Provider Support'}
                                {activeSection === 'verification' && 'Verification Center'}
                                {activeSection === 'categories' && 'Category Management'}
                                {activeSection === 'ratings' && 'Quality & Ratings'}
                            </h1>
                            <p className="text-sm text-gray-500 font-medium mt-1">Managed by {admin.email}</p>
                        </div>
                    </header>

                    {activeSection === 'overview' && (
                        <div className="grid gap-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/50">
                                    <div className="text-sm font-bold text-gray-500 uppercase">Total Users</div>
                                    <div className="text-4xl font-extrabold text-gray-900 mt-2">{providers.length + customers.length}</div>
                                </div>
                                <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/50">
                                    <div className="text-sm font-bold text-gray-500 uppercase">Open Tickets</div>
                                    <div className="text-4xl font-extrabold text-orange-600 mt-2">{tickets.filter(t => t.status === 'OPEN').length}</div>
                                </div>
                                <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/50">
                                    <div className="text-sm font-bold text-gray-500 uppercase">Pending Verif.</div>
                                    <div className="text-4xl font-extrabold text-blue-600 mt-2">{providers.filter(p => !p.verified).length}</div>
                                </div>
                                <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/50">
                                    <div className="text-sm font-bold text-gray-500 uppercase">Banned</div>
                                    <div className="text-4xl font-extrabold text-red-600 mt-2">{providers.filter(p => p.isBanned).length + customers.filter(c => c.isBanned).length}</div>
                                </div>
                            </div>
                            {/* Super Admin sees everything below in summary */}
                            {role === AdminRole.SUPER_ADMIN && (
                                <div className="mt-8 p-12 bg-white/20 backdrop-blur-sm rounded-2xl text-center text-gray-500 border border-dashed border-gray-400">
                                    <p className="font-medium">Select a module from the sidebar to manage specific areas.</p>
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
