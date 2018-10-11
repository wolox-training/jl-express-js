'use strict';

const errors = require('../errors'),
  { getAll } = require('../services/album'),
  logger = require('../logger');

exports.albumList = async (req, res, next) => {
  getAll('/albums')
    .then(albums => {
      res.status(200).send(albums);
    })
    .catch(next);
};
