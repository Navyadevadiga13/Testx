const express = require('express');
const router = express.Router();
const Test = require('../models/Test');

// Get all tests
router.get('/', async (req, res) => {
  const tests = await Test.find();
  res.json(tests);
});

// Get tests by category
router.get('/:category', async (req, res) => {
  const category = req.params.category;
  const tests = await Test.find({ category });
  res.json(tests);
});

// Get test by ID
router.get('/test/:id', async (req, res) => {
  const test = await Test.findById(req.params.id);
  if (!test) return res.status(404).json({ error: 'Test not found' });
  res.json(test);
});

module.exports = router;
