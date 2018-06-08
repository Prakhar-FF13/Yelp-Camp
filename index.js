var express    = require("express"),
app 		       = express(),
bodyParser     = require("body-parser"),
mongoose       = require("mongoose"),
passport       = require("passport"),
LocalStrategy  = require("passport-local"),
Campground     = require("./models/campground"),
User           = require("./models/user"),
seedDB         = require("./seeds"),
Comment        = require("./models/comment");

seedDB();

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

app.use(require("express-session")({
			secret: "Secret, I have lots of them !!",
			resave: false,
			saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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

app.get("/campgrounds/:id/comments/new", isLoggedIn,  function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		}
		else{
			res.render("comments/new", {campground: campground});
		}
	});
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
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

app.get("/register", function(req, res){
		res.render("register");
});

app.post("/register", function(req, res){
		var newUser = new User({username: req.body.username});
		User.register(newUser, req.body.password, function(err, user){
				if(err){
					console.log(err);
					return res.render("register");
				}
				else{
					passport.authenticate("local")(req, res, function(){
							res.redirect("/campgrounds");
					});
				}
		});

});

app.get("/login", function(req, res){
		res.render("login");
});

app.post("/login", passport.authenticate("local",
 		{
	 		successRedirect:"/campgrounds",
			failureRedirect:"/login"
		}), function(req, res){}
);

app.get("/logout", function(req, res){
		req.logout();
		res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
		if(req.isAuthenticated()){
				return next();
		}
		else{
				res.redirect("/login");
		}
}

app.listen(3000, function(){
	console.log("Yelp Camp Server has started");
});
