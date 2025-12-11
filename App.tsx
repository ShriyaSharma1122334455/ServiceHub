
import React, { useState, useEffect } from 'react';
import { User, UserRole, Provider } from './types';
import { api } from './services/mockService';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ProviderSearch } from './pages/ProviderSearch';
import { BookingPage } from './pages/BookingPage';
import { MyBookings } from './pages/MyBookings';
import { ProviderDashboard } from './pages/ProviderDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { SupportModal } from './components/SupportModal';
import { CustomerProfile } from './pages/CustomerProfile';

// Simple HashRouter implementation to satisfy constraint 5
const Router = ({ 
  routes, 
  currentPath 
}: { 
  routes: Record<string, React.ReactNode>, 
  currentPath: string 
}) => {
  return <>{routes[currentPath] || routes['/']}</>;
};

const App = () => {
  const [user, setUser] = useState<User | Provider | null>(null);
  const [currentPath, setCurrentPath] = useState('/');
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  // Handle Hash Navigation
  useEffect(() => {
    const handleHashChange = () => {
      const path = window.location.hash.replace('#', '') || '/';
      setCurrentPath(path);
    };
    
    // Set initial
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (path: string) => {
    window.location.hash = path;
  };

  const handleLogin = async (email: string, role: UserRole, password?: string) => {
    const loggedUser = await api.login(email, role, password);
    setUser(loggedUser);
    
    if (loggedUser.role === UserRole.ADMIN) {
        navigate('/admin');
    } else if (loggedUser.role === UserRole.CUSTOMER) {
        navigate('/search');
    } else {
        navigate('/dashboard');
    }
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  const handleBookProvider = (provider: Provider) => {
    if (!user) {
        navigate('/login');
        return;
    }
    setSelectedProvider(provider);
    navigate('/book');
  };

  const routes: Record<string, React.ReactNode> = {
    '/': <Home onNavigate={navigate} isLoggedIn={!!user} />,
    '/login': <Login onLogin={handleLogin} onRegisterClick={() => navigate('/register')} />,
    '/register': <Register onRegister={handleLogin} onLoginClick={() => navigate('/login')} />,
    '/search': (
      user && user.role === UserRole.CUSTOMER 
        ? <ProviderSearch onBook={handleBookProvider} /> 
        : <Home onNavigate={navigate} isLoggedIn={!!user} /> // Protected
    ),
    '/book': (
        user && selectedProvider 
        ? <BookingPage 
            provider={selectedProvider} 
            customerId={user.id} 
            onCancel={() => navigate('/search')}
            onSuccess={() => navigate('/bookings')}
          />
        : <Home onNavigate={navigate} isLoggedIn={!!user} />
    ),
    '/bookings': (
        user && user.role === UserRole.CUSTOMER
        ? <MyBookings userId={user.id} />
        : <Login onLogin={handleLogin} onRegisterClick={() => navigate('/register')} />
    ),
    '/profile': (
        user && user.role === UserRole.CUSTOMER
        ? <CustomerProfile user={user} />
        : <Login onLogin={handleLogin} onRegisterClick={() => navigate('/register')} />
    ),
    '/dashboard': (
        user && user.role === UserRole.PROVIDER
        ? <ProviderDashboard 
            provider={user as Provider} 
            onLogout={handleLogout} 
            onOpenSupport={() => setIsSupportOpen(true)}
          />
        : <Login onLogin={handleLogin} onRegisterClick={() => navigate('/register')} />
    ),
    '/admin': (
        user && user.role === UserRole.ADMIN
        ? <AdminDashboard admin={user} onLogout={handleLogout} />
        : <Login onLogin={handleLogin} onRegisterClick={() => navigate('/register')} />
    )
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar 
        user={user} 
        onLogout={handleLogout} 
        onNavigate={navigate} 
        currentPath={currentPath}
        onOpenSupport={() => setIsSupportOpen(true)}
      />
      <Router routes={routes} currentPath={currentPath} />
      
      {/* Global Support Modal */}
      {user && (
          <SupportModal 
            isOpen={isSupportOpen} 
            onClose={() => setIsSupportOpen(false)} 
            userId={user.id}
            userRole={user.role}
          />
      )}
    </div>
  );
};

export default App;
