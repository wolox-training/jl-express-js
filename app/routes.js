'use strict';

const { singUp, singIn } = require('./controllers/user');

exports.init = app => {
  app.post('/users/', singUp);
  app.post('/users/sessions/', singIn);
};
