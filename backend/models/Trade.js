const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  type: { type: String, enum: ['buy', 'sell'], required: true },
  stock: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  total: { type: Number, required: true },
  time: { type: String, default: 'Just now' },
  status: { type: String, enum: ['completed', 'pending', 'failed'], default: 'completed' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });

module.exports = mongoose.model('Trade', tradeSchema);
