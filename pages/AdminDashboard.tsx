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

    const glassPanel = "glass-panel rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]";
    // Sidebar: Dark frosted glass
    const sidebarClass = "bg-slate-900/90 backdrop-blur-2xl text-white border-r border-white/10";

    // --- Render Sections ---

    const renderTicketSection = (filterType: 'CUSTOMER' | 'PROVIDER') => {
        const filteredTickets = tickets.filter(t => 
            filterType === 'CUSTOMER' 
            ? t.requesterRole === UserRole.CUSTOMER 
            : t.requesterRole === UserRole.PROVIDER
        );

        return (
            <div className={glassPanel}>
                <div className="p-6 border-b border-white/60 bg-white/40">
                    <h2 className="text-xl font-bold text-slate-900">
                        {filterType === 'CUSTOMER' ? 'Customer Incidents' : 'Provider Appeals & Reports'}
                    </h2>
                </div>
                <div className="divide-y divide-white/60">
                    {filteredTickets.length === 0 ? (
                        <div className="p-12 text-center text-slate-500 font-medium">No open tickets.</div>
                    ) : (
                        filteredTickets.map(ticket => (
                            <div key={ticket.id} className="p-6 hover:bg-white/40 transition-colors">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${ticket.type === 'INCIDENT' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
                                                {ticket.type}
                                            </span>
                                            <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${ticket.priority === 'HIGH' ? 'bg-orange-50 text-orange-700' : 'bg-slate-100 text-slate-600'}`}>
                                                {ticket.priority} Priority
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-slate-900 text-lg">{ticket.subject}</h3>
                                        <p className="text-sm text-slate-600 mt-2 font-medium">{ticket.description}</p>
                                        <div className="text-xs text-slate-400 mt-3 font-mono">ID: {ticket.requesterId} • {new Date(ticket.createdAt).toLocaleDateString()}</div>
                                    </div>
                                    {ticket.status === 'OPEN' ? (
                                        <button 
                                            onClick={() => handleResolveTicket(ticket.id)}
                                            className="px-5 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-full hover:bg-emerald-700 shadow-lg shadow-emerald-900/10 transition-all"
                                        >
                                            Mark Resolved
                                        </button>
                                    ) : (
                                        <span className="text-emerald-600 flex items-center gap-1 text-sm font-bold bg-emerald-50 px-3 py-1 rounded-full">
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
            <div className="p-6 border-b border-white/60 bg-white/40">
                <h2 className="text-xl font-bold text-slate-900">Verification Requests</h2>
                <p className="text-sm text-slate-500 font-medium">Review identity documents and licenses.</p>
            </div>
            <table className="w-full text-left">
                <thead className="bg-slate-50/80 text-slate-500 text-xs uppercase font-bold tracking-wider">
                    <tr>
                        <th className="px-6 py-4">Provider</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">Documents</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/60">
                    {providers.filter(p => !p.verified).map(provider => (
                        <tr key={provider.id} className="hover:bg-white/30 transition-colors">
                            <td className="px-6 py-4">
                                <div className="font-bold text-slate-900">{provider.name}</div>
                                <div className="text-xs text-slate-500 font-medium">{provider.email}</div>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-700 font-medium">{provider.serviceCategory}</td>
                            <td className="px-6 py-4">
                                <button className="text-blue-600 font-bold text-sm hover:underline flex items-center gap-1">
                                    <FileText size={14} /> View Files
                                </button>
                            </td>
                            <td className="px-6 py-4">
                                <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs rounded-full font-bold">Pending</span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button 
                                    onClick={() => handleToggleVerification(provider.id)}
                                    className="text-emerald-600 hover:text-emerald-800 font-bold text-sm mr-4"
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
                        <tr><td colSpan={5} className="p-12 text-center text-slate-500 font-medium">No pending verifications.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );

    const renderRatingsSection = () => (
        <div className="space-y-6">
            <div className={glassPanel}>
                <div className="p-6 border-b border-white/60 bg-white/40">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <AlertTriangle className="text-red-500" size={24} />
                        Risk Management
                    </h2>
                    <p className="text-sm text-slate-500 font-medium">Entities with rating &lt; 3.0</p>
                </div>
                <div className="p-6 grid gap-6">
                    {/* Providers */}
                    <div>
                        <h3 className="font-bold text-slate-700 mb-4 text-sm uppercase tracking-wide">Providers At Risk</h3>
                        {providers.filter(p => p.rating < 3.0).map(p => (
                            <div key={p.id} className="flex items-center justify-between p-4 bg-red-50/50 rounded-2xl mb-3 border border-red-100">
                                <div>
                                    <div className="font-bold text-slate-900">{p.name} <span className="text-slate-500 font-normal">({p.serviceCategory})</span></div>
                                    <div className="text-sm text-red-600 font-bold mt-1">Rating: {p.rating.toFixed(1)} / 5.0</div>
                                </div>
                                <button 
                                    onClick={() => handleToggleBan(p.id, UserRole.PROVIDER)}
                                    className={`px-5 py-2 text-xs font-bold rounded-full text-white shadow-sm transition-all ${p.isBanned ? 'bg-slate-500 hover:bg-slate-600' : 'bg-red-600 hover:bg-red-700'}`}
                                >
                                    {p.isBanned ? 'Unban Provider' : 'Ban Provider'}
                                </button>
                            </div>
                        ))}
                    </div>
                    {/* Customers */}
                    <div>
                        <h3 className="font-bold text-slate-700 mb-4 text-sm uppercase tracking-wide">Customers At Risk</h3>
                        {customers.filter(c => (c.rating || 5) < 3.0).map(c => (
                            <div key={c.id} className="flex items-center justify-between p-4 bg-orange-50/50 rounded-2xl mb-3 border border-orange-100">
                                <div>
                                    <div className="font-bold text-slate-900">{c.name}</div>
                                    <div className="text-sm text-orange-600 font-bold mt-1">Rating: {(c.rating || 5).toFixed(1)} / 5.0</div>
                                </div>
                                <button 
                                    onClick={() => handleToggleBan(c.id, UserRole.CUSTOMER)}
                                    className={`px-5 py-2 text-xs font-bold rounded-full text-white shadow-sm transition-all ${c.isBanned ? 'bg-slate-500 hover:bg-slate-600' : 'bg-red-600 hover:bg-red-700'}`}
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
                <h2 className="text-xl font-bold text-slate-900 mb-8">Service Categories</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map(stat => (
                        <div key={stat.name} className="bg-white/50 p-6 rounded-[1.5rem] border border-white/60 shadow-sm">
                            <h3 className="font-bold text-slate-800 text-lg">{stat.name}</h3>
                            <div className="mt-6 flex justify-between items-end">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Providers</p>
                                    <p className="text-3xl font-bold text-slate-900 mt-1">{stat.count}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Avg Rate</p>
                                    <p className="text-xl font-bold text-slate-700 mt-1">${stat.avgPrice.toFixed(0)}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <aside className={`w-72 flex-shrink-0 hidden md:flex flex-col ${sidebarClass}`}>
                <div className="p-8">
                    <div className="flex items-center gap-3 font-bold text-xl tracking-tight">
                        <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center border border-white/20">A</div>
                        Admin Portal
                    </div>
                    <div className="mt-4 text-[10px] text-slate-400 uppercase tracking-widest font-bold bg-white/5 px-3 py-1.5 rounded-full w-fit">
                        {role === AdminRole.SUPER_ADMIN ? 'Super Admin' : role.replace('_', ' ')}
                    </div>
                </div>
                
                <nav className="flex-1 px-4 space-y-1 mt-2">
                    {canAccess('overview') && (
                        <button 
                            onClick={() => setActiveSection('overview')}
                            className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl transition-all font-bold text-sm ${activeSection === 'overview' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                        >
                            <LayoutDashboard size={20} className="stroke-[2]" /> Dashboard
                        </button>
                    )}
                    
                    {canAccess('tickets_customer') && (
                        <button 
                            onClick={() => setActiveSection('tickets_customer')}
                            className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl transition-all font-bold text-sm ${activeSection === 'tickets_customer' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                        >
                            <Ticket size={20} className="stroke-[2]" /> Cust. Support
                        </button>
                    )}

                    {canAccess('tickets_provider') && (
                        <button 
                            onClick={() => setActiveSection('tickets_provider')}
                            className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl transition-all font-bold text-sm ${activeSection === 'tickets_provider' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                        >
                            <Users size={20} className="stroke-[2]" /> Prov. Support
                        </button>
                    )}

                    {canAccess('verification') && (
                        <button 
                            onClick={() => setActiveSection('verification')}
                            className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl transition-all font-bold text-sm ${activeSection === 'verification' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                        >
                            <ShieldCheck size={20} className="stroke-[2]" /> Verification
                        </button>
                    )}
                     
                    {canAccess('categories') && (
                        <button 
                            onClick={() => setActiveSection('categories')}
                            className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl transition-all font-bold text-sm ${activeSection === 'categories' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                        >
                            <Layers size={20} className="stroke-[2]" /> Categories
                        </button>
                    )}

                    {canAccess('ratings') && (
                        <button 
                            onClick={() => setActiveSection('ratings')}
                            className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl transition-all font-bold text-sm ${activeSection === 'ratings' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                        >
                            <Ban size={20} className="stroke-[2]" /> Ratings & Bans
                        </button>
                    )}
                </nav>

                <div className="p-6 border-t border-white/5">
                    <button onClick={onLogout} className="flex items-center gap-3 text-slate-400 hover:text-red-400 transition-colors text-sm font-bold w-full px-4 py-2">
                        <LogOut size={20} className="stroke-[2]" /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-10 max-w-7xl mx-auto">
                    <header className="mb-10 flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                                {activeSection === 'overview' && 'System Overview'}
                                {activeSection === 'tickets_customer' && 'Customer Support'}
                                {activeSection === 'tickets_provider' && 'Provider Support'}
                                {activeSection === 'verification' && 'Verification Center'}
                                {activeSection === 'categories' && 'Category Management'}
                                {activeSection === 'ratings' && 'Quality & Ratings'}
                            </h1>
                            <p className="text-slate-500 font-medium mt-1">Logged in as {admin.email}</p>
                        </div>
                    </header>

                    {activeSection === 'overview' && (
                        <div className="grid gap-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="glass-panel p-6">
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Total Users</div>
                                    <div className="text-4xl font-extrabold text-slate-900 mt-2">{providers.length + customers.length}</div>
                                </div>
                                <div className="glass-panel p-6">
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Open Tickets</div>
                                    <div className="text-4xl font-extrabold text-orange-500 mt-2">{tickets.filter(t => t.status === 'OPEN').length}</div>
                                </div>
                                <div className="glass-panel p-6">
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Pending Verif.</div>
                                    <div className="text-4xl font-extrabold text-blue-500 mt-2">{providers.filter(p => !p.verified).length}</div>
                                </div>
                                <div className="glass-panel p-6">
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Banned</div>
                                    <div className="text-4xl font-extrabold text-red-500 mt-2">{providers.filter(p => p.isBanned).length + customers.filter(c => c.isBanned).length}</div>
                                </div>
                            </div>
                            
                            {role === AdminRole.SUPER_ADMIN && (
                                <div className="mt-8 p-16 glass-panel text-center text-slate-500 border-2 border-dashed border-slate-200 shadow-none">
                                    <h3 className="text-lg font-bold text-slate-700">Admin Dashboard</h3>
                                    <p className="font-medium mt-2">Select a module from the sidebar to manage specific areas.</p>
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