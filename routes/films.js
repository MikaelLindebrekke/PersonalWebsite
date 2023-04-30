const express = require('express');
const router = express.Router();
const Film = require('../models/film');
const imageMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];


// All films route
router.get('/', async (req, res) => {

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
    runtime: req.body.runtime,
    imdbRating: req.body.imdbRating,
    rtRating: req.body.rtRating
  });
  //
  console.log('Created film: ' + film);

  try {
    const newFilm = await film.save();
    // 
    console.log('Saved successfully.');
    res.redirect('films');
  } catch {
    // 
    console.log('Error saving ' + film.title);
    res.render('films/new', {
      film: film,
      errorMessage: 'Error creating Film'
    });
  }
})

// Show film
router.get('/:id', async (req, res) => {
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
router.get('/:id/edit', async (req, res) => {
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
router.put('/:id', async (req, res) => {
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
    //
    console.log('film updated!');

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
router.delete('/:id', async (req, res) => {
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