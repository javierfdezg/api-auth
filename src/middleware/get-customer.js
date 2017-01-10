'use strict';

function getCustomer (req, res, next) {
  var customer = req.header('yip_id');
  var err;
  if (!customer) {
    err = {
      status: 400,
      message: 'Yip Id not found'
    };
  }
  next(err);
}

module.exports = getCustomer;
