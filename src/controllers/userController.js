const userQueries = require("../db/queries.users.js");
const passport = require("passport");

module.exports = {
  signUp(req, res, next){
    res.render("users/sign_up");
  },

  create(req,res,next) {
    // pull values from req.body and add them to a newUser object
    let newUser = {
      email: req.body.email,
      password: req.body.password,
      passwordConfirmation: req.body.passwordConfirmation
    };

    // call createUser from userQueries, passing in our newUser obj and callback()
    userQueries.createUser(newUser, (err, user) => {
      if(err){
        req.flash("error", err);
        res.redirect("/users/sign_up");
      } else {
        // if user created successfully, auth user by calling passport.authenticate()
        // sets message and redirects to landing, uses function in passport-config.js where local strategy defined
        passport.authenticate("local")(req, res, () => {
          req.flash("notice", "You've successfully signed in!");
          res.redirect("/");
        })
      }
    });
  },

  signInForm(req, res, next){
    res.render("users/sign_in");
  },

  signIn(req, res, next){
     passport.authenticate("local")(req, res, function () {
       if(!req.user){
         req.flash("notice", "Sign in failed. Please try again.")
         res.redirect("/users/sign_in");
       } else {
         req.flash("notice", "You've successfully signed in!");
         res.redirect("/");
       }
     })
   },

   signOut(req, res, next){
     req.logout();
     req.flash("notice", "You've succesfully signed out!");
     res.redirect("/");
   },

   show(req, res, next){

     //call getUser, passing id of user
     userQueries.getUser(req.params.id, (err, result) => {

       // if error or user doesn't exist, flash notice
       if(err || result.user === undefined){
         req.flash("notice", "No user found with that ID.");
         res.redirect("/");
       } else {
         // else render the view and pass in the unpacked object
         res.render("users/show", {...result});
       }
     });
   }

}
