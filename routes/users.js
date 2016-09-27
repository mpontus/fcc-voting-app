var express = require('express');
var expressValidator = require('express-validator');
var User = require('../models/user.js');
var router = express.Router();

router.route('/register')
  .get(function(req, res) {
    res.render('users/register', {
      user: new User(),
    });
  })
  .post(function(req, res) {
    var user = new User();
    user.username = req.body.username;
    user.password = req.body.password;
    if (req.body.email) {
      user.email = req.body.email;
    }
    user.save(function (err) {
      res.json(err);
    });
  });

// router.route('/login')
//   .get(function(req, res) {
//     res.render('users/login');
//   })
//   .post(passport.authenticate('local', { failureRedirect: '/users/login' }),
//         function(req, res) {
//           res.redirect('/');
//         });



module.exports = router;
