'use strict';
module.exports = (sequelize, DataTypes) => {
  var Topic = sequelize.define('Topic', {
    title: DataTypes.STRING,
    description: DataTypes.STRING
  }, {});
  Topic.associate = function(models) {
    // associations can be defined here
    Topic.hasMany(models.Banner, {
      foreignKey: "topicId",
      as: "banners"
    });
    Topic.hasMany(models.Rule, {
      foreignKey: "topicId",
      as: "rules"
    });
  };
  return Topic;
};

/*
For this assignment, Write a Rule model with a description property. Rule objects belong to a Topic and a Topic object can have many Rule objects.
*/
