const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  testId: { type: String, required: true }, // e.g., 'bigfive', 'mbti'
  score: { type: mongoose.Schema.Types.Mixed, required: true }, // Stores the final score object
  rawAnswers: { type: mongoose.Schema.Types.Mixed }, // Stores user's raw inputs (optional)
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Result', ResultSchema);
