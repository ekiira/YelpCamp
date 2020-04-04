var express     =   require("express"),
    app         =   express(),
    bodyParser  =   require("body-parser"),
    mongoose    =   require("mongoose")

mongoose.connect("mongodb://localhost/yelp_camp")
app.use(bodyParser.urlencoded({extended:true}))

app.set("view engine", "ejs")

// SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

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
app.get("/view", function(req, res) {
    // get all campgrounds from db
    Campground.find({}, function(err, allCampgrounds) {
        if(err){
            console.log(err);
        } else{
            res.render("view", {campgrounds:allCampgrounds});
        }
    });
    
});
// CREATE
app.post("/view", function(req, res) {
    var name = req.body.name
    var image = req.body.image
    var desc = req.body.description
    var newCampgrounds = {name: name, image:image, description: desc}
    Campground.create(newCampgrounds, function(err, newlyCreated){
        if(err) {
            console.log(err)
        } else {
            res.redirect("/view")
        }
    })
    
})
// NEW
app.get("/view/add", function(req, res) {
    res.render("add")
})

// SHOW
app.get("/view/:id", function(req, res) {
    Campground.findById(req.params.id, function(err, foundCamp) {
        if(err) {
            console.log(err);
        } else {
            res.render("show", {view: foundCamp})
        }
      })
    
})
app.listen(3000, function() {
    console.log("YelpV2 has started")
})