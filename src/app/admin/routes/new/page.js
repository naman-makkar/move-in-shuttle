// src/app/admin/routes/new/page.js
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewRoutePage() {
  const router = useRouter();
  const [routeName, setRouteName] = useState("");
  const [stops, setStops] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    // We could do a direct fetch to an API route, or call a server action if we define it.
    // For simplicity, let's do a fetch to a separate route or to the same page using server actions.
    // We'll do a simple fetch to an API-like endpoint below.

    const res = await fetch("/admin/routes/new/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ routeName, stops })
    });

    if (res.ok) {
      router.push("/admin/routes");
    } else {
      alert("Error creating route");
    }
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Create a New Route</h1>
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
          <label>Stops (comma-separated):</label>
          <input
            type="text"
            value={stops}
            onChange={(e) => setStops(e.target.value)}
          />
        </div>
        <button type="submit">Create Route</button>
      </form>
    </div>
  );
}
