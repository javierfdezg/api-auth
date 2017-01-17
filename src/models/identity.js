'use strict';

var mongoose = require('mongoose');

var IdentitySchema = new mongoose.Schema({
  customer: {type: String, required: true},
	profile: {type: mongoose.Schema.Types.mixed},
	access_token: {type: String, required: true},
	refresh_token: {type: String, required: true}
});

module.exports = mongoose.model('Identity', IdentitySchema);
