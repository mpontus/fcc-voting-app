var path = require('path');
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('req-flash');

var routes = require('./routes');

var Poll = require('./models/poll.js');

require('dotenv').config();

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URL);

// require('./config/passport')(passport);
require('./passport.js')(passport);

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
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
  console.log(req.user);
  res.render('index');
});

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

app.get('/auth/github', passport.authenticate('github'));
app.get('/auth/github/callback', passport.authenticate('github', {
  successRedirect: '/',
  failureRedirect: '/login',
}));

app.get('/polls', function(req, res) {
  Poll.find({}, function(err, polls) {
    res.render('polls/list', {
      polls: polls,
    });
  });
});

app.get('/polls/new', function(req, res) {
  res.render('polls/new');
});

app.get('/polls/:id', function(req, res) {
  Poll.findOne({_id: req.params.id}, function(err, poll) {
    if (err) throw err
    if (!poll) {
      return res.status(404).send('Not found');
    }
    console.log(poll);
    res.render('polls/show', {
      poll: poll,
    });
  });
});

app.post('/polls/:id/votes', function(req, res) {
  Poll.findOne({_id: req.params.id}, function(err, poll) {
    if (err) throw err;
    if (!poll) {
      return res.status(404).send('Not found');
    }

    var choice = req.body.choice;

    if (poll.options.indexOf(choice) === -1) {
      poll.options.push(choice);
      poll.markModified('options');
    }
    
    if (!poll.votes[choice]) {
      poll.votes[choice] = 1;
    } else {
      poll.votes[choice]++;
    }
    poll.markModified('votes');

    poll.save(function(err) {
      if (err) throw err;
      res.redirect('/polls/'+poll.id);
    });
  });
});

app.post('/polls', function(req, res) {
  var question = (req.body.question || '').trim();

  // Santiize poll options
  var options = (req.body.options || []).map(function(item) {
    return item.trim();
  }).filter(function(item) {
    return item;
  });

  // Create new poll
  var poll = new Poll;
  poll.question = question;
  poll.options = options;
  poll.save(function(err) {
    if (err) throw err;
    res.redirect('/polls/'+poll.id);
  });
});


var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on port " + port);
});
