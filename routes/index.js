var express = require('express');
var router = express.Router();


// TEMP

var YourMessages = [
  {
    createdOn: "Oct 20, 2016",
    title: "I went to LONDON",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa. Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh. Quisque volutpat condimentum velit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nam ne.",
    lat: 51.507351,
    lng: -0.127758,
    likes: 10,
    dislikes: 40,
  },
  {
    createdOn: "Nov 23, 2014",
    title: "TOKYO!!!",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ne.",
    lat: 35.689487,
    lng: 139.691706,
    likes: 100,
    dislikes: 2,
  },
  {
    createdOn: "Jan 14, 2015",
    title: "Burnaby SUCKS",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ne.",
    lat: 49.248809,
    lng: -122.980510,
    likes: 13,
    dislikes: 6,
  },
];

var readMessages = [
  {
    username: "Mclovin'",
    createdOn: "Feb 23, 2014",
    title: "My trip to Beijing",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ne.",
    lat: 39.904211,
    lng: 116.407395,
    likes: 0,
    dislikes: 1000,
  },
  {
    username: "James Bond",
    createdOn: "Jan 14, 2000",
    title: "Concrete Jungle",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ne.",
    lat: 40.712784,
    lng: -74.005941,
    likes: 14,
    dislikes: 5,
  },
];

var currentUser = {
  "username": "JChow417",
  "email": "JChow417@gmail.com",
};

var templateVars = {
  'currentUser': currentUser,
  'yourMessages': YourMessages,
  'readMessages': readMessages
};

router.get('/login', function(req, res, next) {
  res.render('login', {currentUser: currentUser = null});
});
router.get('/signup', function(req, res, next) {
  res.render('signup', {currentUser: currentUser = null});
});
router.get('/profile', function(req, res, next) {
  res.render('profile', templateVars);
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', templateVars);
});

module.exports = router;
