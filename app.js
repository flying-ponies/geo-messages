var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session')

var app = express()



var routes = require('./routes/index');
var users = require('./routes/users');

// socket.io
var http = require('http');
app.server = http.createServer(app);
// var io = require('socket.io')(app.server);
// io.on('connection', function(socket) {
//   console.log('A user connected');
//   socket.on('disconnect', function() {
//     console.log('A user disconnected');
//   });
// });

app.use(session({
  secret: 'th3 qu1ck br0wn f0x jump3d ov3r the l@zy d0g',
  resave: false,
  saveUninitialized: true
}));

app.use(function (req, res, next) {

  console.log( "Current User: ", req.session.currentUser );
  //check email and password as digest in DB

  //if check fails, re-render with error messages


  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  debug: true,
  outputStyle: 'expanded'
  // indentedSyntax: true,
  // sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
