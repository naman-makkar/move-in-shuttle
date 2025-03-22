// src/app/bookings/request/page.js
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BookingRequestPage() {
  const router = useRouter();
  const [fromStop, setFromStop] = useState("");
  const [toStop, setToStop] = useState("");
  const [shift, setShift] = useState("morning");
  const [stops, setStops] = useState([]);
  const [error, setError] = useState("");

  // Fetch available stops from the stops API
  useEffect(() => {
    async function fetchStops() {
      try {
        const res = await fetch("/api/admin/stops");
        if (res.ok) {
          const data = await res.json();
          setStops(data);
        } else {
          setError("Failed to fetch stops");
        }
      } catch (err) {
        console.error(err);
        setError("Error fetching stops");
      }
    }
    fetchStops();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (!fromStop || !toStop || fromStop === toStop) {
      setError("Please select valid From and To stops");
      return;
    }
    // Redirect to shuttle search results with selected criteria as query parameters
    router.push(`/bookings/search?fromStop=${fromStop}&toStop=${toStop}&shift=${shift}`);
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Book a Shuttle</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>From Stop: </label>
          <select value={fromStop} onChange={(e) => setFromStop(e.target.value)} required>
            <option value="">Select From Stop</option>
            {stops.map((stop) => (
              <option key={stop.stopId} value={stop.stopId}>
                {stop.stopName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>To Stop: </label>
          <select value={toStop} onChange={(e) => setToStop(e.target.value)} required>
            <option value="">Select To Stop</option>
            {stops.map((stop) => (
              <option key={stop.stopId} value={stop.stopId}>
                {stop.stopName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Shift: </label>
          <select value={shift} onChange={(e) => setShift(e.target.value)}>
            <option value="morning">Morning</option>
            <option value="evening">Evening</option>
          </select>
        </div>
        <button type="submit">Search Shuttles</button>
      </form>
    </div>
  );
}
