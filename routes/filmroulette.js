const express = require('express');
const router = express.Router();
const Film = require('../models/film');
const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/user');
const Roulette = require('../logic/roulette');
const Middleware = require("../logic/middleware");


// Index page 
router.get('/', Middleware.checkAuthenticated, async (req, res) => {
  const unwatchedFilmsForUser = await Film.find({ watched: 'false', user: req.user.id }).exec();
  res.render('filmroulette/index', {
    allFilms: unwatchedFilmsForUser
  });
});

// View all films in users archive
router.get('/films', Middleware.checkAuthenticated, async (req, res) => {
  let searchOptions = {};
  if (req.query.title != null && req.query.title !== '') {
    searchOptions.title = new RegExp(req.query.title, 'i');
  }
  try {
    const films = await Film.find({ user: req.user.id }, searchOptions);
    res.render('films/index', {
      films: films,
      searchOptions: req.query
    });

  } catch (err) {
    res.redirect('/filmroulette');
  }
})

// Spins the roulette to select a film.
router.get('/spin', Middleware.checkAuthenticated, async (req, res) => {
  try {
    const unwatchedFilmsForUser = await Film.find({ watched: 'false', user: req.user.id }).exec();
    if (unwatchedFilmsForUser.length != 0) {
      const choosenFilm = Roulette.spin(unwatchedFilmsForUser)
      res.render('filmroulette/spin', {
        allFilms: unwatchedFilmsForUser,
        choosenFilm: choosenFilm
      });
    } else {
      const errorMessage = 'All films are watched. Add new films to spin the roulette.'
      res.render('filmroulette/index', {
        allFilms: unwatchedFilmsForUser,
        errorMessage: errorMessage
      })
    }

  } catch {
    res.redirect('filmroulette/index');
  }
})

// Mark a selected film as watched 
router.get('/watch/:id', Middleware.checkAuthenticated, async (req, res) => {
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

// Login page
router.get('/login', Middleware.checkNotAuthenticated, (req, res) => {
  res.render('filmroulette/login');
})

// Login action
router.post('/login', passport.authenticate('local', {
  successRedirect: '/filmroulette',
  failureRedirect: '/filmroulette/login',
  failureFlash: true
}))

// Register page
router.get('/register', Middleware.checkNotAuthenticated, (req, res) => {
  res.render('filmroulette/register');
})

// Register action
router.post('/register', Middleware.checkNotAuthenticated, async (req, res) => {
  let user;
  try {
    // 10 refers to the strengt of the hash. The bigger the number the stronger the hash. 
    // But it will also take longe time to hash. 
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    console.log('Hashed password: ' + hashPassword)
    user = new User({
      displayname: req.body.displayname,
      username: req.body.username,
      password: hashPassword
    })
    await user.save();
    res.render('filmroulette/login');
  } catch {
    res.render('filmroulette/register');
  }
})

// Logout action
router.delete('/logout', Middleware.checkAuthenticated, (req, res) => {
  req.logOut(error => {
    if (error) {
      return next(error);
    }
    res.redirect('/filmroulette/login');
  });
})

// ******************* User handling *******************



module.exports = router;