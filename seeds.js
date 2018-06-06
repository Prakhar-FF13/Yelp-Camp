var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var data = [
  {
    name: "Salmon Creek",
    image: "https://farm9.staticflickr.com/8577/16263386718_c019b13f77.jpg",
    description: "This place is quite famous for camping as it is close to nature, river sounds make it more elegant"
  },
  {
    name: "Granite Hill",
    image: "https://farm2.staticflickr.com/1363/1342367857_2fd12531e7.jpg",
    description: "This place is famous for its beautiful granite rocks. A lot of people always gather here to enjoy the starry sky."
  },
  {
    name: "Mountain Goat's Rest",
    image: "https://farm9.staticflickr.com/8309/7968772438_3e0935fab7.jpg",
    description: "This place in the middle of a forest is the closest you can get to the nature. Completely safe for camping."
  }
]
function seedDB(){
  //Remove all campgrounds
  Campground.remove({}, function(err){
    if(err){
      console.log(err);
    }else{
      console.log("campgrounds removed !!");
    }
  });
  //Add a few campgrounds
  data.forEach( function(seed){
    Campground.create(seed, function(err, data){
      if(err){
        console.log(err);
      }else{
        console.log("Added a Campground !");
        Comment.create(
          {
            text: "Awesome place just need the internet now !!",
            author : "Me"
          }, function(err, comment){
             if(err){
               console.log(err);
             }else{
               data.comments.push(comment);
               data.save();
               console.log("Comments Added");
             }
          }
        );
      }
    });
  });

}
module.exports = seedDB;
