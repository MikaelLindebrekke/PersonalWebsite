const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/user');
const Middleware = require("../logic/middleware");

// Index Page for users
router.get('/', Middleware.checkNotAuthenticated, async (req, res) => {
  try {
    const allUsers = await User.find().exec();
    res.render('users/index', {
      allUsers: allUsers
    });
  } catch {
    res.render('/');
  }

})

// Login page
router.get('/login', Middleware.checkNotAuthenticated, (req, res) => {
  res.render('users/login');
})


router.post('/login', Middleware.checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/filmroulette',
  failureRedirect: '/users/login',
  failureFlash: true
}))

router.get('/register', Middleware.checkNotAuthenticated, (req, res) => {
  res.render('users/register');
})

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
    res.render('users/login');
  } catch {
    res.render('users/register');
  }
})

// Logout User
router.delete('/logout', Middleware.checkAuthenticated, (req, res) => {
  req.logOut(error => {
    if (error) {
      return next(error);
    }
    res.render('users/login')
  });
})



// ******** REMOVE ******************************

// Show user
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.render('users/show', {
      user: user
    })
  } catch {
    res.redirect('/');
  }
})

// Delete User
router.delete('/:id', async (req, res) => {
  let user;

  try {
    user = await User.findById(req.params.id);
    await user.deleteOne();
    res.redirect('/users');
  } catch {
    if (user == null) {
      res.redirect('/');
    } else {
      res.redirect(`/users/${user.id}`);
    }
  }
})

// ******** REMOVE ******************************


module.exports = router;