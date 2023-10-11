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
    request(app).get("/health", (error, res, body) => {
      chai.expect(res.statusCode).to.equal(200);
    })
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
