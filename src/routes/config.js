'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var timeout = require('connect-timeout');

var getCustomerMiddleware = require('../middleware/get-customer');
var configController = require('../controllers/config');

var configRouter = express.Router();

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
*       - name: customer
*         in: query
*         description:  Yip id
*         required: true
*         type: string
*     responses:
*       '200':
*         description: The customers' configuration.
*       '400':
*         description: The customer not provided
*       '404':
*         description: Configuration not found
*/
configRouter.get('/', timeout(5000), configController.get);

configRouter.post('/:provider', timeout(5000), configController.postProvider);
/**
* @swagger
* /config:
*   post:
*     description: Creates a SSO configuration for a customer
*     produces:
*       - application/json
*     parameters:
*       - name: customer
*         in: query
*         description:  Yip id
*         required: true
*         type: string
*     responses:
*       '200':
*         description: Customer configuration created successfully
*       '400':
*         description: The customer not provided or the configuration already existed
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
*       - name: customer
*         in: query
*         description:  Yip id
*         required: true
*         type: string
*     responses:
*       '406':
*         description: Not implemented
*/
configRouter.put('/', timeout(5000), configController.put);

configRouter.put('/:provider', timeout(5000), configController.putProvider);

/**
* @swagger
* /config:
*   delete:
*     description: Deletes the SSO configuration for a customer
*     produces:
*       - application/json
*     parameters:
*       - name: customer
*         in: query
*         description:  Yip id
*         required: true
*         type: string
*     responses:
*       '204':
*         description: SSO Configuration deleted successfully
*       '400':
*         description: customer not provided
*/
configRouter['delete']('/', timeout(5000), configController.del);

module.exports = configRouter;
