const jwt = require('jwt-simple'),
  config = require('./../../config'),
  secret = config.common.session.secret;

exports.HEADER = config.common.session.header_name;

exports.encoder = payload => jwt.encode(payload, secret);
