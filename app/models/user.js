'use strict';

const logger = require('../logger');
const errors = require('../errors');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'users',
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      permission: {
        type: DataTypes.ENUM,
        values: ['regular', 'administrator'],
        defaultValue: 'regular',
        allowNull: false
      }
    },
    {
      paranoid: true,
      freezeTableName: true,
      underscored: true
    }
  );

  User.createModel = user =>
    User.create(user)
      .then(success => {
        logger.info(`User ${success.dataValues.firstName} created correctly.`);
      })
      .catch(err => {
        logger.info(`${user.firstName} user no created.`);
        logger.error(err);
        if (err.name === 'SequelizeUniqueConstraintError') {
          throw errors.signupError('User already exist');
        }
        throw errors.databaseError(err);
      });

  User.getUserBy = email =>
    User.findOne({
      where: {
        email
      }
    }).catch(err => {
      logger.error(err);
      throw errors.databaseError(err);
    });

  User.getAllUserBy = (limit, offset) => {
    return User.findAndCountAll({
      attributes: ['firstName', 'lastName', 'email'],
      offset,
      limit
    }).catch(err => {
      logger.error(err);
      throw errors.databaseError(err);
    });
  };

  return User;
};
