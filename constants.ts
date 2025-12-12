

import { ServiceCategory, Provider, UserRole, SupportTicket, AdminRole } from './types';

export const SERVICE_ICONS: Record<ServiceCategory, string> = {
  [ServiceCategory.CLEANING]: '✨',
  [ServiceCategory.PLUMBING]: '🔧',
  [ServiceCategory.ELECTRICAL]: '⚡',
  [ServiceCategory.INTERIOR_DESIGN]: '🎨',
};

// Admin Credentials Configuration
export const ADMIN_CREDENTIALS = [
    { email: 'ShaDmin158509@gmail.com', password: 'HeLlO56', role: AdminRole.SUPER_ADMIN, name: 'Super Admin' },
    { email: 'support1@servicehub.com', password: 'cust123', role: AdminRole.CUSTOMER_SUPPORT, name: 'Requester Support' },
    { email: 'provider.help@servicehub.com', password: 'prov123', role: AdminRole.PROVIDER_SUPPORT, name: 'Provider Support' },
    { email: 'security@servicehub.com', password: 'sec123', role: AdminRole.VERIFICATION, name: 'Security Verification' },
    { email: 'category@servicehub.com', password: 'cat123', role: AdminRole.CATEGORY_MANAGER, name: 'Category Manager' },
    { email: 'quality@servicehub.com', password: 'qual123', role: AdminRole.CUSTOMER_REVIEWER, name: 'Review Manager' },
];

export const MOCK_TICKETS: SupportTicket[] = [
    {
        id: 't1',
        requesterId: 'u1',
        requesterRole: UserRole.CUSTOMER,
        type: 'INCIDENT',
        subject: 'Provider did not show up',
        description: 'I waited for 2 hours but the cleaner never arrived.',
        status: 'OPEN',
        priority: 'HIGH',
        createdAt: '2023-11-15T10:00:00Z'
    },
    {
        id: 't2',
        requesterId: 'p2',
        requesterRole: UserRole.PROVIDER,
        type: 'APPEAL',
        subject: 'Incorrect Service Category',
        description: 'My profile is listed under Plumbing but I also do Electrical. Please update.',
        status: 'OPEN',
        priority: 'MEDIUM',
        createdAt: '2023-11-14T14:30:00Z'
    },
    {
        id: 't3',
        requesterId: 'p1',
        requesterRole: UserRole.PROVIDER,
        type: 'REPORT',
        subject: 'Customer rude behavior',
        description: 'Customer used abusive language during the service.',
        status: 'OPEN',
        priority: 'HIGH',
        createdAt: '2023-11-16T09:15:00Z'
    }
];

export const MOCK_PROVIDERS: Provider[] = [
  {
    id: 'p1',
    name: 'Sarah Jenkins',
    email: 'sarah@example.com',
    role: UserRole.PROVIDER,
    serviceCategory: ServiceCategory.CLEANING,
    hourlyRate: 30,
    services: [
      { category: ServiceCategory.CLEANING, price: 30, description: 'Standard home cleaning' }
    ],
    teamMembers: [],
    verificationDocuments: [],
    rating: 4.8,
    reviewCount: 124,
    distanceKm: 2.5,
    verified: true,
    bio: 'Professional cleaner with 5 years of experience in eco-friendly cleaning.',
    avatar: 'https://picsum.photos/200/200?random=1',
    availabilityStatus: 'AVAILABLE',
    isBanned: false
  },
  {
    id: 'p2',
    name: 'Mike Ross',
    email: 'mike@example.com',
    role: UserRole.PROVIDER,
    serviceCategory: ServiceCategory.PLUMBING,
    hourlyRate: 85,
    services: [
        { category: ServiceCategory.PLUMBING, price: 85, description: 'Emergency repairs and install' }
    ],
    teamMembers: [
        { id: 'tm1', name: 'Jimmy', email: 'jimmy@plumb.com', status: 'ACTIVE', avatar: 'https://via.placeholder.com/150' }
    ],
    verificationDocuments: [],
    rating: 4.9,
    reviewCount: 89,
    distanceKm: 4.2,
    verified: true,
    bio: 'Licensed plumber available for emergency repairs and installations.',
    avatar: 'https://picsum.photos/200/200?random=2',
    availabilityStatus: 'BUSY',
    isBanned: false
  },
  {
    id: 'p3',
    name: 'Elena Rodriguez',
    email: 'elena@example.com',
    role: UserRole.PROVIDER,
    serviceCategory: ServiceCategory.INTERIOR_DESIGN,
    hourlyRate: 120,
    services: [
        { category: ServiceCategory.INTERIOR_DESIGN, price: 120, description: 'Full Project Design' },
        { category: ServiceCategory.INTERIOR_DESIGN, price: 50, description: 'Initial Consultation' } // Lower price for consultation
    ],
    teamMembers: [],
    verificationDocuments: [],
    rating: 5.0,
    reviewCount: 42,
    distanceKm: 8.1,
    verified: true,
    bio: 'Award-winning interior designer specializing in modern minimalism.',
    avatar: 'https://picsum.photos/200/200?random=3',
    availabilityStatus: 'AVAILABLE',
    isBanned: false
  },
  {
    id: 'p4',
    name: 'David Chen',
    email: 'david@example.com',
    role: UserRole.PROVIDER,
    serviceCategory: ServiceCategory.ELECTRICAL,
    hourlyRate: 75,
    services: [
        { category: ServiceCategory.ELECTRICAL, price: 75, description: 'Residential wiring' }
    ],
    teamMembers: [],
    verificationDocuments: [],
    rating: 4.6,
    reviewCount: 215,
    distanceKm: 1.2,
    verified: true,
    bio: 'Certified electrician for residential and commercial projects.',
    avatar: 'https://picsum.photos/200/200?random=4',
    availabilityStatus: 'OFF_DUTY',
    isBanned: false
  },
  {
    id: 'p5',
    name: 'Clean Masters Co.',
    email: 'team@cleanmasters.com',
    role: UserRole.PROVIDER,
    serviceCategory: ServiceCategory.CLEANING,
    hourlyRate: 45,
    services: [
        { category: ServiceCategory.CLEANING, price: 45, description: 'Deep cleaning team' }
    ],
    teamMembers: [
        { id: 'tm2', name: 'Alice', email: 'alice@cm.com', status: 'ACTIVE' },
        { id: 'tm3', name: 'Bob', email: 'bob@cm.com', status: 'ACTIVE' }
    ],
    verificationDocuments: [],
    rating: 2.5, // Low rating to demonstrate ban warning
    reviewCount: 15,
    distanceKm: 12.5,
    verified: false,
    bio: 'Deep cleaning specialists.',
    avatar: 'https://picsum.photos/200/200?random=5',
    availabilityStatus: 'AVAILABLE',
    isBanned: true
  },
  {
    id: 'p6',
    name: 'Demo Provider',
    email: 'demo@provider.com',
    role: UserRole.PROVIDER,
    serviceCategory: ServiceCategory.CLEANING,
    hourlyRate: 40,
    services: [
        { category: ServiceCategory.CLEANING, price: 40, description: 'Standard cleaning' }
    ],
    teamMembers: [],
    verificationDocuments: [],
    rating: 4.5,
    reviewCount: 10,
    distanceKm: 3.0,
    verified: true,
    bio: 'Demo account for testing provider dashboard.',
    avatar: 'https://picsum.photos/200/200?random=6',
    availabilityStatus: 'AVAILABLE',
    isBanned: false
  }
];

export const COMMISSION_RATE = 0.15;