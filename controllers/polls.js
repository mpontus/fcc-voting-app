var mongoose = require('mongoose');
var Poll = require('../models/poll');
var Vote = require('../models/vote');

module.exports = {
  index: function (req, res) {
    Poll.find({}, function(err, polls) {
      res.json({
        polls: polls.map(function(poll) {
          return {
            id: poll.id,
            question: poll.question,
            options: poll.options
          };
        }),
      });
    });
  },

  show: function(req, res) {
    var pollId = req.params.id;
    Poll.findOne({_id: pollId}, function(err, poll) {
      if (err) throw err;

      if (!poll) {
        var err = Error("Not found");
        err.status = 404;
        throw err;
      }

      Vote.aggregate([{
        $match: { 'pollId': mongoose.Types.ObjectId(poll.id), }
      }, {
        $group: { _id: "$choice", count: { $sum: 1, }, },
      }], function(err, results) {

        var votes = results.reduce(function(memo, curr) {
          memo[curr._id] = curr.count;
          return memo;
        }, {});

        Vote.findOne({
          pollId: mongoose.Types.ObjectId(poll.id),
          voterId: req.visitor.id,
        }, function(err, vote) {
          var myChoice = vote ? vote.choice : null;

          res.json({
            poll: {
              id: poll.id,
              question: poll.question,
              options: poll.options
            },
            votes: votes,
            myChoice: myChoice,
          });
        });
      });
    });
  },

  create: function (req, res) {
    var question = (req.body.question || '').trim();

    // Santiize poll options
    var options = (req.body.options || []).map(function(item) {
      return item.trim();
    }).filter(function(item) {
      return item;
    });

    // Create new poll
    var poll = new Poll;
    poll.question = question;
    poll.options = options;
    poll.save(function(err) {
      if (err) throw err;
      res.json({
        poll: {
          id: poll.id,
          question: poll.question,
          options: poll.options
        },
      });
    });
  },
}
