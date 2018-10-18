'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface
      .createTable('albums', {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
          unique: true
        },
        albumId: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        userId: {
          allowNull: false,
          type: Sequelize.INTEGER,
          references: {
            model: 'users',
            key: 'id'
          }
        },
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
        deletedAt: Sequelize.DATE
      })
      .then(() =>
        queryInterface.addIndex('albums', ['userId', 'albumId'], {
          indicesType: 'UNIQUE'
        })
      ),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('albums')
};
