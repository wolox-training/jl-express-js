'use strict';

const bcrypt = require('bcrypt'),
  saltRounds = 10,
  salt = bcrypt.genSaltSync(saltRounds),
  errors = require('../errors'),
  { validateUser } = require('./validations'),
  User = require('../models').users,
  jwt = require('jwt-simple'),
  logger = require('../logger'),
  secret = 'super-secret';

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

exports.singIn = (req, res, next) => {
  const user = req.body
    ? {
        email: req.body.email,
        password: req.body.password
      }
    : {};

  const signErrors = validateUser(user);

  try {
    if (!signErrors.valid) throw errors.signInError(signErrors.messages);

    return User.getUserByEmailAndPassword(user.email)
      .then(result => {
        if (!result) throw errors.signInError(['user not registered']);

        bcrypt.compare(user.password, result.password, (err, validPassword) => {
          if (validPassword) {
            logger.info(`${result.firstName} logged in.`);
            const token = jwt.encode({ email: result.email }, secret);
            res
              .status(200)
              .set('auth', token)
              .send(result);
            res.end();
          } else {
            next(errors.signInError(['Password invalid!']));
          }
        });
      })
      .catch(next);
  } catch (err) {
    next(err);
  }
  res.send(req.body);
};
