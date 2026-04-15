const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  type: { type: String, enum: ['deposit', 'withdrawal', 'trade'], required: true },
  amount: { type: Number, required: true },
  upiId: { type: String, default: null },
  status: { type: String, enum: ['completed', 'pending', 'failed'], default: 'pending' },
  time: { type: String, default: 'Just now' },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
