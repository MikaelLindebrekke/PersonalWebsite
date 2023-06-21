const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/user');

function initialize(passport) {
  // This is an arrowfunction that takes username, password and a function 'completed' as parameters. 
  const authenticateUser = async (username, password, completed) => {
    const user = await User.findOne({ username: username }).exec();
    if (user == null) {
      return completed(null, false, { message: 'No user with that username' });
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        return completed(null, user);
      } else {
        return completed(null, false, { message: 'Password incorrect' });
      }
    } catch (error) {
      return completed(error);
    }

  }

  passport.use(new LocalStrategy(authenticateUser))
  passport.serializeUser((user, completed) => completed(null, user.id));
  passport.deserializeUser(async (id, completed) => {
    try {
      // Assuming you have a User model and can retrieve a user by its id
      const user = await User.findById(id);
      completed(null, user);
    } catch (error) {
      completed(error, null);
    }
  });
}

module.exports = initialize;