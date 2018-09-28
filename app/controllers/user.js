'use strict';

const bcrypt = require('bcrypt'),
  saltRounds = 10,
  salt = bcrypt.genSaltSync(saltRounds);

const User = require('../models').users;

const validateEmail = valor => {
  if (/^\w+([\.-]?\w+)@wolox+(\.\w{2,3})+$/.test(valor)) {
    return true;
  } else {
    return false;
  }
};

const validatePassword = valor => {
  if (/^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,}$/.test(valor)) {
    return true;
  } else {
    return false;
  }
};

const singUp = (req, res) => {
  const user = {};

  user.firstName = req.body.firstName ? req.body.firstName : '';
  user.lastName = req.body.lastName ? req.body.lastName : '';
  user.email = req.body.email ? req.body.email : '';
  user.password = req.body.password ? req.body.password : '';

  console.log(`THE EMAIL IS: ${validateEmail(user.email)}`);
  console.log(`THE PASSWORD IS: ${validatePassword(user.password)}`);

  if (!validateEmail(user.email) || !validatePassword(user.password)) {
    res.status(302).send('Error');
    return;
  }

  user.password = bcrypt.hashSync(user.password, salt);

  User.createModel(user).then(u => {
    res.status(200).send('User created correctly.');
    res.end();
  });
};

module.exports = {
  singUp
};
