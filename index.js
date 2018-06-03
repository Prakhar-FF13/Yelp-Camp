var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

app.get("/", function(req, res){
	res.render("landing");
});

app.get("/campgrounds", function(req, res){
	var campgrounds = [
		{name: "Salmon Creek", image: "https://pixabay.com/get/e83db50a21f4073ed1584d05fb1d4e97e07ee3d21cac104497f7c87ba0e8bcbd_340.jpg"},
		{name: "Granite Hill", image: "https://farm2.staticflickr.com/1363/1342367857_2fd12531e7.jpg"},
		{name: "Mountain Goat's Rest", image: "https://pixabay.com/get/e837b1072af4003ed1584d05fb1d4e97e07ee3d21cac104497f7c87ba0e8bcbd_340.jpg"}
	]
	res.render("campgrounds", {campgrounds: campgrounds});
});

app.post("/campgrounds", function(req, res){
	//get data from form and redirect to form page.
	
});

app.listen(3000, function(){
	console.log("Yelp Camp Server has started");
});