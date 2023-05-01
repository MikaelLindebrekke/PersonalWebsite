const express = require('express');
const router = express.Router();
const Film = require('../models/film');
const FilmRoulette = require('../models/filmRoulette')

// All films
router.get('/', async (req, res) => {
  let emptyFilter = {};
  try {
    const allFilms = await Film.find(emptyFilter);
    console.log('Spinning');
    const choosenFilm = FilmRoulette.spin(allFilms)
    console.log(choosenFilm);
    res.render('filmroulette/index', {
      allFilms: allFilms,
      choosenFilm: choosenFilm
    });

  } catch {
    console.log('Didnt work')
    res.redirect('/');
  }
})


module.exports = router;