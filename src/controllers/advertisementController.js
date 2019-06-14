const advertisementQueries = require('../db/queries.advertisements.js');

module.exports = {
  index(req, res, next){
    advertisementQueries.getAllAdvertisements((err, topics) => {
      if(err){
        res.redirect(500, "static/index");
      } else {
        res.render("advertisements/index", {advertisements});
      }
    })
  },


}
