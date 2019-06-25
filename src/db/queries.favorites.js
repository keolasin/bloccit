const Comment = require("./models").Comment;
const Post = require("./models").Post;
const User = require("./models").User;
const Favorite = require("./models").Favorite;
const Authorizer = require("../policies/favorite");

module.exports = {

  // create
  createFavorite(req, callback){
    return Favorite.create({
      // call create on Favorite model
      postId: req.params.postId,
      userId: req.user.id
    })
    .then((favorite) => {
      callback(null, favorite);
    })
    .catch((err) => {
      callback(err);
    });
  },

  // delete
  deleteFavorite(req, callback){
    const id = req.params.id;

    return Favorite.findById(id)
    .then((favorite) => {

      if(!favorite){ // check if the favorite exists for the user/post
        return callback("Favorite not found");
      }

      // check if user is authorized
      const authorized = new Authorizer(req.user, favorite).destroy();

      if(authorized){
        Favorite.destroy({ where: { id }})
        .then((deletedRecordsCount) => {
          callback(null, deletedRecordsCount);
        })
        .catch((err) => {
          callback(err);
        });
      } else {
        req.flash("notice", "You are not authorized to do that.")
        callback(401);
      }
    })
    .catch((err) => {
      callback(err);
    });
  }
}
