const sequelize = require("../../src/db/models/index").sequelize;

describe("User", () => {

  beforeEach((done) => {
    // start with empty table
    sequelize.sync({force: true})
    .then(() => {
      done();
    })
    .catch((err) => {
      console.log(err);
      done();
    });

  });

  describe("#create()", () => {

    // Test to ensure successful creation of a user with correct values
    it("should create a User object with a valid email and password", (done) => {
      User.create({
        email: "user@example.com",
        password: "1234567890"
      })
      .then((user) => {
        expect(user.email).toBe("user@example.com");
        expect(user.id).toBe(1);
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });

    // attempt to create a user with a wrongly formatted email
    it("should not create a user with invalid email or password", (done) => {
      User.create({
        email: "It's-a me, Mario!",
        password: "1234567890"
      })
      .then((user) => {

        // The code in this block will not be evaluated since the validation error
        // will skip it. Instead, we'll catch the error in the catch block below
        // and set the expectations there.

        done();
      })
      .catch((err) => {
        // confirm that we return a validation error
        expect(err.message).toContain("Validation error: must be a valid email");
        done();
      });
    });

    it("should not create a user with an email already taken", (done) => {

      // test that a validation error returns when we attempt to make a user with an existing email
      User.create({
        email: "user@example.com",
        password: "1234567890"
      })
      .then((user) => {

        User.create({
          email: "user@example.com",
          password: "nananananananananananananananana BATMAN!"
        })
        .then((user) => {

          // the code in this block will not be evaluated since the validation error
          // will skip it. Instead, we'll catch the error in the catch block below
          // and set the expectations there

          done();
        })
        .catch((err) => {
          expect(err.message).toContain("Validation error");
          done();
        });

        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });

  });

});
