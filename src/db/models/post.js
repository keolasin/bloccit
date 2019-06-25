'use strict';
module.exports = (sequelize, DataTypes) => {
  var Post = sequelize.define('Post', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    body: {
      type: DataTypes.STRING,
      allowNull: false
    },
    topicId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});
  Post.associate = function(models) {
    // associations can be defined here

    Post.belongsTo(models.Topic, {
      foreignKey: "topicId",
      onDelete: "CASCADE"
    });

    Post.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    });

    Post.hasMany(models.Comment, {
      foreignKey: "postId",
      as: "comments"
    });

    Post.hasMany(models.Vote, {
     foreignKey: "postId",
     as: "votes"
   });
  };

  Post.prototype.getPoints = function(){
    if(this.votes.length === 0){
      return 0;
    } else {
      return this.votes
        .maps(vote => {
          return vote.values;
        })
        .reduce((previous, next) => {
          return previous + next;
        });
    };
  }

  Post.prototype.hasUpvoteFor = function(userId){
    let hasUpvote = false;
    this.votes.find(vote => {
      if(vote.userId === userId && vote.value === 1){
        hasUpvote = true;
        return hasUpvote;
      }
    });
  }

  Post.prototype.hasDownvoteFor = function(userId){
    let hasDownvote = false;
    this.votes.find(vote => {
      if(vote.userId === userId && vote.value === -1){
        hasDownvote = true;
        return hasDownvote;
      }
    });
  }
  return Post;
};
