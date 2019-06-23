const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/topics/";

const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const User = require("../../src/db/models").User;

function authorizeUser(role, done) { // helper function to create and authorize new user
  User.create({
    email: `#{role}@example.com`,
    password: "123456",
    role: role
  })
  .then((user) => {
    request.get({         // mock authentication
      url: "http://localhost:3000/auth/fake",
      form: {
        role: user.role,     // mock authenticate as `role` user
        userId: user.id,
        email: user.email
      }
    },
      (err, res, body) => {
        done();
      }
    );
  });
}

describe("routes : topics", () => {

  beforeEach((done) => {
    this.topic;
    sequelize.sync({force: true}).then((res) => {
      Topic.create({
        title: "JS Frameworks",
        description: "There is a lot of them"
      })
      .then((topic) => {
        this.topic = topic;
        done();
      });
    });
  });

  describe("admin user performing CRUD actions for Topic", () => {

    // before each test in admin user context, send an authentication request
    // to a route we will create to mock an authentication request
    beforeEach((done) => {
      User.create({
         email: "admin@example.com",
         password: "123456",
         role: "admin"
       })
       .then((user) => {
         request.get({         // mock authentication
           url: "http://localhost:3000/auth/fake",
           form: {
             role: user.role,     // mock authenticate as admin user
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

    // GET tests
    describe("GET /topics", () => {
      it("should return a status code 200 and all topics", (done) => {
        request.get(base, (err, res, body) => {
          expect(res.statusCode).toBe(200);
          expect(err).toBeNull();
          expect(body).toContain("Topics");
          expect(body).toContain("JS Frameworks");
        done();
        });
      });
    });
    describe("GET /topics/new", () => {
      it("should render a new topic form", (done) => {
        request.get(`${base}new`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("New Topic");
          done();
        });
      });
    });
    describe("GET /topics/:id", () => {
      it("should render a view with the selected topic", (done) => {
        request.get(`${base}${this.topic.id}`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("JS Frameworks");
          done();
        });
      });
    });
    describe("GET /topics/:id/edit", () => {
      it("should render a view with an edit topic form", (done) => {
        request.get(`${base}${this.topic.id}/edit`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Edit Topic");
          expect(body).toContain("JS Frameworks");
          done();
        });
      });
    });

    // POST tests
    describe("POST /topics/create", () => {
      const options = {
        url: `${base}create`,
        form: {
          title: "blink-182 songs",
          description: "What's your favorite blink-182 song?"
        }
      };

      it("should create a new topic and redirect", (done) => {
        request.post(options,
          (err, res, body) => {
            Topic.findOne({where: {title: "blink-182 songs"}})
            .then((topic) => {
              expect(res.statusCode).toBe(303);
              expect(topic.title).toBe("blink-182 songs");
              expect(topic.description).toBe("What's your favorite blink-182 song?");
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
    describe("POST /topics/:id/destroy", () => {
      it("should delete the topic with the associated ID", (done) => {
        Topic.all()
        .then((topics) => {

          const topicCountBeforeDelete = topics.length;
          expect(topicCountBeforeDelete).toBe(1);

          request.post(`${base}${this.topic.id}/destroy`, (err, res, body) => {
            Topic.all()
            .then((topics) => {
              expect(err).toBeNull();
              expect(topics.length).toBe(topicCountBeforeDelete - 1);
              done();
            })
          });
        });
      });
    });
    describe("POST /topics/:id/update", () => {
      it("should update the topic with the given values", (done) => {
        const options = {
          url: `${base}${this.topic.id}/update`,
          form: {
            title: "Javascript Frameworks",
            description: "There are a lot of them"
          }
        };

        request.post(options,
          (err, res, body) => {
            expect(err).toBeNull();
            Topic.findOne({
              where: { id: this.topic.id }
            })
            .then((topic) => {
              expect(topic.title).toBe("Javascript Frameworks");
              done();
            });
          });
        });
      });
  });
  // end admin tests


  // user role tests
  describe("member user performing CRUD actions for Topic", () => {
    beforeEach((done) => {
       request.get({
         url: "http://localhost:3000/auth/fake",
         form: {
           role: "member"
         }
       },
         (err, res, body) => {
           done();
         }
       );
     });

     describe("GET /topics", () => {
       it("should return a status code 200 and all topics", (done) => {
       request.get(base, (err, res, body) => {
         expect(res.statusCode).toBe(200);
         expect(err).toBeNull();
         expect(body).toContain("Topics");
         expect(body).toContain("JS Frameworks");
         done();
       });
     });
   });
    describe("GET /topics/new", () => {
      it("should redirect to topics view", (done) => {
       request.get(`${base}new`, (err, res, body) => {
         expect(err).toBeNull();
         expect(body).toContain("Topics");
         done();
       });
      });
    });
    describe("GET /topics/:id", () => {
     it("should render a view with the selected topic", (done) => {
       request.get(`${base}${this.topic.id}`, (err, res, body) => {
         expect(err).toBeNull();
         expect(body).toContain("JS Frameworks");
         done();
       });
     });
   });
    describe("GET /topics/:id/edit", () => {
     it("should NOT render a view with an edit topic form", (done) => {
       request.get(`${base}${this.topic.id}/edit`, (err, res, body) => {
         expect(err).toBeNull();
         expect(body).not.toContain("Edit Topic");
         expect(body).toContain("JS Frameworks");
         done();
       });
     });
   });


     // POST tests
    describe("POST /topics/create", () => {
     const options = {
       url: `${base}create`,
       form: {
         title: "blink-182 songs",
         description: "What's your favorite blink-182 song?"
       }
     };

     it("should NOT create a new topic", (done) => {
       request.post(options,
         (err, res, body) => {
           Topic.findOne({where: {title: "blink-182 songs"}})
           .then((topic) => {
             expect(topic).toBeNull();
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
    describe("POST /topics/:id/destroy", () => {
     it("should NOT delete the topic with the associated ID", (done) => {
       Topic.all()
       .then((topics) => {

         const topicCountBeforeDelete = topics.length;
         expect(topicCountBeforeDelete).toBe(1);

         request.post(`${base}${this.topic.id}/destroy`, (err, res, body) => {
           Topic.all()
           .then((topics) => {
             expect(topics.length).toBe(topicCountBeforeDelete);
             done();
           })
         });
       });
     });
   });
    describe("POST /topics/:id/update", () => {
     it("should NOT update the topic with the given values", (done) => {
       const options = {
         url: `${base}${this.topic.id}/update`,
         form: {
           title: "Javascript Frameworks",
           description: "There are a lot of them"
         }
       };

       request.post(options,
         (err, res, body) => {
           expect(err).toBeNull();
           Topic.findOne({
             where: { id: this.topic.id }
           })
           .then((topic) => {
             expect(topic.title).toBe("JS Frameworks");
             done();
           });
         });
     });
   });
  })
});
