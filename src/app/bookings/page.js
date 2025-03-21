// src/app/bookings/page.js
"use client";
import { useState } from "react";

export default function BookingPage() {
  const [userId, setUserId] = useState(""); // Enter a valid userId
  const [routeId, setRouteId] = useState("");
  const [fare, setFare] = useState(0);
  const [message, setMessage] = useState("");

  async function handleBooking(e) {
    e.preventDefault();
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, routeId, fare: Number(fare) })
    });
    const data = await res.json();
    if (res.ok) {
      setMessage(`Booking successful. New wallet balance: ${data.walletBalance}`);
    } else {
      setMessage(data.error);
    }
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Book a Ride</h1>
      <form onSubmit={handleBooking}>
        <div>
          <label>User ID:</label>
          <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} required />
        </div>
        <div>
          <label>Route ID:</label>
          <input type="text" value={routeId} onChange={(e) => setRouteId(e.target.value)} required />
        </div>
        <div>
          <label>Fare (points):</label>
          <input type="number" value={fare} onChange={(e) => setFare(e.target.value)} required />
        </div>
        <button type="submit">Book Ride</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
