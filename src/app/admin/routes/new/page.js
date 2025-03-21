'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewRoutePage() {
  const router = useRouter();
  const [routeName, setRouteName] = useState("");
  const [selectedStops, setSelectedStops] = useState([]);
  const [availableStops, setAvailableStops] = useState([]);
  const [error, setError] = useState("");

  // Fetch available stops from the API on component mount
  useEffect(() => {
    async function fetchStops() {
      try {
        const res = await fetch("/api/admin/stops");
        if (res.ok) {
          const data = await res.json();
          setAvailableStops(data);
        } else {
          setError("Failed to load stops");
        }
      } catch (err) {
        console.error(err);
        setError("Error fetching stops");
      }
    }
    fetchStops();
  }, []);

  // Handle changes in the multi-select dropdown
  function handleStopSelection(e) {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setSelectedStops(selected);
  }

  // Handle form submission to create a new route
  async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch("/admin/routes/new/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        routeName,
        stops: selectedStops, // an array of stop IDs
      }),
    });
    if (res.ok) {
      router.push("/admin/routes");
    } else {
      setError("Error creating route");
    }
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Create New Route</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Route Name:</label>
          <input
            type="text"
            value={routeName}
            onChange={(e) => setRouteName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Select Stops:</label>
          <select multiple value={selectedStops} onChange={handleStopSelection}>
            {availableStops.map((stop) => (
              <option key={stop.stopId} value={stop.stopId}>
                {stop.stopName}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Create Route</button>
      </form>
    </div>
  );
}
