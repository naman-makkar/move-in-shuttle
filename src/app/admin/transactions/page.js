// src/app/admin/transactions/page.js
"use client";
import { useEffect, useState } from "react";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const res = await fetch("/api/admin/transactions");
        if (res.ok) {
          const data = await res.json();
          setTransactions(data);
        } else {
          setError("Failed to load transactions");
        }
      } catch (err) {
        setError("Error fetching transactions");
      }
    }
    fetchTransactions();
  }, []);

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Transaction Logs</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <ul>
          {transactions.map((tx) => (
            <li key={tx.transactionId}>
              <strong>{tx.type.toUpperCase()}</strong> of {tx.amount} points for user {tx.userId} on {new Date(tx.createdAt).toLocaleString()} — {tx.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
