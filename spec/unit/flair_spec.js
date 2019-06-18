const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;
const Flair = require("../../src/db/models").Flair;

describe("Flair", () => {
  beforeEach((done) => {
    this.topic;
    this.post;
    this.flair;

    sequelize.sync({force: true}).then((res) => {

      // create a topic
      Topic.create({
        title: "Learning spanish",
        description: "Hola, como estan?"
      })
      .then((topic) => {
        this.topic = topic;

        //create a post
        Post.create({
          title: "Intermediate spanish lesson",
          body: "Hello: Hola, Goodbye: Adios",
          topicId: this.topic.id
        })
        .then((post) => {
          this.post = post;

          // create flair for post
          Flair.create({
            name: "Languages",
            color: "Indigo",
            postId: this.post.id
          })
          .then((flair) => {
            this.flair = flair;
            done();
          })
        });
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });
  });


// create tests
  describe("#create()", () => {
    it("should create a flair object with a name, color, and assigned post", (done) => {
      Flair.create({
        name: "Miscellaneous",
        color: "Red",
        postId: this.post.id
      })
      .then((flair) => {
        expect(flair.name).toBe("Miscellaneous");
        expect(flair.color).toBe("Red");
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });

    it("should not create a post with missing name, color, or assigned post", (done) => {
      Flair.create({
        name: "Miscellaneous"
      })
      .then((flair) => {
        // the code in this block will not be evaluated since the validation error skip
        done();
      })
      .catch((err) => {
        expect(err.message).toContain("Flair.color cannot be null");
        expect(err.message).toContain("Flair.postId cannot be null");
        done();
      })
    });
  });

  describe("#setPost()", () => {

     it("should associate a post and a flair together", (done) => {
       Topic.create({
         title: "Learning to fly",
         description: "How do birds fly?"
       })
       .then((newTopic) => {
         Post.create({
           title: "Birds use wings",
           body: "By flapping their wings, birds can fly",
           topicId: this.topic.id
         })
         .then((newPost) => {
           expect(this.flair.postId).toBe(this.post.id);
           this.flair.setPost(newPost)
           .then((flair) => {
             expect(flair.postId).toBe(newPost.id);
             done();
           });
         });
       });
     });
   });

   describe("#getPost()", () => {
     it("should return the associated post", (done) => {
       this.flair.getPost()
       .then((associatedPost) => {
         expect(associatedPost.title).toBe("Intermediate spanish lesson");
         done();
       });
     });
   });

});
