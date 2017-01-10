/*
 * Copyright (c) Why Not Soluciones, S.L.
 */

/*jslint node: true */
/*jshint -W030 */
"use strict";

var MongoClient = require('mongodb').MongoClient,

// MongoDB connection instance
var conn;
var conf;

module.exports = function (config, cb) {

  var url;
  var authentication = '';

  // save config options
  if (config) {
    conf = config;
  }

  // Allready have a connection, don't connect again
  if (conn) {
    cb && cb(null, conn);
  }
  // No connection established
  else {
    // If MongoDB connection requires authentication
    if (config.user && config.password) {
      authentication = config.user + ':' + config.password + '@';
    }
    url = 'mongodb://' + authentication + config.host + ':' + config.port + '/' + config.name;
    MongoClient.connect(url, {
      db: config.options,
      server: {
        poolSize: config.poolsize,
        socketOptions: {
          autoReconnect: true
        }
      }
    }, function (error, databaseConnection) {
      if (error) {
        cb && cb(error);
      } else {
        conn = databaseConnection;
      }
    });
  }
};
