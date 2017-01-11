/*
 * Copyright (c) inSided BV
 */

/*jslint node: true */
/*jshint -W030 */
'use strict';

var winston = require('winston'),
		passport = require('passport');


exports.authenticate = function (req, res, next) {

	passport.authenticate(req.query.provider)(req, res, next);
};

exports.callback = function (req, res, next) {

	passport.authenticate(req.query.provider, function(err, user) {
		res.send('patata');
	})(req, res, next);
};
