var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
fs = require('fs');

var pages = fs.readdirSync('routes').filter(x => x != 'index.js').map(x => x.replace('.js', ''));

api = require(path.join(__dirname, "../api.js"));

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index'));
pages.forEach(page => {
  app.use('/'+page, require('./routes/'+page));
})
console.log('Attached all routes!')

const mysql = require('mysql2');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : process.env.PASSWORD,
  database : 'imperator'
});

connection.connect();

api.setConnection(connection);


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
  console.log(err);
  res.sendStatus(err.status || 500);
});

module.exports = app;
