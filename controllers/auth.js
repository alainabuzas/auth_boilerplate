//Require and global variables
var express = require('express');
var passport = require('../config/passportConfig');
var db = require('../models');
var router = express.Router();

// Routes
router.get('/login', function(req, res) {
    res.render('loginForm');
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/profile',
    successFlash: 'Awesome, you are logged in.',
    failureRedirect: '/auth/login',
    failureFlash: 'Try again, loser'
}));

router.get('/signup', function(req, res) {
    res.render('signupForm');
});

router.post('/signup', function(req, res, next) {
    db.user.findOrCreate({
        where: { email: req.body.email },
        defaults: {
            'firstName': req.body.firstName,
            'lastName': req.body.lastName,
            'password': req.body.password
        }
    }).spread(function(user, wasCreate) {
        if (wasCreated) {
            // Good!
            passport.authenticate('local', {
                successRedirect: '/profile',
                successFlash: 'Account created and logged in',
                failureRedirect: '/login',
                failureFlash: 'Uh oh, something went wrong. Please try logging in again.'
            })(req, res, next)
        } else {
            // Bad!
            req.flash('error', 'Email already exists. Please login');
            res.redirect('/auth/login');
        }
    }).catch(function(error) {
        req.flash('error', error.message);
        res.redirect('/auth/signup');
    })
});

router.get('/logout', function(req, res) {
    req.logout();
    req.flash('success', 'See ya later alligator');
    res.redirect('/');
})

// Export
module.exports = router;
