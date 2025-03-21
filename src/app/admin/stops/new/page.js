// src/app/admin/stops/new/page.js
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewStopPage() {
  const router = useRouter();
  const [stopName, setStopName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch("/api/admin/stops", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        stopName,
        latitude: Number(latitude),
        longitude: Number(longitude)
      })
    });
    if (res.ok) {
      router.push("/admin/stops");
    }
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Create New Stop</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Stop Name:</label>
          <input type="text" value={stopName} onChange={(e) => setStopName(e.target.value)} required />
        </div>
        <div>
          <label>Latitude:</label>
          <input type="number" value={latitude} onChange={(e) => setLatitude(e.target.value)} required />
        </div>
        <div>
          <label>Longitude:</label>
          <input type="number" value={longitude} onChange={(e) => setLongitude(e.target.value)} required />
        </div>
        <button type="submit">Create Stop</button>
      </form>
    </div>
  );
}
