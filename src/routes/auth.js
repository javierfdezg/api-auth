'use strict';

var express = require('express');
var bodyParser = require('body-parser');

var authController = require('../controller/auth');

var getCustomerMiddleware = require('../middleware/get-customer');
var providerConfigurator = require('../middleware/provider-configurator');

var router = express.Router();

router.use(bodyParser.json());
router.use(getCustomerMiddleware);
router.use(providerConfigurator);
router.use(passport.initialize());
router.use(passport.session());

router.get('/return', timeout(15000), authController.callback);
router.get('/', timeout(15000), authController.authenticate);

module.exports = router;
