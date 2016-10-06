var mongoose = require('mongoose');
var Poll = require('../models/poll');
var Vote = require('../models/vote');

var votingService = {
  getPoll: function(pollId, voterId, cb) {
    // Retrieve the poll
    Poll.findOne({
      _id: pollId,
    }, function(err, poll) {
      if (err) return cb(err);
      if (!poll) {
        return cb(null, {
          poll: null,
        });
      }

      // Retreive aggregate voting results
      Vote.aggregate([{
        $match: { 'pollId': mongoose.Types.ObjectId(poll.id), }
      }, {
        $group: { _id: "$choice", count: { $sum: 1, }, },
      }], function(err, results) {
        if (err) return cb(err);

        var votes = results.reduce(function(memo, curr) {
          memo[curr._id] = curr.count;
          return memo;
        }, {});

        // Retrieve user's own vote
        Vote.findOne({
          pollId: mongoose.Types.ObjectId(poll.id),
          voterId: voterId,
        }, function(err, vote) {
          if (err) return cb(err);

          var myChoice = vote ? vote.choice : null;

          cb(null, {
            poll: {
              id: poll._id,
              question: poll.question,
              options: poll.options,
              votes: votes,
              myChoice: myChoice
            }
          });
        });
      });
    });
  },

  castVote: function (pollId, choice, voterId, cb) {
    Poll.findOne({
      _id: pollId,
    }, function(err, poll) {
      if (err) return cb(err);

      if (!poll) {
        return cb(null, {
          poll: null
        });
      }

      (new Promise(function(resolve, reject) {
        if (poll.options.indexOf(choice) !== -1) {
          return resolve();
        }
        poll.options.push(choice);
        poll.markModified('options');
        poll.save().then(resolve, reject);
      })).then(function() {
        return new Promise(function(resolve, reject) {
          // Find existing vote
          Vote.findOne({
            pollId: poll.id,
            voterId: voterId,
          }, function(err, vote) {
            if (err) return reject(err);

            if (vote) {
              vote.choice = choice;
              vote.save().then(resolve, reject);
            } else {
              var newVote = new Vote({
                pollId: pollId,
                choice: choice,
                voterId: voterId,
              });
              newVote.save().then(resolve, reject);
            }
          });
        });
      }).then(function() {
        votingService.getPoll(pollId, voterId, cb);
      }).catch(function(err) {
        cb(err);
      });
    });
  },
};

module.exports = votingService;
