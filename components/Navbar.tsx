
import React, { useState } from 'react';
import { UserRole } from '../types';
import { Menu, X, User as UserIcon, LogOut, LayoutDashboard, Search, CalendarCheck, HelpCircle } from 'lucide-react';

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
    px-3 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors
    ${currentPath === path 
      ? 'bg-indigo-100 text-indigo-700' 
      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
  `;

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div 
              className="flex-shrink-0 flex items-center cursor-pointer"
              onClick={() => onNavigate('/')}
            >
              <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-2">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="font-bold text-xl text-gray-900 tracking-tight">ServiceHub</span>
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
                    className="p-2 text-gray-400 hover:text-indigo-600 transition-colors flex items-center gap-1"
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

                <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
                  <img 
                    src={user.avatar || "https://via.placeholder.com/32"} 
                    alt="Avatar" 
                    className="h-8 w-8 rounded-full border border-gray-200"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">{user.name}</span>
                    <span className="text-xs text-gray-500 capitalize">{user.role.toLowerCase()}</span>
                  </div>
                  <button 
                    onClick={onLogout}
                    className="ml-2 p-1 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => onNavigate('/login')}
                  className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Log In
                </button>
                <button 
                  onClick={() => onNavigate('/register')}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
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
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="sm:hidden bg-white border-t border-gray-200">
          <div className="pt-2 pb-3 space-y-1 px-2">
            <div 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
              onClick={() => { onNavigate('/'); setIsOpen(false); }}
            >
              Home
            </div>
            {user && user.role === UserRole.CUSTOMER && (
               <div 
               className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
               onClick={() => { onNavigate('/search'); setIsOpen(false); }}
             >
               Find Services
             </div>
            )}
            {user && (
              <div 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => { onNavigate('/bookings'); setIsOpen(false); }}
              >
                My Bookings
              </div>
            )}
            {user && (
                <div 
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    onClick={() => { onOpenSupport(); setIsOpen(false); }}
                >
                    <HelpCircle size={16} /> Support & Help
                </div>
            )}
            {!user && (
              <>
                <div 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => { onNavigate('/login'); setIsOpen(false); }}
                >
                  Log In
                </div>
                <div 
                  className="block px-3 py-2 rounded-md text-base font-medium text-indigo-600 hover:bg-indigo-50"
                  onClick={() => { onNavigate('/register'); setIsOpen(false); }}
                >
                  Sign Up
                </div>
              </>
            )}
             {user && (
               <div 
                  className="block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
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
