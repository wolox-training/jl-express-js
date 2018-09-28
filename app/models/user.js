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
      }
    },
    {
      paranoid: true,
      freezeTableName: true,
      underscored: true
    }
  );

  User.createModel = user => {
    return User.create(user)
      .then(success => {
        logger.info(`User ${success.dataValues.firstName} created correctly.`);
      })
      .catch(err => {
        logger.info(`${user.firstName} user no created.`);
        logger.error(err);
        throw errors.databaseError(err);
      });
  };
  return User;
};
