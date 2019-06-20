// require User model and bcrypt library
const User = require("./models").User;
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
  }

}
