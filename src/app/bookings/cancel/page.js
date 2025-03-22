//src/app/bookings/cancel/page.js
"use client";
import { useState } from "react";

export default function BookingCancellationPage() {
  const [bookingId, setBookingId] = useState("");
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");
  
  async function handleCancel(e) {
    e.preventDefault();
    setMessage("");
    
    const res = await fetch("/api/bookings/cancel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId, userId })
    });
    const data = await res.json();
    if (res.ok) {
      setMessage(`Cancellation successful. Refund: ${data.refundAmount} points. New wallet balance: ${data.newWalletBalance}. Penalty applied: ${data.penalty}`);
    } else {
      setMessage(`Error: ${data.error}`);
    }
  }
  
  return (
    <div style={{ padding: "1rem" }}>
      <h1>Cancel Booking</h1>
      <form onSubmit={handleCancel}>
        <div>
          <label>Booking ID:</label>
          <input type="text" value={bookingId} onChange={(e) => setBookingId(e.target.value)} required />
        </div>
        <div>
          <label>User ID:</label>
          <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} required />
        </div>
        <button type="submit">Cancel Booking</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
