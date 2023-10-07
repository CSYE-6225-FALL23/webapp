const chai = require("chai");
const request = require("supertest");

const Connection = require("database").Connection;

const app = require("../index");

describe("Integration testing", () => {
  before("Initalize application", function (done) {
    this.timeout(4000);
    setTimeout(() => {
      done();
    }, 3000);
  });

  it("should connect to DB", (done) => {
    request(app).get("/health").expect(200, done);
  });

  it("Get auth token", (done) => {
    request(app)
      .post("/auth")
      .send({ email: "john.doe@example.com", password: "abc123" })
      .set("Accept", "application/json")
      .expect(200)
      .end(function (err, res) {
        if (err) throw err;
      }, done());
  });

  after("close open connection", function (done) {
    this.timeout(5000);
    setTimeout(() => {
      Connection.closeConnection().then((isDBClosed) => {
        chai.assert.isTrue(isDBClosed);
        done();
        process.exit(0);
      });
    }, 3000);
  });
});
