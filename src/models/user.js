'use strict';

var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  user_id: {type: Integer, required: true},
  yip_id: {type: String, required: true},
  strategies: []
});

module.exports = mongoose.model('User', UserSchema);
