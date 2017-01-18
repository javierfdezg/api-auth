'use strict';

var Config = require('../models/config');

function updateConfig (req) {
  var customer = req.customer;
  var strategy = {
    provider: req.params.provider,
    config: req.body.config
  };
  return Config.validateStrategy(strategy).then(function (strategy) {
    return Config.createOrUpdateOne(customer, strategy);
  });
}

function updateConfigs (req) {
  var customer = req.customer;
  var strategies = req.body.strategies;
  return Config.validateStrategies(strategies).then(function (strategies) {
    return Config.update({
      'customer': customer
    }, {
      '$set': {
        'strategies': strategies
      }
    }, {
      upsert: true
    });
  });
}

function get (req, res, next) {
  Config.findByCustomer(req.customer).then(function (config) {
    if (!config) {
      return res.status(404).json();
    }
    res.json(config);
  }).catch(next);
}

function post (req, res, next) {
  updateConfigs(req).then(function() {
    return res.status(204).json();
  }).catch(next);
}

function postProvider (req, res, next) {
  updateConfig(req).then(function() {
    return res.status(204).json();
  }).catch(next);
}

function put (req, res, next) {
  updateConfigs(req).then(function() {
    return res.status(204).json();
  }).catch(next);
}

function putProvider (req, res, next) {
  updateConfig(req).then(function() {
    return res.status(204).json();
  }).catch(next);
}

function del (req, res, next){
  Config.findByCustomer(req.customer).then(function (config) {
    if (!config) {
      return res.status(204).json();
    }
    config.remove().then(function () {
      return res.status(204).json();
    }).catch(next);
  });
}

var configHandlers = {};

configHandlers.get = get;
configHandlers.post = post;
configHandlers.postProvider = postProvider;
configHandlers.put = put;
configHandlers.putProvider = putProvider;
configHandlers.del = del;

module.exports = configHandlers
