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

  User.createModel = user =>
    User.create(user)
      .then(success => {
        logger.info(`User ${success.dataValues.firstName} created correctly.`);
      })
      .catch(err => {
        logger.info(`${user.firstName} user no created.`);
        logger.error(err);
        if (err.name === 'SequelizeUniqueConstraintError') {
          const signErrors = [];
          signErrors.push('User already exist');
          throw errors.signupError(signErrors);
        }
        throw errors.databaseError(err);
      });

  User.getUserByEmailAndPassword = email =>
    User.findOne({
      where: {
        email
      },
      order: [['createdAt', 'DESC']]
    });

  return User;
};
