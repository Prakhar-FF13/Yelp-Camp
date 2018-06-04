var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp");

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String
});

var Campground = mongoose.model("Campgrounds", campgroundSchema);

/*Campground.create({name: "Salmon Creek", image: "https://farm9.staticflickr.com/8577/16263386718_c019b13f77.jpg"});
Campground.create({name: "Granite Hill", image: "https://farm2.staticflickr.com/1363/1342367857_2fd12531e7.jpg"});
Campground.create({name: "Mountain Goat's Rest", image: "https://farm9.staticflickr.com/8309/7968772438_3e0935fab7.jpg"});*/

/*var campgrounds = [
		{name: "Salmon Creek", image: "https://farm9.staticflickr.com/8577/16263386718_c019b13f77.jpg"},
		{name: "Granite Hill", image: "https://farm2.staticflickr.com/1363/1342367857_2fd12531e7.jpg"},
		{name: "Mountain Goat's Rest", image: "https://farm9.staticflickr.com/8309/7968772438_3e0935fab7.jpg"},
		{name: "Salmon Creek", image: "https://farm9.staticflickr.com/8577/16263386718_c019b13f77.jpg"},
		{name: "Granite Hill", image: "https://farm2.staticflickr.com/1363/1342367857_2fd12531e7.jpg"},
		{name: "Mountain Goat's Rest", image: "https://farm9.staticflickr.com/8309/7968772438_3e0935fab7.jpg"},
		{name: "Salmon Creek", image: "https://farm9.staticflickr.com/8577/16263386718_c019b13f77.jpg"},
		{name: "Granite Hill", image: "https://farm2.staticflickr.com/1363/1342367857_2fd12531e7.jpg"},
		{name: "Mountain Goat's Rest", image: "https://farm9.staticflickr.com/8309/7968772438_3e0935fab7.jpg"}
	]*/

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
	var newCampground = {name: name, image: image};
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

app.listen(3000, function(){
	console.log("Yelp Camp Server has started");
});