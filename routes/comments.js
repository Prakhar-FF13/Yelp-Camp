var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");

// add new comment form
router.get("/new", isLoggedIn,  function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		}
		else{
			res.render("comments/new", {campground: campground});
		}
	});
});

// post new comment.
router.post("/", isLoggedIn, function(req, res){
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
					//add username and id to comment.
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					campground.comments.push(comment);
					campground.save();
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
});

//Edit comment form
router.get("/:comment_id/edit", checkCommentOwnership, function(req, res){
		Comment.findById(req.params.comment_id, function(err, foundComment){
				if(err){
						res.redirect("back");
				}
				else{
						res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
				}
		});
});

//update comment
router.put("/:comment_id", checkCommentOwnership, function(req, res){
		Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
				if(err){
						res.redirect("back");
				}
				else{
						res.redirect("/campgrounds/" + req.params.id);
				}
		});
});

//delete comments
router.delete("/:comment_id", checkCommentOwnership, function(req, res){
		Comment.findByIdAndRemove(req.params.comment_id, function(err){
				if(err){
						res.redirect("back");
				}
				else{
						res.redirect("/campgrounds/" + req.params.id);
				}
		});
});

function checkCommentOwnership(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
				if(err){
						res.redirect("back");
				}
				else{
						if(foundComment.author.id.equals(req.user._id)){
								next();
						}else{
								res.redirect("back");
						}
				}
		});
	}else{
			res.redirect("back");
	}
}

function isLoggedIn(req, res, next){
		if(req.isAuthenticated()){
				return next();
		}
		else{
				res.redirect("/login");
		}
}

module.exports = router;
