// src/app/admin/users/[userId]/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function EditUserPage() {
  const router = useRouter();
  const path = usePathname();
  const userId = path.split("/").pop();

  const [email, setEmail] = useState("");
  const [walletBalance, setWalletBalance] = useState(0);
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch(`/api/user/${userId}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data) {
        setEmail(data.email);
        setWalletBalance(data.walletBalance);
        setRole(data.role);
      }
    }
    fetchUser();
  }, [userId]);

  async function handleUpdate(e) {
    e.preventDefault();
    setError("");
    const res = await fetch(`/api/user/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ walletBalance, role })
    });
    if (res.ok) {
      router.push("/admin/users");
    } else {
      const data = await res.json();
      setError(data.error || "Update failed");
    }
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Edit User</h1>
      <p>Email: {email}</p>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleUpdate}>
        <div>
          <label>Wallet Balance: </label>
          <input
            type="number"
            value={walletBalance}
            onChange={(e) => setWalletBalance(Number(e.target.value))}
            required
          />
        </div>
        <div>
          <label>Role: </label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit">Update User</button>
      </form>
    </div>
  );
}
