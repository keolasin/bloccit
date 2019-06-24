// base path set to /topics
const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/topics/";

const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;
const User = require("../../src/db/models").User;
const Comment = require("../../src/db/models").Comment;

describe("routes : comments", () => {

  beforeEach((done) => {

    // create new user, alt user, topic, post, comment before each test
    this.user;
    this.topic;
    this.post;
    this.comment;

    sequelize.sync({force: true}).then((res) => {

      // this.user creation and owner of topic, post, and comment
      User.create({
        email: "starman@tesla.com",
        password: "Trekkie4lyfe"
      })
      .then((user) => {
        this.user = user;  // store user as this.user

        Topic.create({
          title: "Expeditions to Alpha Centauri",
          description: "A compilation of reports from recent visits to the star system.",
          posts: [{
            title: "My first visit to Proxima Centauri b",
            body: "I saw some rocks.",
            userId: this.user.id
          }]
        }, {
          include: { //nested creation of posts
            model: Post,
            as: "posts"
          }
        })
        .then((topic) => {
          this.topic = topic;               // store topic
          this.post = this.topic.posts[0];  // store post

          Comment.create({
            body: "ay caramba!!!!!",
            userId: this.user.id,
            postId: this.post.id
          })
          .then((coment) => {
            this.comment = coment;         // store comment
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });
    });
  });

  // guest context
  describe("guest attempting to perform CRUD actions for Comment", () => {

    // ensure no user is signed in before each test
     beforeEach((done) => {    // before each suite in this context
       request.get({           // mock authentication
         url: "http://localhost:3000/auth/fake",
         form: {
           userId: 0 // flag to indicate mock auth to destroy any session
         }
       },
         (err, res, body) => {
           done();
         }
       );
     });

     // user not signed in unable to create comment
     describe("POST /topics/:topicId/posts/:postId/comments/create", () => {

       it("should not create a new comment", (done) => {
         const options = {
           url: `${base}${this.topic.id}/posts/${this.post.id}/comments/create`,
           form: {
             body: "This comment is amazing!"
           }
         };
         request.post(options,
           (err, res, body) => {
             Comment.findOne({where: {body: "This comment is amazing!"}})
             .then((comment) => {
               expect(comment).toBeNull();   // ensure no comment was created
               done();
             })
             .catch((err) => {
               console.log(err);
               done();
             });
           }
         );
       });
     });


     // someone not signed in unable to destroy comments
     describe("POST /topics/:topicId/posts/:postId/comments/:id/destroy", () => {

       it("should not delete the comment with the associated ID", (done) => {
         Comment.findAll()
         .then((comments) => {
           const commentCountBeforeDelete = comments.length;

           expect(commentCountBeforeDelete).toBe(1);

           request.post(
             `${base}${this.topic.id}/posts/${this.post.id}/comments/${this.comment.id}/destroy`,
             (err, res, body) => {
             Comment.findAll()
             .then((comments) => {
               expect(err).toBeNull();
               expect(comments.length).toBe(commentCountBeforeDelete);
               done();
             })

           });
         })
       });
     });
   });
  // end context for guest

  // signed in user context
  describe("signed in user performing CRUD actions for Comment", () => {

     beforeEach((done) => {    // before each suite in this context
       request.get({           // mock authentication
         url: "http://localhost:3000/auth/fake",
         form: {
           role: "member",     // mock authenticate as member user
           userId: this.user.id
         }
       },
         (err, res, body) => {
           done();
         }
       );
     });

     // signed in user able to create comments
     describe("POST /topics/:topicId/posts/:postId/comments/create", () => {

       it("should create a new comment and redirect", (done) => {
         const options = {
           url: `${base}${this.topic.id}/posts/${this.post.id}/comments/create`,
           form: {
             body: "This comment is amazing!"
           }
         };
         request.post(options,
           (err, res, body) => {
             Comment.findOne({where: {body: "This comment is amazing!"}})
             .then((comment) => {
               expect(comment).not.toBeNull();
               expect(comment.body).toBe("This comment is amazing!");
               expect(comment.id).not.toBeNull();
               done();
             })
             .catch((err) => {
               console.log(err);
               done();
             });
           }
         );
       });
     });

     // signed in user able to destroy own comments
     describe("POST /topics/:topicId/posts/:postId/comments/:id/destroy", () => {

       it("should delete the comment with the associated ID", (done) => {
         Comment.findAll()
         .then((comments) => {
           const commentCountBeforeDelete = comments.length;

           expect(commentCountBeforeDelete).toBe(1);

           request.post(
            `${base}${this.topic.id}/posts/${this.post.id}/comments/${this.comment.id}/destroy`,
             (err, res, body) => {
             expect(res.statusCode).toBe(302);
             Comment.findAll()
             .then((comments) => {
               expect(err).toBeNull();
               expect(comments.length).toBe(commentCountBeforeDelete - 1);
               done();
             })
           });
         })
       });
     });

     // other user tries to delete comment they don't own
     describe("POST /topics/:topicId/posts/:postId/comments/:id/destroy", () => {
       beforeEach(done => {
         // create the alt user
         User.create({
           email: "tom@myspace.com",
           password: "isYourFriend",
           role: "member"
         }).then( user => {
           // sign in/auth the alt user
           request.get(
             {
               url: "http://localhost:3000/auth/fake",
               form: {
                 role: user.role,
                 userId: user.id,
                 email: user.email
               }
             },
             (err, res, body) => {
               done();
             }
           );
         });
       });

       it("should NOT delete a comment that doesn't belong to the user", (done) => {
         Comment.findAll().then(comments => {
           const commentCountBeforeDelete = comments.length;
           expect(commentCountBeforeDelete).toBe(1);

           request.post(
             `${base}${this.topic.id}/posts/${this.post.id}/comments/${this.comment.id}/destroy`,
             (err, res, body) => {
               expect(res.statusCode).toBe(401);
               Comment.findAll().then(comments => {
                 expect(err).toBeNull();
                 expect(comments.length).toBe(commentCountBeforeDelete);
                 done();
               });
             }
           );

         });
       });
     });
   });

  // admin user context
  describe("admin user performing CRUD actions for Comment", () => {

      beforeEach((done) => {    // before each suite in this context
        request.get({           // mock authentication
          url: "http://localhost:3000/auth/fake",
          form: {
            role: "admin",     // mock authenticate as admin user
            userId: this.user.id
          }
        },
          (err, res, body) => {
            done();
          }
        );
      });

      // admin user able to create comments
      describe("POST /topics/:topicId/posts/:postId/comments/create", () => {

        it("should create a new comment and redirect", (done) => {
          const options = {
            url: `${base}${this.topic.id}/posts/${this.post.id}/comments/create`,
            form: {
              body: "This comment is amazing!"
            }
          };
          request.post(options,
            (err, res, body) => {
              Comment.findOne({where: {body: "This comment is amazing!"}})
              .then((comment) => {
                expect(comment).not.toBeNull();
                expect(comment.body).toBe("This comment is amazing!");
                expect(comment.id).not.toBeNull();
                done();
              })
              .catch((err) => {
                console.log(err);
                done();
              });
            }
          );
        });
      });

      // admin user able to destroy comments (not owner)
      describe("POST /topics/:topicId/posts/:postId/comments/:id/destroy", () => {

        beforeEach(done => {
          // create the alt admin user
          User.create({
            email: "superman@krypton.com",
            password: "batman",
            role: "admin"
          }).then( user => {
            // sign in/auth the alt user
            request.get(
              {
                url: "http://localhost:3000/auth/fake",
                form: {
                  role: user.role,
                  userId: user.id,
                  email: user.email
                }
              },
              (err, res, body) => {
                done();
              }
            );
          });
        });

        it("should delete the comment with the associated ID", (done) => {
          Comment.findAll()
          .then((comments) => {
            const commentCountBeforeDelete = comments.length;

            expect(commentCountBeforeDelete).toBe(1);

            request.post(
             `${base}${this.topic.id}/posts/${this.post.id}/comments/${this.comment.id}/destroy`,
              (err, res, body) => {
              expect(res.statusCode).toBe(302);
              Comment.findAll()
              .then((comments) => {
                expect(err).toBeNull();
                expect(comments.length).toBe(commentCountBeforeDelete - 1);
                done();
              })
            });
          })
        });
      });
    });
   //end context for admin user
});
