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
    
// requiring routes
var indexRoutes         = require("./routes/index"),
    commentRoutes       = require("./routes/comments"),
    campgroundRoutes    = require("./routes/campgrounds")

mongoose.connect("mongodb://localhost/yelp_camp_v6");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
// seedDB(); 
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

// quicker way to allow the varariable to be on all routes
app.use(function(req, res, next) {
    res.locals.currentUser  = req.user;
    next();
});

app.use("/",  indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

app.listen(3000, function() {
    console.log("YelpcampV9 has started")
});