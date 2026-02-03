
# ServiceHub - On-Demand Home Services Platform 
[URL](https://aistudio.google.com/apps/drive/1O0Flyq4JK83P3Gv06Sv7GeH-kJoT0m4p?fullscreenApplet=true&showPreview=true&showAssistant=true)
[Demo Video](https://www.youtube.com/watch?v=RnNrwXI5O0s)

**ServiceHub** is a modern, scalable, and sophisticated marketplace application designed to connect homeowners with verified service professionals (Cleaners, Plumbers, Electricians, Interior Designers) in real-time. Think of it as the "Uber for Home Services."

The platform focuses on trust, transparency, and ease of use, featuring rigorous provider verification, dynamic pricing models, and comprehensive dashboards for all user roles.

---

## 🚀 Key Features

### 🌟 For Customers
*   **Smart Search & Filtering**: Find providers based on location, rating, price, and availability.
*   **Instant Booking**: Real-time scheduling with dynamic pricing logic (surge pricing during peak hours).
*   **Secure Payments**: Simulated secure checkout flow with multiple payment options.
*   **Booking Management**: Track service status from "Requested" to "Completed".
*   **Profile Management**: Manage personal details and view account status.

### 💼 For Service Providers
*   **Dedicated Dashboard**: A powerful command center to manage business operations.
*   **Income Analytics**: Visual charts tracking revenue trends, client retention, and profile views.
*   **Schedule Management**: Accept/Decline incoming booking requests and toggle availability status (Available/Busy/Off Duty).
*   **Service Menu**: customizable service offerings with pricing and descriptions.
*   **Team Management**: Invite and manage team members.
*   **Compliance**: Upload and track verification documents (ID, License, Insurance).

### 🛡️ For Administrators
The system implements a robust Role-Based Access Control (RBAC) system with three distinct admin tiers:

1.  **Super Admin**
    *   Full access to all system modules.
    *   Manage all users, settings, and financial data.
2.  **Customer Support Admin**
    *   Focuses on Ticket Management (Incidents, Appeals).
    *   Cannot access sensitive security settings or financial configurations.
3.  **Security/Verification Admin**
    *   Focuses on Trust & Safety.
    *   Approves/Rejects provider documents and manages bans.
    *   Cannot view revenue data or handle customer service tickets.

---

## 🛠️ Technical Stack

*   **Frontend**: React 19 (Functional Components, Hooks)
*   **Language**: TypeScript (Strict typing for robustness)
*   **Styling**: Tailwind CSS (Utility-first, Glassmorphism aesthetic)
*   **Icons**: Lucide React
*   **State Management**: React Context / Local State
*   **Mock Backend**: A simulation layer (`mockService.ts`) that mimics API delays, CRUD operations, and logic without a real server, allowing the app to run as a standalone client-side demo.

---

## 🏗️ Project Structure

```text
/
├── components/         # Reusable UI components (Navbar, ProviderCard, etc.)
├── pages/             # Main route views (Home, Login, Dashboard, etc.)
├── services/          # Mock API logic and data simulation
├── types/             # TypeScript interfaces and Enum definitions
├── App.tsx            # Main application entry and Routing logic
├── index.tsx          # React DOM rendering
└── index.html         # HTML entry point
```

---

## 🚦 How to Run the Application

This project is built as a Single Page Application (SPA).

### Prerequisites
*   Node.js (v16 or higher)
*   npm or yarn

### Installation

1.  **Clone the repository** (if applicable) or download the source files.
2.  **Install dependencies**:
    ```bash
    npm install
    ```
    *Note: Ensure you have `react`, `react-dom`, `lucide-react`, and `tailwindcss` installed.*

### Running locally
If you are using a standard bundler like Vite or Create React App:

1.  **Start the development server**:
    ```bash
    npm run dev
    # or
    npm start
    ```
2.  Open your browser to `http://localhost:3000` (or the port specified by your bundler).

### Demo Credentials

To explore the different roles without registering, use the following pre-configured credentials on the Login screen:

*   **Customer**: `demo@customer.com` / `password123`
*   **Provider**: `demo@provider.com` / `password123`
*   **Super Admin**: `ShaDmin158509@gmail.com` / `HeLlO56`
*   **Support Admin**: `support1@servicehub.com` / `cust123`
*   **Security Admin**: `security@servicehub.com` / `sec123`

---

## 🎨 Design Philosophy

The UI follows a **"Glassmorphism"** design language:
*   **Translucency**: Frosted glass effects on panels and inputs.
*   **Depth**: Subtle shadows and floating elements.
*   **Vivid Colors**: Used sparingly for status indicators and calls to action against a clean, neutral background.
*   **Typography**: Uses the 'Inter' font family for high legibility.

---

## 🔄 Workflow Logic

1.  **Onboarding**: Providers sign up -> Upload Documents -> Verification Admin approves documents -> Provider becomes "Verified" and appears in search.
2.  **Booking**: Customer searches for service -> Selects Provider -> Configures Service Details -> Pays -> Booking Request sent.
3.  **Fulfillment**: Provider accepts booking -> Service Delivered -> Booking marked Completed -> Review left.
4.  **Support**: Issues raised via Ticket -> Support Admin resolves ticket.

