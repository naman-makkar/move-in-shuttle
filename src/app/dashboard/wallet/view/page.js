// src/app/dashboard/wallet/view/page.js
"use client";
import { useState } from "react";

export default function WalletViewPage() {
  const [userId, setUserId] = useState("");
  const [walletBalance, setWalletBalance] = useState(null);
  const [error, setError] = useState("");

  async function handleCheck(e) {
    e.preventDefault();
    setError("");
    const res = await fetch(`/api/user/wallet?userId=${userId}`);
    const data = await res.json();
    if (res.ok) {
      setWalletBalance(data.walletBalance);
    } else {
      setError(data.error || "Error fetching wallet");
    }
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h1>View Wallet Balance</h1>
      <form onSubmit={handleCheck}>
        <div>
          <label>User ID: </label>
          <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} required />
        </div>
        <button type="submit">Check Wallet</button>
      </form>
      {walletBalance !== null && <p>Your wallet balance is: {walletBalance}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
