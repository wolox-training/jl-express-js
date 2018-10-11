'use strict';

const { singUp, singIn, userList, singUpAdmins } = require('./controllers/user'),
  { albumList } = require('./controllers/album'),
  { verifyToken, verifyPermission } = require('./middlewares/auth');

exports.init = app => {
  app.post('/users/', singUp);
  app.post('/users/sessions/', singIn);
  app.get('/users/', verifyToken, userList);
  app.get('/albums/', verifyToken, albumList);
  app.post('/admin/users/', [verifyToken, verifyPermission], singUpAdmins);
};
