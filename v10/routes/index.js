var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");



// ROUTES
router.get("/", function(req, res) {
    res.render("landing")
});

// auth routes
// signup
router.get("/register", function(req, res) {
    res.render("register")
});

// signup logic
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, function(err, user) {
        if(err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function() {
            res.redirect("/campgrounds")
        });
    });
});

// login
router.get("/login", function(req, res) {
    res.render("login")
});

// middleware
var passportAuth =  passport.authenticate("local", 
{
    successRedirect:    "/campgrounds",
    failureRedirect:    "/login"
});
router.post("/login",passportAuth ,function(req, res)  {
});

// logout logic
router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/campgrounds")
});

// middleware login restriction
function isLoggedIn (req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login")
};

module.exports = router;  