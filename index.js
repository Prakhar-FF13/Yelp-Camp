var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp");

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String
});

var Campground = mongoose.model("Campgrounds", campgroundSchema);

/*Campground.create({name: "Salmon Creek", 
	image: "https://farm9.staticflickr.com/8577/16263386718_c019b13f77.jpg",
	description: "This place is quite famous for camping as it is close to nature, river sounds make it more elegant"});
Campground.create({name: "Granite Hill",
	image: "https://farm2.staticflickr.com/1363/1342367857_2fd12531e7.jpg",
	description: "This place is famous for its beautiful granite rocks. A lot of people always gather here to enjoy the starry sky."});
Campground.create({name: "Mountain Goat's Rest", image: "https://farm9.staticflickr.com/8309/7968772438_3e0935fab7.jpg",
	description: "This place in the middle of a forest is the closest you can get to the nature. Completely safe for camping."});*/

app.get("/", function(req, res){
	res.render("landing");
});

app.get("/campgrounds", function(req, res){
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		}
		else{
			res.render("campgrounds", {campgrounds: allCampgrounds});		
		}
	});
});

app.post("/campgrounds", function(req, res){
	//get data from form and redirect to form page.
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var newCampground = {name: name, image: image, description: desc};
	Campground.create(newCampground, function(err, newCampground){
		if(err){
			console.log(err);
		}
		else{
			res.redirect("/campgrounds");
		}
	});
});

app.get("/campgrounds/new", function(req, res){
	res.render("new");
});

app.get("/campgrounds/:id", function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			console.log(err);
		}
		else{
			res.render("show", {campground: foundCampground});
		}
	});
});

app.listen(3000, function(){
	console.log("Yelp Camp Server has started");
});