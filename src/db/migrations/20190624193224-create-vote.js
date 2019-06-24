"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Votes", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      value: {
        // value should not be null and only set to 1 or -1
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          isIn: [[-1, 1]]
        }
      },

      // associate a vote and post - if post deleted, delete votes as well
      postId: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        allowNull: false,
        references: {
          model: "Posts",
          key: "id",
          as: "postId"
        }
      },

      // associate a vote and user - if user deleted, delete votes as well
      userId: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
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
    return queryInterface.dropTable("Votes");
  }
};
