'use strict';

var Strategy = require('../models/strategy');
var Config = require('../models/config');

var strategyController = {};

function get (req, res, next) {
  var customer = req.header('yip_id') || req.query.yip_id;
  Strategy.find().then(function (strategies) {
    if (!customer) {
      return res.json(strategies);
    }
    return Config.mergeCustomerStrategies(customer, strategies);
  }).then(function (strategies) {
    return res.json(strategies);
  }).catch(next);
}

strategyController.get = get;

module.exports = strategyController;
