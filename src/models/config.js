'use strict';

var mongoose = require('mongoose');
var Promise = require('bluebird');

var Strategy = require('../models/strategy');

var DEFAULT_FIELD_TYPE = 'String';

var ConfigSchema = new mongoose.Schema({
  customer: {type: String, required: true, unique: true},
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
    customer: customer
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
      var strategy = strategies[i].toObject();
      var configuredStrategy = configuredStrategies[strategy.provider];
      var mergedFields = strategy.fields.map(function (field) {
        var mergedField = {
          name: field.name,
          type: field.type || DEFAULT_FIELD_TYPE,
        };
        if (configuredStrategy) {
          mergedField.value = configuredStrategy[field.name];
        }
        return mergedField;
      });
      strategy.fields = mergedFields;
      strategy.active = true;
      strategies[i] = strategy;
    }
    return strategies;
  });
}

ConfigSchema.statics.validateStrategies = validateStrategies;
ConfigSchema.statics.findByCustomer = findByCustomer;
ConfigSchema.statics.mergeCustomerStrategies = mergeCustomerStrategies;

module.exports = mongoose.model('Config', ConfigSchema);
