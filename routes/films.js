const express = require('express');
const router = express.Router();
const Film = require('../models/film');
const Middleware = require("../logic/middleware");
const imageMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];


// All films route
router.get('/', Middleware.checkAuthenticated, async (req, res) => {
  res.redirect('/filmroulette/films');
})

router.get('/archive', Middleware.checkAuthenticated, async (req, res) => {

  let searchOptions = {};
  if (req.query.title != null && req.query.title !== '') {
    searchOptions.title = new RegExp(req.query.title, 'i');
  }
  try {
    const films = await Film.find(searchOptions);
    res.render('films/archive', {
      films: films,
      searchOptions: req.query
    });

  } catch {
    console.log('Error with getting archive')
    res.redirect('/filmroulette');
  }
})

// New film Route
router.get('/new', Middleware.checkAuthenticated, (req, res) => {
  res.render('films/new', { film: new Film() });
})

// Create new Film
router.post('/', Middleware.checkAuthenticated, async (req, res) => {

  const film = new Film({
    title: req.body.title,
    released: req.body.released,
    genre: req.body.genre,
    runtime: req.body.runtime,
    imdbRating: req.body.imdbRating,
    rtRating: req.body.rtRating,
    user: req.user.id
  });
  try {
    const newFilm = await film.save();
    res.redirect('films');
  } catch {
    res.render('films/new', {
      film: newFilm,
      errorMessage: 'Error creating Film'
    });
  }
})

// Creates a new film and adds it to the archive of the logged in user
router.post('/add/:id', Middleware.checkAuthenticated, async (req, res) => {
  try {
    const addFilm = await Film.findById(req.params.id);

    const film = new Film({
      title: addFilm.title,
      released: addFilm.released,
      genre: addFilm.genre,
      runtime: addFilm.runtime,
      imdbRating: addFilm.imdbRating,
      rtRating: addFilm.rtRating,
      user: req.user.id
    });
    await film.save();
    res.redirect('/filmroulette/films');
  } catch {
    res.redirect('films/archive');
  }
})

// Show film
router.get('/:id', Middleware.checkAuthenticated, async (req, res) => {
  try {
    const film = await Film.findById(req.params.id);
    res.render('films/show', {
      film: film
    })
  } catch {
    res.redirect('/');
  }
})

// Edit Film
router.get('/:id/edit', Middleware.checkAuthenticated, async (req, res) => {
  try {
    const film = await Film.findById(req.params.id);
    res.render('films/edit', {
      film: film
    })
  } catch {
    res.redirect('/films');
  }
})

// Update Film
router.put('/:id', Middleware.checkAuthenticated, async (req, res) => {
  let film;
  try {
    film = await Film.findById(req.params.id);
    film.title = req.body.title;
    film.released = req.body.released;
    film.genre = req.body.genre;
    film.runtime = req.body.runtime;
    film.imdbRating = req.body.imdbRating;
    film.rtRating = req.body.rtRating;
    film.mikellyRating = req.body.mikellyRating;
    if (req.body.watched == 'on') {
      film.watched = true;
    } else {
      film.watched = false;
    }
    film.comments = req.body.comments;
    await film.save();
    res.redirect(`/films/${film.id}`);
  } catch {
    if (film != null) {
      console.log('Error updating film.');
    } else {
      res.redirect('/');
    }
  }

})


// Delete Film
router.delete('/:id', Middleware.checkAuthenticated, async (req, res) => {
  let film;

  try {
    film = await Film.findById(req.params.id);
    await film.deleteOne();
    res.redirect('/films');
  } catch {
    if (film == null) {
      res.redirect('/');
    } else {
      res.redirect(`/films/${film.id}`);
    }
  }
})

module.exports = router;