//src/app/bookings/confirm/page.js
"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function BookingConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shuttleId = searchParams.get("shuttleId");
  const fromStop = searchParams.get("fromStop");
  const toStop = searchParams.get("toStop");
  const fare = searchParams.get("fare");
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");

  async function handleConfirm() {
    if (!userId) {
      alert("Please enter your user ID for testing");
      return;
    }
    const res = await fetch("/api/bookings/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        shuttleId,
        fromStop,
        toStop,
        fare: Number(fare)
      })
    });
    const data = await res.json();
    if (res.ok) {
      setMessage(`Booking confirmed! Booking ID: ${data.booking.bookingId}`);
    } else {
      setMessage(`Error: ${data.error}`);
    }
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Booking Confirmation</h1>
      <p>Shuttle ID: {shuttleId}</p>
      <p>From: {fromStop}</p>
      <p>To: {toStop}</p>
      <p>Fare: {fare} points</p>
      <input 
        type="text" 
        placeholder="Enter your userId for testing" 
        value={userId} 
        onChange={(e) => setUserId(e.target.value)} 
      />
      <br />
      <button onClick={handleConfirm}>Confirm Booking</button>
      {message && <p>{message}</p>}
    </div>
  );
}
