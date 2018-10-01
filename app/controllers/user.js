'use strict';

const bcrypt = require('bcrypt'),
  saltRounds = 10,
  salt = bcrypt.genSaltSync(saltRounds),
  errors = require('../errors'),
  { validations } = require('./validations'),
  User = require('../models').users;

exports.singUp = async (req, res, next) => {
  const user = req.body
    ? {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
      }
    : {};

  const signErrors = await validations(user);

  try {
    if (signErrors.length) throw errors.signupError(signErrors);

    user.password = bcrypt.hashSync(user.password, salt);

    return User.createModel(user)
      .then(() => {
        res.status(201).send(`User created correctly.`);
        res.end();
      })
      .catch(next);
  } catch (err) {
    next(err);
  }
};
