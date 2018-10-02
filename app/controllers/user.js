'use strict';

const bcrypt = require('bcrypt'),
  saltRounds = 10,
  salt = bcrypt.genSaltSync(saltRounds),
  errors = require('../errors'),
  { validateUser } = require('./validations'),
  User = require('../models').users;

exports.singUp = (req, res, next) => {
  const user = req.body
    ? {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
      }
    : {};

  const signErrors = validateUser(user);

  try {
    if (!signErrors.valid) throw errors.signupError(signErrors.messages);

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
