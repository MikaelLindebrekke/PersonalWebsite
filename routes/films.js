const express = require('express');
const router = express.Router();
const Film = require('../models/film');
const imageMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];


// All films route
router.get('/', async (req, res) => {

  let searchOptions = {};
  if (req.query.name != null && req.query.name !== '') {
    searchOptions.title = new RegExp(req.query.name, 'i');
  }
  try {
    const films = await Film.find(searchOptions);
    res.render('films/index', {
      films: films,
      searchOptions: req.query
    });

  } catch {
    res.redirect('/');
  }
})

// New film Route
router.get('/new', (req, res) => {
  res.render('films/new', { film: new Film() });
})

// Create new Film
router.post('/', async (req, res) => {
  const film = new Film({
    title: req.body.title,
    released: req.body.released,
    genre: req.body.genre,
    rating: req.body.rating,
    runtime: req.body.runtime

  });
  console.log(film);
  try {
    const newFilm = await film.save();
    // 
    console.log('Success.');
    res.redirect('films');
  } catch {
    // 
    console.log('Error.' + film.title);
    res.render('films/new', {
      film: film,
      errorMessage: 'Error creating Film'
    });
  }
})

module.exports = router;