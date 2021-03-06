var express = require('express');
var auth = require('./auth');
var polls = require('./polls');
var votes = require('./votes');
var router = express.Router();

router.use('/auth', auth);
router.use('/api/polls', polls);
router.use('/api/votes', votes);

router.get('/', function(req, res) {
  res.redirect('/polls');
});

router.get('/logout', function(req, res) {
  res.redirect('/auth/logout');
});

module.exports = router;
