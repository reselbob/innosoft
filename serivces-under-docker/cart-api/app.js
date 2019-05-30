"use strict";

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var seedData = require('./seedData');

// var indexRouter = require('./routes/index');
// var userRouter = require('./routes/user');
var cartRouter = require('./routes/cart');

var app = express();
//Set up mongoose connection
var mongoose = require('mongoose');
var mongoDB = process.env.MONGO_URL1 || 'mongodb://localhost:27017/appDemo1';
mongoose.connect(mongoDB, seedData.seed_data);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/user', userRouter);
app.use('/cart', cartRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;