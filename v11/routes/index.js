/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
const express = require('express');

const router = express.Router();
const passport = require('passport');
const User = require('../models/user');


// ROUTES
router.get('/', (req, res) => {
  res.render('landing');
});

// auth routes
// signup
router.get('/register', (req, res) => {
  res.render('register');
});

// signup logic
router.post('/register', (req, res) => {
  const newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      req.flash('error', err.message);
      res.redirect('/register');
    }
    passport.authenticate('local')(req, res, () => {
      req.flash('success', `Welcome to YelpCamp ${user.username}`);
      res.redirect('/campgrounds');
    });
  });
});

// login
router.get('/login', (req, res) => {
  res.render('login');
});

// middleware
const passportAuth = passport.authenticate('local',
  {
    successRedirect: '/campgrounds',
    failureRedirect: '/login',
  });
router.post('/login', passportAuth, (req, res) => {
});

// logout logic
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'You have been logged out');
  res.redirect('/campgrounds');
});

module.exports = router;
