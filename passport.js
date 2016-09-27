var GithubStrategy = require('passport-github').Strategy;
var User = require('./models/user.js');
var configAuth = require('./auth');

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use('github', new GithubStrategy({
    clientID: configAuth.github.clientID,
    clientSecret: configAuth.github.clientSecret,
    callbackUrl: configAuth.github.callbackUrl,
  }, function(token, refreshToken, profile, done) {
    User.findOne({'github.id': profile.id}, function(err, user) {
      if (err) return done(err);

      // Find existing user associated with github profile
      if (user) return done(null, user);

      User.generateUniqueUsername(profile.username, function(err, username) {
        var newUser = new User();
        newUser.username = username;
        newUser.github.id = profile.id;
        newUser.save(function(err) {
          if (err) return done(err);
          done(null, newUser);
        });
      });
    });
  }));
};
