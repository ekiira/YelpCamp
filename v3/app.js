var express     =   require("express"),
    app         =   express(),
    bodyParser  =   require("body-parser"),
    mongoose    =   require("mongoose"),
    Campground  =   require("./models/campground")
    seedDB      =   require("./seed")
    
seedDB();
mongoose.connect("mongodb://localhost/yelp_camp_v3")
app.use(bodyParser.urlencoded({extended:true}))

app.set("view engine", "ejs")


// Campground.create(
//     {
//         name: "Thee sons' Mountain", 
//         image: "https://images.unsplash.com/photo-1505760894712-0cac55d259ff?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
//         description: "Mountains that enhance you with it's splendor"
//     }
//     , function(err, campground){
//         if(err){
//             console.log(err);
//         } else {
//             console.log("NEWLY CREATED: ")
//             console.log(campground);
//         }
//     }); 

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
            res.render("index", {campgrounds:allCampgrounds});
        }
    });
    
});

// NEW
app.get("/campgrounds/new", function(req, res) {
    res.render("new")
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
            res.render("show", {campground: foundCamp})
        }
      })
    
})
app.listen(3000, function() {
    console.log("YelpV3 has started")
})