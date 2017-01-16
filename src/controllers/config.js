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
    res.json(config);
  }).catch(function (err) {
    res.status(400).json(err);
  });
}

function put (req, res) {
  res.status(406).send('Not implemented');
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
