var LocalStrategy = require('passport-local');

var User = require('../models/user');

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
  }, function(username, password, done) {
    User.findOne({
      username: username
    }, function(err, user) {
      if (err) return done(err);
      if (user && user.validatePassword(password)) {
        return done(null, user);
      }
      return done(null, false, { message: "Invalid credentials"})
    });
  }));
};
