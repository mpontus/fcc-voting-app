var express = require('express');
var votes = require('../controllers/votes');
var router = express.Router();

router.post('/', votes.create);

module.exports = router;
