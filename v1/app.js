var express = require("express")
var app = express();
var bodyParser = require("body-parser")

var campgrounds = [
    {name: "Rachel creek", image: "https://images.unsplash.com/photo-1480779735619-f73b30fdc062?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"},
    {name: "Top Mountains", image: "https://images.unsplash.com/photo-1505760894712-0cac55d259ff?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"},
    {name: "Rachel creek", image: "https://images.unsplash.com/photo-1540329957110-b87b06f5718e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"},
    {name: "Rachel creek", image: "https://images.unsplash.com/photo-1455763916899-e8b50eca9967?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"},
    {name: "Rachel creek", image: "https://images.unsplash.com/photo-1537165410262-1abc68541d8b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"},
    {name: "Rachel creek", image: "https://images.unsplash.com/photo-1559261567-2f844618aabf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"}
]

app.use(bodyParser.urlencoded({extended:true}))

app.set("view engine", "ejs")

app.get("/", function(req, res) {
    res.render("landing")
}
);

app.get("/view", function(req, res) {
    res.render("view", {campgrounds:campgrounds})
})

app.post("/view", function(req, res) {
    var name = req.body.name
    var image = req.body.image
    var newCampgrounds = {name: name, image:image}
    campgrounds.push(newCampgrounds)
    res.redirect("/view")
})

app.get("/view/add", function(req, res) {
    res.render("add")
})
app.listen(3000, function() {
    console.log("YelpV1 has started")
})