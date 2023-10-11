const chai = require("chai");
const chaiHttp = require("chai-http"); 

const Connection = require("database").Connection;

const app = require("../index");

chai.use(chaiHttp);

describe("Integration testing", () => {
  before("Initalize application", function (done) {
    this.timeout(4000);
    setTimeout(() => {
      done();
    }, 3000);
  });

  it("should connect to DB", (done) => {
    chai
    .request(app)
    .get("/healthz")
    .end((error, res) => {
      if (error) done(err);
      chai.expect(res.statusCode).to.equal(200);
      done();
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
