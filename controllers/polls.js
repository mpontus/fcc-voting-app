var Poll = require('../models/poll');
var Vote = require('../models/vote');

module.exports = {
  index: function (req, res) {
    Poll.find({}, function(err, polls) {
      res.render('polls/list', {
        polls: polls,
      });
    });
  },

  new: function(req, res) {
    res.render('polls/new');
  },

  show: function(req, res) {
    var pollId = req.params.id;
    Poll.findOne({_id: pollId}, function(err, poll) {
      if (err) throw err;
      if (!poll) {
        return res.status(404).send('Not found');
      }
      console.log(poll.id);
      Vote.findOne({
        pollId: poll.id,
        visitorId: req.visitor.id,
      }, function(err, vote) {
        if (err) throw err;

        var currentChoice;
        if (vote) {
          currentChoice = vote.choice;
        }

        console.log(currentChoice);

        res.render('polls/show', {
          poll: poll,
          currentChoice: currentChoice,
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
      res.redirect('/polls/'+poll.id);
    });
  },
}
