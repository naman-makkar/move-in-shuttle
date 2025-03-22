"use client";
import { useEffect, useState } from "react";

export default function ShuttleListPage() {
  const [shuttles, setShuttles] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchShuttles() {
      try {
        const res = await fetch("/api/admin/shuttles");
        if (res.ok) {
          const data = await res.json();
          setShuttles(data);
        } else {
          setError("Failed to load shuttles");
        }
      } catch (err) {
        setError("Error fetching shuttles");
      }
    }
    fetchShuttles();
  }, []);

  return (
    <div style={{ padding: "1rem" }}>
      <h1>All Shuttles</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <a href="/admin/shuttles/new">Create New Shuttle</a>
      <ul>
        {shuttles.map(shuttle => (
          <li key={shuttle.shuttleId} style={{ marginBottom: "1rem" }}>
            <strong>{shuttle.shuttleName}</strong> (Shift: {shuttle.shift})<br />
            Seats: {shuttle.seats}<br />
            Departure: {new Date(shuttle.departureTime).toLocaleString()}<br />
            Arrival: {new Date(shuttle.arrivalTime).toLocaleString()}<br />
            Total KM: {shuttle.kmTravel}<br />
            <strong>Stops:</strong>
            <ul>
              {shuttle.stops.map(stop => (
                <li key={stop.stopId}>
                  Stop ID: {stop.stopId} - Arrival: {new Date(stop.arrivalTime).toLocaleTimeString()}
                </li>
              ))}
            </ul>
            <a href={`/admin/shuttles/${shuttle.shuttleId}`}>Edit</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
