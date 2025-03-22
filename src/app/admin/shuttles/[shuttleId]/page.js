"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function EditShuttlePage() {
  const router = useRouter();
  const path = usePathname();
  const shuttleId = path.split("/").pop();

  const [shuttleName, setShuttleName] = useState("");
  const [seats, setSeats] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [kmTravel, setKmTravel] = useState("");
  const [shift, setShift] = useState("morning");
  const [isActive, setIsActive] = useState(true);
  const [selectedStops, setSelectedStops] = useState([]);
  const [availableStops, setAvailableStops] = useState([]);
  const [stopArrivalTimes, setStopArrivalTimes] = useState({});
  const [error, setError] = useState("");

  // Fetch shuttle details
  useEffect(() => {
    async function fetchShuttle() {
      try {
        const res = await fetch(`/api/admin/shuttles/${shuttleId}`);
        if (!res.ok) {
          setError("Failed to load shuttle");
          return;
        }
        const data = await res.json();
        setShuttleName(data.shuttleName);
        setSeats(data.seats);
        setDepartureTime(new Date(data.departureTime).toISOString().slice(0,16));
        setArrivalTime(new Date(data.arrivalTime).toISOString().slice(0,16));
        setKmTravel(data.kmTravel);
        setShift(data.shift);
        setIsActive(data.isActive);
        setSelectedStops(data.stops.map(s => s.stopId));
        const times = {};
        data.stops.forEach(s => {
          times[s.stopId] = new Date(s.arrivalTime).toISOString().slice(0,16);
        });
        setStopArrivalTimes(times);
      } catch (err) {
        setError("Error fetching shuttle");
      }
    }
    fetchShuttle();
  }, [shuttleId]);

  // Fetch available stops
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

  async function handleUpdate(e) {
    e.preventDefault();
    setError("");
    const stopsData = selectedStops.map(stopId => ({
      stopId,
      arrivalTime: stopArrivalTimes[stopId] ? new Date(stopArrivalTimes[stopId]) : new Date()
    }));
    const res = await fetch(`/api/admin/shuttles/${shuttleId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shuttleName,
        seats: Number(seats),
        departureTime,
        arrivalTime,
        stops: stopsData,
        kmTravel: Number(kmTravel),
        shift,
        isActive
      }),
    });
    if (res.ok) {
      router.push("/admin/shuttles");
    } else {
      setError("Error updating shuttle");
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this shuttle?")) return;
    const res = await fetch(`/api/admin/shuttles/${shuttleId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      router.push("/admin/shuttles");
    } else {
      setError("Error deleting shuttle");
    }
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Edit Shuttle</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleUpdate}>
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
          <label>Active?</label>
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
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
        <button type="submit">Update Shuttle</button>
      </form>
      <button onClick={handleDelete} style={{ marginTop: "1rem", color: "red" }}>
        Delete Shuttle
      </button>
    </div>
  );
}
