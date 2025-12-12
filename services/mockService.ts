import { Booking, BookingStatus, Provider, User, UserRole, ServiceCategory, SupportTicket, AdminRole, VerificationDocument } from '../types';
import { MOCK_PROVIDERS, MOCK_TICKETS, ADMIN_CREDENTIALS } from '../constants';

const API_URL = 'http://localhost:8000';

export const api = {
  // --- AUTHENTICATION ---
  login: async (email: string, role?: UserRole, password?: string): Promise<User | Provider> => {
    // Try real API first
    try {
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password || '');

        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData
        });

        if (!response.ok) {
             throw new Error('Connection failed'); // Trigger fallback
        }

        const data = await response.json();
        localStorage.setItem('token', data.access_token);
        return { ...data.user, role: data.user.role as UserRole };

    } catch (error) {
        console.warn("Backend unavailable, using Mock Login logic.");
        
        // MOCK FALLBACK LOGIC
        
        // 1. Check Admin
        const admin = ADMIN_CREDENTIALS.find(a => a.email === email);
        if (admin) {
            return {
                id: 'admin-1',
                name: admin.name,
                email: admin.email,
                role: UserRole.ADMIN,
                adminRole: admin.role
            };
        }

        // 2. Check Providers
        const provider = MOCK_PROVIDERS.find(p => p.email === email);
        if (provider) return provider;

        // 3. Default Customer
        return {
            id: 'u1',
            name: 'Demo Customer',
            email: email,
            role: UserRole.CUSTOMER,
            phone: '555-0123',
            address: '123 Glass St, Tech City',
            avatar: 'https://ui-avatars.com/api/?name=Demo+Customer&background=0D8ABC&color=fff'
        };
    }
  },

  checkUserExists: async (email: string): Promise<boolean> => {
      // Mock check
      return email.includes('@'); 
  },

  // --- USERS ---
  updateUser: async (userId: string, updates: Partial<User>): Promise<User> => {
      return { id: userId, ...updates } as User;
  },

  // --- PROVIDERS ---
  searchProviders: async (category?: ServiceCategory, maxDistance?: number): Promise<Provider[]> => {
      // Simulate API delay for realism
      await new Promise(resolve => setTimeout(resolve, 600));

      try {
          // Attempt fetch but usually fail in demo
          const response = await fetch(`${API_URL}/providers`);
          if (!response.ok) throw new Error();
          return await response.json();
      } catch (e) {
          let results = [...MOCK_PROVIDERS];
          if (category && category !== 'All' as any) {
              results = results.filter(p => p.serviceCategory === category);
          }
          // Simulate simple distance filter
          if (maxDistance) {
              results = results.filter(p => p.distanceKm <= maxDistance);
          }
          return results;
      }
  },

  getProviderById: async (id: string): Promise<Provider | undefined> => {
      const all = await api.searchProviders();
      return all.find(p => p.id === id);
  },

  updateProviderProfile: async (providerId: string, updates: Partial<Provider>): Promise<Provider> => {
      return { id: providerId, ...updates } as Provider;
  },

  // --- BACKGROUND CHECKS (Automated API Integration Simulation) ---
  initiateBackgroundCheck: async (providerId: string) => {
      // Simulate API call to Checkr or similar
      return { checkId: 'bkc_12345', status: 'PROCESSING' };
  },

  uploadProviderDocument: async (providerId: string, docType: string, fileName: string): Promise<VerificationDocument> => {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      return {
          id: `doc-${Date.now()}`,
          name: fileName,
          type: docType as any,
          url: '#',
          status: 'PENDING', // In a real app, 'APPROVED' might come via webhook
          uploadedAt: new Date().toISOString()
      };
  },

  toggleProviderVerification: async (providerId: string): Promise<void> => {},
  toggleUserBan: async (userId: string, role: UserRole): Promise<void> => {},

  getAllProviders: async (): Promise<Provider[]> => {
      return MOCK_PROVIDERS;
  },

  getAllCustomers: async (): Promise<User[]> => {
      return [];
  },

  // --- BOOKINGS & PAYMENTS ---
  getDynamicPricingMultiplier: async (serviceCategory: ServiceCategory, time: string): Promise<number> => {
     // Mock Logic: Surge pricing between 5PM (17:00) and 8PM (20:00)
     const hour = parseInt(time.split(':')[0]);
     if (hour >= 17 && hour <= 20) return 1.25; // 1.25x surge
     return 1.0;
  },

  createBooking: async (bookingData: any): Promise<Booking> => {
      // Simulate Stripe Payment Processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      return {
          id: `bk-${Date.now()}`,
          ...bookingData,
          status: BookingStatus.REQUESTED,
          createdAt: new Date().toISOString(),
          totalPrice: bookingData.totalPrice || 0
      };
  },

  getBookings: async (userId: string, role: UserRole): Promise<Booking[]> => {
      // Simulate bookings
      const now = new Date();
      return [
          {
              id: 'b1',
              customerId: 'u1',
              providerId: 'p1',
              providerName: 'Sarah Jenkins',
              serviceCategory: ServiceCategory.CLEANING,
              bookingType: 'STANDARD',
              date: new Date(now.setDate(now.getDate() - 2)).toISOString(),
              time: '10:00',
              durationHours: 3,
              totalPrice: 90,
              status: BookingStatus.COMPLETED,
              createdAt: '2023-01-01'
          },
          {
              id: 'b2',
              customerId: 'u1',
              providerId: 'p2',
              providerName: 'Mike Ross',
              serviceCategory: ServiceCategory.PLUMBING,
              bookingType: 'STANDARD',
              date: new Date(now.setDate(now.getDate() + 5)).toISOString(),
              time: '14:00',
              durationHours: 1,
              totalPrice: 85,
              status: BookingStatus.REQUESTED,
              createdAt: '2023-01-05'
          },
          {
              id: 'b3',
              customerId: 'u3',
              providerId: 'p2',
              providerName: 'Mike Ross',
              serviceCategory: ServiceCategory.PLUMBING,
              bookingType: 'STANDARD',
              date: new Date(now.setDate(now.getDate() + 1)).toISOString(),
              time: '09:00',
              durationHours: 2,
              totalPrice: 170,
              status: BookingStatus.ACCEPTED,
              createdAt: '2023-01-06'
          }
      ];
  },

  updateBookingStatus: async (bookingId: string, status: BookingStatus): Promise<void> => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      return;
  },

  // --- ANALYTICS (Data Visualization Support) ---
  getProviderAnalytics: async (providerId: string) => {
      return {
          revenue: [450, 800, 650, 1200, 950, 1500], // Last 6 months
          months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          totalBookings: 45,
          repeatCustomers: 12,
          profileViews: 340
      };
  },

  // --- TICKETS ---
  getTickets: async (): Promise<SupportTicket[]> => {
      return MOCK_TICKETS; 
  },

  createTicket: async (ticket: any): Promise<SupportTicket> => {
      return { ...ticket, id: 't-new', status: 'OPEN', createdAt: new Date().toISOString() };
  },

  resolveTicket: async (ticketId: string): Promise<void> => {}
};