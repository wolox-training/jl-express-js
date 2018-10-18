'use strict';

const errors = require('../errors'),
  { getAlbums } = require('../services/album'),
  Album = require('../models').albums,
  logger = require('../logger');

exports.albumList = (req, res, next) => {
  return getAlbums('/albums')
    .then(albums => {
      res.status(200).send(albums);
    })
    .catch(next);
};

exports.buyAnAlbum = async (req, res, next) => {
  try {
    const album = await getAlbums(`/albums/${req.params.id}`);

    const newAlbum = {
      albumId: album.id,
      userId: req.body.id
    };

    await Album.createModel(newAlbum);

    res.status(200).send(album);
  } catch (err) {
    next(err);
  }
};
