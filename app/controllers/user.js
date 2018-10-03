'use strict';

const bcrypt = require('bcrypt'),
  saltRounds = 10,
  salt = bcrypt.genSaltSync(saltRounds),
  errors = require('../errors'),
  { validateUser } = require('./validations'),
  User = require('../models').users,
  { encoder, HEADER } = require('./../services/jwt'),
  logger = require('../logger');

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

exports.singIn = async (req, res, next) => {
  const user = req.body
    ? {
        email: req.body.email,
        password: req.body.password
      }
    : {};

  const signErrors = validateUser(user);

  try {
    if (!signErrors.valid) throw errors.signInError(signErrors.messages);

    const result = await User.getUserBy(user.email);

    if (!result) throw errors.signInError('user not registered');

    return bcrypt.compare(user.password, result.password, (err, validPassword) => {
      if (validPassword) {
        logger.info(`${result.firstName} logged in.`);
        const token = encoder({ email: result.email });
        res
          .status(200)
          .set(HEADER, token)
          .send(result);
        res.end();
      } else {
        next(errors.signInError('Password invalid!'));
      }
    });
  } catch (err) {
    next(err);
  }
};
