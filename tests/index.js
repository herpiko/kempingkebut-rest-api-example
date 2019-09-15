const mongoose = require('mongoose')
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const app = require('../server');
const userModel = require('../models/users');
const async = require('async');

function connectAndCleanDatabase(done) {
  mongoose.connect('mongodb://localhost/note_api_test', {
    useNewUrlParser: true,
    useFindAndModify: false,
  }, () => {
    mongoose.connection.db.dropDatabase();
    done();
  });
}

var users = [];
var lastInsertId;

chai.use(chaiHttp);
chai.should();
describe('Tests', () => {
  before((done) => {
    connectAndCleanDatabase(done);
  });
  describe('Users', () => {
    it('foo should be able to register', (done) => {
      chai.request(app)
        .post('/users/register')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({
          email: 'foo@bar.com',
          name: 'foo',
          password: 'oof',
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          expect(res.body.message).to.equal('success');
          done();
        })
    })
    it('foo registration challenge', (done) => {
      userModel.findOne({
        email: 'foo@bar.com',
      }, (err, userInfo) => {
        expect(err).to.equal(null);
        chai.request(app)
          .get('/users/challenge?code=' + userInfo.registrationChallenge)
          .end((err, res) => {
            res.should.have.status(200);
            done();
          })
      })
    })
    it('foo should be able to login', (done) => {
      chai.request(app)
        .post('/users/authenticate')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({
          email: 'foo@bar.com',
          password: 'oof',
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          expect(res.body.message).to.equal('success');
          expect(res.body.data.user.name).to.equal('foo');
          expect(res.body.data.user.email).to.equal('foo@bar.com');
          expect(res.body.data.user.password).to.equal(undefined);
          expect(res.body.data.token).to.be.a('string');
          expect(res.body.data.token.length).to.greaterThan(0);
          users.push(res.body.data);
          done();
        })
    })
    it('rex should be able to register', (done) => {
      chai.request(app)
        .post('/users/register')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({
          email: 'rex@bar.com',
          name: 'rex',
          password: 'xer',
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          expect(res.body.message).to.equal('success');
          done();
        })
    })
    it('rex registration challenge', (done) => {
      userModel.findOne({
        email: 'rex@bar.com',
      }, (err, userInfo) => {
        expect(err).to.equal(null);
        chai.request(app)
          .get('/users/challenge?code=' + userInfo.registrationChallenge)
          .end((err, res) => {
            res.should.have.status(200);
            done();
          })
      })
    })
    it('rex should be able to login', (done) => {
      chai.request(app)
        .post('/users/authenticate')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({
          email: 'rex@bar.com',
          password: 'xer',
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          expect(res.body.message).to.equal('success');
          expect(res.body.data.user.name).to.equal('rex');
          expect(res.body.data.user.email).to.equal('rex@bar.com');
          expect(res.body.data.user.password).to.equal(undefined);
          expect(res.body.data.token).to.be.a('string');
          expect(res.body.data.token.length).to.greaterThan(0);
          users.push(res.body.data);
          done();
        })
    });
  })

  describe('Posts', () => {
    it('foo should be able to get post list', (done) => {
      chai.request(app)
        .get('/posts')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          expect(res.body.message).to.equal('success');
          expect(res.body.data.length).to.equal(0);
          done();
        })
    })
    it('foo should not be able to create post with incomplete values', (done) => {
      let payload = {
        content: 'Hello world content',
      }
      chai.request(app)
        .post('/posts')
        .set('content-type', 'application/x-www-form-urlencoded')
        .set('x-access-token', users[0].token)
        .send(payload)
        .end((err, res) => {
          res.should.have.status(400);
          expect(res.body.data[0]).to.equal('title');

          payload = {
            title: 'Hello world',
          }
          chai.request(app)
            .post('/posts')
            .set('content-type', 'application/x-www-form-urlencoded')
            .set('x-access-token', users[0].token)
            .send(payload)
            .end((err, res) => {
              res.should.have.status(400);
              expect(res.body.data[0]).to.equal('content');

              payload = {}
              chai.request(app)
                .post('/posts')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('x-access-token', users[0].token)
                .send(payload)
                .end((err, res) => {
                  res.should.have.status(400);
                  expect(res.body.data[0]).to.equal('title');
                  expect(res.body.data[1]).to.equal('content');
                  done();
                })
            })
        })
    })
    it('foo should be able to create post', (done) => {
      let payload = {
        title: 'Hello world',
        content: 'Hello world content',
      }
      chai.request(app)
        .post('/posts')
        .set('content-type', 'application/x-www-form-urlencoded')
        .set('x-access-token', users[0].token)
        .send(payload)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          expect(res.body.message).to.equal('success');

          chai.request(app)
            .get('/posts')
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              expect(res.body.message).to.equal('success');
              expect(res.body.data.length).to.equal(1);

              chai.request(app)
                .get('/posts/' + res.body.data[0].id)
                .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  console.log(res.body);
                  expect(res.body.message).to.equal('success');
                  expect(res.body.data.title).to.equal(payload.title);
                  expect(res.body.data.content).to.equal(payload.content);
                  expect(res.body.data.userId).to.equal(users[0].user.id);
                  done();
                })
            })
        })
    })
    it('foo should be able to create more posts', (done) => {
      let payload = {
        title: 'Hello world',
        content: 'Hello world content',
      }
      let ids = '1234567890';
      async.eachSeries(ids, (id, cb) => {
        payload.title += id;
        payload.content += id;
        chai.request(app)
          .post('/posts')
          .set('content-type', 'application/x-www-form-urlencoded')
          .set('x-access-token', users[0].token)
          .send(payload)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            expect(res.body.message).to.equal('success');

            chai.request(app)
              .get('/posts/' + res.body.lastInsertId)
              .set('x-access-token', users[0].token)
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                expect(res.body.message).to.equal('success');
                expect(res.body.data.title).to.equal(payload.title);
                expect(res.body.data.content).to.equal(payload.content);
                expect(res.body.data.userId).to.equal(users[0].user.id);
                cb();
              })
          })
      }, (err) => {
        chai.request(app)
          .get('/posts')
          .set('x-access-token', users[1].token)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            expect(res.body.message).to.equal('success');
            expect(res.body.data.length).to.equal(10);
            done();
          })
      })
    })
    it('foo should be able to get posts by pagination', (done) => {
      chai.request(app)
        .get('/posts?page=1&limit=3')
        .set('x-access-token', users[0].token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          expect(res.body.message).to.equal('success');
          expect(res.body.data.length).to.equal(3);
          expect(res.body.page).to.equal(1);
          expect(res.body.limit).to.equal(3);

          chai.request(app)
            .get('/posts?page=4&limit=3')
            .set('x-access-token', users[0].token)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              expect(res.body.message).to.equal('success');
              expect(res.body.data.length).to.equal(2);
              expect(res.body.page).to.equal(4);
              expect(res.body.limit).to.equal(3);
              done();
            })
        })
    })
    it('foo should be able to update a post', (done) => {
      let payload = {
        title: 'Good morning',
        content: 'Good morning content',
      }
      chai.request(app)
        .post('/posts')
        .set('content-type', 'application/x-www-form-urlencoded')
        .set('x-access-token', users[0].token)
        .send(payload)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          expect(res.body.message).to.equal('success');
          lastInsertId = res.body.lastInsertId;
          payload = {
            content: 'Good night content',
          }
          chai.request(app)
            .put('/posts/' + lastInsertId)
            .set('content-type', 'application/x-www-form-urlencoded')
            .set('x-access-token', users[0].token)
            .send(payload)
            .end((err, res) => {
              res.should.have.status(400);
              expect(res.body.data[0]).to.equal('title');

              payload = {
                title: 'Good night',
                content: 'Good night content',
              }
              chai.request(app)
                .put('/posts/' + lastInsertId)
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('x-access-token', users[0].token)
                .send(payload)
                .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  expect(res.body.message).to.equal('success');
                  expect(res.body.data.title).to.equal(payload.title);
                  expect(res.body.data.content).to.equal(payload.content);
                  expect(res.body.data.userId).to.equal(users[0].user.id);
                  done();
                })
            })
        })
    })
    it('rex should not be able to update foo\'s post', (done) => {
      payload = {
        title: 'Good night',
        content: 'Good night content',
      }
      chai.request(app)
        .put('/posts/' + lastInsertId)
        .set('content-type', 'application/x-www-form-urlencoded')
        .set('x-access-token', users[1].token)
        .send(payload)
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.be.a('object');
          expect(res.body.message).to.equal('forbidden');
          done();
        })
    })
    it('rex should not be able to delete foo\'s post', (done) => {
      chai.request(app)
        .delete('/posts/' + lastInsertId)
        .set('x-access-token', users[1].token)
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.be.a('object');
          expect(res.body.message).to.equal('forbidden');
          done();
        })
    })
    it('foo should be able to delete a post', (done) => {
      let payload = {
        title: 'Good afternoon',
        content: 'Good afternoon content',
      }
      chai.request(app)
        .post('/posts')
        .set('content-type', 'application/x-www-form-urlencoded')
        .set('x-access-token', users[0].token)
        .send(payload)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          expect(res.body.message).to.equal('success');
          lastInsertId = res.body.lastInsertId;

          chai.request(app)
            .delete('/posts/' + lastInsertId)
            .set('x-access-token', users[0].token)
            .end((err, res) => {
              res.should.have.status(200);
              expect(res.body.data).to.equal(null);

              payload = {
                title: 'Good night',
                content: 'Good night content',
              }
              chai.request(app)
                .get('/posts/' + lastInsertId)
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('x-access-token', users[0].token)
                .send(payload)
                .end((err, res) => {
                  res.should.have.status(404);
                  res.body.should.be.a('object');
                  expect(res.body.message).to.equal('not-found');
                  done();
                })
            })
        })
    })
  })
})
