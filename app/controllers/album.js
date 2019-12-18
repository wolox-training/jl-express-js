'use strict';

const { getResources } = require('../services/album'),
  { decoder, AUTHORIZATION } = require('../services/sessionManager'),
  errors = require('../errors'),
  User = require('../models').users,
  Album = require('../models').albums;

exports.albumList = (req, res, next) =>
  getResources('/albums')
    .then(albums => {
      res.status(200).send(albums);
    })
    .catch(next);

exports.buyAnAlbum = async (req, res, next) => {
  try {
    const album = await getResources(`/albums/${req.params.id}`);

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

exports.listAlbumsPhotos = async (req, res, next) => {
  try {
    const auth = req.headers[AUTHORIZATION];
    const decipherText = decoder(auth),
      user = await User.getUserBy(decipherText.email);

    let albums = await Album.getAlbumBy(user.id);
    albums = albums.filter(value => parseInt(value.albumId) === parseInt(req.params.id));

    if (!albums.length) throw errors.albumNotFound('the user do not have this album yet');

    const photos = await getResources(`/albums/${albums[0].albumId}/photos`);

    res.status(200).send(photos);
  } catch (error) {
    next(error);
  }
};
