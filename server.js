require('dotenv').config();

var path = require('path');
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');
var passport = require('./passport');
var exposeUserVariableToViews = require('./middleware/expose-user-variable-to-views');
var assignVisitorIdToRequest = require('./middleware/assign-visitor-id-to-request');
var routes = require('./routes');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URL);

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(morgan('dev')); // log requests to console
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(exposeUserVariableToViews);
app.use(assignVisitorIdToRequest);
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

app.use('*', express.static(path.join(__dirname, 'public', 'index.html')));

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on port " + port);
});
