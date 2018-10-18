'use strict';

const axios = require('axios'),
  config = require('../../config'),
  errors = require('../errors'),
  logger = require('../logger'),
  url = config.common.albumsApi.url;

exports.getAlbums = source => {
  return axios
    .get(`${url}${source}`)
    .then(res => res.data)
    .catch(err => {
      logger.error(err);
      throw errors.albumsApiError(err.message);
    });
};
