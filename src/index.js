/*
 * Copyright (c) inSided BV
 */

/*jslint node: true */
/*jshint -W030 */
"use strict";

var app, winston = require('winston'),
  mongoose = require('mongoose'),
  Promise = require('bluebird'),
  express = require('express'),
  envConfig = require('node-env-configuration'),
  defaults = require('./config/params'),
  config = envConfig({
    defaults: defaults,
    prefix: defaults.appName
  }),
  mongoConnection = require('./config/mongo')(config.data),
  fs = require('fs');

var getCustomerMiddleware = require('./middleware/get-customer');

mongoose.Promise = Promise;

mongoose.connect(mongoConnection);

app = express();

// Disable X-Powered-By HTTP response header
app.disable('x-powered-by');

// Logging config
if (!fs.existsSync(config.logging.directory)) {
  fs.mkdirSync(config.logging.directory, '0755');
}
require('./config/logging')(app, config);

app.use(getCustomerMiddleware);

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
