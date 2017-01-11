'use strict';

var winston = require('winston'),
		Config = require('../models/config'),
		passport = require('passport'),
	  FacebookStrategy = require('passport-facebook').Strategy,
	  OpenIdStrategy = require('passport-openid').Strategy;

var strategyLoader = {};

strategyLoader.facebook = function (config, next) {

		passport.use('facebook', new FacebookStrategy({
			clientID: config.clientID,
			clientSecret: config.clientSecret,
			callbackURL: config.callbackURL
		},
		function(accessToken, refreshToken, profile, done) {

			winston.debug('Access token: %s', accessToken);
			winston.debug('Refresh token: %s', refreshToken);
			winston.debug('profile: %s', JSON.stringify(profile));

			return done(null, accessToken, refreshToken, profile);
		}));

		next();
}

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

		var strategy = config.strategies[req.query.provider];
		if (!strategy) {
			var	err = {
				status: 400,
				message: 'Provider not supported for this customer'
			};

			return next(err);
		}

		strategyLoader[req.query.provider.toLowerCase()](strategy.fields, next);

	}).catch(next);


}

module.exports = loadConfigurator;
