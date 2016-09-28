var mongoose = require('mongoose');

var Poll = mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true,
  },
  options: [{
    type: String,
    trim: true,
  }]
});

module.exports = mongoose.model('Poll', Poll);
