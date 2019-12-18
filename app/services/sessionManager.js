const jwt = require('jwt-simple'),
  config = require('../../config'),
  secret = config.common.session.secret,
  moment = require('moment'),
  expiration = config.common.session.expiration;

exports.AUTHORIZATION = config.common.session.header_name;

exports.encoder = payload => {
  const expires = moment()
    .add(expiration, 'minutes')
    .valueOf();

  payload.expiration = expires;
  return jwt.encode(payload, secret);
};

exports.decoder = token => jwt.decode(token, secret);
