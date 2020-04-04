/* eslint-disable linebreak-style */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */

const express = require('express');

const router = express.Router();
const Campground = require('../models/campground');
const middleware = require('../middleware');

// INDEX --
router.get('/', (req, res) => {
  // get all campgrounds from db
  Campground.find({}, (err, allCampgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render('campgrounds/index', { campgrounds: allCampgrounds });
    }
  });
});

// NEW
router.get('/new', middleware.isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});

// CREATE
router.post('/', middleware.isLoggedIn, (req, res) => {
  const { name } = req.body;
  const { image } = req.body;
  const desc = req.body.description;
  const author = {
    id: req.user._id,
    username: req.user.username,
  };
  const newCampgrounds = {
    name, image, description: desc, author,
  };
  Campground.create(newCampgrounds, (err, newlyCreated) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/campgrounds');
    }
  });
});

// SHOW
router.get('/:id', (req, res) => {
  Campground.findById(req.params.id).populate('comments').exec((err, foundCamp) => {
    if (err) {
      console.log(err);
    } else {
      res.render('campgrounds/show', { campground: foundCamp });
    }
  });
});

// EDIT
router.get('/:id/edit', middleware.checkForCampgroundAuthorization, (req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    res.render('campgrounds/edit', { campground: foundCampground });
  });
});

// UPDATE
router.put('/:id', middleware.checkForCampgroundAuthorization, (req, res) => {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
    if (err) {
      res.rediredt('/campgrounds');
    } else {
      res.redirect(`/campgrounds/${req.params.id}`);
    }
  });
});

// DELETE
router.delete('/:id', middleware.checkForCampgroundAuthorization, (req, res) => {
  Campground.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      res.redirect('/campgrounds');
    } else {
      req.flash('success', 'Campground has been deleted');
      res.redirect('/campgrounds');
    }
  });
});


module.exports = router;
