'use strict';

const errors = require('../errors');
const logger = require('../logger');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'user',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true
      },
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
      timestamps: false
    }
  );

  User.associate = function(models) {};

  //   User.createModel = user => {
  //     return User.create(user).then(result => {
  //       const save = result.get({ plain: true });
  //       console.log(save);
  //       return save;
  //       // .catch(success => {
  //       //   console.log('######################\n');
  //       //   console.log(success);
  //       //   console.log('\n######################\n');
  //       // });
  //     });
  //   };

  User.createModel = user => {
    return User.create(user).then((success, err) => {
      if (err) {
        console.log('########## ERROR ############\n');
        console.log(err);
        console.log('\n######################\n');
      } else {
        logger.info(`User ${success.dataValues.firstName} created correctly.`);
      }
    });
  };
  return User;
};
