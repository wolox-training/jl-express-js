'use strict';

const { getResouces } = require('../services/album'),
  Album = require('../models').albums;

exports.albumList = (req, res, next) =>
  getResouces('/albums')
    .then(albums => {
      res.status(200).send(albums);
    })
    .catch(next);

exports.buyAnAlbum = async (req, res, next) => {
  try {
    const album = await getResouces(`/albums/${req.params.id}`);

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

exports.listPurchasedAlbums = (req, res, next) =>
  Album.getAlbumBy(req.params.user_id)
    .then(result => {
      res.status(200).send(result);
    })
    .catch(next);
