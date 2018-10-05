'use strict';

const { singUp, singIn, userList, singUpAdmins } = require('./controllers/user'),
  { verifyToken } = require('./middlewares/auth');

exports.init = app => {
  app.post('/users/', singUp);
  app.post('/users/sessions/', singIn);
  app.get('/users/', verifyToken, userList);
  app.post('/admin/users/', verifyToken, singUpAdmins);
};
