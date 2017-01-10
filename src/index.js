/*
 * Copyright (c) inSided BV
 */

/*jslint node: true */
/*jshint -W030 */
"use strict";

var app, winston = require('winston'),
  express = require('express'),
  envConfig = require('node-env-configuration'),
  defaults = require('./config/params'),
  config = envConfig({
    defaults: defaults,
    prefix: defaults.appName
  }),
  fs = require('fs'),

app = express();

// Disable X-Powered-By HTTP response header
app.disable('x-powered-by');

// Logging config
require('./config/logging')(app, config);

// ==============================================================
// Routes for API & static resources middleware config.
// ==============================================================

require('./config/routes')(app, config);

app.listen(config.httpp, function() {
  winston.info('%s: Node server started on %s ...', Date(Date.now() ), config.httpp);
});

// process event handlers
process.on('uncaughtException', function (err) {
// handle the error safely
winston.error('Uncaught Exception. Stack trace:\n%s', err.stack);
});

module.exports = app;
