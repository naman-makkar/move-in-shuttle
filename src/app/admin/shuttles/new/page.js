"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewShuttlePage() {
  const router = useRouter();
  const [shuttleName, setShuttleName] = useState("");
  const [seats, setSeats] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [kmTravel, setKmTravel] = useState("");
  const [shift, setShift] = useState("morning");
  const [selectedStops, setSelectedStops] = useState([]);
  const [availableStops, setAvailableStops] = useState([]);
  const [stopArrivalTimes, setStopArrivalTimes] = useState({});
  const [error, setError] = useState("");

  // Fetch available stops from stops API
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
        setError("Error fetching stops");
      }
    }
    fetchStops();
  }, []);

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

  function handleStopArrivalTimeChange(stopId, value) {
    setStopArrivalTimes(prev => ({ ...prev, [stopId]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    // Build stops array with each object: { stopId, arrivalTime }
    const stopsData = selectedStops.map(stopId => ({
      stopId,
      arrivalTime: stopArrivalTimes[stopId] ? new Date(stopArrivalTimes[stopId]) : new Date()
    }));
    const res = await fetch("/api/admin/shuttles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shuttleName,
        seats: Number(seats),
        departureTime,
        arrivalTime,
        stops: stopsData,
        kmTravel: Number(kmTravel),
        shift
      }),
    });
    if (res.ok) {
      router.push("/admin/shuttles");
    } else {
      setError("Error creating shuttle");
    }
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Create New Shuttle</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Shuttle Name:</label>
          <input type="text" value={shuttleName} onChange={(e) => setShuttleName(e.target.value)} required />
        </div>
        <div>
          <label>Seats:</label>
          <input type="number" value={seats} onChange={(e) => setSeats(e.target.value)} required />
        </div>
        <div>
          <label>Departure Time:</label>
          <input type="datetime-local" value={departureTime} onChange={(e) => setDepartureTime(e.target.value)} required />
        </div>
        <div>
          <label>Arrival Time:</label>
          <input type="datetime-local" value={arrivalTime} onChange={(e) => setArrivalTime(e.target.value)} required />
        </div>
        <div>
          <label>Total KM Travel:</label>
          <input type="number" value={kmTravel} onChange={(e) => setKmTravel(e.target.value)} required />
        </div>
        <div>
          <label>Shift:</label>
          <select value={shift} onChange={(e) => setShift(e.target.value)}>
            <option value="morning">Morning</option>
            <option value="evening">Evening</option>
          </select>
        </div>
        <div>
          <label>Select Stops:</label>
          <select multiple value={selectedStops} onChange={handleStopSelection}>
            {availableStops.map(stop => (
              <option key={stop.stopId} value={stop.stopId}>
                {stop.stopName}
              </option>
            ))}
          </select>
        </div>
        {selectedStops.length > 0 && (
          <div>
            <h3>Set Arrival Time for Each Selected Stop</h3>
            {selectedStops.map(stopId => {
              const stop = availableStops.find(s => s.stopId === stopId);
              return (
                <div key={stopId}>
                  <label>{stop ? stop.stopName : stopId} Arrival Time:</label>
                  <input 
                    type="datetime-local" 
                    value={stopArrivalTimes[stopId] || ""}
                    onChange={(e) => handleStopArrivalTimeChange(stopId, e.target.value)}
                    required
                  />
                </div>
              );
            })}
          </div>
        )}
        <button type="submit">Create Shuttle</button>
      </form>
    </div>
  );
}
