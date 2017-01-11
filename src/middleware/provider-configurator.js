'use strict';

var winston = require('winston'),
		Config = require('../models/config'),
		passport = require('passport'),
	  FacebookStrategy = require('passport-facebook').Strategy;

function loadConfigurator (req, res, next) {

	var customer = req.customer;

	Config.findByCustomer(customer).then(function (config) {

		if (!config) {
			var	err = {
				status: 400,
				message: 'Configuration for provider not available'
			};

			return next(err);
		}

		var strategy = config.strategies.facebook.fields;

		passport.use('facebook', new FacebookStrategy({
			clientID: strategy.clientID,
			clientSecret: strategy.clientSecret,
			callbackURL: strategy.callbackURL
		},
		function(accessToken, refreshToken, profile, done) {

			winston.debug('Access token: %s', accessToken);
			winston.debug('Refresh token: %s', refreshToken);
			winston.debug('profile: %s', JSON.stringify(profile));

			return done(null, accessToken, refreshToken, profile);
		}));

		next();

	}).catch(next);


}

module.exports = loadConfigurator;
