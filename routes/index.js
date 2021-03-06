var express = require('express');
var router = express.Router();

const sanitizer = require( 'sanitizer' );
const Message = require('../lib/messages');
const User = require('../lib/users');
const marked = require('marked');

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: true,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false
});


router.get('/login', function(req, res, next) {
  res.render('login', {
    page: 'login',
    currentUser: null,
    errors: null,
    email: ''
  });
});

router.post('/login', function(req, res, next) {

  req.body.email = sanitizer.sanitize( req.body.email );
  req.body.password = sanitizer.sanitize( req.body.password );

  User.authenticateUser( req.body.email, req.body.password ).then(function(userResults){

    req.session.currentUser = userResults;
    res.redirect( "/" );

  }).catch( function(error){

    res.render('login', {
      page: 'error',
      currentUser: null,
      errors: ['Email or Password is invalid'],
      email: req.body.email
    });

  });
});

router.get('/logout', function(req, res, next){
  req.session.currentUser = null;

  res.redirect('/');
});

router.get('/signup', function(req, res, next) {
  res.render('signup', {
    page: 'signup',
    currentUser: null,
    errors: null,
    username: '',
    email: ''
  });
});

router.post('/signup', function(req, res, next) {
  let newUser = new User({
    username: sanitizer.sanitize( req.body.username ),
    email: sanitizer.sanitize( req.body.email ),
    password: sanitizer.sanitize( req.body.password ),
    passwordConfirmation: sanitizer.sanitize( req.body.passwordConfirmation )
  });

  newUser.save()
    .then(info => {
      req.session.currentUser = newUser.fields;
      res.redirect('/');
    })
    .catch(error => {
      console.error(error);
      res.render('signup', {
        page: 'error',
        currentUser: null,
        errors: newUser.errors,
        username: sanitizer.sanitize( req.body.username ),
        email: sanitizer.sanitize( req.body.email )
      });
    });

});

router.post('/users/search', function(req, res, next) {
  const searchTerm = req.body.searchTerm;
  User.search(searchTerm).then((usernames) => {
    res.json(usernames);
  });
});

router.get('/profile', function(req, res, next) {
  let newUser = new User(req.session.currentUser);
  let templateVars = { currentUser: req.session.currentUser, page: 'profile' };
  res.render('profile', templateVars);
});

router.get('/messages/:id', function(req, res) {
  let templateVars = {
    currentUser: req.session.currentUser,
    message: null
  };

  templateVars.page = 'message';

  Message.findById(req.params.id).then((rows) => {
    if (rows && rows.length) {
      let displayMessage = new Message(rows[0]).fields;
      if (displayMessage.username === templateVars.currentUser.username) {
        templateVars.message = displayMessage;
        templateVars.message.htmlContent = marked(templateVars.message.content);
      }
    }
    res.render('show-message', templateVars);
  }).catch((error) => {
    console.error(error);
    res.render('show-message', templateVars);
  })
});

/* GET home page. */
router.get('/', function(req, res, next) {
  if( req.session.currentUser ){
    res.render('index', { currentUser: req.session.currentUser,  page: 'index' });
  }
  else {
    res.redirect('/login');
  }
});

module.exports = router;
