const Topic = require("./models").Topic;
const Post = require("./models").Post;

module.exports = {
  getAllTopics(callback){
    return Topic.all()
    .then((topics) => {
      callback(null, topics);
    })
    .catch((err) => {
      callback(err);
    })
  },

  getTopic(id, callback){
    return Topic.findById(id, {
      include: [{
        model: Post,
        as: "posts"
      }]
    })
    .then((topic) => {
      callback(null, topic);
    })
    .catch((err) => {
      callback(err);
    })
  },

  addTopic(newTopic, callback){
    return Topic.create({
      title: newTopic.title,
      description: newTopic.description
    })
    .then((topic) => {
      callback(null, topic);
    })
    .catch((err) => {
      callback(err);
    })
  },

  deleteTopic(req, callback){

    // searches for topic matching the id in the req.params
     return Topic.findById(req.params.id)
     .then((topic) => {

      // if we find the topic, pass it along with signed in user to policy constructor and call destroy()
       const authorized = new Authorizer(req.user, topic).destroy();

       if(authorized) {
         // if authorized user, call destroy method of Sequelize model to destroy
         topic.destroy()
         .then((res) => {
           callback(null, topic);
         });

       } else {
         // if not authorized, flash notice message and pass 401 for redirect
         req.flash("notice", "You are not authorized to do that.")
         callback(401);
       }
     })
     .catch((err) => {
       callback(err);
     });
   },

   updateTopic(req, updatedTopic, callback){

     // search for a topic matching the id passed in the req.params
      return Topic.findByPk(req.params.id)
      .then((topic) => {

        //if not found, return error notice
        if(!topic){
          return callback("Topic not found");
        }

        // auth the user and topic by calling update method on policy instance
        const authorized = new Authorizer(req.user, topic).update();

        if(authorized) {
          // if authorized, call update method of Sequelize model. pass in the object containing the updated attributes/values
          topic.update(updatedTopic, {
            fields: Object.keys(updatedTopic)
          })
          .then(() => {
            callback(null, topic);
          })
          .catch((err) => {
            callback(err);
          });
        } else {

          // if not authorized, create notice and give control to controller
          req.flash("notice", "You are not authorized to do that.");
          callback("Forbidden");
        }
      });
    }
}
