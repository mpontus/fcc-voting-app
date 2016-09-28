var mongoose = require('mongoose');
var Poll = require('./poll');

var Vote = mongoose.Schema({
  _pollId: {
    type: Schema.Types.ObjectId,
    ref: 'Poll',
    required: true,
  },
  choice: {
    type: String,
    required: true,
  },
  visitorId: {
    type: String,
    required: true,
  },
});



module.exports = mongoose.model('Vote', Vote);
