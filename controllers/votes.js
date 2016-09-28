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

      // Try and find existing vote
      Vote.findOne({pollId: poll.id, visitorId: visitorId}, function(err) {
        if (err) throw err;
        if (vote) {
          poll.votes[vote.choice]--;
          if (poll.votes[choice]) {
            poll.votes[choice]++;
          } else {
            poll.votes[choice] = 1;
          }
        } else {
          var newVote = new Vote({
            pollId: pollId,
            choice: choice,
            visitorId: req.visitor.id,
          });
          newVote.save(handleSaveVote);
      } else {
          vote.

      });


      vote.save(function(err) {
        if (err) throw err;

        if (poll.options.indexOf(choice) === -1) {
          poll.options.push(choice);
          poll.markModified('options');
        }

        if (poll.votes[choice]) {
          poll.votes[choice]++;
        } else {
          poll.votes[choice] = 0;
        }
        poll.markModified('votes');

        poll.save(function(err) {
          if (err) throw err;

          res.redirect('/polls/'+poll.id);
        });
      });
    });
  },
}
