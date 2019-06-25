const favoriteQueries = require("../db/queries.favorites.js");

module.exports = {

  // create
  create(req, res, next){
    if(req.user){ // check if user is signed in
      favoriteQueries.createFavorite(req, (err, favorite) => {
        if(err){
          req.flash("error", err);
        }
      });
    } else {
      req.flash("notice", "You must be signed in to do that.")
    }
    res.redirect(req.headers.referer);
  },

  // destroy
  destroy(req, res, next){
    if(req.user){ // check if user is signed in
      favoriteQueries.deleteFavorite(req, (err, favorite) => {
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
