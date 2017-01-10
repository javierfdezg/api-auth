/*
 * Copyright (c) inSided BV
 */

/*jslint node: true */
/*jshint -W030 */
"use strict";

var path = require('path');

module.exports = exports = {
  appName: 'api-auth',
  appDir: path.normalize(__dirname + '/../../'),
  httpp: process.env.port || 3000, // https port
  httpsp: 3001, // https port
  maxLag: 200, // Too Busy max lag (ms)
  cookiesSecret: "-WNSScrt_123.::;109",
  data: {
    name: 'api-auth', // Database name
    host: '127.0.0.1', // Database host
    user: '', // Database user
    password: '', // Database password
    port: 27017,
    poolsize: 5,
    options: {}, // MongoDB options
  },
  logging: {
    directory: path.normalize(__dirname + '/../../' + '/log/'),
    console: {
      level: 'debug',
      silent: false,
      colorize: true,
      timestamp: true
    },
    file: {
      filename: path.normalize(__dirname + '/../../' + '/log/') + 'error.log',
      level: 'warn',
      json: false,
      colorize: false,
      timestamp: true,
      maxsize: 1024 * 1024 * 5 // Log rotation 5MB
    }
  }
};
