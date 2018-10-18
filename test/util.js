'use strict';

const chai = require('chai'),
  server = require('./../app');

exports.userOne = {
  firstName: 'pepito',
  lastName: 'perez',
  email: 'pepito.perez@wolox.com',
  password: 'Holahola23'
};

exports.anotherUser = {
  firstName: 'pepito',
  lastName: 'paez',
  email: 'pepito.paez@wolox.com',
  password: 'Holahola23'
};

exports.saveUser = user =>
  chai
    .request(server)
    .post('/users/')
    .send(user);

exports.login = credentials =>
  chai
    .request(server)
    .post('/users/sessions/')
    .send(credentials);
