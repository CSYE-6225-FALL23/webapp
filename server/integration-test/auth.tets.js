const chai = require("chai");
const chaiHttp = require("chai-http"); 

const Connection = require("database").Connection;

const app = require("../index");

chai.use(chaiHttp);

describe("Integration testing", () => {
  it("should connect to DB", (done) => {
    chai
    .request(app)
    .get("/health")
    .end((error, res) => {
      if (error) done(err);
      chai.expect(res.statusCode).to.equal(200);
      done();
    })
  });
});
