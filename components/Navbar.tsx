
import React, { useState } from 'react';
import { UserRole } from '../types';
import { Menu, X, User as UserIcon, LogOut, LayoutDashboard, Search, CalendarCheck, HelpCircle, Settings } from 'lucide-react';

interface NavbarProps {
  user: { name: string; role: UserRole; avatar?: string } | null;
  onLogout: () => void;
  onNavigate: (path: string) => void;
  currentPath: string;
  onOpenSupport: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLogout, onNavigate, currentPath, onOpenSupport }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItemClass = (path: string) => `
    px-3 py-2 rounded-xl text-sm font-medium cursor-pointer transition-all duration-300
    ${currentPath === path 
      ? 'bg-teal-500/10 text-teal-800 shadow-inner' 
      : 'text-gray-600 hover:bg-white/40 hover:text-teal-700 hover:shadow-sm'}
  `;

  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-lg border-b border-white/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div 
              className="flex-shrink-0 flex items-center cursor-pointer group"
              onClick={() => onNavigate('/')}
            >
              <div className="h-9 w-9 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center mr-2 shadow-lg group-hover:scale-105 transition-transform">
                <span className="text-white font-bold text-xl drop-shadow-sm">S</span>
              </div>
              <span className="font-bold text-xl text-gray-800 tracking-tight">ServiceHub</span>
            </div>
            
            <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
              <span onClick={() => onNavigate('/')} className={navItemClass('/')}>
                Home
              </span>
              {user && user.role === UserRole.CUSTOMER && (
                 <span onClick={() => onNavigate('/search')} className={navItemClass('/search')}>
                 Find Services
               </span>
              )}
            </div>
          </div>

          <div className="hidden sm:flex sm:items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                 <button 
                    onClick={onOpenSupport}
                    className="p-2 text-gray-500 hover:text-teal-700 hover:bg-white/50 rounded-full transition-all flex items-center gap-1"
                    title="Support & Help"
                 >
                    <HelpCircle size={20} />
                    <span className="text-sm font-medium hidden lg:inline">Support</span>
                 </button>
                 
                 {user.role === UserRole.CUSTOMER && (
                    <span onClick={() => onNavigate('/bookings')} className={navItemClass('/bookings')}>
                        <div className="flex items-center gap-1">
                        <CalendarCheck size={16} />
                        <span>My Bookings</span>
                        </div>
                    </span>
                 )}

                <div className="flex items-center gap-2 pl-4 border-l border-gray-300/50">
                  <div className="relative">
                    <img 
                        src={user.avatar || "https://via.placeholder.com/32"} 
                        alt="Avatar" 
                        className="h-9 w-9 rounded-full border-2 border-white shadow-md"
                    />
                    <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-400 border-2 border-white rounded-full"></div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-800">{user.name}</span>
                    <span className="text-[10px] text-teal-600 font-semibold uppercase tracking-wider">{user.role.toLowerCase()}</span>
                  </div>
                  
                  {user.role === UserRole.CUSTOMER && (
                      <button 
                        onClick={() => onNavigate('/profile')}
                        className="ml-2 p-2 text-gray-500 hover:text-teal-600 hover:bg-white/50 rounded-full transition-all"
                        title="My Profile"
                      >
                        <Settings size={18} />
                      </button>
                  )}

                  <button 
                    onClick={onLogout}
                    className="ml-1 p-2 text-gray-500 hover:text-red-600 hover:bg-red-50/50 rounded-full transition-all"
                    title="Sign Out"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => onNavigate('/login')}
                  className="text-gray-600 hover:text-teal-700 hover:bg-white/40 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                >
                  Log In
                </button>
                <button 
                  onClick={() => onNavigate('/register')}
                  className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:shadow-lg hover:scale-105 transition-all duration-300 shadow-md border border-white/20"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-white/50"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="sm:hidden bg-white/90 backdrop-blur-xl border-t border-white/20 absolute w-full shadow-lg">
          <div className="pt-2 pb-3 space-y-1 px-4">
            <div 
              className="block px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-teal-50/50"
              onClick={() => { onNavigate('/'); setIsOpen(false); }}
            >
              Home
            </div>
            {user && user.role === UserRole.CUSTOMER && (
               <div 
               className="block px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-teal-50/50"
               onClick={() => { onNavigate('/search'); setIsOpen(false); }}
             >
               Find Services
             </div>
            )}
            {user && (
              <div 
                className="block px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-teal-50/50"
                onClick={() => { onNavigate('/bookings'); setIsOpen(false); }}
              >
                My Bookings
              </div>
            )}
            {user && user.role === UserRole.CUSTOMER && (
              <div 
                className="block px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-teal-50/50 flex items-center gap-2"
                onClick={() => { onNavigate('/profile'); setIsOpen(false); }}
              >
                 <Settings size={16} /> My Profile
              </div>
            )}
            {user && (
                <div 
                    className="block px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-teal-50/50 flex items-center gap-2"
                    onClick={() => { onOpenSupport(); setIsOpen(false); }}
                >
                    <HelpCircle size={16} /> Support & Help
                </div>
            )}
            {!user && (
              <>
                <div 
                  className="block px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-teal-50/50"
                  onClick={() => { onNavigate('/login'); setIsOpen(false); }}
                >
                  Log In
                </div>
                <div 
                  className="block px-3 py-3 rounded-lg text-base font-medium text-teal-600 hover:bg-teal-50/50"
                  onClick={() => { onNavigate('/register'); setIsOpen(false); }}
                >
                  Sign Up
                </div>
              </>
            )}
             {user && (
               <div 
                  className="block px-3 py-3 rounded-lg text-base font-medium text-red-600 hover:bg-red-50/50"
                  onClick={() => { onLogout(); setIsOpen(false); }}
                >
                  Sign Out
                </div>
             )}
          </div>
        </div>
      )}
    </nav>
  );
};
