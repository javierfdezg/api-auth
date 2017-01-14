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
	passport = require('passport'),
	swaggerJSDoc = require('swagger-jsdoc');

var swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'SSO Service',
      version: '1.0.0',
    },
  },
  apis: ['./src/config/routes.js']
};

var swaggerSpec = swaggerJSDoc(swaggerOptions);

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

	router.get('/api-docs.json', function(req, res) {
		res.setHeader('Content-Type', 'application/json');
		res.send(swaggerSpec);
	});

	router.use(express.static('public', {'index': ['index.html']}));

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
	/**
	* @swagger
	* /config:
	*   get:
	*     description: Retrieve the SSO configuration for a customer
	*     produces:
	*       - application/json
	*     parameters:
	*       - name: yip_id
	*         in: query
	*         description:  Yip id
	*         required: true
	*         type: string
	*     responses:
	*       '200':
	*         description: The customers' configuration.
	*       '400':
	*         description: The yip_id not provided
	*       '404':
	*         description: Configuration not found
	*/
  configRouter.get('/', timeout(5000), configController.get);

	/**
	* @swagger
	* /config:
	*   post:
	*     description: Creates a SSO configuration for a customer
	*     produces:
	*       - application/json
	*     parameters:
	*       - name: yip_id
	*         in: query
	*         description:  Yip id
	*         required: true
	*         type: string
	*     responses:
	*       '201':
	*         description: Customer configuration created successfully
	*       '400':
	*         description: The yip_id not provided or the configuration already existed
	*/
  configRouter.post('/', timeout(5000), configController.post);

	/**
	* @swagger
	* /config:
	*   put:
	*     description: Updates the SSO configuration for a customer
	*     produces:
	*       - application/json
	*     parameters:
	*       - name: yip_id
	*         in: query
	*         description:  Yip id
	*         required: true
	*         type: string
	*     responses:
	*       '406':
	*         description: Not implemented
	*/
  configRouter.put('/', timeout(5000), configController.put);

	/**
	* @swagger
	* /config:
	*   delete:
	*     description: Deletes the SSO configuration for a customer
	*     produces:
	*       - application/json
	*     parameters:
	*       - name: yip_id
	*         in: query
	*         description:  Yip id
	*         required: true
	*         type: string
	*     responses:
	*       '204':
	*         description: SSO Configuration deleted successfully
	*       '400':
	*         description: yip_id not provided
	*/
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
  app.use('/', router);
  app.use('/config', configRouter);
  app.use('/auth', authRouter);

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
