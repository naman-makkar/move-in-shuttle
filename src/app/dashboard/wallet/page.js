// src/app/dashboard/wallet/page.js
"use client";
import { useState, useEffect } from "react";

export default function WalletPage() {
  const [userId, setUserId] = useState("");
  const [walletBalance, setWalletBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [rechargeAmount, setRechargeAmount] = useState(0);
  const [error, setError] = useState("");

  // Fetch wallet balance and transactions once userId is set
  async function fetchWalletInfo() {
    setError("");
    if (!userId) return;
    try {
      // 1) Fetch wallet balance
      let res = await fetch(`/api/user/wallet?userId=${userId}`);
      let data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to fetch wallet balance");
        return;
      }
      setWalletBalance(data.walletBalance);

      // 2) Fetch transaction logs
      res = await fetch(`/api/user/wallet/transactions?userId=${userId}`);
      data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to fetch transactions");
        return;
      }
      setTransactions(data);
    } catch (err) {
      console.error(err);
      setError("Error fetching wallet info");
    }
  }

  // Handle recharge
  async function handleRecharge(e) {
    e.preventDefault();
    setError("");
    if (!userId) {
      setError("Please enter userId first");
      return;
    }
    if (rechargeAmount <= 0) {
      setError("Recharge amount must be greater than 0");
      return;
    }
    try {
      const res = await fetch("/api/user/wallet/recharge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, amount: Number(rechargeAmount) })
      });
      const data = await res.json();
      if (res.ok) {
        alert(`Wallet recharged! New balance: ${data.walletBalance}`);
        // Refresh wallet info
        fetchWalletInfo();
        setRechargeAmount(0);
      } else {
        setError(data.error || "Recharge failed");
      }
    } catch (err) {
      console.error(err);
      setError("Error recharging wallet");
    }
  }

  function handleSubmitUserId(e) {
    e.preventDefault();
    fetchWalletInfo();
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h1>User Wallet Page</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Step 1: Enter userId (for testing) */}
      <form onSubmit={handleSubmitUserId} style={{ marginBottom: "1rem" }}>
        <label>Enter User ID: </label>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        />
        <button type="submit">Load Wallet Info</button>
      </form>

      {/* Step 2: Display wallet balance */}
      {walletBalance !== null && (
        <div style={{ marginBottom: "1rem" }}>
          <h2>Wallet Balance: {walletBalance}</h2>
        </div>
      )}

      {/* Step 3: Transaction logs */}
      {transactions.length > 0 && (
        <div style={{ marginBottom: "1rem" }}>
          <h2>Transaction History</h2>
          <ul>
            {transactions.map((tx) => (
              <li key={tx._id}>
                {new Date(tx.createdAt).toLocaleString()} -{" "}
                <strong>{tx.type.toUpperCase()}</strong> {tx.amount} points
                {tx.description ? ` (${tx.description})` : ""}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Step 4: Recharge form */}
      {walletBalance !== null && (
        <form onSubmit={handleRecharge}>
          <label>Recharge Amount: </label>
          <input
            type="number"
            value={rechargeAmount}
            onChange={(e) => setRechargeAmount(e.target.value)}
          />
          <button type="submit">Recharge</button>
        </form>
      )}
    </div>
  );
}
