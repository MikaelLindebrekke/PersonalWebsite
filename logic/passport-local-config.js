const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

function initialize(passport, getUserByEmail, getUserById) {
  // This is an arrowfunction that takes email, password and a function 'done' as parameters. 
  const authenticateUser = async (username, password, completed) => {
    const user = getUserByEmail(email);
    if (user == null) {
      return completed(null, false, { message: 'No user with that email' });
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        return completed(null, user);
      } else {
        return completed(null, false, { message: 'Password incorrect' });
      }
    } catch (err) {
      return completed(err);
    }

  }

  passport.use(new LocalStrategy(authenticateUser))
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    return done(null, getUserById(id))
  });
}

module.exports = initialize;