'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var timeout = require('connect-timeout');

var strategyController = require('../controllers/strategy');

var strategyRouter = express.Router();

strategyRouter.use(bodyParser.json());

strategyRouter.get('/', timeout(15000), strategyController.get);
strategyRouter.post('/', timeout(15000), strategyController.post);
strategyRouter['delete']('/', timeout(15000), strategyController.del);

module.exports = strategyRouter;
