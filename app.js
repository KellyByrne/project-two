require('dotenv').load();
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');
var routes = require('./routes/index');
var users = require('./routes/users');
var cities = require('./routes/cities');
var request = require('request');
var OAuth   = require('oauth-1.0a');
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieSession({
  name: 'authSession',
  keys: ['process.env.SECRET1', 'process.env.SECRET2']
}))



app.use('/', routes);
app.use('/users', users);
app.use('/cities', cities);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// var oauth = OAuth({
//     consumer: {
//         public: process.env.oauth_consumer_key,
//         secret: process.env.oauth_consumer_secret
//     },
//     oauth_signature_method: 'HMAC-SHA1'
// });

// var request_data = {
//     url: 'https://api.yelp.com/v2/search?term=food&location=San+Francisco',
//     method: 'POST',
//     data: {
//         status: 'Hello Ladies + Gentlemen, a signed OAuth request!'
//     }
// };

// var token = {
//     public: process.env.oauth_token ,
//     secret: process.env.oauth_token_secret
// };

// request({
//     url: request_data.url,
//     method: request_data.method,
//     data: request_data.data,
//     headers: oauth.toHeader(oauth.authorize(request_data, token))
// }, function(error, data) {
//     console.log(data);
//     // console.log('hello')
//     // console.log(body)
// });


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
