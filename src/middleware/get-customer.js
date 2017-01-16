'use strict';

var winston = require('winston');

function getCustomer (req, res, next) {
  var customer = req.header('customer') || req.query.customer;
  var err;
  if (!customer) {
    err = {
      status: 400,
      message: 'Yip Id not found'
    };

    winston.debug('%s', req.path);
    winston.error('getCustomer middleware: %s', JSON.stringify(err));
  }
  req.customer = customer;
  next(err);
}

module.exports = getCustomer;
