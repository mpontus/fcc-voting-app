var Poll = require('../models/poll.js');

module.exports = {
  new: function(req, res) {
    res.render('polls/new');
  },
}
