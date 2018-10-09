'use strict';

const errors = require('../errors'),
  { getAll } = require('../services/album'),
  logger = require('../logger');

exports.albumList = async (req, res, next) => {
  try {
    const albums = await getAll();
    res.status(200).send(albums.data);
  } catch (err) {
    next(err);
  }
};
