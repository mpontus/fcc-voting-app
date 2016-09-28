var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Poll = require('./poll');

var Vote = Schema({
  pollId: {
    type: Schema.Types.ObjectId,
    ref: 'Poll',
    required: true,
  },
  choice: {
    type: String,
    required: true,
  },
  voterId: {
    type: String,
    required: true,
  },
});



module.exports = mongoose.model('Vote', Vote);
