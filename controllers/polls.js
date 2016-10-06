var mongoose = require('mongoose');
var Poll = require('../models/poll');
var Vote = require('../models/vote');
var votingService = require('../services/voting.js');

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
    var visitorId = req.visitor.id;
    votingService.getPoll(pollId, visitorId, function(err, data) {
      if (err) throw err;
      res.json(data);
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
