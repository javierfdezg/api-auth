/*jslint node: true */
/*jshint -W030 */
"use strict";

function getConnectionString (config) {
  var authentication = '';

  if (config.user && config.password) {
    authentication = config.user + ':' + config.password + '@';
  }

  return 'mongodb://' + authentication + config.host + ':' + config.port + '/' + config.name;
}

module.exports = getConnectionString;
