// src/models/Transaction.js
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const TransactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  userId: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,  // Positive for credit, negative for debit
  },
  type: {
    type: String,
    enum: ['credit', 'debit'],
    required: true,
  },
  description: {
    type: String,
  }
}, {
  timestamps: true,
});

export default mongoose.models.Transaction || mongoose.model("Transaction", TransactionSchema);
