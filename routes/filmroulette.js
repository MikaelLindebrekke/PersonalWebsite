const express = require('express');
const router = express.Router();

// All films
router.get('/', async (req, res) => {
  res.render('filmroulette/index');
})

// New films
router.get('/new', (req, res) => {
  res.render('filmroulette/new', { film: new film() });
})
module.exports = router;