const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/advertisement";

const sequelize = require("../../src/db/models/index").sequelize;
const Advertisement = require("../../src/db/models").Advertisement;

describe("routes : advertisements", () => {
  beforeEach((done) => {
    this.advertisement;
    sequelize.sync({force: true}).then((res) => {
      Advertisement.create({
        title: "Bloc ad",
        description: "advertisement for bloc"
      })
      .then((advertisement) => {
        this.advertisement = advertisement;
        done();
      });
    });
  });

  // GET tests
  describe("/GET /advertisements", () => {
    it("it should return a status code 200 and all advertisements", (done)=>{
      request.get(base, (err, res, body) => {
        expect(res.statusCode).toBe(200);
        expect(err).toBeNull();
        expect(body).toContain("Advertisements");
        expect(body).toContain("Bloc ad");
        done();
      });
    });
  });
});
