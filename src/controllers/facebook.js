/*
 * Copyright (c) inSided BV
 */

/*jslint node: true */
/*jshint -W030 */
'use strict';

var winston = require('winston'),
		passport = require('passport');

exports.authenticate = function (req, res, next) {

	winston.debug('facebook.authenticate');

	passport.authenticate('facebook')(req, res, next);
};

exports.callback = function (req, res, next) {

	winston.debug('facebook.callback');
	passport.authenticate('facebook', function(err, user, info) {
		winston.debug(arguments);
		res.send('patata');
	});
};
