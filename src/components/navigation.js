"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import LogoutButton from "@/components/logoutButton";

export default function Navigation() {
  const { data: session } = useSession();

  return (
    <nav style={{ padding: "1rem", background: "#eee" }}>
      <Link href="/">Home</Link> |{" "}
      {/* Admin Links */}
      <Link href="/admin/shuttles">Admin Shuttles</Link> |{" "}
      <Link href="/admin/stops">Admin Stops</Link> |{" "}
      <Link href="/admin/users">Admin Users</Link> |{" "}
      <Link href="/admin/transactions">Admin Transactions</Link> |{" "}
      {/* Auth Links */}
      <Link href="/auth/register">Register</Link> |{" "}
      <Link href="/auth/login">Login</Link> |{" "}
      {/* Bookings */}
      <Link href="/bookings/request">Booking Request</Link> |{" "}
      <Link href="/bookings/my">My Bookings</Link> |{" "}
      <Link href="/bookings/cancel">Cancel Booking</Link> |{" "}
      {/* Dashboard and Wallet */}
      <Link href="/dashboard">Dashboard</Link> |{" "}
      <Link href="/dashboard/wallet">Wallet</Link>
      {session && (
        <>
          {" "}
          | <LogoutButton />
        </>
      )}
    </nav>
  );
}
