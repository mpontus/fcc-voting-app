var mongoose = require('mongoose');
var validator = require('validator');
var bcrypt = require('bcrypt-nodejs');
var uniqid = require('uniqid');

var User = mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username cannot be empty'],
    unique: [true, 'Username is already taken'],
  },
  github: {
    id: Number,
  },
});

User.statics.generateUniqueUsername = function(base, cb) {
  this.findOne({'username': base}, function(err, user) {
    if (err) return cb(err);
    if (!user) return cb(null, base);
    cb(null, uniqid(base + '-'));
  });
}

module.exports = mongoose.model('User', User);
