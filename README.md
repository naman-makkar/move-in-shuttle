# 🚌 Move-In Shuttle Service

A comprehensive Next.js application for managing college campus shuttle services. This platform allows students to book shuttles, track routes, manage bookings, and handle payments for campus transportation.  
**Live Demo:** [https://move-in-shuttle.vercel.app/](https://move-in-shuttle.vercel.app/)  
**Demo Site:** [https://move-in-shuttle.vercel.app/](https://move-in-shuttle.vercel.app/)  
**Try the Demo:** [https://move-in-shuttle.vercel.app/](https://move-in-shuttle.vercel.app/)

[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-green.svg)](https://github.com/naman-makkar/move-in-shuttle)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen.svg)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-blue.svg)](https://tailwindcss.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-purple.svg)](https://stripe.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-Maps-green.svg)](https://leafletjs.com/)

## ✨ Features

### 👤 User Features

- **🔐 Authentication System**

  - User registration and login
  - Profile management
  - Role-based access (students and admins)

- **🎫 Shuttle Booking**

  - Browse available shuttle routes
  - Book seats on campus shuttles
  - **Enhanced Booking Flow:** Now using [Zustand](https://github.com/pmndrs/zustand) for client-side state management. The booking search, confirm, and request pages now share state seamlessly for an improved user experience.
  - Search for specific routes and timings
  - View booking history
  - Cancel bookings
  - Confirm bookings

- **💳 Wallet & Payment System**

  - Add funds to digital wallet via Stripe integration
  - Make payments for shuttle services
  - View transaction history
  - Secure payment processing
  - Automatic wallet balance updates

- **🗺️ Route Tracking**
  - Real-time shuttle tracking with Leaflet maps
  - Interactive route visualization
  - User-friendly location selection
  - Visual pickup and dropoff markers
  - **Advanced Location Selection:** Improved pickup and dropoff location selection directly from the map interface
  - **Improved Map Integration:** The Maps API loader has been centralized to prevent duplicate initialization issues

### 👑 Admin Features

- **🚐 Shuttle Management**

  - Add/edit shuttle routes
  - Manage shuttle schedules
  - Monitor shuttle capacity
  - Track shuttle usage statistics

- **👥 User Management**

  - View registered users
  - Manage user roles and permissions
  - Monitor user activity

- **📋 Booking Oversight**
  - View all bookings
  - Handle cancellations and refunds
  - Generate reports on booking trends

## 🔌 API Endpoints

### 🔒 Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate a user
- `GET /api/auth/profile` - Get user profile information
- `PUT /api/auth/profile` - Update user profile

### 🎟️ Bookings

- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create a new booking
- `GET /api/bookings/my` - Get bookings for current user  
  _(For example, fetching from `/api/bookings/my/<userId>`)_
- `GET /api/bookings/search` - Search for available bookings  
  _(Dynamic server usage handled with `request.nextUrl` and `export const dynamic = "force-dynamic"`.)_
- `POST /api/bookings/confirm` - Confirm a pending booking  
  _Includes wallet balance check, booking record creation, and transaction logging._
- `POST /api/bookings/cancel` - Cancel an existing booking

### 🛣️ Routes

- `GET /api/routes` - Get all available shuttle routes
- `POST /api/routes` - Create a new route (admin only)
- `PUT /api/routes/:id` - Update a route (admin only)
- `DELETE /api/routes/:id` - Delete a route (admin only)

### 👤 User Management

- `GET /api/user` - Get user information
- `PUT /api/user` - Update user information
- `GET /api/admin/users` - List all users (admin only)

### 💰 Wallet & Payments

- `GET /api/wallet` - Get wallet balance
- `POST /api/wallet` - Add funds to wallet
- `GET /api/wallet/transactions` - Get transaction history
- `POST /api/stripe/create-checkout` - Create a Stripe checkout session
- `POST /api/stripe/webhook` - Handle Stripe payment webhooks

## 🛠️ Technologies Used

- **🖥️ Frontend**:
  - Next.js 14 (App Router)
  - React 18
  - Tailwind CSS
  - Shadcn UI Components
  - React Hook Form with Zod validation
  - **Zustand** for client-side state management (booking flow: request, search, confirm)
- **⚙️ Backend**:
  - Next.js API Routes
  - NextAuth.js for authentication
  - MongoDB & Mongoose for data storage
  - Bcrypt for password hashing
- **📍 Maps & Location**:
  - Leaflet maps for interactive mapping
  - Leaflet Routing Machine for route calculation
  - Custom marker icons for improved UX
  - Location-based search functionality
- **💵 Payment Processing**:
  - Stripe integration for secure payments
  - Custom checkout sessions
  - Webhook handling for payment events
  - Transaction tracking

## 💾 Database Models

- **👤 User** - Stores user account details, preferences, and authentication information
- **🎫 Booking** - Manages shuttle bookings with status tracking and payment information
- **🛣️ Route** - Defines shuttle routes with waypoints and schedule information
- **🚏 Stop** - Defines shuttle stops with geolocation data and descriptions
- **🚐 Shuttle** - Shuttle information, capacity, and availability status
- **💸 Transaction** - Records wallet transactions with detailed payment information

## 🚀 Getting Started

### 📋 Prerequisites

- Node.js 18.0.0 or later
- MongoDB instance
- Stripe account for payment processing
- Google Maps API key (optional, for additional mapping features)

### ⚙️ Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/naman-makkar/move-in-shuttle.git
   cd move-in-shuttle
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. Configure environment variables:  
   Create a `.env.local` file in the root directory with the following:

   ```env
   # MongoDB Connection
   MONGODB_URI=your_mongodb_connection_string

   # NextAuth Configuration
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000

   # Stripe Integration
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

   # Application URL
   NEXT_PUBLIC_URL=http://localhost:3000
   ```

4. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.  
   **Live Demo:** [https://move-in-shuttle.vercel.app/](https://move-in-shuttle.vercel.app/)

## 🌐 Deployment

The easiest way to deploy this application is using the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.  
**Demo Site:** [https://move-in-shuttle.vercel.app/](https://move-in-shuttle.vercel.app/)  
Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 🔄 Recent Updates

- **Advanced Map Interaction:**  
  Users can now directly select pickup and dropoff locations from the map interface with visual confirmation and location information. This provides a more intuitive booking experience.

- **Stripe Payment Integration:**  
  Complete Stripe payment processing flow with checkout sessions and webhook handling for secure transactions.

- **Zustand State Management:**  
  The booking request, search, and confirm pages now share state via Zustand for a seamless booking experience without losing user selections between pages.
- **Enhanced UI Notifications:**  
  Improved toast notifications provide better feedback throughout the user journey. Custom markers and animations on the map create a more engaging visual experience.

- **Leaflet Maps Integration:**  
  Switched to Leaflet for maps implementation with custom markers and route visualization. The enhanced map component provides better performance and user experience.

## 🙏 Acknowledgements

- Next.js team for the incredible framework
- Shadcn for beautiful UI components
- Vercel for hosting solutions
- Zustand for simple and powerful state management
- Leaflet for comprehensive mapping solutions
- Stripe for secure payment processing

## 🙌 Check It Out!

Visit the live demo site now: [https://move-in-shuttle.vercel.app/](https://move-in-shuttle.vercel.app/)  
Demo Site: [https://move-in-shuttle.vercel.app/](https://move-in-shuttle.vercel.app/)

```

```
