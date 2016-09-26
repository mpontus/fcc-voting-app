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
  .post(expressValidator({
    customValidators: {
      
    }
  }), function(req, res) {
    req.checkBody({
      username: {
        notEmpty: {
          errorMessage: "Username cannot be empty",
        },
        isLength: {
          options: [{ min: 2 }],
          errorMessage: "Username must be at least 2 characters long"
        },
        isLength: {
          options: [{ max: 18 }],
          errorMessage: "Username can be at most 18 characters long"
        },
        isAlphanumeric: {
          errorMessage: "Username must contain only alphanumeric characters"
        }
      },
      'password.orig': {
        notEmpty: {
          errorMessage: "Password can not be empty",
        },
        isLength: {
          options: [{ min: 6 }],
          errorMessage: "Password must be at least 6 characters long",
        },
        equals: {
          options[]
        }

    //   },

    //   email: {
    //     optional: true,
    //     isEmail: true,
    //     errorMessage: "Email is invalid."
    //   }
    // })
    req.check('username', "Username can not be empty").notEmpty();
    req.check('username', "Username must be at least 2 characters in length")
      .isLength({ min: 2 });
    req.check('username', "Username must be at most 18 characters in length")
      .isLength({ max: 18 });
    req.check('username', "Username must contain only alphanumeric characters")
      .isAlphanumeric();

    req.check('password.orig', "Password can not be empty").notEmpty();
    req.check('password.orig', "Password must be at least 6 characters long")
      .isLength({ min: 6 });
    req.check('password.confirm', "Password confirmation does not match original password")
      .equals(req.body.password.orig);

    if (req.body.email) {
      req.check('email', "Email is invalid").isEmail();
    }

    var user = new User();
    user.username = req.body.username;
    user.email = req.body.email;
    user.password = user.generateHash(req.body.password.orig);

    req.asyncValidationErrors()
      .then(function() {
        user.save(function(err) {
          if (err) throw err;
          req.login(user, function(err) {
            if (err) throw err;
            res.redirect('/');
          });
        })
      })
      .catch(function(errors) {
        res.render('users/register', {
          user: user,
          errors: errors,
        });
      });
  });

module.exports = router;
