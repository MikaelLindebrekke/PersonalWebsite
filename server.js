if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// Load in all required packages
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const Middleware = require("./logic/middleware");

// Set all routers
const indexRouter = require('./routes/index');
const filmRouletteRouter = require('./routes/filmroulette');
const filmRouter = require('./routes/films');
const userRouter = require('./routes/users');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');

// Setup Passport
const initializePassport = require('./logic/passport-local-config');
initializePassport(passport);

// Set all use functions for app.
app.use(expressLayouts);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET, // ==> Secret key for the session 
  resave: false,                      // ==> Do you want to save session variables if nothing is changed? 
  saveUninitialized: false            // ==> Do you want to save empty variables? 
}));
app.use(passport.initialize());
app.use(passport.session());

// Middelware
app.use(Middleware.setUserMiddleware);

// Set up database connection
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL, {
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', error => console.error(error));
db.on('open', () => console.log('Connected to Mongoose'));

app.use('/', indexRouter);
app.use('/filmroulette', filmRouletteRouter);
app.use('/films', filmRouter);
app.use('/users', userRouter);

app.listen(process.env.PORT || 3000);