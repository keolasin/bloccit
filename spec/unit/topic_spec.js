const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;

describe("Topic", () => {



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
