const mongoose = require('mongoose');

const holdingSchema = new mongoose.Schema({
  symbol: { type: String, required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  avgPrice: { type: Number, required: true },
  currentPrice: { type: Number, required: true },
  invested: { type: Number, required: true },
  currentValue: { type: Number, required: true },
  pnl: { type: Number, required: true },
  pnlPercent: { type: Number, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });

module.exports = mongoose.model('Holding', holdingSchema);
