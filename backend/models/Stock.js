const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  symbol: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  change: { type: Number, default: 0 },
  volume: { type: String, default: '0' },
  ltp: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Stock', stockSchema);
