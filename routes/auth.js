var express = require('express');
var passport = require('../passport.js');
var router = express.Router();

router.get('/github', passport.authenticate('github'));
router.get('/github/callback', passport.authenticate('github', {
  successRedirect: '/',
}));

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
