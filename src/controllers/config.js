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
  Config.validateStrategies(strategies).then(function (strategies) {
    Config.update({customer: customer},{'$set': {
      'strategies': strategies
    }}, {upsert: true}).then(function() {
      return res.json(strategies);
    });
  }).catch(next);
}

function put (req, res, next) {
  post(req, res, next);
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
configHandlers.put = put;
configHandlers.del = del;

module.exports = configHandlers;
