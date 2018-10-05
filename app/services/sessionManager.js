const jwt = require('jwt-simple'),
  config = require('../../config'),
  secret = config.common.session.secret;

exports.AUTHORIZATION = config.common.session.header_name;

exports.encoder = payload => jwt.encode(payload, secret);

exports.decoder = token => jwt.decode(token, secret);
