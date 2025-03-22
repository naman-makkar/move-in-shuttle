//src/app/bookings/my/page.js
"use client";
import { useState, useEffect } from "react";

export default function MyBookingsPage() {
  const [userId, setUserId] = useState("");
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  async function fetchBookings() {
    try {
      const res = await fetch(`/api/bookings/my?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      } else {
        setError("Failed to fetch bookings");
      }
    } catch (err) {
      setError("Error fetching bookings");
    }
  }

  function handleFetch(e) {
    e.preventDefault();
    if (userId) {
      fetchBookings();
    }
  }

  // Define the handleCancelBooking function
  async function handleCancelBooking(bookingId) {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    
    try {
      // For testing, we prompt for userId; later, use session info.
      const currentUserId = prompt("Enter your userId for cancellation:");
      const res = await fetch("/api/bookings/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, userId: currentUserId }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(
          `Cancellation successful. Refund: ${data.refundAmount} points. New wallet balance: ${data.newWalletBalance}. Penalty: ${data.penalty}`
        );
        // Refresh bookings after cancellation
        fetchBookings();
      } else {
        alert(`Cancellation failed: ${data.error}`);
      }
    } catch (error) {
      alert("Error cancelling booking: " + error);
    }
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h1>My Bookings</h1>
      <form onSubmit={handleFetch}>
        <div>
          <label>User ID:</label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
        </div>
        <button type="submit">Fetch My Bookings</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {bookings.map((b) => (
          <li key={b.bookingId}>
            Booking ID: {b.bookingId} | Shuttle: {b.shuttleId} | From: {b.fromStop} | To: {b.toStop} | Fare: {b.fare} | Status: {b.bookingStatus}
            {b.bookingStatus === "confirmed" && (
              <button onClick={() => handleCancelBooking(b.bookingId)}>
                Cancel
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
