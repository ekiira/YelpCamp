var express                 =   require("express"),
    app                     =   express(),
    bodyParser              =   require("body-parser"),
    mongoose                =   require("mongoose"),
    passport                =   require("passport"),
    User                    =   require("./models/user"),
    localStrategy           =   require("passport-local"),
    passportLocalMongoose   =   require("passport-local-mongoose"),
    Campground              =   require("./models/campground"),
    Comment                 =   require("./models/comment"),
    seedDB                  =   require("./seed")
    

mongoose.connect("mongodb://localhost/yelp_camp_v6");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
seedDB();
app.use(express.static(__dirname + "/public"))


// PASSPORT CONFIGURATION
app.use(require("express-session") ({
    secret: "Still going to be the best year",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// quicker way to allow the var to be on all routes
app.use(function(req, res, next) {
    res.locals.currentUser  = req.user;
    next();
})

// ROUTES
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
app.get("/campgrounds/:id/comments/new",isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground})
        }
    });
});

app.post("/campgrounds/:id/comments",isLoggedIn, function(req, res) {
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

// auth routes
// signup
app.get("/register", function(req, res) {
    res.render("register")
})
app.post("/register", function(req, res) {
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
app.get("/login", function(req, res) {
    res.render("login")
});
// login logic
var passportAuth =  passport.authenticate("local", 
{
    successRedirect:    "/campgrounds",
    failureRedirect:    "/login"
});
app.post("/login",passportAuth ,function(req, res)  {
});

// logout logic
app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/campgrounds")
});

// middleware login restriction
function isLoggedIn (req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login")
}
app.listen(3000, function() {
    console.log("YelpV6 has started")
})