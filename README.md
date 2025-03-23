# 🚌 Move-In Shuttle Service

A comprehensive Next.js application for managing college campus shuttle services. This platform allows students to book shuttles, track routes, manage bookings, and handle payments for campus transportation.  
**Live Demo:** [https://move-in-shuttle.vercel.app/](https://move-in-shuttle.vercel.app/)  
**Demo Site:** [https://move-in-shuttle.vercel.app/](https://move-in-shuttle.vercel.app/)  
**Try the Demo:** [https://move-in-shuttle.vercel.app/](https://move-in-shuttle.vercel.app/)

[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-green.svg)](https://github.com/naman-makkar/move-in-shuttle)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen.svg)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-blue.svg)](https://tailwindcss.com/)

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

- **💳 Wallet System**
  - Add funds to digital wallet
  - Make payments for shuttle services
  - View transaction history

- **🗺️ Route Tracking**
  - Real-time shuttle tracking
  - View shuttle schedules
  - See estimated arrival times
  - **Improved Google Maps Integration:** The Maps API loader has been centralized to prevent duplicate initialization issues. Check out the demo for route tracking at [https://move-in-shuttle.vercel.app/](https://move-in-shuttle.vercel.app/)

### 👑 Admin Features

- **🚐 Shuttle Management**
  - Add/edit shuttle routes
  - Manage shuttle schedules
  - Monitor shuttle capacity

- **👥 User Management**
  - View registered users
  - Manage user roles and permissions

- **📋 Booking Oversight**
  - View all bookings
  - Handle cancellations and refunds

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
  *(For example, fetching from `/api/bookings/my/<userId>`)*
- `GET /api/bookings/search` - Search for available bookings  
  *(Dynamic server usage handled with `request.nextUrl` and `export const dynamic = "force-dynamic"`.)*
- `POST /api/bookings/confirm` - Confirm a pending booking  
  *Includes wallet balance check, booking record creation, and transaction logging.*
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

### 💰 Wallet

- `GET /api/wallet` - Get wallet balance
- `POST /api/wallet` - Add funds to wallet
- `GET /api/wallet/transactions` - Get transaction history

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
  - Google Maps API integration for route visualization
  - Centralized Maps API loader to prevent duplicate initialization errors

## 💾 Database Models

- **👤 User** - Stores user account details
- **🎫 Booking** - Manages shuttle bookings
- **🛣️ Route** - Defines shuttle routes
- **🚏 Stop** - Defines shuttle stops
- **🚐 Shuttle** - Shuttle information and availability
- **💸 Transaction** - Records wallet transactions

## 🚀 Getting Started

### 📋 Prerequisites

- Node.js 18.0.0 or later
- MongoDB instance
- Google Maps API key (for map features)

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
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key
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

- **Zustand Integration for Booking Flow:**  
  The booking request, search, and confirm pages now share state via Zustand. This results in a smoother booking flow and easier state management.  
  **Try the Demo:** [https://move-in-shuttle.vercel.app/](https://move-in-shuttle.vercel.app/)

- **Centralized Google Maps API Loader:**  
  We fixed issues with duplicate loader initialization by centralizing the Google Maps API configuration.  
  **Demo Site:** [https://move-in-shuttle.vercel.app/](https://move-in-shuttle.vercel.app/)

## 🙏 Acknowledgements

- Next.js team for the incredible framework
- Shadcn for beautiful UI components
- Vercel for hosting solutions
- Zustand for simple and powerful state management
- Google Maps API for location services

## 🙌 Check It Out!

Visit the live demo site now: [https://move-in-shuttle.vercel.app/](https://move-in-shuttle.vercel.app/)  
Demo Site: [https://move-in-shuttle.vercel.app/](https://move-in-shuttle.vercel.app/)
```
