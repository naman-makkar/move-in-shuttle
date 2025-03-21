// src/app/admin/stops/page.js
"use client";
import { useEffect, useState } from "react";

export default function StopListPage() {
  const [stops, setStops] = useState([]);

  useEffect(() => {
    async function fetchStops() {
      const res = await fetch("/api/admin/stops");
      const data = await res.json();
      setStops(data);
    }
    fetchStops();
  }, []);

  return (
    <div style={{ padding: "1rem" }}>
      <h1>All Stops</h1>
      <ul>
        {stops.map((stop) => (
          <li key={stop.stopId}>
            {stop.stopName} (Active: {stop.isActive.toString()})
          </li>
        ))}
      </ul>
      <a href="/admin/stops/new">Create New Stop</a>
    </div>
  );
}
