'use strict';

const { singUp } = require('./controllers/user');

exports.init = app => {
  app.post('/users/', singUp);
};
