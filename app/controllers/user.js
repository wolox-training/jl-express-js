'use strict';

const bcrypt = require('bcrypt'),
  saltRounds = 10,
  salt = bcrypt.genSaltSync(saltRounds),
  { validateEmail, validatePassword } = require('./validations'),
  errors = require('../errors'),
  User = require('../models').users;

exports.singUp = (req, res, next) => {
  const signErrors = [];
  const user = req.body
    ? {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
      }
    : {};

  if (!validateEmail(user.email)) signErrors.push(errors.emailError());

  if (!validatePassword(user.password)) signErrors.push(errors.passwordError());

  if (signErrors.length) throw errors.signupError(signErrors);

  user.password = bcrypt.hashSync(user.password, salt);

  return User.createModel(user)
    .then(() => {
      res.status(201).send(`User created correctly.`);
      res.end();
    })
    .catch(err => {
      next(err);
    });
};

exports.singIn = (req, res, next) => {
  res.send('pong');
};
