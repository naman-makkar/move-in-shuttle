// src/app/admin/routes/[routeId]/page.js
"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function EditRoutePage() {
  const router = useRouter();
  const path = usePathname(); 
  // path might look like "/admin/routes/xxxx"
  // We'll extract the routeId from the last part
  const routeId = path.split("/").pop();

  const [routeName, setRouteName] = useState("");
  const [stops, setStops] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Fetch existing data on mount
  useEffect(() => {
    async function fetchRoute() {
      const res = await fetch(`/admin/routes/${routeId}/get`);
      if (!res.ok) return;
      const data = await res.json();
      if (data) {
        setRouteName(data.routeName);
        setStops(data.stops.join(", "));
        setIsActive(data.isActive);
      }
    }
    fetchRoute();
  }, [routeId]);

  async function handleUpdate(e) {
    e.preventDefault();
    const res = await fetch(`/admin/routes/${routeId}/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        routeName,
        stops,
        isActive
      })
    });
    if (res.ok) {
      router.push("/admin/routes");
    } else {
      alert("Error updating route");
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this route?")) return;
    const res = await fetch(`/admin/routes/${routeId}/delete`, {
      method: "DELETE"
    });
    if (res.ok) {
      router.push("/admin/routes");
    } else {
      alert("Error deleting route");
    }
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Edit Route</h1>
      <form onSubmit={handleUpdate}>
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
          <label>Stops (comma-separated):</label>
          <input
            type="text"
            value={stops}
            onChange={(e) => setStops(e.target.value)}
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
        <button type="submit">Update Route</button>
      </form>
      <button onClick={handleDelete} style={{ marginTop: '1rem', color: 'red' }}>
        Delete Route
      </button>
    </div>
  );
}
