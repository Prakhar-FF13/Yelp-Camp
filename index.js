var express    = require("express"),
app 		       = express(),
bodyParser     = require("body-parser"),
mongoose       = require("mongoose"),
flash          = require("connect-flash"),
passport       = require("passport"),
LocalStrategy  = require("passport-local"),
methodOverride = require("method-override"),
Campground     = require("./models/campground"),
User           = require("./models/user"),
seedDB         = require("./seeds"),
Comment        = require("./models/comment");

var commentRoutes    = require("./routes/comments"),
		campgroundRoutes = require("./routes/campgrounds"),
		authRoutes       = require("./routes/auth");
//seedDB();

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(flash());
app.set("view engine", "ejs");

app.use(require("express-session")({
			secret: "Secret, I have lots of them !!",
			resave: false,
			saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next){
		res.locals.currentUser = req.user;
		next();
});
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(authRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.listen(3000, function(){
	console.log("Yelp Camp Server has started");
});
