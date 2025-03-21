// src/app/admin/stops/[stopId]/page.js
"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function EditStopPage() {
  const router = useRouter();
  const path = usePathname();
  const stopId = path.split("/").pop();

  const [stopName, setStopName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStop() {
      try {
        const res = await fetch(`/api/admin/stops/${stopId}`);
        if (!res.ok) {
          setError("Failed to load stop");
          return;
        }
        const data = await res.json();
        setStopName(data.stopName);
        setLatitude(data.location?.latitude || 0);
        setLongitude(data.location?.longitude || 0);
        setIsActive(data.isActive);
      } catch (err) {
        setError("Error fetching stop");
      }
    }
    fetchStop();
  }, [stopId]);

  async function handleUpdate(e) {
    e.preventDefault();
    setError("");
    const res = await fetch(`/api/admin/stops/${stopId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        stopName,
        latitude: Number(latitude),
        longitude: Number(longitude),
        isActive,
      }),
    });
    if (res.ok) {
      router.push("/admin/stops");
    } else {
      setError("Error updating stop");
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this stop?")) return;
    const res = await fetch(`/api/admin/stops/${stopId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      router.push("/admin/stops");
    } else {
      setError("Error deleting stop");
    }
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Edit Stop</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleUpdate}>
        <div>
          <label>Stop Name:</label>
          <input
            type="text"
            value={stopName}
            onChange={(e) => setStopName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Latitude:</label>
          <input
            type="number"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
          />
        </div>
        <div>
          <label>Longitude:</label>
          <input
            type="number"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
          />
        </div>
        <div>
          <label>Active?</label>
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
        </div>
        <button type="submit">Update Stop</button>
      </form>
      <button onClick={handleDelete} style={{ marginTop: "1rem", color: "red" }}>
        Delete Stop
      </button>
    </div>
  );
}
