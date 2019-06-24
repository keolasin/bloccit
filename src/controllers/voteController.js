const voteQueries = require("../db/queries.votes.js");

module.exports = {
  upvote(req, res, next){
    // check if there is a user signed in, then calls createVote from voteQueries.
    if(req.user){
      voteQueries.createVote(req, 1, (err, vote) => {
        if(err){
          // if error, flash
          req.flash("error", err);
        }
        res.redirect(req.headers.referer);
      });
    } else {
      // if not signed in, flash notice
      req.flash("notice", "You must be signed in to do that.")
      res.redirect(req.headers.referer);
    }
  },


  downvote(req, res, next){
    if(req.user){
      voteQueries.createVote(req, -1, (err, vote) => {
        if(err){
          req.flash("error", err);
        }
        res.redirect(req.headers.referer);
      });
    } else {
      req.flash("notice", "You must be signed in to do that.")
      res.redirect(req.headers.referer);
    }
  }
}
