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
strategy.name = 'facebook';
strategy.save().then(function () {
  console.log('facebook saved');
});
