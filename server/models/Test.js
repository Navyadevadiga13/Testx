const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  question: String,
  options: [String]
});

const TestSchema = new mongoose.Schema({
  name: String,
  category: String,
  description: String,
  questions: [QuestionSchema]
});

module.exports = mongoose.model('Test', TestSchema);
