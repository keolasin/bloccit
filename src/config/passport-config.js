// handles authentication using passport
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../db/models").User;
const authHelper = require("../auth/helpers");

module.exports = {
  init(app){

    // init passport, uses sessions to keep track of auth users
    app.use(passport.initialize());
    app.use(passport.session());

    // uses local strategy, looks for props of 'username' and 'password' in req.body normally, so use option of usernameField instead
    passport.use(new LocalStrategy({
      usernameField: "email"
    }, (email, password, done) => {
      User.findOne({
        where: { email }
      })
      .then((user) => {

        // if we find no user with provided email, or pw doesnt match, return error
        if (!user || !authHelper.comparePass(password, user.password)) {
          return done(null, false, { message: "Invalid email or password" });
        }

        // else, return the authenticated user
        return done(null, user);
      })
    }));

    // stores authenticated user.id and stores in session
    passport.serializeUser((user, callback) => {
      callback(null, user.id);
    });

    // takes the user.id stored in the session and returns user associated with it
    passport.deserializeUser((id, callback) => {
      User.findById(id)
      .then((user) => {
        callback(null, user);
      })
      .catch((err =>{
        callback(err, user);
      }))

    });
  }
}
