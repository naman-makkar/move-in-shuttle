// src/app/layout.js

import './globals.css';  // if you have global styles

export const metadata = {
  title: 'Shuttle Management',
  description: 'Multi-route management system'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav style={{ padding: '1rem', background: '#eee' }}>
          <a href="/">Home</a> |{' '}

          {/* Admin Links */}
          <a href="/admin/shuttles">Admin Shuttles</a> |{' '}
          <a href="/admin/stops">Admin Stops</a> |{' '}
          <a href="/admin/users">Admin Users</a> |{' '}
          <a href="/admin/transactions">Admin Transactions</a> |{' '}

          {/* Auth Links */}
          <a href="/auth/register">Register</a> |{' '}
          <a href="/auth/login">Login</a> |{' '}

          {/* Bookings */}
          <a href="/bookings/request">Booking Request</a> |{' '}
          <a href="/bookings/my">My Bookings</a> |{' '}
          <a href="/bookings/cancel">Cancel Booking</a> |{' '}

          {/* Dashboard (and possibly wallet) */}
          <a href="/dashboard">Dashboard</a> |{' '}
          {/* If you have a wallet subpage:  */}
             <a href="/dashboard/wallet">Wallet</a> |{' '}
         
        </nav>
        {children}
      </body>
    </html>
  );
}
