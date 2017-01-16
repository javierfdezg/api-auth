'use strict';

var express = require('express');
var passport = require('passport');
var bodyParser = require('body-parser');
var timeout = require('connect-timeout');

var authController = require('../controllers/auth');

var getCustomerMiddleware = require('../middleware/get-customer');
var providerConfigurator = require('../middleware/provider-configurator');

var authRouter = express.Router();

authRouter.use(bodyParser.json());
authRouter.use(getCustomerMiddleware);
authRouter.use(providerConfigurator);
authRouter.use(passport.initialize());
authRouter.use(passport.session());

authRouter.get('/return', timeout(15000), authController.callback);
authRouter.get('/', timeout(15000), authController.authenticate);

module.exports = authRouter;
