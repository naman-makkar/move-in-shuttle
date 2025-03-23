# 🚌 Move-In Shuttle Service

A comprehensive Next.js application for managing college campus shuttle services. This platform allows students to book shuttles, track routes, manage bookings, and handle payments for campus transportation.

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
- `GET /api/bookings/search` - Search for available bookings
- `POST /api/bookings/confirm` - Confirm a pending booking
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

- **⚙️ Backend**:

  - Next.js API Routes
  - NextAuth.js for authentication
  - MongoDB & Mongoose for data storage
  - Bcrypt for password hashing

- **📍 Maps & Location**:
  - Google Maps API integration for route visualization

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

```
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

## 🌐 Deployment

The easiest way to deploy this application is using the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- Next.js team for the incredible framework
- Shadcn for beautiful UI components
- Vercel for hosting solutions
