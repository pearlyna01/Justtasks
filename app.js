var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session'); //include this for session

/*
var crypto = require('crypto');
var bodyParser = require('body-parser');
var argon2i = require('argon2-ffi').argon2i;
var jsonParser = bodyParser.json();
*/

//use mysql in this app
var mysql = require('mysql');
//create a 'pool' (group) of connections to be used for connecting with our sql server
var dbConnectionPool = mysql.createPool({
  //user:'ubuntu@localhost',
  host:'localhost',
  database:'justtasks'
});
//var mysql = require('./sql/mysql');
//var dbConnectionPool = mysql.createPool({ host: 'localhost', user: 'test', password: 'password', database: 'justtasks'});
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

//middleware for accessing sql database
app.use(function(req, res, next) {
  req.pool = dbConnectionPool;
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//this contains the session which is encrypted
app.use(session({
  secret: "just-tasks",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;