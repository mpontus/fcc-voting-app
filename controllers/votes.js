var votingService = require('../services/voting.js');

module.exports = {
  create: function(req, res) {
    var pollId = req.body.pollId;
    var choice = req.body.choice;
    var visitorId = req.visitor.id;

    votingService.castVote(pollId, choice, visitorId, function(err, data) {
      if (err) throw err;
      res.json(data);
    });
  },
}
