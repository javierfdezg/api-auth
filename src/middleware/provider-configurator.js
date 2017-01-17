'use strict';

var winston = require('winston');
var Config = require('../models/config');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var OIDCStrategy = require('passport-openidconnect').Strategy;

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

strategyLoader.openidconnect = function (config, next) {
  passport.use('openidconnect', new OIDCStrategy({
    issuer: config.issuer,
    authorizationURL: config.authorizationURL,
    userInfoURL: config.userInfoURL,
    tokenURL: config.tokenURL,
    clientID: config.clientID,
    clientSecret: config.clientSecret,
    callbackURL: config.callbackURL
  }, function(token, tokenSecret,  profile, done) {
    winston.debug('token: %s', token);
    winston.debug('tokenSecret: %s', tokenSecret);
    winston.debug('profile: %s', JSON.stringify(profile));
    return done(null, token, tokenSecret, profile);
  }));
  next();
}

function loadConfigurator (req, res, next) {
  var customer = req.customer;
  Config.findByCustomer(customer).then(function (config) {
    var err = {
      status: 400
    };
    var strategy;
    var provider;
    if (!config) {
      err.message = 'Configuration for provider not available';
      return next(err);
    }
    provider = req.query.provider.toLowerCase();
    strategy = config.strategies.filter(function (strategy) {
      return strategy.provider === provider;
    })[0];
    if (!strategy) {
      err.message = 'Provider not supported for this customer';
      return next(err);
    }
    strategyLoader[provider](strategy.config, next);
  }).catch(next);
}

module.exports = loadConfigurator;
