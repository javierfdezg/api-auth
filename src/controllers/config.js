/*
 * Copyright (c) inSided BV
 */

/*jslint node: true */
/*jshint -W030 */
'use strict';

function get (req, res) {
  res.status(406).send('Not implemented');
}

function post (req, res) {
  res.status(406).send('Not implemented');
}

function put (req, res) {
  res.status(406).send('Not implemented');
}

function del (req, res) {
  res.status(406).send('Not implemented');
}

var configHandlers = {};

configHandlers.get = get;
configHandlers.post = post;
configHandlers.put = put;
configHandlers.del = del;

module.exports = configHandlers;
