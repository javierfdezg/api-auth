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

//TODO::PLEASE PLEASE REMOVE ME :) :)
function post (req, res, next) {
  var strategy1 = new Strategy();
  strategy1.provider = 'facebook';
  strategy1.fields = [
    {
      name: 'callbackURL',
      type: 'String'
    },
    {
      name: 'clientSecret',
      type: 'String'
    },
    {
      name: 'clientID',
      type: 'String'
    }
  ];

  var strategy2 = new Strategy();
  strategy2.provider = 'openidconnect';
  strategy2.fields = [
    {
      name: 'callbackURL',
      type: 'String'
    },
    {
      name: 'clientSecret',
      type: 'String'
    },
    {
      name: 'clientID',
      type: 'String'
    },
    {
      name: 'tokenURL',
      type: 'String'
    },
    {
      name: 'userInfoURL',
      type: 'authorizationURL'
    },
    {
      name: 'issuer',
      type: 'String'
    }
  ];
  strategy1.save().then(function () {
    console.log('facebook saved');
    strategy2.save().then(function () {
      console.log('openidconnect saved');
      res.json();
    }).catch(next);
  }).catch(next);
}

//TODO::PLEASE PLEASE REMOVE ME :) :)
function del (req, res, next) {
  Strategy.remove().then(function () {
    return res.json();
  }).catch(next);
}

strategyController.get = get;
strategyController.post = post;
strategyController.del = del;

module.exports = strategyController;
