const flairQueries = require("../db/queries.flairs.js");

module.exports = {
  new(req, res, next){
    res.render("flairs/new", {postId: req.params.postId});
  },

  create(req, res, next){
    let newFlair = {
      name: req.body.name,
      color: req.body.color,
      postId: req.params.postId
    };
    flairQueries.addFlair(newFlair, (err, post) => {
      if(err){
        res.redirect(500, "/flairs/new");
      } else {
        res.redirect(303, `/topics/${post.topicId}/posts/${post.id}/flairs/${flair.id}`)
      }
    });
  }
}
