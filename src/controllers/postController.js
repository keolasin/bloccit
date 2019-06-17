const postQueries = require("../db/queries.posts.js");

module.exports = {
  new(req, res, next){
    res.render("posts/new", {topicId: req.params.topicId});
  },

  create(req, res, next){
    let newPost= {
      title: req.body.title,
      body: req.body.body,
      topicId: req.params.topicId
    };

    postQueries.addPost(newPost, (err, post) => {
      if(err){
        res.redirect(500, "/posts/new");
        console.log(`error hit: ${err}`);
      } else {
        console.log(`success`);
        res.redirect(303, `/topics/${newPost.topicId}/posts/${post.id}`);
      }
    });
  },

  show(req, res, next){
    postQueries.getPost(req.params.id, (err, post) => {
      if(err || post == null){
        res.redirect(404, "/");
      } else {
        res.render("posts/show", {post});
      }
    });
  }
}