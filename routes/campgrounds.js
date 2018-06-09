var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
// Display Campgrounds
router.get("/", function(req, res){
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		}
		else{
			res.render("campgrounds", {campgrounds: allCampgrounds});
		}
	});
});

// Add a new Campground
router.post("/", isLoggedIn, function(req, res){
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
			id: req.user._id,
			username: req.user.username
	};
	var newCampground = {name: name, image: image, description: desc, author: author};
	Campground.create(newCampground, function(err, newCampground){
		if(err){
			console.log(err);
		}
		else{
			res.redirect("/campgrounds");
		}
	});
});

// Display new campground form
router.get("/new", isLoggedIn, function(req, res){
	res.render("new");
});

// Display more info about a partiular campground.
router.get("/:id", function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		}
		else{
			res.render("show", {campground: foundCampground});
		}
	});
});

//Edit Campground route.
router.get("/:id/edit", checkCampgroundOwnership, function(req, res){
			Campground.findById(req.params.id, function(err, foundCampground){
					res.render("edit", {campground: foundCampground});
			});
});

//update campground
router.put("/:id", checkCampgroundOwnership, function(req, res){
		var data = {name:req.body.name, image:req.body.image, description:req.body.description};
		Campground.findByIdAndUpdate(req.params.id, data, function(err, updatedCampground){
					if(err){
							res.redirect("/campgrounds");
					}
					else{
							res.redirect("/campgrounds/" + req.params.id);
					}
		});
});

//delete campground
router.delete("/:id", checkCampgroundOwnership, function(req, res){
		Campground.findByIdAndRemove(req.params.id, function(err){
				if(err){
						res.redirect("/campgrounds");
				}else{
						res.redirect("/campgrounds");
				}
		});
});


function isLoggedIn(req, res, next){
		if(req.isAuthenticated()){
				return next();
		}
		else{
				res.redirect("/login");
		}
}

function checkCampgroundOwnership(req, res, next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundCampground){
				if(err){
						res.redirect("back");
				}
				else{
						if(foundCampground.author.id.equals(req.user._id)){
								res.render("edit", {campground: foundCampground});
						}else{
								res.send("you dont have permission to do that");
						}
				}
		});
	}else{
			res.redirect("back");
	}
}
module.exports = router;
