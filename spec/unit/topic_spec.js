const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const User = require("../../src/db/models").User;

describe("Topic", () => {

  beforeEach((done) => {
     this.topic;
     this.post;
     this.user;

     sequelize.sync({force: true}).then((res) => {

       // create user object
       User.create({
         email: "starman@tesla.com",
         password: "Trekkie4lyfe"
       })
       .then((user) => {
         this.user = user; //store the user

         // create topic object
         Topic.create({
           title: "Expeditions to Alpha Centauri",
           description: "A compilation of reports from recent visits to the star system.",

           // associated post created for parent topic
           posts: [{
             title: "My first visit to Proxima Centauri b",
             body: "I saw some rocks.",
             userId: this.user.id
           }]
         }, {

          // tells us to store the associated post via the Post model as 'posts'
           include: {
             model: Post,
             as: "posts"
           }
         })
         .then((topic) => {
           this.topic = topic; //store the topic
           this.post = topic.posts[0]; //store the post
           done();
         })
       })
     });
   });

  describe("#create()", () => {

    it("should create a topic object with a title and description", (done) => {

      Topic.create({
        title: "Rock climbing",
        body: "All things related to rock climbing",
      })
      .then((topic) => {
        expect(topic.title).toBe("Rock climbing");
        expect(topic.description).toBe("All things related to rock climbing");
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });

    it("should not create a topic with missing title or description", (done) => {
      Topic.create({
        title: "Rock climbing"
      })
      .then((topic) => {
        // won't be evaluated due to description missing, go to catch()
        done();
      })
      .catch((err) => {
        expect(err.message).toContain("Topic.description cannot be null");
        done();
      });
    });
  });

  describe("#getPosts()", () => {
    it("should return the associated posts", (done) => {
      this.topic.getPosts()
      .then((associatedPosts) => {
        expect(associatedPosts.length).toBe(1);
        expect(associatedPosts[0].title).toBe("Fire-breathing");
        done();
      });
    });
  });
});
