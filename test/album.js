const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('./../app'),
  expect = chai.expect,
  config = require('../config'),
  { saveUser, login, userOne } = require('./util'),
  should = chai.should();

describe('albums', () => {
  describe('/users GET', () => {
    it('should list all users by pagination without problems because are loged', done => {
      saveUser(userOne).then(() => {
        login({
          email: 'pepito.perez@wolox.com',
          password: 'Holahola23'
        }).then(res => {
          chai
            .request(server)
            .get('/users?count=1&page=1')
            .set(config.common.session.header_name, res.headers[config.common.session.header_name])
            .then(result => {
              result.should.have.status(200);
              expect(result).to.be.a('object');
              expect(result.body.count).to.be.equal(1);
              expect(result.body.pages).to.be.equal(1);
              dictum.chai(result, 'get all user with pagination');
              done();
            });
        });
      });
    });

    it('should fail list all users by pagination because token is no sent or user is no loged', done => {
      chai
        .request(server)
        .get('/users?count=1&page=1')
        .catch(err => {
          err.should.have.status(401);
          err.response.should.be.json;
          err.response.body.should.have.property('message');
          err.response.body.should.have.property('internal_code');
          expect(err.response.body.internal_code).to.equal('authorization_error');
          done();
        });
    });
  });
});
