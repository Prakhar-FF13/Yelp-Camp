var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObject = {};

middlewareObject.checkCampgroundOwnership = function(req, res, next){
  if(req.isAuthenticated()){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            res.redirect("back");
        }
        else{
            if(foundCampground.author.id.equals(req.user._id)){
                next();
            }else{
                req.flash("error", "You don't have permission to do that.");
                res.redirect("back");
            }
        }
    });
  }else{
    req.flash("error", "You need to be logged in to do that");
      res.redirect("back");
  }
}
middlewareObject.checkCommentOwnership = function(req, res, next){
  if(req.isAuthenticated()){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        }
        else{
            if(foundComment.author.id.equals(req.user._id)){
                next();
            }else{
                req.flash("error", "You don't have permission to do that.");
                res.redirect("back");
            }
        }
    });
  }else{
      req.flash("You need to be logged in to do that.");
      res.redirect("back");
  }
}

middlewareObject.isLoggedIn = function(req, res, next){
		if(req.isAuthenticated()){
				return next();
		}
		else{
        req.flash("error", "You need to be logged in to do that.");
				res.redirect("/login"); // message is displayed on /login
		}
}


module.exports = middlewareObject;
