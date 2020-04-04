var mongoose = require('mongoose');
var Campground = require("./models/campground")

function seedDB() {
    // To remove all campgrounds
    Campground.remove({}, function(err) {
        if(err) {
            console.log(err)
        }
        console.log("removed campgrounds")
    });
    // Add few campgrounds
}


module.exports = seedDB;