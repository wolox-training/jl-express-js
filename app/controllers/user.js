'use strict';

const bcrypt = require('bcryptjs'),
  saltRounds = 10,
  salt = bcrypt.genSaltSync(saltRounds),
  errors = require('../errors'),
  { validateUser } = require('./validations'),
  User = require('../models').users,
  { encoder, AUTHORIZATION } = require('../services/sessionManager'),
  logger = require('../logger'),
  { permission } = require('./enum');

const userParser = data => {
  const user = data
    ? {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password
      }
    : {};

  const signErrors = validateUser(user);

  if (!signErrors.valid) throw errors.signupError(signErrors.messages);

  user.password = bcrypt.hashSync(user.password, salt);
  return user;
};

exports.singUp = async (req, res, next) => {
  try {
    const user = userParser(req.body);

    await User.createModel(user);

    res.status(201).send(`User created correctly.`);
    res.end();
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
        page: req.query.page || 1,
        count: req.query.count || 10
      }
    : {};

  try {
    query.offset = parseInt(query.count * (query.page - 1));

    const result = await User.getAllUserBy(query.count, query.offset),
      pages = Math.ceil(result.count / query.count);
    res.json({ users: result.rows, count: result.count, pages });
  } catch (err) {
    next(err);
  }
};

exports.singUpAdmins = async (req, res, next) => {
  try {
    const user = userParser(req.body);

    user.permission = permission.ADMINISTRATOR;

    await User.createAdmin(user);

    res.status(201).send(`User created correctly.`);
  } catch (err) {
    next(err);
  }
};

exports.invalidateAll = async (req, res, next) => {
  try {
    const secret =
      Math.random()
        .toString(36)
        .substring(2, 12) +
      Math.random()
        .toString(36)
        .substring(2, 12);
    // console.log('random', r);
    res.status(200).send(`random: ${secret}`);
  } catch (err) {
    next(err);
  }
};
