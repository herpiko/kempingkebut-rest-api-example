const mongoose = require('mongoose')
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const app = require('../server');

function connectAndCleanDatabase(done) {
  mongoose.connect('mongodb://localhost/note_api_test', () => {
    mongoose.connection.db.dropDatabase();
    done();
  });
}

chai.use(chaiHttp);
chai.should();
describe("Users", () => {
  before((done) => {
      connectAndCleanDatabase(done);
  });
  describe("POST /users/register", () => {
    it("should be able to register", (done) => {
      chai.request(app)
      .post('/users/register')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({
        email: 'foo@bar.com',
        name: 'foo',
        password: 'bar',
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        expect(res.body.message).to.equal('ok');
        done();
      })
    })
    it("should be able to login", (done) => {
      chai.request(app)
      .post('/users/authenticate')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({
        email: 'foo@bar.com',
        password: 'bar',
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        expect(res.body.message).to.equal('ok');
        expect(res.body.data.user.name).to.equal('foo');
        expect(res.body.data.user.email).to.equal('foo@bar.com');
        expect(res.body.data.user.password).to.equal(undefined);
        expect(res.body.data.token).to.be.a('string');
        expect(res.body.data.token.length).to.greaterThan(0);
        done();
      })
    })
  })
})
