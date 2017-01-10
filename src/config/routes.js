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
  path = require('path');

module.exports = function (app, config) {

  var router = express.Router();
  var authRouter = express.Router();
  var configRouter = express.Router();

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

  // Add X-Response-Time header (response time) in every response
  app.use(responseTime());

  // Body parser
  authRouter.use(bodyParser.json());

  // --------------------------- AUTH SERVICES ----------------------------
  authRouter.get('/facebook', timeout(5000), passport.authenticate('facebook', {scope: 'email'}));
  // ----------------------------------------------------------------------

  configRouter.use(bodyParser.json());

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
  app.use(function (req, res, next) {
    // check if we're toobusy()
    if (toobusy()) {
      winston.warn('[API TOOBUSY ERROR] %s -- %s %s', req.ip, req.method, req.path);
      res.status(503).json({result: 'Server too busy'});
    } else {
      next();
    }
  });

  app.use(haltOnTimedout);

  // Main router
  app.use('/', router);
  app.use('/', authRouter);
  app.use('/config', configRouter);

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
    if (err && err.status == 503) {
      winston.warn("[API TIMEOUT ERROR] %s -- %s %s", req.ip, req.method, req.path);
      res.status(503).json({result: 'Timeout'});
    }
    // Unexpected exception handling
    else if (err) {
      var errorDesc = (err.stack) ? err.stack : JSON.stringify(err, null, '\t');
      winston.error("[API 500 ERROR] %s -- %s %s \n %s", req.ip, req.method, req.path, errorDesc);
      res.status(500).json(err);
    } else {
      res.status(500).json({result: 'Unknown error'});
    }
  });

};

// See : https://github.com/expressjs/timeout/issues/11
function haltOnTimedout(req, res, next) {
  if (!req.timedout) {
    next();
  }
}
