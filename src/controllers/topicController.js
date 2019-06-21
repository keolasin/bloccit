const topicQueries = require("../db/queries.topics.js");

const Authorizer = require("../policies/topic");

module.exports = {
  index(req, res, next){
    topicQueries.getAllTopics((err, topics) => {
      if(err){
        res.redirect(500, "static/index");
      } else {
        res.render("topics/index", {topics});
      }
    })
  },

  new(req, res, next){
    // access the request object and passport can use req.user
    // create new instance of policy class
     const authorized = new Authorizer(req.user).new();

     //render the topic form or flash a notice and redirect
     if(authorized) {
       res.render("topics/new");
     } else {
       req.flash("notice", "You are not authorized to do that.");
       res.redirect("/topics");
     }
  },

  create(req, res, next){

      // pass the user to the policy constructor and call create on the policy instance
     const authorized = new Authorizer(req.user).create();

     //if true, continue with Topic obj creation
     if(authorized) {
       let newTopic = {
         title: req.body.title,
         description: req.body.description
       };
       topicQueries.addTopic(newTopic, (err, topic) => {
         if(err){
           res.redirect(500, "topics/new");
         } else {
           res.redirect(303, `/topics/${topic.id}`);
         }
       });
     } else {

       // if not authorized, flash error and redirect
       req.flash("notice", "You are not authorized to do that.");
       res.redirect("/topics");
     }
   },

  show(req, res, next){
    topicQueries.getTopic(req.params.id, (err, topic) => {
      if(err || topic == null){
        res.redirect(404, "/");
      } else {
        res.render("topics/show", {topic});
      }
    });
  },

  destroy(req, res, next){

    // pass the request object to the deleteTopic method
     topicQueries.deleteTopic(req, (err, topic) => {
       if(err){
         res.redirect(err, `/topics/${req.params.id}`)
       } else {
         res.redirect(303, "/topics")
       }
     });
   },

  edit(req, res, next){

    // query for the topic with the matching id from the url params
     topicQueries.getTopic(req.params.id, (err, topic) => {
       if(err || topic == null){
         res.redirect(404, "/");
       } else {
         //if we find the topic, pass it to the policy constructor along with signed in user - call edit from policy class
         const authorized = new Authorizer(req.user, topic).edit();

         // render edit view if authorized or flash error and redirect
         if(authorized){
           res.render("topics/edit", {topic});
         } else {
           req.flash("You are not authorized to do that.")
           res.redirect(`/topics/${req.params.id}`)
         }
       }
     });
   },

   update(req, res, next){
      topicQueries.updateTopic(req, req.body, (err, topic) => {
        if(err || topic == null){
          res.redirect(401, `/topics/${req.params.id}/edit`);
        } else {
          res.redirect(`/topics/${req.params.id}`);
        }
      });
    }
}
