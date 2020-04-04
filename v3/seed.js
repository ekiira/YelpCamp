var mongoose = require('mongoose');
var Campground = require("./models/campground");
var Comment     =   require("./models/comment")
var data = [
    {
        name:   "Cloud's rest",
        image:  "https://images.unsplash.com/photo-1477581265664-b1e27c6731a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60", 
        description:   "blah blah blah"
    },
    {
        name:   "Desert Mesa",
        image:  "https://images.unsplash.com/photo-1533576182743-b0e2d2c9d7a2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60", 
        description:   "blah blah blah"
    },
    {
        name:   "Canyon Floor",
        image:  "https://images.unsplash.com/photo-1529335368860-022a22e0a944?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60", 
        description:   "blah blah blah"
    }
]

function seedDB() {
    // To remove campgrounds
    Campground.remove({}, function(err) {
        if(err) {
            console.log(err)
        }
        console.log("removed campgrounds")
          // Add a few campgrounds
    data.forEach(function(seed) {
        Campground.create(seed, function(err, campground) {
            if(err) {
                console.log(err)
            } else {
                console.log("added campgrounds");
                // create a comment
                Comment.create(
                    {
                        text:   "This place is great, but I wish there was internet",
                        author: "Homer"
                    }, function(err, comment) {
                        if (err) {
                            console.log(err);
                        } else {
                            campground.comments.push(comment);
                            campground.save();
                            console.log("Created a new comment")
                        }
                        
                    }
                )
            }
        })
    })
    });
    
  
}


module.exports = seedDB;