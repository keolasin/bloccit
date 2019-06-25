"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Favorites", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      // postId attribute
      postId: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE", // if post is delete, all associated favorites should be deleted
        allowNull: false,
        references: {
          model: "Posts",
          key: "id",
          as: "postId"
        }
      },

      // userId attribute
      userId: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE", // if user is delete, all associated favorites should be deleted
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
          as: "userId"
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Favorites");
  }
};
