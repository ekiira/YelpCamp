/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable new-cap */
/* eslint-disable no-unused-vars */

const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');
const methodOverride = require('method-override');
const User = require('./models/user');
const Campground = require('./models/campground');
const Comment = require('./models/comment');
const seedDB = require('./seed');

// requiring routes
const indexRoutes = require('./routes/index');
const commentRoutes = require('./routes/comments');
const campgroundRoutes = require('./routes/campgrounds');

mongoose.connect('mongodb://localhost/yelp_camp_v6');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
// to seed the database
// seedDB();
app.use(express.static(`${__dirname}/public`));
app.use(flash());


// PASSPORT CONFIGURATION
app.use(require('express-session')({
  secret: 'Still going to be the best year',
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// quicker way to allow the variable to be on all routes
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

app.use('/', indexRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);
app.use('/campgrounds', campgroundRoutes);

app.listen(3000, () => {
  console.log('YelpcampV11 has started');
});
