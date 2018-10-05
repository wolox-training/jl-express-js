'use strict';

const bcrypt = require('bcrypt'),
  saltRounds = 10,
  salt = bcrypt.genSaltSync(saltRounds),
  errors = require('../errors'),
  { validateUser, validateQuery } = require('./validations'),
  User = require('../models').users,
  { encoder, AUTHORIZATION } = require('../services/sessionManager'),
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
          .set(AUTHORIZATION, token)
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

exports.userList = async (req, res, next) => {
  const query = req.query
    ? {
        page: req.query.page,
        count: req.query.count
      }
    : {};

  const queryErrors = validateQuery(query);

  try {
    if (!queryErrors.valid) throw errors.queryError(queryErrors.messages);
    query.offset = parseInt(query.count * (query.page - 1));

    const result = await User.getAllUserBy(query.count, query.offset),
      pages = Math.ceil(result.count / query.count);
    res.json({ users: result.rows, count: result.count, pages });
  } catch (err) {
    next(err);
  }
};

exports.singUpAdmins = (req, res, next) => {
  res.send('pong');
  // const user = req.body
  //   ? {
  //       firstName: req.body.firstName,
  //       lastName: req.body.lastName,
  //       email: req.body.email,
  //       password: req.body.password
  //     }
  //   : {};
  // const signErrors = validateUser(user);
  // try {
  //   if (!signErrors.valid) throw errors.signupError(signErrors.messages);
  //   user.password = bcrypt.hashSync(user.password, salt);
  //   return User.createModel(user)
  //     .then(() => {
  //       res.status(201).send(`User created correctly.`);
  //       res.end();
  //     })
  //     .catch(next);
  // } catch (err) {
  //   next(err);
  // }
};
