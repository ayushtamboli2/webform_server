var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//captcha
var svgCaptcha = require('svg-captcha');
var CryptoJS =require('crypto-js');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var formRouter =require('./routes/form');
var loginRouter= require('./routes/login');
var adminRouter=require('./routes/admin')

var app = express();
var cors = require('cors');
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//captcha
app.get('/captcha', function(req,res){
  var captcha =svgCaptcha.create({ ignoreChars:'0oO1iIlL'});
  captcha.text = CryptoJS.AES.encrypt(captcha.text, 'svgcaptcha_key').toString();
  res.json(captcha);
  
  });

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/form', formRouter);
app.use('/login', loginRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
