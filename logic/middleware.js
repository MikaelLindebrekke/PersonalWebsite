
// To be used where you need to be authenticated to access.
// I.e. check if you are logged in. 
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/users');
}

// To be used where you do not need to be authenticated to access. 
// I.e. check that you are not logged in. 
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/filmroulette');
  }
  next();
}

// Sets the user data in the locals object for use across views during the session.
function setUserMiddleware(req, res, next) {
  res.locals.userExists = false;
  if (req.isAuthenticated) {
    res.locals.user = req.user;
    if (req.user) {
      res.locals.userExists = true;
    }
  }
  next();
}

module.exports = {
  checkAuthenticated,
  checkNotAuthenticated,
  setUserMiddleware
};
