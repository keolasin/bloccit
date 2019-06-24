const Comment = require("./models").Comment;
const Post = require("./models").Post;
const User = require("./models").User;
const Vote = require("./models").Vote;

module.exports = {
  createVote(req, val, callback){
    // findOne on Vote model to find vote with the id of the current user as well as the id of the post being voted on
    return Vote.findOne({
      where: {
        postId: req.params.postId,
        userId: req.user.id
      }
    })
    .then((vote) => {

      // if we find it, user has already voted - update the votes value to new upvote/downvote
      if(vote){
        vote.value = val;
        vote.save()
        .then((vote) => {
          callback(null, vote);
        })
        .catch((err) => {
          callback(err);
        });
      } else {

        // if not voted on, then create the vote with the upvote/downvote value and postId and userId
        Vote.create({
          value: val,
          postId: req.params.postId,
          userId: req.user.id
        }).then((vote) => {
          callback(null, vote);
        })
        .catch((err) => {
          callback(err);
        });
      }
    });
  }
}
