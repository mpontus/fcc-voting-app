var Poll = require('../models/poll.js');
var Vote = require('../models/vote.js');

module.exports = {
  create: function(req, res) {
    var pollId = req.body.pollId;
    var choice = req.body.choice;
    var visitorId = req.visitor.id;

    Poll.findOne({_id: pollId}, function(err, poll) {
      if (err) throw err;
      if (!poll) {
        var err = Error("Not found");
        err.status = 404;
        throw err;
      }

      // Try to find existing vote
      Vote.findOne({
        pollId: poll.id,
        voterId: visitorId,
      }, function(err, vote) {
        if (err) throw err;
        if (vote) {
          vote.choice = choice;
          vote.save(handleSaveVote);
        } else {
          var newVote = new Vote({
            pollId: pollId,
            choice: choice,
            voterId: req.visitor.id,
          });
          newVote.save(handleSaveVote);
        }
      });

      function handleSaveVote(err) {
        if (err) throw err;
        res.redirect('/polls/'+poll.id);
      };
    });
  },
}
