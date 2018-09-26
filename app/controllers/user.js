'use strict';

const User = require('../models').user;

const singUp = (req, res) => {
  const user = {};

  user.firstName = req.body.firstName ? req.body.firstName : '';
  user.lastName = req.body.lastName ? req.body.lastName : '';
  user.email = req.body.email ? req.body.email : '';
  user.password = req.body.password ? req.body.password : '';

  User.createModel(user).then(u => {
    res.status(200).send('User created correctly.');
    res.end();
  });
};

module.exports = {
  singUp
};
