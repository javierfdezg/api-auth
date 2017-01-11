'use strict';

var winston = require('winston');

function getCustomer (req, res, next) {
  var customer = req.header('yip_id');
  var err;

  winston.debug('Running getCustomer middleware');

  if (!customer) {
    err = {
      status: 400,
      message: 'Yip Id not found'
    };

		winston.error('getCustomer middleware: %s', JSON.stringify(err));
  }

  req.customer = customer;

  next(err);
}

module.exports = getCustomer;
