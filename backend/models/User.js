const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  balance: { type: Number, default: 0 },
  trades: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' },
  kyc: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
  traderLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Pro'], default: 'Beginner' },
  joined: { type: String, default: 'Just now' },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
