'use strict';

var mongoose = require('mongoose');
var Promise = require('bluebird');
var envConfig = require('node-env-configuration');
var defaults = require('../src/config/params');
var config = envConfig({
  defaults: defaults,
  prefix: defaults.appName
});
var mongoConnection = require('../src/config/mongo')(config.data);

var Strategy = require('../src/models/strategy');

mongoose.Promise = Promise;

mongoose.connect(mongoConnection);

var strategy = new Strategy();
strategy.provider = 'facebook';
strategy.fields = [
  {
    name: 'callbackURL',
    type: 'String'
  },
  {
    name: 'clientSecret',
    type: 'String'
  },
  {
    name: 'clientID',
    type: 'String'
  }
];
strategy.save().then(function () {
  console.log('facebook saved');
});

strategy = new Strategy();
strategy.provider = 'openidconnect';
strategy.fields = [
  {
    name: 'callbackURL',
    type: 'String'
  },
  {
    name: 'clientSecret',
    type: 'String'
  },
  {
    name: 'clientID',
    type: 'String'
  },
  {
    name: 'tokenURL',
    type: 'String'
  },
  {
    name: 'userInfoURL',
    type: 'authorizationURL'
  },
  {
    name: 'issuer',
    type: 'String'
  }
];
strategy.save().then(function () {
  console.log('openidconnect saved');
});
