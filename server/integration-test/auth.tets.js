const chai = require("chai");
const chaiHttp = require("chai-http");

const app = require("../index");

chai.use(chaiHttp);
console.log(process.env.SERVER_PORT)
console.log(process.env.POSTGRES_DB)
describe("Integration testing", () => {
  it("should connect to DB", (done) => {
    chai
      .request(app)
      .get("/healthz")
      .end((error, res) => {
        if (error) done(err);
        chai.expect(res.statusCode).to.equal(200);
        done();
      });
  });
});
