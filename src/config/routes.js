'use strict';

var express = require('express');
var winston = require('winston');
var timeout = require('connect-timeout');
var toobusy = require('toobusy-js');
var responseTime = require('response-time');
var cors = require('cors');
var path = require('path');
var swaggerJSDoc = require('swagger-jsdoc');

var swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'SSO Service',
      version: '1.0.0',
    },
  },
  apis: ['./src/config/routes.js']
};

//var swaggerSpec = swaggerJSDoc(swaggerOptions);

module.exports = function (app, config) {

  var router = express.Router();
  var authRouter = require('../routes/auth');
  var strategiesRouter = require('../routes/strategy');
  var configRouter = require('../routes/config');

  // Require here your api controllers

  // -------- Routes --------

	/**
	* @swagger
	* /elb-ping:
	*   get:
	*     description: Enpoint for ELB health check
	*     produces:
	*       - application/json
	*     responses:
	*       200:
	*         description: login
	*/
  router.get('/elb-ping', timeout(5000), function (req, res) {
    res.json({result: 'ok'});
  });

  router.get('/favicon.ico', timeout(5000), function (req, res) {
    res.status(200).send();
  });

	// router.get('/api-docs.json', function(req, res) {
	// 	res.setHeader('Content-Type', 'application/json');
	// 	res.send(swaggerSpec);
	// });

	app.use(express.static('public', {'index': ['index.html']}));

  app.use(responseTime());

  app.use(haltOnTimedout);

  app.use(cors());

  app.use(haltOnTimedout);

  toobusy.maxLag(config.maxLag);

  app.use(haltOnTimedout);

  app.use('/', router);
  app.use('/strategies', strategiesRouter);
  app.use('/config', configRouter);
  app.use('/auth', authRouter);

  app.use(haltOnTimedout);

  app.use(function (req, res, next) {
    winston.verbose('[API 404 ERROR] %s -- %s %s', req.ip, req.method, req.path);
    res.status(404).json({result: 'Not found'});
  });

  app.use(haltOnTimedout);

  app.use(function (err, req, res, next) {
    if (err && err.status) {
      winston.warn("[API ERROR] %s -- %s %s %s", req.ip, req.method, req.path, err);
      res.status(err.status).json({result: err.message});
    } else {
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
