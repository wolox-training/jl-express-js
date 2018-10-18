'use strict';

const { singUp, singIn, userList, singUpAdmins } = require('./controllers/user'),
  { albumList, buyAnAlbum } = require('./controllers/album'),
  { verifyToken, verifyPermission } = require('./middlewares/auth');

exports.init = app => {
  app.post('/users/', singUp);
  app.post('/users/sessions/', singIn);
  app.get('/users/', verifyToken, userList);
  app.get('/albums/', verifyToken, albumList);
  app.post('/albums/:id', verifyToken, buyAnAlbum);
  app.post('/admin/users/', [verifyToken, verifyPermission], singUpAdmins);
};
