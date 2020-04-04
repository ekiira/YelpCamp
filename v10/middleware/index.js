var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.checkForCampgroundAuthorization = function(req, res, next) {
    // check is user is logged in
    if(req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCampground) {
           if(err) {
               res.redirect("back")
           } else {
            //    check if the user is the owner of the campground
                if(foundCampground.author.id.equals(req.user._id)) {
                    next();  
                } else{
                    res.redirect("back")
                }
            }
        });
    } else {
        res.redirect("back")
    }
}

middlewareObj.checkForCommentAuthorization = function(req, res, next) {
    // if user is logged in
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if (err) {
                res.redirect("back")
            } else {
               if(foundComment.author.id.equals(req.user._id)) {
                    next();
               } else {
                   res.redirect("back")
               }
            }
        });
    } else {
        res.redirect("back")
    }
};

// middleware login restriction
middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login")
};

module.exports = middlewareObj;
