const express = require('express');
const router = express.Router();
const Film = require('../models/film');
const Roulette = require('../logic/roulette');
const Middleware = require("../logic/middleware");


// All films
router.get('/', Middleware.checkAuthenticated, async (req, res) => {
  try {
    const allFilms = await Film.find({ watched: 'false', user: req.body.user }).exec();

    res.render('filmroulette/index', {
      allFilms: allFilms
    });

  } catch {
    res.redirect('/');
  }
});

// All films route
router.get('/films', Middleware.checkAuthenticated, async (req, res) => {

  let searchOptions = {};
  if (req.query.title != null && req.query.title !== '') {
    searchOptions.title = new RegExp(req.query.title, 'i');
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

router.get('/spin', Middleware.checkAuthenticated, async (req, res) => {
  try {
    const allFilms = await Film.find({ watched: 'false', user: req.body.user }).exec();
    if (allFilms.length != 0) {
      const choosenFilm = Roulette.spin(allFilms)
      res.render('filmroulette/spin', {
        allFilms: allFilms,
        choosenFilm: choosenFilm
      });
    } else {
      const errorMessage = 'All films are watched. Add new films to spin the roulette.'
      res.render('filmroulette/index', {
        allFilms: allFilms,
        errorMessage: errorMessage
      })
    }

  } catch {
    res.redirect('filmroulette/index');
  }
})

router.get('/:id', Middleware.checkAuthenticated, async (req, res) => {
  try {
    const choosenFilm = await Film.findById(req.params.id);
    choosenFilm.watched = true;
    choosenFilm.save();
    res.render('filmroulette/watch', {
      choosenFilm: choosenFilm
    })
  } catch {
    res.redirect('spin');
  }
})


module.exports = router;