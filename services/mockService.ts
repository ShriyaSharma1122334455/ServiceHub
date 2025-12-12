
import { Booking, BookingStatus, Provider, User, UserRole, ServiceCategory, SupportTicket, AdminRole, VerificationDocument } from '../types';
import { MOCK_PROVIDERS, MOCK_TICKETS } from '../constants';

const API_URL = 'http://localhost:8000';

export const api = {
  // --- AUTHENTICATION ---
  login: async (email: string, role?: UserRole, password?: string): Promise<User | Provider> => {
    const formData = new URLSearchParams();
    formData.append('username', email); // FastAPI OAuth2 expects 'username'
    formData.append('password', password || '');

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData
        });

        if (!response.ok) {
             const err = await response.json();
             throw new Error(err.detail || 'Login failed');
        }

        const data = await response.json();
        localStorage.setItem('token', data.access_token);
        
        // Return structured user object
        const userData = data.user;
        
        // If provider, we might need more details, but for login basics this is enough
        // The /providers endpoint enriches this usually
        return {
            ...userData,
            role: userData.role as UserRole
        };
    } catch (error) {
        console.error("Login API Error", error);
        throw error;
    }
  },

  checkUserExists: async (email: string): Promise<boolean> => {
      // Not implemented in this basic API yet
      return false; 
  },

  // --- USERS ---
  updateUser: async (userId: string, updates: Partial<User>): Promise<User> => {
      // Placeholder for real patch endpoint
      return { id: userId, ...updates } as User;
  },

  // --- PROVIDERS ---
  searchProviders: async (category?: ServiceCategory, maxDistance?: number): Promise<Provider[]> => {
      try {
          let url = `${API_URL}/providers`;
          if (category && category !== 'All' as any) { // Type casting for 'All' from UI
            url += `?category=${category}`;
          }
          
          const response = await fetch(url);
          if (!response.ok) throw new Error("Failed to fetch providers");
          return await response.json();
      } catch (e) {
          console.warn("API unavailable, using mock fallback for demo");
          return MOCK_PROVIDERS;
      }
  },

  getProviderById: async (id: string): Promise<Provider | undefined> => {
      // In real app, fetch /providers/{id}
      // For now, reuse search or mock
      const all = await api.searchProviders();
      return all.find(p => p.id === id);
  },

  updateProviderProfile: async (providerId: string, updates: Partial<Provider>): Promise<Provider> => {
      // Placeholder
      return { id: providerId, ...updates } as Provider;
  },

  uploadProviderDocument: async (providerId: string, docType: string, fileName: string): Promise<VerificationDocument> => {
      return {
          id: 'doc-new',
          name: fileName,
          type: docType as any,
          url: '#',
          status: 'PENDING',
          uploadedAt: new Date().toISOString()
      };
  },

  toggleProviderVerification: async (providerId: string): Promise<void> => {},
  toggleUserBan: async (userId: string, role: UserRole): Promise<void> => {},

  getAllProviders: async (): Promise<Provider[]> => {
      return api.searchProviders();
  },

  getAllCustomers: async (): Promise<User[]> => {
      return []; // Implement /users endpoint restricted to admin
  },

  // --- BOOKINGS ---
  createBooking: async (bookingData: any): Promise<Booking> => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/bookings`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(bookingData)
      });
      
      if (!response.ok) throw new Error("Booking failed");
      return await response.json();
  },

  getBookings: async (userId: string, role: UserRole): Promise<Booking[]> => {
      const token = localStorage.getItem('token');
      if (!token) return [];

      try {
        const response = await fetch(`${API_URL}/bookings`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) return [];
        return await response.json();
      } catch (e) {
          return [];
      }
  },

  // --- TICKETS ---
  getTickets: async (): Promise<SupportTicket[]> => {
      return MOCK_TICKETS; // Implement /tickets endpoint
  },

  createTicket: async (ticket: any): Promise<SupportTicket> => {
      return { ...ticket, id: 't-new', status: 'OPEN', createdAt: new Date().toISOString() };
  },

  resolveTicket: async (ticketId: string): Promise<void> => {}
};
