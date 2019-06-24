const commentQueries = require("../db/queries.comments.js");
const Authorizer = require("../policies/comment.js");

module.exports = {
 create(req, res, next){
   // check auth for comment creation
   const authorized = new Authorizer(req.user).create();

   if(authorized) {

     // create comment if authorized
     let newComment = {
       body: req.body.body,
       userId: req.user.id,
       postId: req.params.postId
     };

     // call createComment
     commentQueries.createComment(newComment, (err, comment) => {
       // send an error if needed
       if(err){
         req.flash("error", err);
       }
       res.redirect(req.headers.referer);
     });
   } else {
     req.flash("notice", "You must be signed in to do that.")
     req.redirect("/users/sign_in");
   }
 },

 // remove a comment
 destroy(req, res, next){
   commentQueries.deleteComment(req, (err, comment) => {
     if(err){
       res.redirect(err, req.headers.referer);
     } else {
       res.redirect(req.headers.referer);
     }
   });
 }
}
