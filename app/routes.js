'use strict';

const { singUp, singIn, userList } = require('./controllers/user'),
  { verifyToken } = require('./middlewares/auth');

exports.init = app => {
  app.post('/users/', singUp);
  app.post('/users/sessions/', singIn);
  app.get('/users/', verifyToken, userList);
};
