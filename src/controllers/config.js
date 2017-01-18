'use strict';

var Config = require('../models/config');

function get (req, res, next) {
  Config.findByCustomer(req.customer).then(function (config) {
    if (!config) {
      return res.status(404).json();
    }
    res.json(config);
  }).catch(next);
}

function post (req, res, next) {
  var customer = req.customer;
  var strategies = req.body.strategies;
  var config = new Config();
  config.customer = customer;
  Config.validateStrategies(strategies).then(function (strategies) {
    config.strategies = strategies;
    return config.save();
  }).then(function (config) {
    res.status(200).json(config);
  }).catch(function (err) {
    res.status(400).json(err);
  });
}

function postProvider (req, res, next) {
  var customer = req.customer;
  var strategies = [{
    provider: req.params.provider,
    config: req.body.config
  }];

  var config = new Config();
  Config.validateStrategies(strategies).then(function (strategies) {
    config.customer = customer;
    config.strategies = strategies;
    return config.save();
  }).then(function (config) {
    res.status(200).json(config);
  }).catch(function (err) {
    res.status(400).json(err);
  });
}

function put (req, res, next) {
  var customer = req.customer;
  var strategies = req.body.strategies;
  Config.validateStrategies(strategies).then(function (strategies) {
    Config.update({customer: customer},{'$set': {
      'strategies': strategies
    }}, {upsert: true}).then(function() {
      return res.status(204).json(strategies);
    });
  }).catch(next);
}

function putProvider (req, res, next) {
  var customer = req.customer;
  var strategies = [{
    provider: req.params.provider,
    config: req.body.config
  }];

  Config.validateStrategies(strategies).then(function (strategies) {
    Config.update({customer: customer, 'strategies.provider': req.params.provider},{'$set': {
      'strategies.$': strategies[0]
    }}).then(function() {
      return res.status(204).send();
    });
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
