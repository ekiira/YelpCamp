var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");

// INDEX -- 
router.get("/", function(req, res) {
    // get all campgrounds from db
    Campground.find({}, function(err, allCampgrounds) {
        if(err){
            console.log(err);
        } else{
            res.render("campgrounds/index", {campgrounds:allCampgrounds});
        }
    });
    
});

// NEW
router.get("/new", function(req, res) {
    res.render("campgrounds/new")
});

// CREATE
router.post("/",  function(req, res) {
    var name = req.body.name
    var image = req.body.image
    var desc = req.body.description
    var newCampgrounds = {name: name, image:image, description: desc}
    Campground.create(newCampgrounds, function(err, newlyCreated){
        if(err) {
            console.log(err)
        } else {
            res.redirect("/campgrounds")
        }
    }); 
});

// SHOW
router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp) {
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/show", {campground: foundCamp})
        }
    });  
});

module.exports = router;
  