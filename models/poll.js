var mongoose = require('mongoose');

var Poll = mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: [{
    type: String,
  }],
});

module.exports = mongoose.model('Poll', Poll);
