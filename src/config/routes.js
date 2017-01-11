/*
 * Copyright (c)
 */

/*jslint node: true */
/*jshint -W030 */
"use strict";

var express = require('express'),
  passport = require('passport'),
  winston = require('winston'),
  timeout = require('connect-timeout'),
  toobusy = require('toobusy-js'),
  responseTime = require('response-time'),
  cors = require('cors'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  path = require('path'),
	passport = require('passport');

module.exports = function (app, config) {

  var router = express.Router();
  var authRouter = express.Router();
  var configRouter = express.Router();
  var getCustomerMiddleware = require('../middleware/get-customer');
  var providerConfigurator = require('../middleware/provider-configurator');

  // -------- Controllers ------
  var authController = require('../controllers/auth');
  var configController = require('../controllers/config');

  // Require here your api controllers

  // -------- Routes --------

  // Amazon elb health check. This always return 200 status code because we are not using this
  // to manage the auto launching.
  router.get('/elb-ping', timeout(5000), function (req, res) {
    res.json({result: 'ok'});
  });
  router.get('/favicon.ico', timeout(5000), function (req, res) {
    res.status(200).send();
  });

  // Add X-Response-Time header (response time) in every response
  app.use(responseTime());

  authRouter.use(bodyParser.json());
  authRouter.use(getCustomerMiddleware);

	authRouter.use(providerConfigurator);
	authRouter.use(passport.initialize());
	authRouter.use(passport.session());

  // --------------------------- AUTH SERVICES ----------------------------
  authRouter.get('/return', timeout(15000), authController.callback);
  authRouter.get('/', timeout(15000), authController.authenticate);
  // ----------------------------------------------------------------------

  configRouter.use(bodyParser.json());
  configRouter.use(getCustomerMiddleware);

  // --------------------------- CONFIG SERVICES ----------------------------
  configRouter.get('/', timeout(5000), configController.get);
  configRouter.post('/', timeout(5000), configController.post);
  configRouter.put('/', timeout(5000), configController.put);
  configRouter['delete']('/', timeout(5000), configController.del);
  // ----------------------------------------------------------------------

  // --------------------------- SESSION SERVICES ----------------------------
  // ----------------------------------------------------------------------

  // Use this before each middleware
  app.use(haltOnTimedout);

  // Enable cors requests
  app.use(cors());

  // Use this before each middleware
  app.use(haltOnTimedout);

  // Set maximum lag and configure toobusy middleware
  toobusy.maxLag(config.maxLag);


  app.use(haltOnTimedout);

  // Main router
  app.use('/config', configRouter);
  app.use('/', router);
  app.use('/', authRouter);

  app.use(haltOnTimedout);

  // 404 routes
  app.use(function (req, res, next) {
    winston.verbose('[API 404 ERROR] %s -- %s %s', req.ip, req.method, req.path);
    res.status(404).json({result: 'Not found'});
  });

  app.use(haltOnTimedout);

  // Error handling
  app.use(function (err, req, res, next) {
    // Timeout
    if (err && err.status) {
      winston.warn("[API ERROR] %s -- %s %s %s", req.ip, req.method, req.path, err);
      res.status(err.status).json({result: err.message});
    }
    // Unexpected exception handling
    else {
      var errorDesc = (err.stack) ? err.stack : JSON.stringify(err, null, '\t');
      winston.error("[API 500 ERROR] %s -- %s %s \n %s", req.ip, req.method, req.path, errorDesc);
      res.status(500).json(err);
    }
  });

};

// See : https://github.com/expressjs/timeout/issues/11
function haltOnTimedout(req, res, next) {
  if (!req.timedout) {
    next();
  }
}
