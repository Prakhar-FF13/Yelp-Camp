var express = require("express"),
app 		    = express(),
bodyParser  = require("body-parser"),
mongoose    = require("mongoose"),
Campground  = require("./models/campground"),
seedDB      = require("./seeds"),
Comment     = require("./models/comment");

seedDB();

mongoose.connect("mongodb://localhost/yelp_camp");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

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
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		}
		else{
			res.render("show", {campground: foundCampground});
		}
	});
});

app.get("/campgrounds/:id/comments/new", function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		}
		else{
			res.render("comments/new", {campground: campground});
		}
	});
});

app.post("/campgrounds/:id/comments", function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}
		else{
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
				}
				else{
					campground.comments.push(comment);
					campground.save();
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
});

app.listen(3000, function(){
	console.log("Yelp Camp Server has started");
});
