const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Middleware = require("../logic/middleware");

router.get('/', Middleware.checkAuthenticated, (req, res) => {
  // res.render('index.ejs', { name: req.user.name });
  res.render('users/index', { name: 'Mikael' });
})

router.get('/login', Middleware.checkNotAuthenticated, (req, res) => {
  res.render('users/login');
})

router.get('/register', Middleware.checkNotAuthenticated, (req, res) => {
  res.render('users/register');
})

router.post('/register', async (req, res) => {
  let user;
  try {
    // 10 refers to the strengt of the hash. The bigger the number the stronger the hash. 
    // But it will also take longe time to hash. 
    const hashPassword = await bcrypt.hash(req.body.password, 10);

    user = new User({
      displayname: req.body.displayname,
      username: req.body.username,
      password: hashPassword
    })
    await user.save();
    console.log(user)
    res.render('users/login');
  } catch {
    console.log(user)
    res.render('users/register');
  }
})


module.exports = router;