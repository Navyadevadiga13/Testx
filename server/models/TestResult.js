// server/models/TestResult.js
const mongoose = require('mongoose');

const TestResultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  testName: {
    type: String,
    required: true
  },
  result: {
    type: Object, // Stores the flexible JSON result (scores, types, etc.)
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('TestResult', TestResultSchema);
