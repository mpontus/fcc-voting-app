var uniqid = require('uniqid');

// Assings permanent id to user session to track their votes
module.exports = function(req, res, next) {
  if (req.user) {
    req.visitor = {
      id: req.user.visitorId,
    };
    return next();
  }

  if (!req.session.visitorId) {
    req.session.visitorId = uniqid();
  }

  req.visitor = {
    id: req.session.visitorId,
  }

  next();
};
