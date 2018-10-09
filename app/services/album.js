'use strict';

const axios = require('axios'),
  config = require('../../config'),
  errors = require('../errors'),
  logger = require('../logger'),
  url = config.common.albumsApi.url;

exports.getAll = () =>
  axios.get(url).catch(err => {
    logger.error(err);
    throw errors.albumsApiError(err);
  });
