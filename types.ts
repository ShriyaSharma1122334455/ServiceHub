
export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  PROVIDER = 'PROVIDER',
  ADMIN = 'ADMIN'
}

export enum AdminRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  CUSTOMER_SUPPORT = 'CUSTOMER_SUPPORT', // Requester Support
  PROVIDER_SUPPORT = 'PROVIDER_SUPPORT', // Provider Support
  VERIFICATION = 'VERIFICATION',         // Security/Complaint/Verification
  CATEGORY_MANAGER = 'CATEGORY_MANAGER', // Category Managers
  CUSTOMER_REVIEWER = 'CUSTOMER_REVIEWER' // Customer Reviewer (Ratings)
}

export enum ServiceCategory {
  CLEANING = 'Cleaning',
  PLUMBING = 'Plumbing',
  ELECTRICAL = 'Electrical',
  INTERIOR_DESIGN = 'Interior Design'
}

export enum BookingStatus {
  REQUESTED = 'REQUESTED',
  ACCEPTED = 'ACCEPTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  address?: string;
  adminRole?: AdminRole; // Optional sub-role for admins
  avatar?: string;
  rating?: number; // Customers can now be rated
  isBanned?: boolean;
}

export interface ServiceOffering {
  category: ServiceCategory;
  price: number;
  description: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: 'ACTIVE' | 'PENDING';
}

export interface VerificationDocument {
  id: string;
  name: string;
  type: 'ID' | 'LICENSE' | 'INSURANCE' | 'OTHER';
  url: string; // Mock URL
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  uploadedAt: string;
}

export interface Provider extends User {
  role: UserRole.PROVIDER;
  // Deprecated single category/rate in favor of services array, kept for backward comp. if needed temporarily
  serviceCategory: ServiceCategory; 
  hourlyRate: number; 
  
  services: ServiceOffering[];
  teamMembers: TeamMember[];
  verificationDocuments: VerificationDocument[];
  
  rating: number;
  reviewCount: number;
  distanceKm: number;
  verified: boolean;
  bio: string;
  
  availabilityStatus: 'AVAILABLE' | 'BUSY' | 'OFF_DUTY';
  isBanned: boolean;
}

export interface Booking {
  id: string;
  customerId: string;
  providerId: string;
  providerName: string;
  serviceCategory: ServiceCategory;
  bookingType: 'STANDARD' | 'CONSULTATION'; // New field for Architects
  date: string; // ISO Date
  time: string; // "14:00"
  durationHours: number;
  totalPrice: number;
  status: BookingStatus;
  createdAt: string;
}

export interface SupportTicket {
    id: string;
    requesterId: string;
    requesterRole: UserRole;
    type: 'INCIDENT' | 'APPEAL' | 'REPORT';
    subject: string;
    description: string;
    status: 'OPEN' | 'RESOLVED';
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    createdAt: string;
}

export interface AuthState {
  user: User | Provider | null;
  isAuthenticated: boolean;
  login: (email: string, role: UserRole) => void;
  logout: () => void;
}
