var express = require('express');
var polls = require('../controllers/polls.js');
var router = express.Router();

router.get('/', polls.index);
router.get('/new', polls.new);
router.get('/:id', polls.show);
router.post('/', polls.create);

module.exports = router;
