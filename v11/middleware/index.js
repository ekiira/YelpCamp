/* eslint-disable linebreak-style */
/* eslint-disable consistent-return */
/* eslint-disable no-lonely-if */
/* eslint-disable no-underscore-dangle */

const Campground = require('../models/campground');
const Comment = require('../models/comment');

const middlewareObj = {};


middlewareObj.checkForCampgroundAuthorization = (req, res, next) => {
  // check is user is logged in
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, (err, foundCampground) => {
      if (err) {
        req.flash('error', 'Campground not found');
        res.redirect('back');
      } else {
        //    check if the user is the owner of the campground
        if (foundCampground.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash('error', "You don't have permission to do that");
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error', 'You need to be logged in to do that');
    res.redirect('back');
  }
};

middlewareObj.checkForCommentAuthorization = (req, res, next) => {
  // if user is logged in
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err) {
        res.redirect('back');
      } else if (foundComment.author.id.equals(req.user._id)) {
        next();
      } else {
        req.flash('error', "You don't have permission to do that");
        res.redirect('back');
      }
    });
  } else {
    req.flash('error', 'You need to be logged in to do that');
    res.redirect('back');
  }
};

// middleware login restriction
middlewareObj.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'You need to be logged in to do that');
  res.redirect('/login');
};

module.exports = middlewareObj;
