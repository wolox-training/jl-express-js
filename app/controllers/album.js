'use strict';

const errors = require('../errors'),
  { getAll } = require('../services/album'),
  logger = require('../logger');

exports.albumList = (req, res, next) => {
  return getAll('/albums')
    .then(albums => {
      res.status(200).send(albums);
    })
    .catch(next);
};
