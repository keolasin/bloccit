const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/topics";

const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;
const Flair = require("../../src/db/models").Flair;

describe("routes : flairs", () => {

  beforeEach((done) => {
    this.topic;
    this.post;
    this.flair;

    sequelize.sync({force: true}).then((res) => {

      // create a topic
      Topic.create({
        title: "Superheroes",
        description: "Everything related to superheroes"
      })
      .then((topic) => {
        this.topic = topic;

        //create a post
        Post.create({
          title: "Crime fighting",
          body: "Spider-man is the best crime-fighter",
          topicId: this.topic.id
        })
        .then((post) => {
          this.post = post;

          // create flair for post
          Flair.create({
            name: "Comics",
            color: "Blue",
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

  describe("GET /topics/:topicId/posts/:postId/flairs/new", () => {
    it("should render a new flair form", (done) => {
      request.get(`${base}/${this.topic.id}/posts/${this.post.id}/flairs/new`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("New Flair");
        done();
      });
    });
  });

  describe("POST /topics/:topicId/posts/:postId/flairs/create", () => {
   it("should create a new flair and redirect", (done) => {
      const options = {
        url: `${base}/${this.topic.id}/posts/${this.post.id}/flairs/create`,
        form: {
          name: "Villains",
          color: "Black"
        }
      };
      request.post(options,
        (err, res, body) => {
          Flair.findOne({where: {name: "Villains"}})
          .then((flair) => {
            expect(flair).not.toBeNull();
            expect(flair.name).toBe("Villains");
            expect(flair.color).toBe("Black");
            expect(post.topicId).not.toBeNull();
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

});
