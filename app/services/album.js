'use strict';

const axios = require('axios'),
  config = require('../../config'),
  errors = require('../errors'),
  logger = require('../logger'),
  url = config.common.albumsApi.url;

exports.getResources = source =>
  axios
    .get(`${url}${source}`)
    .then(res => res.data)
    .catch(err => {
      logger.error(err);

      if (err.response.status === 404) throw errors.albumNotFound(err.message);

      throw errors.albumsApiError(err.message);
    });
