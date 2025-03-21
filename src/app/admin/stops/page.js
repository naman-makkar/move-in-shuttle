// src/app/admin/stops/page.js
"use client";
import { useEffect, useState } from "react";

export default function StopListPage() {
  const [stops, setStops] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStops() {
      try {
        const res = await fetch("/api/admin/stops");
        if (res.ok) {
          const data = await res.json();
          setStops(data);
        } else {
          setError("Failed to load stops");
        }
      } catch (err) {
        setError("Error fetching stops");
      }
    }
    fetchStops();
  }, []);

  return (
    <div style={{ padding: "1rem" }}>
      <h1>All Stops</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <a href="/admin/stops/new">Create New Stop</a>
      <ul>
        {stops.map((stop) => (
          <li key={stop.stopId}>
            <strong>{stop.stopName}</strong> (Active: {stop.isActive ? "Yes" : "No"})
            {" - "}
            <a href={`/admin/stops/${stop.stopId}`}>Edit</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
