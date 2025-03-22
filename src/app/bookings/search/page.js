//src/app/bookings/search/page.js
"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ShuttleSearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromStop = searchParams.get("fromStop");
  const toStop = searchParams.get("toStop");
  const shift = searchParams.get("shift");

  const [shuttles, setShuttles] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchShuttles() {
      try {
        const res = await fetch(`/api/bookings/search?fromStop=${fromStop}&toStop=${toStop}&shift=${shift}`);
        if (res.ok) {
          const data = await res.json();
          setShuttles(data);
        } else {
          setError("Failed to fetch available shuttles");
        }
      } catch (err) {
        setError("Error fetching shuttles");
      }
    }
    fetchShuttles();
  }, [fromStop, toStop, shift]);

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Available Shuttles</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {shuttles.length === 0 ? (
        <p>No shuttles available for the selected criteria.</p>
      ) : (
        <ul>
          {shuttles.map(shuttle => (
            <li key={shuttle.shuttleId} style={{ marginBottom: "1rem" }}>
              <strong>{shuttle.shuttleName}</strong><br />
              Seats: {shuttle.seats}<br />
              Departure: {new Date(shuttle.departureTime).toLocaleString()}<br />
              Arrival: {new Date(shuttle.arrivalTime).toLocaleString()}<br />
              Fare: {shuttle.fare} points<br />
              <button onClick={() => router.push(`/bookings/confirm?shuttleId=${shuttle.shuttleId}&fromStop=${fromStop}&toStop=${toStop}&fare=${shuttle.fare}`)}>
                Book Now
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
