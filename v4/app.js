var express     =   require("express"),
    app         =   express(),
    bodyParser  =   require("body-parser"),
    mongoose    =   require("mongoose"),
    Campground  =   require("./models/campground")
    Comment     =   require("./models/comment")
    seedDB      =   require("./seed")
    

mongoose.connect("mongodb://localhost/yelp_camp_v3")
app.use(bodyParser.urlencoded({extended:true}))
app.set("view engine", "ejs");
seedDB();


app.get("/", function(req, res) {
    res.render("landing")
})
// INDEX -- 
app.get("/campgrounds", function(req, res) {
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
app.get("/campgrounds/new", function(req, res) {
    res.render("campgrounds/new")
})

// CREATE
app.post("/campgrounds", function(req, res) {
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
    })
    
})

// SHOW
app.get("/campgrounds/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp) {
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/show", {campground: foundCamp})
        }
      })
    
})

    // =======================
    //     COMMENT ROUTES
    // =======================
app.get("/campgrounds/:id/comments/new", function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground})
        }
    });
});

app.post("/campgrounds/:id/comments", function(req, res) {
    Campground.findById(req.params.id, function(err, campground){
        if(err){
           res.redirect("/campgrounds")
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if(err) {
                    console.log(err)
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            })
        }
    })
   
})

app.listen(3000, function() {
    console.log("YelpV4 has started")
})