'use strict';

const logger = require('../logger'),
  errors = require('../errors');

module.exports = (sequelize, DataTypes) => {
  const Album = sequelize.define(
    'albums',
    {
      albumId: { type: DataTypes.INTEGER, allowNull: false },
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
      }
    },
    {
      indexes: [
        {
          unique: true,
          fields: ['albumId', 'userId']
        }
      ]
    },
    {
      paranoid: true,
      freezeTableName: true,
      underscored: true
    }
  );

  Album.associate = models => {
    Album.belongsTo(models.users);
  };

  Album.createModel = album =>
    Album.create(album).catch(err => {
      logger.error(err);
      if (err.name === 'SequelizeUniqueConstraintError') {
        throw errors.albumOrderError('User already have this album');
      }
      throw errors.databaseError(err.message);
    });

  Album.getAlbumBy = userId =>
    Album.findAll({
      where: {
        userId
      }
    }).catch(err => {
      logger.error(err);
      throw errors.databaseError(err);
    });

  return Album;
};
