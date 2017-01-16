'use strict';

var mongoose = require('mongoose');
var Promise = require('bluebird');

var Strategy = require('../models/strategy');

var DEFAULT_FIELD_TYPE = 'String';

var ConfigSchema = new mongoose.Schema({
  yip_id: {type: String, required: true, unique: true},
  strategies: {}
});

function getProviders (strategies) {
  return strategies.map(function (strategy) {
    return strategy.provider;
  });
}

function validateStrategies (strategies) {
  return Strategy.exist(getProviders(strategies)).then(function () {
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

function mergeCustomerStrategies (customer, strategies) {
  return this.findByCustomer(customer).then(function (config) {
    if (!config) {
      return strategies;
    }
    var configuredStrategies = {};
    for (var i = 0, l = config.strategies.length; i < l; i++) {
      var strategy = config.strategies[i];
      configuredStrategies[strategy.provider] = strategy.config;
    }
    for (var i = 0, l = strategies.length; i < l; i++) {
      var strategy = strategies[i];
      var configuredStrategy = configuredStrategies[strategy.provider];
      var mergedFields = strategy.fields.map(function (field) {
        return {
          name: field.name,
          type: field.type || DEFAULT_FIELD_TYPE,
          value: configuredStrategy[field.name]
        };
      });
      strategy.fields = mergedFields;
    }
    return strategies;
  });
}

ConfigSchema.statics.validateStrategies = validateStrategies;
ConfigSchema.statics.findByCustomer = findByCustomer;
ConfigSchema.statics.mergeCustomerStrategies = mergeCustomerStrategies;

module.exports = mongoose.model('Config', ConfigSchema);
