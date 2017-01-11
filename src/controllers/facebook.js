/*
 * Copyright (c) inSided BV
 */

/*jslint node: true */
/*jshint -W030 */
'use strict';

var winston = require('winston'),
		passport = require('passport'),
		FacebookStrategy = require('passport-facebook').Strategy;

exports.authenticate = function (req, res) {

	winston.debug('facebook.authenticate');

	passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://www.example.com/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
//    User.findOrCreate(..., function(err, user) {
//      if (err) { return done(err); }
//      done(null, user);
//    });
  }));
};

exports.callback = function (req, res) {
  res.send();
};
