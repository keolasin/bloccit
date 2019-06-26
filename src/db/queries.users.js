// require User model and bcrypt library
const User = require("./models").User;
const Post = require("./models").Post;
const Comment = require("./models").Comment;
const bcrypt = require("bcryptjs");


module.exports = {
  // method to handle user creation
  createUser(newUser, callback){

    // salt using bcrypt to pass to hashSync
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);

    // store hashed pw in the database when we create and return the user object
    return User.create({
      email: newUser.email,
      password: hashedPassword
    })
    .then((user) => {
      callback(null, user);
    })
    .catch((err) => {
      callback(err);
    })
  },

  getUser(id, callback){
    // define result object that we will return
    let result = {};
    // find user
    User.findById(id)
    .then((user) => {
      if(!user) { // if no user found, give 404 error
        callback(404);
      } else {
        result["user"] = user; // store user as user property for result object

        Post.scope({method: ["lastFiveFor", id]}).findAll() //find last five posts for posts using scope
        .then((posts) => {
          result["posts"] = posts; // store in the result object

          Comment.scope({method: ["lastFiveFor", id]}).findAll() //find last five comments for posts using scope
          .then((comments) => {
            result["comments"] = comments; // store in the result object

            Favorite.scope({method: ["favoritePostsFor", id]}).findAll() // find all favorited posts
            .then((favorites) => {
              result["favorites"] = favorites;
              callback(null, result);
            })
          })
          .catch((err) => {
            callback(err);
          })
        })
      }
    })
  }

}
