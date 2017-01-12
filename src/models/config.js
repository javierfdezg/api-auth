'use strict';

var mongoose = require('mongoose');
var Promise = require('bluebird');

var Strategy = require('../models/strategy');

var ConfigSchema = new mongoose.Schema({
  yip_id: {type: String, required: true, unique: true},
  strategies: {}
});

function validateStrategies (strategies) {
  return Strategy.exist(Object.keys(strategies)).then(function () {
    return strategies;
  }).catch(function (err) {
    return Promise.reject(err);
  });
}

function findByCustomer (customer) {
  return this.findOne({
    yip_id: customer
  });
}

function removeCustomer (customer) {
  return this.remove({
    yip_id: customer
  });
}

ConfigSchema.statics.validateStrategies = validateStrategies;
ConfigSchema.statics.findByCustomer = findByCustomer;

module.exports = mongoose.model('Config', ConfigSchema);
