
import { Booking, BookingStatus, Provider, User, UserRole, ServiceCategory, SupportTicket, AdminRole, VerificationDocument } from '../types';
import { MOCK_PROVIDERS, COMMISSION_RATE, MOCK_TICKETS, ADMIN_CREDENTIALS } from '../constants';

const API_URL = 'http://localhost:8000';

// --- Helper for Real API Calls ---
async function apiCall(endpoint: string, method: string = 'GET', body?: any) {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    const token = localStorage.getItem('token');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
        });
        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.warn(`Backend call to ${endpoint} failed. Falling back to mock data if available.`);
        throw error;
    }
}

// --- Legacy Mock Data (Fallback) ---
let bookings: Booking[] = [
  {
    id: 'b-init-1',
    customerId: 'u1',
    providerId: 'p1',
    providerName: 'Sarah Jenkins',
    serviceCategory: ServiceCategory.CLEANING,
    bookingType: 'STANDARD',
    date: '2023-11-01',
    time: '10:00',
    durationHours: 3,
    totalPrice: 103.5,
    status: BookingStatus.COMPLETED,
    createdAt: new Date().toISOString()
  }
];

let providers: Provider[] = MOCK_PROVIDERS.map(p => ({
    ...p,
    verificationDocuments: [],
    phone: '555-0123',
    address: '123 Provider Lane'
}));

let tickets = [...MOCK_TICKETS];
let customers: User[] = [
    { id: 'u1', name: 'Alice Johnson', email: 'alice@test.com', role: UserRole.CUSTOMER, rating: 4.8, isBanned: false, avatar: 'https://picsum.photos/200?random=10', phone: '555-0101', address: '123 Main St, Springfield' },
    { id: 'u2', name: 'Bob Smith', email: 'bob@test.com', role: UserRole.CUSTOMER, rating: 2.2, isBanned: false, avatar: 'https://picsum.photos/200?random=11', phone: '555-0102', address: '456 Oak Ave, Metropolis' } 
];

export const api = {
  login: async (email: string, role?: UserRole, password?: string): Promise<User | Provider> => {
    // 1. Try Real Backend First
    try {
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password || '');

        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.access_token);
            // If it's a new user, register them in our mock state to keep UI working for other features
            if (data.user.role === UserRole.PROVIDER) {
                if (!providers.find(p => p.email === email)) {
                     // Sync mock
                     providers.push({ ...data.user, services: [], teamMembers: [], verificationDocuments: [] } as Provider);
                }
            }
            return data.user;
        }
    } catch (e) {
        console.warn("Real backend login failed, using mock fallback.");
    }

    // 2. Mock Fallback
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Admin Login
        const adminAccount = ADMIN_CREDENTIALS.find(c => c.email === email && c.password === password);
        if (adminAccount) {
            resolve({
                id: 'admin-01',
                name: adminAccount.name,
                email: adminAccount.email,
                role: UserRole.ADMIN,
                adminRole: adminAccount.role,
                avatar: 'https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff'
            });
            return;
        }

        // Provider Login
        const existingProvider = providers.find(p => p.email === email);
        if (existingProvider && (role === UserRole.PROVIDER || !role)) {
            resolve(existingProvider);
            return;
        }
        
        // Auto-Register Mock Provider
        if (role === UserRole.PROVIDER) {
             const newProvider: Provider = {
                id: `p-${Date.now()}`,
                name: email.split('@')[0],
                email,
                role: UserRole.PROVIDER,
                serviceCategory: ServiceCategory.CLEANING,
                hourlyRate: 50,
                services: [
                    { category: ServiceCategory.CLEANING, price: 50, description: 'Standard Service' }
                ],
                teamMembers: [],
                verificationDocuments: [],
                rating: 0,
                reviewCount: 0,
                distanceKm: 1,
                verified: false,
                bio: 'New service provider.',
                avatar: `https://picsum.photos/200/200?random=${Math.floor(Math.random() * 100)}`,
                availabilityStatus: 'AVAILABLE',
                isBanned: false
            };
            providers.push(newProvider);
            resolve(newProvider);
            return;
        }

        // Customer Login
        const existingCustomer = customers.find(c => c.email === email);
        if (existingCustomer) {
            resolve(existingCustomer);
            return;
        }

        // Auto-Register Mock Customer
        const newCustomer = {
          id: `u-${Date.now()}`,
          name: email.split('@')[0],
          email,
          role: UserRole.CUSTOMER,
          avatar: `https://picsum.photos/200/200?random=${Math.floor(Math.random() * 100)}`,
          rating: 5.0,
          isBanned: false,
          phone: '',
          address: ''
        };
        customers.push(newCustomer);
        resolve(newCustomer);
      }, 800);
    });
  },

  updateUser: async (userId: string, updates: Partial<User>): Promise<User> => {
      // Try Real Backend
      try {
           // Assume we have an endpoint for this
           // return await apiCall(`/users/${userId}`, 'PATCH', updates);
      } catch(e) {}

      return new Promise((resolve) => {
          setTimeout(() => {
              const customerIndex = customers.findIndex(c => c.id === userId);
              if (customerIndex !== -1) {
                  customers[customerIndex] = { ...customers[customerIndex], ...updates };
                  resolve(customers[customerIndex]);
                  return;
              }
              const providerIndex = providers.findIndex(p => p.id === userId);
              if (providerIndex !== -1) {
                  providers[providerIndex] = { ...providers[providerIndex], ...updates } as Provider;
                  resolve(providers[providerIndex]);
                  return;
              }
              throw new Error("User not found");
          }, 500);
      });
  },

  searchProviders: async (
    category?: ServiceCategory,
    maxDistance?: number
  ): Promise<Provider[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let results = providers.filter(p => !p.isBanned && p.verified);
        if (category) {
          results = results.filter(p => p.services.some(s => s.category === category) || p.serviceCategory === category);
        }
        if (maxDistance) {
          results = results.filter(p => p.distanceKm <= maxDistance);
        }
        resolve(results);
      }, 600);
    });
  },

  getProviderById: async (id: string): Promise<Provider | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(providers.find(p => p.id === id)), 300);
    });
  },

  createBooking: async (bookingData: Omit<Booking, 'id' | 'status' | 'createdAt' | 'totalPrice' | 'bookingType'> & { bookingType?: 'STANDARD' | 'CONSULTATION' }): Promise<Booking> => {
    return new Promise((resolve) => {
      const providerIndex = providers.findIndex(p => p.id === bookingData.providerId);
      const provider = providers[providerIndex];
      
      const serviceOffering = provider?.services.find(s => s.category === bookingData.serviceCategory);
      const hourlyRate = serviceOffering ? serviceOffering.price : (provider?.hourlyRate || 0);

      const basePrice = hourlyRate * bookingData.durationHours;
      const totalPrice = basePrice + (basePrice * COMMISSION_RATE);

      const newBooking: Booking = {
        ...bookingData,
        bookingType: bookingData.bookingType || 'STANDARD',
        id: `b-${Date.now()}`,
        status: BookingStatus.REQUESTED,
        createdAt: new Date().toISOString(),
        totalPrice
      };
      
      bookings = [newBooking, ...bookings];

      if (provider) {
          const updatedProvider = { ...provider, availabilityStatus: 'BUSY' as const };
          providers[providerIndex] = updatedProvider;
      }

      setTimeout(() => resolve(newBooking), 1000);
    });
  },

  getBookings: async (userId: string, role: UserRole): Promise<Booking[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (role === UserRole.PROVIDER) {
          resolve(bookings.filter(b => b.providerId === userId));
        } else {
          resolve(bookings.filter(b => b.customerId === userId));
        }
      }, 500);
    });
  },

  updateProviderProfile: async (providerId: string, updates: Partial<Provider>): Promise<Provider> => {
      return new Promise((resolve) => {
          setTimeout(() => {
            const index = providers.findIndex(p => p.id === providerId);
            if (index !== -1) {
                providers[index] = { ...providers[index], ...updates };
                resolve(providers[index]);
            } else {
                throw new Error("Provider not found");
            }
          }, 300);
      });
  },

  uploadProviderDocument: async (providerId: string, docType: 'ID' | 'LICENSE' | 'INSURANCE' | 'OTHER', fileName: string): Promise<VerificationDocument> => {
      return new Promise(resolve => {
          setTimeout(() => {
            const index = providers.findIndex(p => p.id === providerId);
            if (index !== -1) {
                const newDoc: VerificationDocument = {
                    id: `doc-${Date.now()}`,
                    name: fileName,
                    type: docType,
                    url: '#', // Mock URL
                    status: 'PENDING',
                    uploadedAt: new Date().toISOString()
                };
                providers[index] = {
                    ...providers[index],
                    verificationDocuments: [...(providers[index].verificationDocuments || []), newDoc]
                };
                resolve(newDoc);
            }
          }, 800);
      });
  },

  checkUserExists: async (email: string): Promise<boolean> => {
      return new Promise(resolve => setTimeout(() => resolve(true), 500)); 
  },

  getTickets: async (): Promise<SupportTicket[]> => {
      return new Promise(resolve => setTimeout(() => resolve(tickets), 400));
  },

  createTicket: async (ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'status'>): Promise<SupportTicket> => {
      return new Promise(resolve => {
          const newTicket: SupportTicket = {
              ...ticket,
              id: `t-${Date.now()}`,
              status: 'OPEN',
              createdAt: new Date().toISOString()
          };
          tickets = [newTicket, ...tickets];
          setTimeout(() => resolve(newTicket), 500);
      });
  },

  resolveTicket: async (ticketId: string): Promise<void> => {
      return new Promise(resolve => {
          tickets = tickets.map(t => t.id === ticketId ? { ...t, status: 'RESOLVED' } : t);
          setTimeout(resolve, 300);
      });
  },

  getAllProviders: async (): Promise<Provider[]> => {
      return new Promise(resolve => setTimeout(() => resolve(providers), 400));
  },
  
  getAllCustomers: async (): Promise<User[]> => {
      return new Promise(resolve => setTimeout(() => resolve(customers), 400));
  },

  toggleProviderVerification: async (providerId: string): Promise<void> => {
      return new Promise(resolve => {
          const idx = providers.findIndex(p => p.id === providerId);
          if (idx !== -1) {
              providers[idx] = { ...providers[idx], verified: !providers[idx].verified };
          }
          setTimeout(resolve, 300);
      });
  },

  toggleUserBan: async (userId: string, role: UserRole): Promise<void> => {
      return new Promise(resolve => {
          if (role === UserRole.PROVIDER) {
            const idx = providers.findIndex(p => p.id === userId);
            if (idx !== -1) providers[idx] = { ...providers[idx], isBanned: !providers[idx].isBanned };
          } else {
            const idx = customers.findIndex(c => c.id === userId);
            if (idx !== -1) customers[idx] = { ...customers[idx], isBanned: !customers[idx].isBanned };
          }
          setTimeout(resolve, 300);
      });
  }
};
