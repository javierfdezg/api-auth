'use strict';

var winston = require('winston');
var mongoose = require('mongoose');
var Promise = require('bluebird');
var express = require('express');
var envConfig = require('node-env-configuration');
var defaults = require('./config/params');
var config = envConfig({
  defaults: defaults,
  prefix: defaults.appName
});
var mongoConnection = require('./config/mongo')(config.data);
var fs = require('fs');

var app = express();

mongoose.Promise = Promise;
mongoose.connect(mongoConnection);

app.disable('x-powered-by');

require('./config/logging')(app, config);

require('./config/routes')(app, config);

var port = process.env.PORT || config.httpp;

app.listen(port, function() {
  winston.info('%s: Node server started on %s ...', Date(Date.now() ), port);
});

process.on('uncaughtException', function (err) {
  winston.error('Uncaught Exception. Stack trace:\n%s', err.stack);
});

module.exports = app;
